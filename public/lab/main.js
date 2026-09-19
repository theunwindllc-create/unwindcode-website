/* Unwind Code — Living Atlas. Progressive enhancement, no dependencies. */
"use strict";
(() => {
  const doc = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const readStorage = (key, fallback) => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  };
  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Private browsing can deny storage. */
    }
  };
  let language = readStorage("uc-lang", "en") === "es" ? "es" : "en";
  let motionPaused = readStorage("uc-atlas-motion", "on") === "off";
  const translations = [...document.querySelectorAll("[data-es]")].map(
    (el) => ({ el, en: el.textContent, es: el.dataset.es }),
  );
  const attributes = [
    ...[...document.querySelectorAll("[data-es-aria]")].map((el) => ({
      el,
      name: "aria-label",
      en: el.getAttribute("aria-label"),
      es: el.dataset.esAria,
    })),
    ...[...document.querySelectorAll("[data-es-alt]")].map((el) => ({
      el,
      name: "alt",
      en: el.getAttribute("alt"),
      es: el.dataset.esAlt,
    })),
  ];
  const languageButton = document.getElementById("lang-toggle");
  const motionButton = document.getElementById("motion-toggle");
  const motionLabel = document.getElementById("motion-label");

  function updateMotion() {
    const paused = motionPaused || reduced.matches;
    doc.classList.toggle("motion-paused", paused);
    motionButton.setAttribute("aria-pressed", String(paused));
    motionButton.disabled = reduced.matches;
    motionLabel.textContent = reduced.matches
      ? language === "es"
        ? "MOVIMIENTO REDUCIDO"
        : "REDUCED MOTION"
      : paused
        ? language === "es"
          ? "ACTIVAR MOVIMIENTO"
          : "RESUME MOTION"
        : language === "es"
          ? "PAUSAR MOVIMIENTO"
          : "PAUSE MOTION";
    motionButton.firstElementChild.textContent = paused ? "▷" : "Ⅱ";
  }
  function setLanguage(lang) {
    language = lang === "es" ? "es" : "en";
    doc.lang = language;
    for (const item of translations) item.el.textContent = item[language];
    for (const item of attributes)
      item.el.setAttribute(item.name, item[language]);
    languageButton.textContent = language === "en" ? "ES" : "EN";
    languageButton.setAttribute(
      "aria-label",
      language === "en" ? "Cambiar a español" : "Switch to English",
    );
    document.title =
      language === "es"
        ? "Unwind Code — Inteligencia que evoluciona"
        : "Unwind Code — Intelligence That Evolves";
    updateMotion();
    writeStorage("uc-lang", language);
    document.dispatchEvent(new CustomEvent("uc:languagechange", { detail: { lang: language } }));
  }
  languageButton.addEventListener("click", () =>
    setLanguage(language === "en" ? "es" : "en"),
  );
  languageButton.hidden = false;
  motionButton.addEventListener("click", () => {
    motionPaused = !motionPaused;
    writeStorage("uc-atlas-motion", motionPaused ? "off" : "on");
    updateMotion();
  });
  motionButton.hidden = false;
  reduced.addEventListener("change", updateMotion);
  setLanguage(language);

  // Tab groups use native buttons, roving focus, and an explicit panel relationship.
  document.querySelectorAll("[data-tabs]").forEach((group) => {
    const tabs = [...group.querySelectorAll('[role="tab"]')];
    function select(tab, focus = false) {
      for (const item of tabs) {
        const active = item === tab;
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
        document.getElementById(item.getAttribute("aria-controls")).hidden =
          !active;
      }
      const diagram = group.querySelector(".memory-diagram");
      if (diagram) diagram.dataset.layer = tab.dataset.layer;
      const loop = group.querySelector("[data-infinity]");
      if (loop) {
        loop.dataset.step = tab.dataset.layer;
        loop.dispatchEvent(new Event("stepchange"));
      }
      if (focus) tab.focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (event) => {
        let next = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown")
          next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
          next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        else return;
        event.preventDefault();
        select(tabs[next], true);
      });
    });
  });

  // Native dialog contains focus, makes the background inert, and supports Escape.
  const menu = document.getElementById("mobile-menu");
  const menuToggle = document.getElementById("menu-toggle");
  let menuDestination = null;
  const closeMenu = () => {
    if (menu.open) menu.close();
  };
  menuToggle.hidden = false;
  menuToggle.addEventListener("click", () => {
    menu.showModal();
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  });
  document.getElementById("menu-close").addEventListener("click", closeMenu);
  menu.addEventListener("close", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    (menuDestination || menuToggle).focus({ preventScroll: true });
    menuDestination = null;
  });
  menu.addEventListener("click", (event) => {
    if (event.target === menu) closeMenu();
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      const target = a.hash ? document.getElementById(a.hash.slice(1)) : null;
      menuDestination = target;
      closeMenu();
      // A local navigation returns focus to the destination instead of the closed drawer.
      if (target && a.pathname === window.location.pathname) {
        target.tabIndex = -1;
      }
    }),
  );
  window
    .matchMedia("(min-width: 901px)")
    .addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });

  // The artwork is complete as a still. Animation runs only while it is visible.
  const scenes = document.querySelectorAll("[data-motion-scene]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) =>
          entry.target.classList.toggle("in-view", entry.isIntersecting),
        ),
      { threshold: 0.05 },
    );
    scenes.forEach((el) => observer.observe(el));
  }
  document.addEventListener("visibilitychange", () =>
    doc.classList.toggle("page-hidden", document.hidden),
  );
  doc.classList.toggle("page-hidden", document.hidden);
  document.querySelectorAll("img").forEach((img) => {
    const onError = () => img.parentElement.classList.add("media-unavailable");
    img.addEventListener("error", onError);
    if (img.complete && img.naturalWidth === 0) onError();
  });
  doc.classList.add("js-ready");
})();
