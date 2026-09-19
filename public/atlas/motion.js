/* Living Atlas: optional motion. Content never depends on this module. */
const STORAGE_KEY = "uc-atlas-motion";

function initMotion() {
  const root = document.documentElement;
  if (root.hasAttribute("data-atlas-motion-ready")) return;
  root.setAttribute("data-atlas-motion-ready", "");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const existingControl = document.querySelector(
    "#motion-toggle, [data-atlas-motion-toggle]",
  );
  const readChoice = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "off";
    } catch {
      return !root.classList.contains("motion-paused");
    }
  };
  let choice = readChoice();
  let pageActive = true;
  let control;
  let controlLabel;
  let running = false;
  let lastReportedPause;

  // The landing script remains the sole owner of its button and preference.
  // Elsewhere this module owns the same preference, not a second setting.
  if (!existingControl) {
    control = document.createElement("button");
    control.type = "button";
    control.id = "atlas-motion-toggle";
    control.className = "atlas-motion-toggle";
    control.setAttribute("data-atlas-motion-toggle", "");
    const icon = document.createElement("span");
    icon.className = "atlas-motion-toggle__icon";
    icon.setAttribute("aria-hidden", "true");
    controlLabel = document.createElement("span");
    controlLabel.className = "atlas-motion-toggle__label";
    control.append(icon, controlLabel);
    document.body.append(control);
    control.addEventListener("click", () => {
      if (reduced.matches) return;
      choice = !choice;
      try {
        localStorage.setItem(STORAGE_KEY, choice ? "on" : "off");
      } catch {
        // The current-page choice still works when storage is unavailable.
      }
      syncPreference();
    });
  }

  function labelControl() {
    if (!control) return;
    const spanish = root.lang.toLowerCase().startsWith("es");
    const paused = reduced.matches || root.classList.contains("motion-paused");
    const label = reduced.matches
      ? spanish ? "Movimiento reducido" : "Reduced motion"
      : paused
        ? spanish ? "Activar movimiento" : "Resume motion"
        : spanish ? "Pausar movimiento" : "Pause motion";
    controlLabel.textContent = label;
    control.setAttribute("aria-label", label);
    control.setAttribute("aria-pressed", String(paused));
    control.disabled = reduced.matches;
    control.title = reduced.matches
      ? spanish
        ? "Se respeta la preferencia de movimiento reducido de tu dispositivo."
        : "Your device’s reduced-motion preference is respected."
      : label;
  }

  const scenes = [];
  const staticImages = [];
  const images = new Set();
  const canAnimate = typeof Element.prototype.animate === "function";
  const canFloat = canAnimate && window.CSS?.supports("translate", "0 1px");
  const activeReveals = new Map();
  const seenReveals = new WeakSet();

  function restorePointer(scene) {
    cancelAnimationFrame(scene.frame);
    scene.frame = 0;
    scene.lastTime = 0;
    scene.x = scene.y = scene.vx = scene.vy = 0;
    scene.targetX = scene.targetY = 0;
    if (scene.originalTransform) {
      scene.image.style.setProperty(
        "transform", scene.originalTransform, scene.originalPriority,
      );
    } else {
      scene.image.style.removeProperty("transform");
    }
  }

  function syncScene(scene) {
    const active = running && scene.visible;
    scene.image.toggleAttribute("data-atlas-motion-active", active);
    if (reduced.matches && scene.float) {
      scene.float.cancel();
      scene.float = null;
    }
    if (!active) {
      scene.float?.pause();
      restorePointer(scene);
      return;
    }
    if (!scene.float && canFloat) {
      // Individual properties leave pointer depth independent and interruptible.
      // A tiny overscan keeps the cropped specimen edges inside their frame.
      scene.float = scene.image.animate(
        [
          { translate: "0 0", rotate: "-0.2deg", scale: "1.018" },
          { translate: "0 -5px", rotate: "0.2deg", scale: "1.025" },
          { translate: "0 0", rotate: "-0.2deg", scale: "1.018" },
        ],
        {
          duration: 16000 + (scene.index % 4) * 1700,
          iterations: Infinity,
          easing: "ease-in-out",
        },
      );
      scene.float.id = "atlas-art-float";
    } else {
      scene.float?.play();
    }
  }

  function clearReveal(element) {
    const animation = activeReveals.get(element);
    if (!animation) return;
    activeReveals.delete(element);
    animation.cancel();
  }

  function syncStaticImage(item) {
    // Parent CSS cannot pause animation inside an external SVG image. Only
    // explicitly tagged, single-source images opt into build-generated stills.
    const source = running && item.visible ? item.original : item.still;
    if (item.image.getAttribute("src") !== source) {
      item.image.setAttribute("src", source);
    }
  }

  function syncMotion() {
    running = pageActive && !document.hidden && !reduced.matches &&
      !root.classList.contains("motion-paused");
    root.setAttribute("data-atlas-motion-state", reduced.matches ? "reduced"
      : root.classList.contains("motion-paused") ? "paused"
        : running ? "running" : "hidden");
    labelControl();
    scenes.forEach(syncScene);
    staticImages.forEach(syncStaticImage);
    if (!running) [...activeReveals.keys()].forEach(clearReveal);
    const paused = !running;
    if (lastReportedPause !== paused) {
      lastReportedPause = paused;
      // Publish once on initialization, then only on effective state changes.
      // Bubbling supports document or window listeners in the legacy runtime.
      // Offscreen handling is per-image; it does not globally pause the page.
      document.dispatchEvent(new CustomEvent("uc:motionchange", {
        bubbles: true,
        detail: { paused },
      }));
    }
  }

  function syncPreference() {
    if (control) {
      const paused = !choice || reduced.matches;
      if (root.classList.contains("motion-paused") !== paused) {
        root.classList.toggle("motion-paused", paused);
      }
    }
    syncMotion();
  }

  // Critically damped, independent axes; preserve position AND velocity when
  // retargeting. A RAF exists only until the pointer response has settled.
  function spring(position, velocity, target, seconds) {
    const omega = 17;
    const distance = position - target;
    const impulse = velocity + omega * distance;
    const decay = Math.exp(-omega * seconds);
    return [
      target + (distance + impulse * seconds) * decay,
      (velocity - omega * impulse * seconds) * decay,
    ];
  }

  function pointerFrame(scene, time) {
    scene.frame = 0;
    if (!running || !scene.visible || !finePointer.matches) {
      restorePointer(scene);
      return;
    }
    const seconds = Math.min((time - (scene.lastTime || time - 16)) / 1000, 0.05);
    scene.lastTime = time;
    [scene.x, scene.vx] = spring(scene.x, scene.vx, scene.targetX, seconds);
    [scene.y, scene.vy] = spring(scene.y, scene.vy, scene.targetY, seconds);
    const settled = Math.abs(scene.x - scene.targetX) < 0.001 &&
      Math.abs(scene.y - scene.targetY) < 0.001 &&
      Math.abs(scene.vx) + Math.abs(scene.vy) < 0.008;
    if (settled) {
      scene.x = scene.targetX;
      scene.y = scene.targetY;
      scene.vx = scene.vy = 0;
      scene.lastTime = 0;
      if (scene.x === 0 && scene.y === 0) {
        restorePointer(scene);
        return;
      }
    }
    const depth = `perspective(1100px) rotateX(${(-scene.y * 1.6).toFixed(4)}deg) rotateY(${(scene.x * 1.8).toFixed(4)}deg)`;
    scene.image.style.transform = scene.originalTransform
      ? `${scene.originalTransform} ${depth}` : depth;
    if (!settled) scene.frame = requestAnimationFrame((next) => pointerFrame(scene, next));
  }

  function targetPointer(scene, x, y) {
    scene.targetX = x;
    scene.targetY = y;
    if (!scene.frame) scene.frame = requestAnimationFrame((time) => pointerFrame(scene, time));
  }

  // .specimen-image is the actual current landing selector; the other two
  // aliases support shared cell cards without requiring a markup rewrite.
  const sceneSelector = "[data-atlas-art], .specimen-image, .organism-visual, .organism-card";
  document.querySelectorAll(sceneSelector).forEach((candidate) => {
    const image = candidate.matches("img") ? candidate
      : candidate.querySelector("img[data-atlas-image], img");
    if (!image || images.has(image)) return;
    const element = image.closest(sceneSelector) || candidate;
    // Existing landing hero / WebGL scenes already have their own animation.
    if (element.closest("[data-motion-scene], [data-infinity]")) return;
    images.add(image);
    image.classList.add("atlas-motion-image");
    const scene = {
      element, image, index: scenes.length, visible: false, float: null,
      frame: 0, lastTime: 0, x: 0, y: 0, vx: 0, vy: 0, targetX: 0, targetY: 0,
      originalTransform: image.style.getPropertyValue("transform"),
      originalPriority: image.style.getPropertyPriority("transform"),
    };
    scenes.push(scene);
    element.addEventListener("pointermove", (event) => {
      if (!running || !scene.visible || !finePointer.matches || event.pointerType === "touch") return;
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const clamp = (value) => Math.max(-1, Math.min(1, value));
      targetPointer(scene,
        clamp((event.clientX - bounds.left) / bounds.width * 2 - 1),
        clamp((event.clientY - bounds.top) / bounds.height * 2 - 1));
    }, { passive: true });
    element.addEventListener("pointerleave", () => {
      if (running && scene.visible) targetPointer(scene, 0, 0);
      else restorePointer(scene);
    }, { passive: true });
    element.addEventListener("pointercancel", () => restorePointer(scene), { passive: true });
  });

  document.querySelectorAll("img[data-atlas-static-src]").forEach((image) => {
    const original = image.getAttribute("src");
    const still = image.getAttribute("data-atlas-static-src");
    // A srcset/picture can override src. Leave responsive images untouched
    // rather than accidentally displaying their animated candidate when paused.
    const pictureSources = image.closest("picture")?.querySelectorAll("source[srcset]");
    if (!original || !still?.trim() || image.getAttribute("srcset")?.trim() ||
      [...(pictureSources || [])].some((source) => source.getAttribute("srcset")?.trim())) return;
    const bounds = image.getBoundingClientRect();
    staticImages.push({
      image, original, still,
      // Avoid a needless still -> original reload before the first IO callback.
      // Without observers, prefer the complete static fallback everywhere.
      visible: "IntersectionObserver" in window && bounds.width > 0 && bounds.height > 0 &&
        bounds.top < innerHeight && bounds.bottom > 0 &&
        bounds.left < innerWidth && bounds.right > 0,
    });
  });

  if ("IntersectionObserver" in window) {
    const staticMap = new Map(staticImages.map((item) => [item.image, item]));
    const staticObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const item = staticMap.get(entry.target);
        item.visible = entry.isIntersecting && entry.intersectionRatio > 0;
        syncStaticImage(item);
      }
    }, { threshold: 0 });
    staticImages.forEach((item) => staticObserver.observe(item.image));

    const sceneMap = new Map(scenes.map((scene) => [scene.element, scene]));
    const artObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const scene = sceneMap.get(entry.target);
        scene.visible = entry.isIntersecting && entry.intersectionRatio > 0;
        syncScene(scene);
      }
    }, { threshold: 0 });
    scenes.forEach((scene) => artObserver.observe(scene.element));

    if (canAnimate) {
      const revealSelector = "[data-atlas-reveal], .section-heading, .specimen-info, .lab-section-header, .tx-section-head, .lab-card";
      const revealObserver = new IntersectionObserver((entries) => {
        let stagger = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            clearReveal(entry.target);
            continue;
          }
          if (seenReveals.has(entry.target)) continue;
          seenReveals.add(entry.target);
          // Once visible while paused, it never animates retroactively.
          if (!running || entry.target.contains(document.activeElement)) continue;
          const animation = entry.target.animate([
            { opacity: 0.78, transform: "translateY(8px)" },
            { opacity: 1, transform: "none" },
          ], {
            duration: 340,
            delay: Math.min(stagger++, 2) * 40,
            easing: "cubic-bezier(.2,.7,.2,1)",
            fill: "none",
          });
          animation.id = "atlas-section-reveal";
          activeReveals.set(entry.target, animation);
          animation.onfinish = () => {
            clearReveal(entry.target);
            revealObserver.unobserve(entry.target);
          };
        }
      }, { threshold: 0.08 });
      document.querySelectorAll(revealSelector).forEach((element) => {
        if (element.parentElement?.closest(revealSelector)) return;
        const bounds = element.getBoundingClientRect();
        // Don't fade already-visible content (including the LCP) on boot.
        if (bounds.top < innerHeight && bounds.bottom > 0) seenReveals.add(element);
        revealObserver.observe(element);
      });
    }
  }
  // Without observers the complete static art/content stays available.

  new MutationObserver(syncMotion).observe(root, {
    attributes: true, attributeFilter: ["class", "lang"],
  });
  reduced.addEventListener("change", syncPreference);
  finePointer.addEventListener("change", () => scenes.forEach(restorePointer));
  document.addEventListener("uc:languagechange", labelControl);
  document.addEventListener("visibilitychange", syncMotion);
  document.addEventListener("focusin", (event) => {
    for (const element of activeReveals.keys()) {
      if (element.contains(event.target)) clearReveal(element);
    }
  });
  window.addEventListener("storage", (event) => {
    if (!control || (event.key !== STORAGE_KEY && event.key !== null)) return;
    choice = readChoice();
    syncPreference();
  });
  window.addEventListener("pagehide", () => { pageActive = false; syncMotion(); });
  window.addEventListener("pageshow", () => { pageActive = true; syncMotion(); });
  syncPreference();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMotion, { once: true });
} else {
  initMotion();
}
