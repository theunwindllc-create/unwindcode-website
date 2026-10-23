import { createMotionArbiter, syncVideos } from './alive-motion.js';
import { initWitness } from './witness.js';
import { projectLoop } from './loop-geometry.js';
import { initLivingWords, circuitFrames } from './living-words.js';
import { createScrollDepth } from './scroll-depth.js';
import { createScrollCinema } from './scroll-cinema.js';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const coarse = matchMedia('(pointer: coarse)');
let pageActive = true;
let scrollDepth = null;
let cinema = null;
let inputAt = -Infinity;
let scrollIntent = false;
const allowed = () => pageActive && !document.hidden && !reduced.matches && !root.classList.contains('motion-paused');
const motion = createMotionArbiter(allowed, busy => {
  if (busy) { cinema?.brake(); inputAt = -Infinity; scrollIntent = false; }
  root.toggleAttribute('data-alive-busy', busy);
  document.dispatchEvent(new CustomEvent('atlas:foreground', { detail: { busy } }));
  syncBreath();
  if (!busy) queueMicrotask(refreshDepth);
});
const videos = [...document.querySelectorAll('video[data-alive-video]')];
const arts = [...document.querySelectorAll('[data-alive-art]')];
const visible = new Set();
let lit = null;
let scrollFrame = 0;
let pointerSample = null;
let scrolled = false;
let living = null;
let currentSheet = null;
let origin = null;
let sheetRequest = 0;
const loopPanels = document.querySelector('.loop-panels');
const loop = document.querySelector('[data-infinity]');
const specimenSheet = document.getElementById('specimen-sheet');
const hero = arts.find(art => art.classList.contains('hero-art'));
if (hero) scrollDepth = createScrollDepth();
if (hero) cinema = createScrollCinema({ hero,
  allowed: () => allowed() && !currentSheet && !motion.active,
  manifestUrl: '/lab/media/atlas/scroll/infinity-v1/manifest.json',
});
// Approved decorative exception, not telemetry. One transform-only compositor animation.
let breath = null;
function syncBreath() {
  if (!hero) return;
  if (allowed() && visible.has(hero) && !motion.active && !cinema?.metrics.active) {
    breath ??= hero.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.014)' }, { transform: 'scale(1)' }],
      { duration: 12000, iterations: Infinity, easing: 'ease-in-out' });
    hero.style.willChange = 'transform';
    if (breath.playState !== 'running') breath.play();
  } else {
    // A paused transform still retains accelerated descendant layers in Chromium.
    // Retire it during foreground work so the entrance really owns only two layers.
    if (motion.active || cinema?.metrics.active) { breath?.cancel(); breath = null; }
    else breath?.pause();
    hero.style.removeProperty('will-change');
  }
}
const spanish = () => root.lang === 'es';
function words(element, en, es) {
  element.dataset.en = en;
  element.dataset.es = es;
  element.textContent = spanish() ? es : en;
}
function resetLight(force = false) {
  living?.resetLight();
  pointerSample = null;
  if (!lit) return;
  if (force !== true && lit.hasAttribute('data-sheet-lit') && allowed()) return;
  lit.removeAttribute('data-alive-lit');
  lit.style.removeProperty('--depth');
  lit = null;
}
function seedPoint(art) {
  const image = art.querySelector('img');
  const width = art.clientWidth, height = art.clientHeight;
  const iw = image.naturalWidth || 1536, ih = image.naturalHeight || 1024;
  const scale = (art === hero ? Math.min : Math.max)(width / iw, height / ih);
  const x = .5 + (Number(art.dataset.seedX || .5) - .5) * iw * scale / width;
  const y = .5 + (Number(art.dataset.seedY || .5) - .5) * ih * scale / height;
  // Specimen pixels and their seed move together inside a stationary container.
  // Keep the seed's layout position unshifted; aim light at its rendered position.
  const shift = art === hero ? 0 : (parseFloat(art.style.getPropertyValue('--scene-y')) || 0);
  return { x, y, lightY: y + shift / (height || 1) };
}
function seedLight(art, sheet = false) {
  const point = seedPoint(art); light(art, point.x, point.lightY, 0, sheet);
}
function light(art, x, y, depth = 0, sheet = false) {
  if (!allowed() || (!sheet && (motion.active || currentSheet))) return;
  const { x: sx, y: sy, lightY } = seedPoint(art);
  if (lit !== art) resetLight();
  lit = art;
  art.setAttribute('data-alive-lit', '');
  art.style.setProperty('--light-x', `${x * 100}%`);
  art.style.setProperty('--light-y', `${y * 100}%`);
  // The reflection image already translates; its mask needs image-local Y.
  art.style.setProperty('--refract-light-y', `${(y - (lightY - sy)) * 100}%`);
  art.style.setProperty('--refract-x', `${-(x - .5) * 18}px`);
  art.style.setProperty('--refract-y', `${-(y - .5) * 18}px`);
  art.style.setProperty('--seed-x', `${sx * 100}%`);
  art.style.setProperty('--seed-y', `${sy * 100}%`);
  art.style.setProperty('--seed-strength', `${.2 + .7 * clamp(1 - Math.hypot(x - sx, y - lightY) / .48)}`);
  art.style.setProperty('--depth', `${depth}px`);
}
for (const art of arts) {
  const image = art.querySelector('img');
  const reflection = image.cloneNode(false);
  reflection.className = 'alive-refraction';
  reflection.alt = '';
  reflection.removeAttribute('data-es-alt');
  reflection.removeAttribute('fetchpriority');
  reflection.setAttribute('aria-hidden', 'true');
  art.append(reflection);
  const bloom = document.createElement('span');
  bloom.className = 'alive-bloom';
  bloom.setAttribute('aria-hidden', 'true');
  art.append(bloom);
  const seed = document.createElement('span');
  seed.className = 'alive-seed';
  seed.setAttribute('aria-hidden', 'true');
  art.append(seed);
  const point = seedPoint(art);
  art.style.setProperty('--seed-x', `${point.x * 100}%`);
  art.style.setProperty('--seed-y', `${point.y * 100}%`);
  // Hero text overlaps the artwork; listen on its section without stealing clicks.
  const hit = art.classList.contains('hero-art') ? art.closest('.hero') : art;
  hit.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    pointerSample = { art, x: event.clientX, y: event.clientY };
    scheduleInput();
  }, { passive: true });
  hit.addEventListener('pointerleave', resetLight, { passive: true });
  hit.addEventListener('pointercancel', resetLight, { passive: true });
  const focusHit = art.closest('.specimen') || hit;
  focusHit.addEventListener('focusin', () => seedLight(art));
  focusHit.addEventListener('focusout', resetLight);
}
function clamp(n) { return Math.max(0, Math.min(1, n)); }
const pendingSeeds = new Set();
function pulseNext() {
  if (!allowed() || currentSheet || motion.active) return;
  const art = [...pendingSeeds].find(candidate => visible.has(candidate));
  if (!art) return;
  pendingSeeds.delete(art);
  resetLight();
  motion.play(art.querySelector('.alive-seed'), [
    { opacity: 0, transform: 'scale(.6)' },
    { opacity: .7, transform: 'scale(1.2)', offset: .35 },
    { opacity: 0, transform: 'scale(1.8)' },
  ], 320, { finish: () => queueMicrotask(pulseNext) });
}
const entered = new WeakSet();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        visible.add(entry.target);
        if (!entered.has(entry.target)) {
          entered.add(entry.target);
          if (!entry.target.classList.contains('hero-art') && allowed()) pendingSeeds.add(entry.target);
        }
      } else {
        visible.delete(entry.target);
        pendingSeeds.delete(entry.target);
        if (lit === entry.target) resetLight();
      }
    }
    pulseNext();
    syncBreath();
  }, { threshold: 0 });
  arts.forEach(art => observer.observe(art));
}
function scrollLight() {
  scrollFrame = 0;
  if (!allowed() || currentSheet) return;
  if (pointerSample) {
    const { art, x, y } = pointerSample;
    pointerSample = null;
    const box = art.getBoundingClientRect();
    light(art, clamp((x - box.left) / box.width), clamp((y - box.top) / box.height));
    if (art === hero) living?.light(x, y);
  }
  if (!scrolled) return;
  scrolled = false;
  const intent = scrollIntent;
  scrollIntent = false;
  if (!motion.active) {
    scrollDepth?.sample();
    if (hero) {
      const box = hero.closest('.hero').getBoundingClientRect();
      cinema?.sample(clamp(-box.top / (box.height * .7)), intent);
      syncBreath();
    }
  }
  const active = [...visible].sort((a, b) => {
    const distance = el => Math.abs(el.getBoundingClientRect().top + el.clientHeight / 2 - innerHeight / 2);
    return distance(a) - distance(b);
  })[0];
  if (active) {
    const box = active.getBoundingClientRect();
    const progress = clamp((innerHeight - box.top) / (innerHeight + box.height));
    light(active, progress, .5 + Math.sin(progress * Math.PI * 2) * .18);
  }
  const bounds = loop.getBoundingClientRect();
  if (bounds.bottom > 0 && bounds.top < innerHeight) {
    loop.dispatchEvent(new CustomEvent('atlas:scroll', { detail: { progress: clamp((innerHeight - bounds.top) / (innerHeight + bounds.height)) } }));
  }
}
function scheduleInput() {
  if (allowed() && !scrollFrame) scrollFrame = requestAnimationFrame(scrollLight);
}
function refreshDepth() {
  if (!scrollDepth || !allowed() || currentSheet || motion.active) return;
  scrolled = true;
  scheduleInput();
}
window.addEventListener('resize', () => {
  inputAt = -Infinity; scrollIntent = false; refreshDepth();
}, { passive: true });
// Intent is separate from layout/resize refreshes and restored scroll positions.
for (const type of ['wheel', 'touchmove', 'pointerdown']) {
  window.addEventListener(type, () => { inputAt = performance.now(); }, { passive: true });
}
window.addEventListener('keydown', event => {
  if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) inputAt = performance.now();
}, { passive: true });
window.addEventListener('scroll', () => {
  scrollIntent = performance.now() - inputAt < 1000;
  scrolled = true;
  scheduleInput();
}, { passive: true });

