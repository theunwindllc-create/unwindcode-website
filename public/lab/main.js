/* ═══════════════ Unwind Code — cinematic engine ═══════════════ */
'use strict';

const clamp01 = v => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Debug surface for automated verification */
window.__unwind = { heroProgress: 0, heroVideoReady: false, activeOrgan: 0, selectedPath: 'collaborators', bootDone: false };

/* ═══════════════ BOOT — cinematic entrance ═══════════════ */
(function boot() {
  const overlay = document.getElementById('boot');
  const statusEl = document.getElementById('boot-status');
  const fill = document.getElementById('boot-fill');
  const STATUSES = ['waking cortex…', 'linking memory…', 'opening gateway…', 'running proof loop…', 'organism awake'];
  const MIN_MS = reducedMotion ? 250 : 2000;
  const MAX_MS = reducedMotion ? 400 : 3600;
  const start = performance.now();
  let finished = false;

  function finish() {
    if (finished) return;
    finished = true;
    statusEl.textContent = STATUSES[STATUSES.length - 1];
    fill.style.width = '100%';
    const splashDelay = reducedMotion ? 0 : 180;
    setTimeout(() => {
      overlay.classList.add('splash');
      document.body.classList.remove('booting');
      document.body.classList.add('lit');
      setTimeout(() => {
        overlay.classList.add('gone');
        window.__unwind.bootDone = true;
        setTimeout(() => overlay.remove(), 1200);
      }, reducedMotion ? 0 : 500);
    }, splashDelay);
  }

  function tick(now) {
    if (finished) return;
    const t = clamp01((now - start) / MIN_MS);
    fill.style.width = (t * 92) + '%';
    statusEl.textContent = STATUSES[Math.min(STATUSES.length - 2, Math.floor(t * (STATUSES.length - 1)))];
    const heroEl = document.getElementById('hero-video');
    const videoReady = heroEl && heroEl.readyState >= 3;
    if ((t >= 1 && videoReady) || now - start >= MAX_MS) { finish(); return; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  overlay.addEventListener('click', finish);
})();

/* ── Section scroll progress: 0 when section top hits viewport top, 1 at pin end ── */
function sectionProgress(el) {
  const rect = el.getBoundingClientRect();
  const total = el.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  return clamp01(-rect.top / total);
}

/* ═══════════════ Video helpers: use clip when present, fallback otherwise ═══════════════ */
function wireVideo(id, { autoplay = false } = {}) {
  const video = document.getElementById(id);
  if (!video) return null;
  const state = { video, ready: false, duration: 0 };
  video.addEventListener('loadedmetadata', () => {
    state.duration = video.duration || 0;
  });
  video.addEventListener('canplay', () => {
    if (state.ready) return;
    state.ready = true;
    video.classList.add('ready');
    if (autoplay) video.play().catch(() => {});
  });
  video.addEventListener('error', () => { state.ready = false; }, true);
  video.load();
  return state;
}

const heroVideo = wireVideo('hero-video');
const boundaryVideo = wireVideo('boundary-video', { autoplay: true });
const proofVideo = wireVideo('proof-video', { autoplay: true });

/* ═══════════════ HERO — particle assembly, scroll-scrubbed ═══════════════ */
const heroSection = document.querySelector('.hero');
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let W = 0, H = 0, DPR = 1;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.clientWidth; H = canvas.clientHeight;
  canvas.width = W * DPR; canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize);
resize();

/* Anchors match the HTML overlay node positions (percent of viewport) */
const ANCHORS = [
  { x: 0.50, y: 0.52, w: 46 },  // core ∞
  { x: 0.50, y: 0.27, w: 30 },  // Cortex
  { x: 0.25, y: 0.52, w: 30 },  // Memory
  { x: 0.75, y: 0.52, w: 30 },  // Cells
  { x: 0.50, y: 0.74, w: 30 },  // Proof
];

/* Deterministic pseudo-random so the scrub is stable frame to frame */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PARTICLE_COUNT = 1400;
const rand = mulberry32(20260719);
const particles = [];
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const anchor = ANCHORS[Math.floor(rand() * ANCHORS.length)];
  const angle = rand() * Math.PI * 2;
  const spread = 0.55 + rand() * 0.65;
  particles.push({
    sx: 0.5 + Math.cos(angle) * spread * (0.6 + rand()),   // scattered start (viewport units)
    sy: 0.5 + Math.sin(angle) * spread * (0.6 + rand()),
    cx: 0.5 + (rand() - 0.5) * 1.6,                        // bezier control → swirl path
    cy: 0.5 + (rand() - 0.5) * 1.6,
    ax: anchor.x, ay: anchor.y, aw: anchor.w,
    ja: rand() * Math.PI * 2,                              // jitter phase
    js: 0.4 + rand() * 0.9,                                // jitter speed
    da: rand() * Math.PI * 2,                              // dock angle
    dr: 0.12 + rand() * rand(),                            // dock radius (center-dense)
    size: 0.6 + rand() * 1.7,
    alpha: 0.25 + rand() * 0.75,
    delay: rand() * 0.35,                                  // staggered assembly
  });
}