function retire(returnFocus = true, animate = true) {
  sheetRequest++;
  const revision = sheetRequest;
  if (!currentSheet) return;
  const sheet = currentSheet;
  const trigger = origin;
  arts.forEach(art => art.removeAttribute('data-sheet-lit'));
  resetLight(true);
  if (sheet === loopPanels) {
    delete loop.dataset.sheetOpen;
    delete loop.closest('.loop-system').dataset.sheetSide;
    const thread = document.querySelector('.loop-thread');
    if (thread) thread.hidden = true;
  }
  currentSheet = null;
  origin = null;
  const finish = () => {
    if (sheet === specimenSheet) sheet.close();
    else sheet.hidden = true;
    trigger?.setAttribute('aria-expanded', 'false');
    if (returnFocus && sheetRequest === revision) trigger?.focus({ preventScroll: true });
  };
  motion.cancel();
  if (animate) motion.play(sheet, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(8px) scale(.97)' }], 180, { priority: 2, finish });
  else finish();
}
function condense(sheet, trigger) {
  const scrollPosition = { top: window.scrollY, left: window.scrollX, behavior: 'instant' };
  retire(false, false);
  motion.cancel();
  resetLight();
  currentSheet = sheet;
  origin = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  if (sheet === specimenSheet) { if (!sheet.open) sheet.show(); }
  else sheet.hidden = false;
  if (sheet === loopPanels) positionLoop();
  else {
    positionSpecimen();
    const art = trigger.closest('.specimen').querySelector('[data-alive-art]');
    art.setAttribute('data-sheet-lit', '');
    seedLight(art, true);
    window.scrollTo(scrollPosition);
  }
  pendingSeeds.clear();
  const thread = sheet === loopPanels ? document.querySelector('.loop-thread') : null;
  const sheetBlur = window.innerWidth <= 700 || coarse.matches ? 'none' : 'blur(14px)';
  motion.play(sheet, [{ opacity: 0, filter: sheetBlur, transform: 'scale(.98)' },
    { opacity: 1, filter: 'none', transform: 'none' }], 240, { priority: 2,
    companion: thread && !thread.hidden ? { element: thread, frames: [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }] } : null });
}
function requestSheet(commit) {
  const revision = ++sheetRequest;
  motion.cancel();
  if (!currentSheet || !allowed()) { commit(); return; }
  motion.play(currentSheet, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(8px) scale(.97)' }], 180, {
    priority: 2,
    finish: () => { if (sheetRequest === revision) commit(); },
  });
}
loopPanels.classList.add('alive-sheet');
loopPanels.hidden = true;
document.querySelectorAll('[data-organism-status], .loop-panels [data-sheet-close]').forEach(button => { button.hidden = false; });
root.classList.add('alive-ready');
document.addEventListener('atlas:loop-request', event => {
  event.preventDefault();
  requestSheet(event.detail.commit);
});
document.addEventListener('atlas:loop-select', event => {
  const tab = event.detail.tab;
  condense(loopPanels, tab);
});

function positionLoop() {
  if (!loop.getBoundingClientRect) return; // Non-layout environments retain semantic tabs.
  const system = loop.closest('.loop-system');
  const step = Number(origin.dataset.layer);
  const side = Math.cos(step / 6 * Math.PI * 2) < 0 ? 'left' : 'right';
  system.dataset.sheetSide = side;
  loop.dataset.sheetOpen = 'true';
  let thread = system.querySelector('.loop-thread');
  if (!thread) {
    thread = document.createElement('span');
    thread.className = 'loop-thread'; thread.setAttribute('aria-hidden', 'true'); system.append(thread);
  }
  thread.hidden = innerWidth <= 700;
  if (innerWidth <= 700) return;
  const box = loop.getBoundingClientRect(), parent = system.getBoundingClientRect();
  const point = loop.projectStep?.(step) || projectLoop(step, box.width, box.height);
  const x = box.left - parent.left + point.x, y = box.top - parent.top + point.y;
  const width = loopPanels.offsetWidth, height = loopPanels.offsetHeight;
  const left = side === 'left' ? 0 : parent.width - width;
  const top = Math.max(86, 16 - parent.top, Math.min(box.height - height - 32, innerHeight - parent.top - height - 96, y - height / 2));
  loopPanels.style.setProperty('--sheet-left', `${left}px`);
  loopPanels.style.setProperty('--sheet-top', `${top}px`);
  loopPanels.style.setProperty('--sheet-origin', `${x - left}px ${y - top}px`);
  const endX = side === 'left' ? left + width : left;
  const endY = Math.max(top + 24, Math.min(top + height - 24, y));
  const length = Math.hypot(endX - x, endY - y);
  Object.assign(thread.style, { left: `${x}px`, top: `${y}px`, width: `${length}px`,
    rotate: `${Math.atan2(endY - y, endX - x)}rad` });
  loop.dispatchEvent(new Event('stepchange'));
}
function positionSpecimen() {
  if (currentSheet !== specimenSheet || !origin) return;
  const parent = origin.closest('.specimen').getBoundingClientRect();
  const trigger = origin.getBoundingClientRect();
  if (innerWidth > 700) {
    const art = origin.closest('.specimen').querySelector('[data-alive-art]');
    const top = Math.max(24, Math.min(trigger.top - parent.top - specimenSheet.offsetHeight - 18,
      art.offsetTop + art.offsetHeight - specimenSheet.offsetHeight * .85));
    specimenSheet.style.setProperty('--specimen-top', `${top}px`);
  }
  // offset coordinates ignore the in-flight condensation transform.
  const left = specimenSheet.offsetLeft + (innerWidth > 700 ? parent.left : 0);
  const top = specimenSheet.offsetTop + (innerWidth > 700 ? parent.top : 0);
  specimenSheet.style.setProperty('--sheet-origin', `${trigger.left + trigger.width / 2 - left}px ${trigger.top + trigger.height / 2 - top}px`);
}
window.addEventListener('resize', () => {
  if (currentSheet === loopPanels) positionLoop(); else positionSpecimen();
});
document.querySelectorAll('[data-sheet-close]').forEach(button => button.addEventListener('click', () => retire()));
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !currentSheet) return;
  // A modal Brain/menu owns its own Escape path.
  if (document.querySelector('dialog:modal')) return;
  event.preventDefault();
  retire();
});
document.addEventListener('pointerdown', event => {
  if (currentSheet && !currentSheet.contains(event.target) && !event.target.closest('[role="tab"], [data-organism-status]')) retire(false);
});
const translations = {
  'visual-cortex': 'Visual Cortex se presenta como una superficie de inteligencia creativa que traduce la estrategia del organismo, los sistemas de diseño y la experiencia pública en resultados visuales coherentes.',
  'infinity-mirror': 'Infinity Mirror se presenta como una experiencia reflexiva del organismo para la claridad emocional, la memoria visible, la reflexión con consentimiento y la retroalimentación centrada en las personas.',
  'financial-organisms': 'Los organismos financieros se describen como sistemas guiados por pruebas que observan, simulan y clasifican riesgos, y requieren aprobación humana explícita antes de cualquier acción financiera con consecuencias.',
  'brain-cell-architecture': 'Brain Cell Architecture es el patrón público de células especializadas e intercambiables, gobernadas por revisión, simulación, límites de capacidad y crecimiento reversible.',
};
const statuses = {
  'public-concept': ['Public concept', 'Concepto público'],
  'public-product-narrative': ['Public product narrative', 'Descripción pública del producto'],
  'public-safety-architecture': ['Public safety architecture', 'Arquitectura pública de seguridad'],
  'public-architecture': ['Public architecture', 'Arquitectura pública'],
};
let registryRequest = null;
document.querySelectorAll('[data-organism-status]').forEach(button => {
  button.addEventListener('click', () => {
    if (origin === button) { retire(); return; }
    requestSheet(() => openSpecimen(button));
  });
});
async function openSpecimen(button) {
    registryRequest?.abort();
    const request = new AbortController();
    registryRequest = request;
    button.closest('.specimen').append(specimenSheet);
    const title = specimenSheet.querySelector('h3');
    title.textContent = button.closest('.specimen').querySelector('h3').textContent.trim();
    const status = specimenSheet.querySelector('[data-registry-status]');
    const summary = specimenSheet.querySelector('[data-registry-summary]');
    words(status, 'Public registry · reading', 'Registro público · consultando');
    words(summary, 'Reading the published description.', 'Consultando la descripción publicada.');
    condense(specimenSheet, button);
    specimenSheet.querySelector('button').focus({ preventScroll: true });
    const timeout = setTimeout(() => request.abort(), 8000);
    try {
      const response = await fetch('/data/organisms.json', { signal: request.signal, cache: 'no-store', credentials: 'omit' });
      if (!response.ok) throw new Error('unreachable');
      const data = await response.json();
      const record = data.organisms?.find(item => item.id === button.dataset.organismStatus);
      if (!record || record.review_status !== 'public_safe' || !statuses[record.status] || typeof record.summary !== 'string') throw new Error('invalid registry');
      if (registryRequest !== request || origin !== button) return;
      const [en, es] = statuses[record.status];
      words(status, `${en} · reviewed as public-safe`, `${es} · revisado para uso público`);
      words(summary, record.summary, translations[record.id]);
    } catch {
      if (registryRequest !== request || origin !== button) return;
      words(status, 'PUBLIC REGISTRY UNREACHABLE', 'REGISTRO PÚBLICO INACCESIBLE');
      words(summary, 'Current registry status could not be read. Explore the organism for its published context.', 'No se pudo consultar el estado del registro. Explora el organismo para ver su contexto publicado.');
    } finally { clearTimeout(timeout); positionSpecimen(); }
}
document.addEventListener('uc:languagechange', () => {
  if (currentSheet === specimenSheet && origin) specimenSheet.querySelector('h3').textContent = origin.closest('.specimen').querySelector('h3').textContent.trim();
  specimenSheet.querySelectorAll('[data-en][data-es]').forEach(el => { el.textContent = spanish() ? el.dataset.es : el.dataset.en; });
  if (currentSheet === loopPanels) positionLoop(); else positionSpecimen();
});
window.addEventListener('atlas:witness-beat', () => {
  if (!allowed() || currentSheet || motion.active) return;
  if (!visible.has(hero)) { loop.dispatchEvent(new Event('atlas:witness')); return; }
  resetLight();
  const seed = hero.querySelector('.alive-seed');
  // One observed arrival, one circuit. The image itself remains conceptual.
  motion.play(seed, circuitFrames(hero), 360, { companion: {
    element: document.querySelector('[data-witness]'),
    frames: [{ color: '#aba2b8' }, { color: '#ffffff', offset: .45 }, { color: '#aba2b8' }],
  } });
});
function brake() {
  if (!allowed()) {
    cinema?.brake(); inputAt = -Infinity; scrollIntent = false;
    living?.brake();
    pendingSeeds.clear();
    motion.cancel(); resetLight(true); cancelAnimationFrame(scrollFrame); scrollFrame = 0;
    scrollDepth?.reset();
    document.querySelectorAll('.loop-thread').forEach(thread => thread.getAnimations().forEach(animation => animation.cancel()));
  }
  syncBreath();
  if (allowed() && currentSheet === specimenSheet && origin) seedLight(origin.closest('.specimen').querySelector('[data-alive-art]'), true);
  syncVideos(videos, allowed() && !motion.active);
  refreshDepth();
}
new MutationObserver(brake).observe(root, { attributes: true, attributeFilter: ['class'] });
reduced.addEventListener('change', brake);
document.addEventListener('visibilitychange', brake);
document.addEventListener('uc:motionchange', brake);
window.addEventListener('pagehide', () => { pageActive = false; registryRequest?.abort(); brake(); });
window.addEventListener('pageshow', () => { pageActive = true; brake(); });
coarse.addEventListener('change', resetLight);
if (hero) living = initLivingWords({ hero, motion, allowed, syncBreath,
  scrollActive: () => cinema?.metrics.active || (scrollIntent && hero.getBoundingClientRect().bottom > 0),
});
initWitness();
brake();