let heroProgress = 0;        // rendered (smoothed)
let heroTarget = 0;          // raw from scroll

function drawParticles(time) {
  ctx.clearRect(0, 0, W, H);
  const p = reducedMotion ? 1 : heroProgress;
  const settled = p > 0.92;
  const beat = settled ? 1 + Math.sin(time * 0.0035) * 0.25 : 1;

  for (const pt of particles) {
    const local = clamp01((p - pt.delay) / (1 - pt.delay || 1));
    const t = easeInOut(local);
    // quadratic bezier: scattered → swirl → anchor
    const inv = 1 - t;
    let x = inv * inv * pt.sx + 2 * inv * t * pt.cx + t * t * pt.ax;
    let y = inv * inv * pt.sy + 2 * inv * t * pt.cy + t * t * pt.ay;
    // orbital jitter that dies out as the particle docks
    const drift = (1 - t) * 0.045 + 0.0035;
    x += Math.sin(time * 0.001 * pt.js + pt.ja) * drift;
    y += Math.cos(time * 0.0012 * pt.js + pt.ja * 1.7) * drift;
    // dock scatter: settle into a soft round cloud around the anchor
    const dock = t * t;
    const dockR = pt.aw * pt.dr * 2.2;
    x += Math.cos(pt.da) * dockR / Math.max(W, 1) * dock;
    y += Math.sin(pt.da) * dockR / Math.max(H, 1) * dock;

    const px = x * W, py = y * H;
    if (px < -40 || px > W + 40 || py < -40 || py > H + 40) continue;
    const glow = pt.alpha * (0.5 + 0.5 * t) * beat;
    ctx.beginPath();
    ctx.arc(px, py, pt.size * (1 + dock * 0.4), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(155, 89, 245, ${Math.min(glow, 1)})`;
    ctx.fill();
  }

  // faint filaments between anchors once mostly assembled
  if (p > 0.6) {
    const la = (p - 0.6) / 0.4 * 0.35;
    ctx.strokeStyle = `rgba(155, 89, 245, ${la * beat})`;
    ctx.lineWidth = 1;
    const core = ANCHORS[0];
    for (let i = 1; i < ANCHORS.length; i++) {
      ctx.beginPath();
      ctx.moveTo(core.x * W, core.y * H);
      ctx.lineTo(ANCHORS[i].x * W, ANCHORS[i].y * H);
      ctx.stroke();
    }
  }
}

/* Overlay: copy, nodes, lines, CTA driven by progress */
const heroCopy = document.getElementById('hero-copy');
const heroCta = document.getElementById('hero-cta');
const scrollHint = document.getElementById('scroll-hint');
const orgCore = document.querySelector('.org-core');
const orgNodes = [...document.querySelectorAll('.org-node')];
const orgLines = [...document.querySelectorAll('.org-line')];
const NODE_AT = [0.38, 0.48, 0.58, 0.68];

function updateHeroOverlay(p) {
  const copyFade = clamp01(1 - p / 0.3);
  heroCopy.style.opacity = copyFade;
  heroCopy.style.transform = `translateY(${p * -120}px) scale(${1 - p * 0.12})`;
  scrollHint.style.opacity = p > 0.05 ? 0 : 1;

  const coreT = clamp01((p - 0.28) / 0.14);
  orgCore.style.opacity = coreT;
  orgCore.style.transform = `translate(-50%, -50%) scale(${lerp(0.6, 1, easeInOut(coreT))})`;

  orgNodes.forEach((node, i) => node.classList.toggle('on', p >= NODE_AT[i]));
  orgLines.forEach((line, i) => {
    const t = clamp01((p - NODE_AT[i]) / 0.1);
    line.style.strokeDashoffset = 100 - easeInOut(t) * 100;
  });

  heroCta.classList.toggle('on', p > 0.82);
}

/* ═══════════════ BOUNDARY — pinned organ strip ═══════════════ */
const boundarySection = document.querySelector('.boundary');
const organs = [...document.querySelectorAll('.organ')];
const organLine = document.getElementById('organ-line');
const ORGAN_LINES = [
  'Reasoning and planning. Decides what to try next.',
  'Persistent, versioned recall. Nothing learned is lost.',
  'Every outward action passes through one door.',
  'Small, replaceable workers — grown, tested, retired.',
  'Detects drift and quarantines rogue behavior.',
  'Every claim ships with a public artifact.',
];
let activeOrgan = -1;
let organPinned = false; // manual click wins over scroll until user scrolls on

function setOrgan(i) {
  if (i === activeOrgan) return;
  activeOrgan = i;
  window.__unwind.activeOrgan = i;
  organs.forEach((o, j) => o.classList.toggle('active', j === i));
  organLine.textContent = ORGAN_LINES[i];
}
organs.forEach((o, i) => o.addEventListener('click', () => { organPinned = true; setOrgan(i); }));
setOrgan(0);

/* ═══════════════ Scroll + render loop ═══════════════ */
const nav = document.getElementById('nav');
let lastScrollY = -1;

function onFrame(time) {
  const sy = window.scrollY;
  if (sy !== lastScrollY) {
    lastScrollY = sy;
    heroTarget = sectionProgress(heroSection);
    if (organPinned) organPinned = false; // user scrolled → resume scroll control
    nav.classList.toggle('scrolled', sy > 30);
  }

  heroProgress = reducedMotion ? heroTarget : lerp(heroProgress, heroTarget, 0.12);
  if (Math.abs(heroProgress - heroTarget) < 0.0005) heroProgress = heroTarget;
  window.__unwind.heroProgress = heroProgress;

  updateHeroOverlay(heroProgress);

  // when the clip exists it carries the organism map itself: scrub it and
  // retire the HTML map + canvas fallback; otherwise the particles play the part
  if (heroVideo && heroVideo.ready && heroVideo.duration > 0) {
    if (!window.__unwind.heroVideoReady) {
      window.__unwind.heroVideoReady = true;
      document.getElementById('org-map').style.display = 'none';
      ctx.clearRect(0, 0, W, H);
    }
    const t = heroProgress * Math.max(heroVideo.duration - 0.05, 0);
    if (Math.abs(heroVideo.video.currentTime - t) > 0.02) {
      heroVideo.video.currentTime = t;
    }
  } else {
    drawParticles(time);
  }

  // boundary organ strip follows scroll unless a click pinned it
  if (!organPinned) {
    const bp = sectionProgress(boundarySection);
    if (bp > 0) setOrgan(Math.min(5, Math.floor(bp * 6)));
  }

  requestAnimationFrame(onFrame);
}
requestAnimationFrame(onFrame);

/* ═══════════════ Reveal on scroll ═══════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.18 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════ Metric counters ═══════════════ */
function runCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const dur = 1600;
  const start = performance.now();
  function tick(now) {
    const t = clamp01((now - start) / dur);
    el.textContent = Math.round(easeInOut(t) * target);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); counterObserver.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('.metric-num').forEach(el => counterObserver.observe(el));

/* ═══════════════ Path toggle ═══════════════ */
const PATHS = {
  builders: {
    title: 'Builders — fork the anatomy',
    items: [
      'Organism blueprints: cortex, memory, gateway, cells, immune system, proof loop',
      'Cell templates and the graft loop for growing new organs safely',
      'Proof-loop tooling — ship artifacts, not claims',
    ],
    cta: 'Start building',
    href: '/build-with-us',
  },
  investors: {
    title: 'Investors — back governed intelligence',
    items: [
      'The thesis: autonomy that compounds only inside authority boundaries',
      'Live proof ledger — real artifacts, honest metrics, failures included',
      'Zero vanity numbers. Zero hidden authority paths.',
    ],
    cta: 'Read the thesis',
    href: '/vision',
  },
  users: {
    title: 'Users — live with an organism',
    items: [
      'Infinity Mirror early access — an EQ that adapts to you',
      'Public transmissions as each organism grows a new capability',
      'Your data, your gates: every organism obeys the same boundaries',
    ],
    cta: 'Join early access',
    href: '/organisms/infinity-mirror',
  },
  collaborators: {
    title: 'Collaborators — grow the lab with us',
    items: [
      'Co-design new organs and run joint experiments on live organisms',
      'Shared research on memory, proof loops, and human authority gates',
      'A direct line to the architect — small lab, real conversations',
    ],
    cta: 'Build With Us',
    href: '/build-with-us',
  },
};

const pathCards = [...document.querySelectorAll('.path-card')];
const pathTitle = document.getElementById('path-detail-title');
const pathList = document.getElementById('path-detail-list');
const pathCta = document.getElementById('path-detail-cta');

function selectPath(key) {
  const data = PATHS[key];
  if (!data) return;
  window.__unwind.selectedPath = key;
  pathCards.forEach(c => c.setAttribute('aria-selected', String(c.dataset.path === key)));
  pathTitle.textContent = data.title;
  pathList.innerHTML = '';
  data.items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    pathList.appendChild(li);
  });
  pathCta.textContent = data.cta;
  pathCta.href = data.href;
}
pathCards.forEach(c => c.addEventListener('click', () => selectPath(c.dataset.path)));
selectPath('collaborators');
