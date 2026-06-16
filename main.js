/* ═══════════════════════════════════════════════════════════════
   UNWIND CODE — Neural Interface
   Zero dependencies. Maximum signal.
   ═══════════════════════════════════════════════════════════════ */

import { setLanguage, getCurrentLang, getTranslation } from './i18n.js?v=20260615-system-state';

const SUPABASE_URL = 'https://rxsjhikbmvstsivrqqyg.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4c2poaWtibXZzdHNpdnJxcXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MTI1MDYsImV4cCI6MjA4NzI4ODUwNn0.Wt1i-HBRzX6eF0EzSPHbRLoh6wVKDFMGQqqUyiVdKbo';
const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

// ── Language Toggle ─────────────────────────────────────────────
const langToggle = document.getElementById('lang-toggle');
langToggle?.addEventListener('click', () => {
    const next = getCurrentLang() === 'en' ? 'es' : 'en';
    setLanguage(next);
    document.dispatchEvent(new CustomEvent('uc:languagechange', { detail: { lang: next } }));
});

// Initialize language from localStorage
setLanguage(getCurrentLang());

// ── Governed Hero Signal Field ──────────────────────────────────
const canvas = document.getElementById('neural-canvas');
const ctx = canvas?.getContext('2d', { alpha: true });
const heroSignalRoot = document.getElementById('hero');
const compactSignalQuery = window.matchMedia?.('(max-width: 760px)');
let signalWidth = 0;
let signalHeight = 0;
let signalDpr = 1;
let heroSignalFrame = 0;
let heroSignalParticles = [];
let pointerSignal = { x: -1000, y: -1000, active: false };

const heroSignalNodes = [
    { id: 'signal', x: 0.16, y: 0.58, hue: '13, 148, 136', radius: 8 },
    { id: 'gateway', x: 0.32, y: 0.34, hue: '155, 89, 245', radius: 9 },
    { id: 'cortex', x: 0.5, y: 0.46, hue: '214, 168, 79', radius: 12 },
    { id: 'memory', x: 0.66, y: 0.32, hue: '13, 148, 136', radius: 9 },
    { id: 'proof', x: 0.84, y: 0.56, hue: '240, 238, 246', radius: 8 },
    { id: 'boundary', x: 0.58, y: 0.76, hue: '214, 168, 79', radius: 10 },
];

const heroSignalEdges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [2, 5],
    [3, 4],
    [5, 4],
    [1, 5],
];

function isCompactSignalField() {
    return compactSignalQuery?.matches ?? window.innerWidth <= 760;
}

function getHeroSignalPoint(node) {
    return {
        x: node.x * signalWidth,
        y: node.y * signalHeight,
    };
}

function createHeroSignalParticles() {
    if (!signalWidth || !signalHeight) {
        heroSignalParticles = [];
        return;
    }

    const staticMode = prefersReducedMotion || isCompactSignalField();
    const count = staticMode ? 18 : Math.min(58, Math.max(32, Math.floor((signalWidth * signalHeight) / 26000)));

    heroSignalParticles = Array.from({ length: count }, (_, index) => ({
        edge: heroSignalEdges[index % heroSignalEdges.length],
        progress: (index * 0.137) % 1,
        speed: 0.0012 + (index % 5) * 0.00022,
        radius: 1.4 + (index % 4) * 0.35,
        offset: ((index % 7) - 3) * 1.35,
    }));
}

function resizeHeroSignalField() {
    if (!canvas || !ctx || !heroSignalRoot) return;

    const rect = heroSignalRoot.getBoundingClientRect();
    signalWidth = Math.max(1, Math.floor(rect.width));
    signalHeight = Math.max(1, Math.floor(rect.height));
    signalDpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(signalWidth * signalDpr);
    canvas.height = Math.floor(signalHeight * signalDpr);
    canvas.style.width = `${signalWidth}px`;
    canvas.style.height = `${signalHeight}px`;
    ctx.setTransform(signalDpr, 0, 0, signalDpr, 0, 0);

    createHeroSignalParticles();
    drawHeroSignalField(0, true);
}

function drawHeroSignalGrid() {
    if (!ctx) return;

    const spacing = isCompactSignalField() ? 82 : 96;
    ctx.save();
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.055)';

    for (let x = signalWidth % spacing; x < signalWidth; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, signalHeight);
        ctx.stroke();
    }

    for (let y = signalHeight % spacing; y < signalHeight; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(signalWidth, y);
        ctx.stroke();
    }

    ctx.restore();
}

function drawHeroSignalEdges(timestamp, staticMode) {
    if (!ctx) return;

    heroSignalEdges.forEach(([fromIndex, toIndex], index) => {
        const from = getHeroSignalPoint(heroSignalNodes[fromIndex]);
        const to = getHeroSignalPoint(heroSignalNodes[toIndex]);
        const bend = index % 2 === 0 ? 1 : -1;
        const controlX = (from.x + to.x) / 2 + bend * signalWidth * 0.028;
        const controlY = (from.y + to.y) / 2 - bend * signalHeight * 0.045;
        const alpha = staticMode ? 0.18 : 0.16 + Math.sin(timestamp / 800 + index) * 0.035;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(controlX, controlY, to.x, to.y);
        ctx.strokeStyle = `rgba(155, 89, 245, ${alpha})`;
        ctx.lineWidth = 3.2;
        ctx.shadowColor = 'rgba(155, 89, 245, 0.2)';
        ctx.shadowBlur = 18;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(controlX, controlY, to.x, to.y);
        ctx.strokeStyle = 'rgba(13, 148, 136, 0.16)';
        ctx.lineWidth = 0.85;
        ctx.shadowBlur = 0;
        ctx.stroke();
        ctx.restore();
    });
}

function drawHeroSignalParticles(timestamp, staticMode) {
    if (!ctx) return;

    heroSignalParticles.forEach((particle, index) => {
        if (!staticMode) particle.progress = (particle.progress + particle.speed) % 1;

        const from = getHeroSignalPoint(heroSignalNodes[particle.edge[0]]);
        const to = getHeroSignalPoint(heroSignalNodes[particle.edge[1]]);
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.max(1, Math.hypot(dx, dy));
        const normalX = -dy / length;
        const normalY = dx / length;
        const t = particle.progress;
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const x = from.x + dx * eased + normalX * particle.offset;
        const y = from.y + dy * eased + normalY * particle.offset;
        const pointerDistance = pointerSignal.active ? Math.hypot(pointerSignal.x - x, pointerSignal.y - y) : 1000;
        const pointerBoost = pointerDistance < 150 ? (150 - pointerDistance) / 150 : 0;
        const pulse = staticMode ? 0.72 : 0.58 + Math.sin(timestamp / 420 + index) * 0.22 + pointerBoost * 0.4;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, particle.radius + pointerBoost * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 168, 79, ${Math.min(0.8, pulse)})`;
        ctx.shadowColor = 'rgba(214, 168, 79, 0.4)';
        ctx.shadowBlur = 10 + pointerBoost * 18;
        ctx.fill();
        ctx.restore();
    });
}

function drawHeroSignalNodes(timestamp, staticMode) {
    if (!ctx) return;

    heroSignalNodes.forEach((node, index) => {
        const point = getHeroSignalPoint(node);
        const pulse = staticMode ? 0.78 : 0.68 + Math.sin(timestamp / 620 + index) * 0.18;

        ctx.save();
        ctx.beginPath();
        ctx.arc(point.x, point.y, node.radius * 3.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${node.hue}, ${0.045 + pulse * 0.03})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(point.x, point.y, node.radius * 1.9, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${node.hue}, ${0.22 + pulse * 0.16})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(point.x, point.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${node.hue}, ${0.62 + pulse * 0.22})`;
        ctx.shadowColor = `rgba(${node.hue}, 0.38)`;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();
    });

    const boundary = getHeroSignalPoint(heroSignalNodes[5]);
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.ellipse(boundary.x, boundary.y, signalWidth * 0.145, signalHeight * 0.105, -0.12, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(214, 168, 79, 0.24)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
}

function drawHeroSignalField(timestamp = 0, once = false) {
    if (!canvas || !ctx || !signalWidth || !signalHeight) return;

    const staticMode = prefersReducedMotion || isCompactSignalField();
    canvas.dataset.fieldState = staticMode ? 'static' : 'active';

    ctx.clearRect(0, 0, signalWidth, signalHeight);
    const glow = ctx.createRadialGradient(
        signalWidth * 0.58,
        signalHeight * 0.48,
        0,
        signalWidth * 0.58,
        signalHeight * 0.48,
        Math.max(signalWidth, signalHeight) * 0.72,
    );
    glow.addColorStop(0, 'rgba(155, 89, 245, 0.12)');
    glow.addColorStop(0.42, 'rgba(13, 148, 136, 0.07)');
    glow.addColorStop(1, 'rgba(6, 6, 12, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, signalWidth, signalHeight);

    drawHeroSignalGrid();
    drawHeroSignalEdges(timestamp, staticMode);
    drawHeroSignalParticles(timestamp, staticMode);
    drawHeroSignalNodes(timestamp, staticMode);

    if (!staticMode && !once) {
        heroSignalFrame = requestAnimationFrame(drawHeroSignalField);
    }
}

function startHeroSignalField() {
    if (!canvas || !ctx || !heroSignalRoot) return;
    if (heroSignalFrame) cancelAnimationFrame(heroSignalFrame);

    resizeHeroSignalField();

    if (!prefersReducedMotion && !isCompactSignalField()) {
        heroSignalFrame = requestAnimationFrame(drawHeroSignalField);
    }
}

if (canvas && ctx && heroSignalRoot) {
    const restartHeroSignalField = () => startHeroSignalField();
    startHeroSignalField();

    if ('ResizeObserver' in window) {
        const heroSignalObserver = new ResizeObserver(restartHeroSignalField);
        heroSignalObserver.observe(heroSignalRoot);
    } else {
        window.addEventListener('resize', restartHeroSignalField, { passive: true });
    }

    compactSignalQuery?.addEventListener?.('change', restartHeroSignalField);
    compactSignalQuery?.addListener?.(restartHeroSignalField);

    heroSignalRoot.addEventListener('pointermove', (event) => {
        if (prefersReducedMotion || isCompactSignalField()) return;
        const rect = canvas.getBoundingClientRect();
        pointerSignal = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            active: true,
        };
    }, { passive: true });

    heroSignalRoot.addEventListener('pointerleave', () => {
        pointerSignal = { x: -1000, y: -1000, active: false };
    }, { passive: true });
}

// ── Scroll Reveal ───────────────────────────────────────────────
if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
} else {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const delay = e.target.dataset.delay || 0;
                setTimeout(() => e.target.classList.add('visible'), +delay);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

const hashRevealDelays = [0, 80, 240, 720, 1400, 2400];

if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}

function getDocumentScrollRoot() {
    return document.scrollingElement || document.documentElement || document.body;
}

function getCurrentScrollY() {
    return window.scrollY
        || document.documentElement.scrollTop
        || document.body.scrollTop
        || getDocumentScrollRoot()?.scrollTop
        || 0;
}

function setDocumentScrollY(top, behavior = 'auto') {
    const nextY = Math.max(0, top);
    const scrollRoot = getDocumentScrollRoot();
    window.scrollTo({ top: nextY, behavior });
    if (scrollRoot) scrollRoot.scrollTop = nextY;
    document.documentElement.scrollTop = nextY;
    document.body.scrollTop = nextY;
}

function scrollToHashTarget(target, { behavior = 'auto' } = {}) {
    const navHeight = document.getElementById('nav')?.getBoundingClientRect().height || 0;
    const targetY = getCurrentScrollY() + target.getBoundingClientRect().top - navHeight - 18;
    setDocumentScrollY(targetY, behavior);
}

function getHashTarget() {
    const hash = window.location.hash?.slice(1);
    if (!hash) return null;
    let decodedHash = hash;
    try {
        decodedHash = window.decodeURIComponent ? window.decodeURIComponent(hash) : hash;
    } catch {
        decodedHash = hash;
    }
    return document.getElementById(decodedHash);
}

function revealHashTarget({ scroll = false } = {}) {
    const target = getHashTarget();
    if (!target) return false;

    const revealTarget = target.closest('.reveal');
    if (revealTarget) revealTarget.classList.add('visible');
    target.querySelectorAll?.('.reveal').forEach(el => el.classList.add('visible'));
    if (scroll) {
        requestAnimationFrame(() => {
            scrollToHashTarget(target);
            updateScrollNavigationState();
            requestAnimationFrame(() => queueMirrorExperienceStepUpdate());
        });
    }

    return true;
}

function scheduleHashTargetReveal() {
    if (!window.location.hash) return;
    revealHashTarget({ scroll: true });
    hashRevealDelays.forEach((delay) => {
        window.setTimeout(() => {
            requestAnimationFrame(() => revealHashTarget({ scroll: true }));
        }, delay);
    });
}

scheduleHashTargetReveal();
window.addEventListener('load', scheduleHashTargetReveal, { once: true });
window.addEventListener('hashchange', () => revealHashTarget({ scroll: true }));

// ── Infinity Mirror Scroll Choreography ────────────────────────
const mirrorExperiencePage = document.querySelector('.mirror-experience-page');
const mirrorExperienceSteps = mirrorExperiencePage
    ? Array.from(document.querySelectorAll('.mirror-scroll-step'))
    : [];
function getMirrorExperienceStepTarget(step) {
    const hash = step.querySelector('.mirror-scroll-link')?.getAttribute('href');
    if (!hash?.startsWith('#')) return null;
    const target = document.getElementById(hash.slice(1));
    return target?.closest('.mirror-experience-hero, .mirror-experience-section') || target;
}

const mirrorExperienceSections = mirrorExperiencePage
    ? mirrorExperienceSteps.map(getMirrorExperienceStepTarget).filter(Boolean)
    : [];
let mirrorExperienceFrame = 0;

function clampMirrorExperienceValue(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
}

function setMirrorExperienceStep(index) {
    if (!mirrorExperiencePage || mirrorExperienceSteps.length === 0) return;
    const safeIndex = Math.max(0, Math.min(index, mirrorExperienceSteps.length - 1));
    mirrorExperienceSteps.forEach((step, stepIndex) => {
        const isActive = stepIndex === safeIndex;
        const currentLink = step.querySelector('.mirror-scroll-link');
        step.classList.toggle('is-active', isActive);
        if (isActive) {
            currentLink?.setAttribute('aria-current', 'step');
        } else {
            currentLink?.removeAttribute('aria-current');
        }
    });
    document.body.dataset.mirrorStep = String(safeIndex + 1).padStart(2, '0');
}

function updateMirrorExperienceDepthFromScroll() {
    if (!mirrorExperiencePage) return;
    const scrollableHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress = clampMirrorExperienceValue(window.scrollY / scrollableHeight);
    const portalScale = 1 + scrollProgress * 0.09;
    const fractureOffset = (scrollProgress - 0.5) * 54;
    const fractureOpacity = 0.14 + scrollProgress * 0.34;
    mirrorExperiencePage.style.setProperty('--mirror-scroll-progress', scrollProgress.toFixed(3));
    mirrorExperiencePage.style.setProperty('--mirror-portal-scale', portalScale.toFixed(3));
    mirrorExperiencePage.style.setProperty('--mirror-fracture-offset', `${fractureOffset.toFixed(2)}px`);
    mirrorExperiencePage.style.setProperty('--mirror-fracture-opacity', fractureOpacity.toFixed(3));
}

function updateMirrorExperienceStepFromScroll() {
    if (!mirrorExperiencePage || mirrorExperienceSections.length === 0) return;
    const probeY = Math.min(window.innerHeight * 0.42, 420);
    const nextIndex = mirrorExperienceSections.reduce((activeIndex, section, sectionIndex) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= probeY && rect.bottom > 84 ? sectionIndex : activeIndex;
    }, 0);
    setMirrorExperienceStep(nextIndex);
}

function updateMirrorExperienceFromScroll() {
    updateMirrorExperienceDepthFromScroll();
    updateMirrorExperienceStepFromScroll();
}

function queueMirrorExperienceStepUpdate() {
    if (mirrorExperienceFrame) return;
    mirrorExperienceFrame = requestAnimationFrame(() => {
        mirrorExperienceFrame = 0;
        updateMirrorExperienceFromScroll();
    });
}

function handleMirrorScrollLinkClick(event) {
    const link = event.target.closest?.('.mirror-scroll-link');
    if (!link) return;
    const targetHash = link.getAttribute('href');
    if (!targetHash?.startsWith('#')) return;
    const target = document.getElementById(targetHash.slice(1));
    if (!target) return;

    event.preventDefault();
    window.history.pushState(null, '', targetHash);
    revealHashTarget({ scroll: true });
}

if (mirrorExperiencePage && mirrorExperienceSections.length && mirrorExperienceSteps.length) {
    setMirrorExperienceStep(0);
    updateMirrorExperienceDepthFromScroll();
    mirrorExperiencePage.addEventListener('click', handleMirrorScrollLinkClick);

    if (!prefersReducedMotion) {
        updateMirrorExperienceFromScroll();
        window.addEventListener('scroll', queueMirrorExperienceStepUpdate, { passive: true });
        window.addEventListener('resize', queueMirrorExperienceStepUpdate, { passive: true });
    }
}

// ── Infinity Mirror Bounded Portal Field ───────────────────────
const mirrorRuntimeField = document.getElementById('mirror-runtime-field');
const mirrorRuntimeStage = mirrorRuntimeField?.closest('.mirror-portal-stage');
const mirrorRuntimeCtx = mirrorRuntimeField?.getContext('2d', { alpha: true });
const mirrorRuntimeCompactQuery = window.matchMedia?.('(max-width: 760px)');
const mirrorRuntimeParticles = Array.from({ length: 108 }, (_, index) => ({
    index,
    theta: mirrorRuntimeHash(index * 1.7) * Math.PI * 2,
    layer: Math.floor(mirrorRuntimeHash(index * 3.1) * 4),
    speed: 0.0024 + mirrorRuntimeHash(index * 5.3) * 0.0042,
    radius: 0.8 + mirrorRuntimeHash(index * 7.7) * 1.6,
    tone: mirrorRuntimeHash(index * 11.4),
}));
let mirrorRuntimeWidth = 0;
let mirrorRuntimeHeight = 0;
let mirrorRuntimeDpr = 1;
let mirrorRuntimeFrame = 0;
let mirrorRuntimeVisible = false;
let mirrorRuntimePointer = { x: 0, y: 0, tx: 0, ty: 0, energy: 0 };

function mirrorRuntimeHash(value) {
    const seed = Math.sin(value * 127.1 + 17.7) * 43758.5453;
    return seed - Math.floor(seed);
}

function isMirrorRuntimeCompact() {
    return mirrorRuntimeCompactQuery ? mirrorRuntimeCompactQuery.matches : window.innerWidth <= 760;
}

function isMirrorRuntimeStatic() {
    return prefersReducedMotion || isMirrorRuntimeCompact();
}

function getMirrorRuntimeScrollDepth() {
    const raw = getComputedStyle(mirrorExperiencePage || document.documentElement).getPropertyValue('--mirror-scroll-progress');
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? clampMirrorExperienceValue(value) : 0;
}

function getMirrorRuntimePoint(theta, scale, cx, cy, rotation = 0) {
    const denominator = 1 + Math.sin(theta) * Math.sin(theta);
    let x = (scale * Math.cos(theta)) / denominator;
    let y = (scale * Math.sin(theta) * Math.cos(theta)) / denominator;

    if (rotation) {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const nextX = x * cos - y * sin;
        const nextY = x * sin + y * cos;
        x = nextX;
        y = nextY;
    }

    return { x: cx + x, y: cy + y };
}

function resizeMirrorRuntimeField() {
    if (!mirrorRuntimeField || !mirrorRuntimeCtx || !mirrorRuntimeStage) return;

    const rect = mirrorRuntimeStage.getBoundingClientRect();
    mirrorRuntimeWidth = Math.max(1, Math.floor(rect.width));
    mirrorRuntimeHeight = Math.max(1, Math.floor(rect.height));
    mirrorRuntimeDpr = isMirrorRuntimeStatic() ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

    mirrorRuntimeField.width = Math.floor(mirrorRuntimeWidth * mirrorRuntimeDpr);
    mirrorRuntimeField.height = Math.floor(mirrorRuntimeHeight * mirrorRuntimeDpr);
    mirrorRuntimeField.style.width = `${mirrorRuntimeWidth}px`;
    mirrorRuntimeField.style.height = `${mirrorRuntimeHeight}px`;
    mirrorRuntimeCtx.setTransform(mirrorRuntimeDpr, 0, 0, mirrorRuntimeDpr, 0, 0);
    drawMirrorRuntimeField(0, true);
}

function drawMirrorRuntimeRings(timestamp, cx, cy, base, scrollDepth, staticMode) {
    if (!mirrorRuntimeCtx) return;

    const ringCount = staticMode ? 3 : 5;
    mirrorRuntimeCtx.save();
    mirrorRuntimeCtx.globalCompositeOperation = 'lighter';

    for (let ring = ringCount - 1; ring >= 0; ring -= 1) {
        const depth = ring / ringCount;
        const scale = base * Math.pow(0.78, ring) * (1 + scrollDepth * 0.16);
        const rotation = scrollDepth * 0.34 + timestamp * 0.00003 * (ring % 2 ? -1 : 1);
        const alpha = 0.045 + (1 - depth) * 0.085 + scrollDepth * 0.035;

        mirrorRuntimeCtx.beginPath();
        for (let step = 0; step <= 128; step += 1) {
            const point = getMirrorRuntimePoint((step / 128) * Math.PI * 2, scale, cx, cy, rotation);
            if (step === 0) mirrorRuntimeCtx.moveTo(point.x, point.y);
            else mirrorRuntimeCtx.lineTo(point.x, point.y);
        }
        mirrorRuntimeCtx.closePath();
        mirrorRuntimeCtx.lineWidth = Math.max(0.7, 1.7 - depth);
        mirrorRuntimeCtx.strokeStyle = ring % 2
            ? `rgba(241, 209, 138, ${alpha})`
            : `rgba(32, 214, 187, ${alpha})`;
        mirrorRuntimeCtx.stroke();
    }

    mirrorRuntimeCtx.restore();
}

function drawMirrorRuntimeParticles(timestamp, cx, cy, base, scrollDepth, staticMode) {
    if (!mirrorRuntimeCtx) return;

    const activeCount = staticMode ? 34 : mirrorRuntimeParticles.length;
    mirrorRuntimeCtx.save();
    mirrorRuntimeCtx.globalCompositeOperation = 'lighter';

    for (let index = 0; index < activeCount; index += 1) {
        const particle = mirrorRuntimeParticles[index];
        if (!staticMode) particle.theta = (particle.theta + particle.speed * (1 + mirrorRuntimePointer.energy * 0.9)) % (Math.PI * 2);

        const layer = Math.min(particle.layer, Math.floor(scrollDepth * 4.2));
        const scale = base * Math.pow(0.8, layer) * (1 + scrollDepth * 0.12);
        const rotation = scrollDepth * 0.42 + timestamp * 0.00004 * (layer % 2 ? -1 : 1);
        const point = getMirrorRuntimePoint(particle.theta, scale, cx, cy, rotation);
        const tone = particle.tone > 0.66 ? '241, 209, 138' : particle.tone > 0.38 ? '240, 238, 246' : '32, 214, 187';
        const radius = particle.radius * (1 + mirrorRuntimePointer.energy * 0.36);
        const alpha = staticMode ? 0.34 : 0.38 + scrollDepth * 0.25;

        mirrorRuntimeCtx.beginPath();
        mirrorRuntimeCtx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        mirrorRuntimeCtx.fillStyle = `rgba(${tone}, ${alpha})`;
        mirrorRuntimeCtx.fill();

        if (!staticMode && particle.tone > 0.55) {
            mirrorRuntimeCtx.beginPath();
            mirrorRuntimeCtx.arc(point.x, point.y, radius * 3.8, 0, Math.PI * 2);
            mirrorRuntimeCtx.fillStyle = `rgba(${tone}, ${0.035 + scrollDepth * 0.018})`;
            mirrorRuntimeCtx.fill();
        }
    }

    mirrorRuntimeCtx.restore();
}

function drawMirrorRuntimeBoundary(cx, cy, base, scrollDepth) {
    if (!mirrorRuntimeCtx) return;

    mirrorRuntimeCtx.save();
    mirrorRuntimeCtx.globalCompositeOperation = 'source-over';
    mirrorRuntimeCtx.setLineDash([9, 12]);
    mirrorRuntimeCtx.beginPath();
    mirrorRuntimeCtx.ellipse(cx, cy, base * 1.32, base * 0.66, -0.08, 0, Math.PI * 2);
    mirrorRuntimeCtx.strokeStyle = `rgba(241, 209, 138, ${0.11 + scrollDepth * 0.11})`;
    mirrorRuntimeCtx.lineWidth = 1;
    mirrorRuntimeCtx.stroke();
    mirrorRuntimeCtx.setLineDash([]);
    mirrorRuntimeCtx.beginPath();
    mirrorRuntimeCtx.rect(cx + base * 0.52, cy + base * 0.18, 9, 9);
    mirrorRuntimeCtx.strokeStyle = `rgba(240, 238, 246, ${0.24 + scrollDepth * 0.18})`;
    mirrorRuntimeCtx.stroke();
    mirrorRuntimeCtx.restore();
}

function drawMirrorRuntimeField(timestamp = 0, once = false) {
    if (!mirrorRuntimeField || !mirrorRuntimeCtx || !mirrorRuntimeWidth || !mirrorRuntimeHeight) return;

    const staticMode = isMirrorRuntimeStatic();
    const scrollDepth = getMirrorRuntimeScrollDepth();
    mirrorRuntimeField.dataset.fieldState = staticMode ? 'static' : mirrorRuntimeVisible ? 'active' : 'paused';
    mirrorRuntimePointer.x += (mirrorRuntimePointer.tx - mirrorRuntimePointer.x) * 0.08;
    mirrorRuntimePointer.y += (mirrorRuntimePointer.ty - mirrorRuntimePointer.y) * 0.08;
    mirrorRuntimePointer.energy *= 0.94;

    mirrorRuntimeCtx.clearRect(0, 0, mirrorRuntimeWidth, mirrorRuntimeHeight);
    const cx = mirrorRuntimeWidth * (0.5 + mirrorRuntimePointer.x * 0.032);
    const cy = mirrorRuntimeHeight * (0.46 + mirrorRuntimePointer.y * 0.028);
    const base = Math.min(mirrorRuntimeWidth, mirrorRuntimeHeight) * (0.34 + scrollDepth * 0.035);

    const gradient = mirrorRuntimeCtx.createRadialGradient(cx, cy, 0, cx, cy, base * 2.8);
    gradient.addColorStop(0, `rgba(241, 209, 138, ${0.055 + scrollDepth * 0.045})`);
    gradient.addColorStop(0.38, 'rgba(32, 214, 187, 0.035)');
    gradient.addColorStop(1, 'rgba(3, 3, 8, 0)');
    mirrorRuntimeCtx.fillStyle = gradient;
    mirrorRuntimeCtx.fillRect(0, 0, mirrorRuntimeWidth, mirrorRuntimeHeight);

    drawMirrorRuntimeRings(timestamp, cx, cy, base, scrollDepth, staticMode);
    drawMirrorRuntimeParticles(timestamp, cx, cy, base, scrollDepth, staticMode);
    drawMirrorRuntimeBoundary(cx, cy, base, scrollDepth);

    if (!staticMode && !once && mirrorRuntimeVisible) {
        mirrorRuntimeFrame = requestAnimationFrame(drawMirrorRuntimeField);
    }
}

function stopMirrorRuntimeField() {
    if (mirrorRuntimeFrame) {
        cancelAnimationFrame(mirrorRuntimeFrame);
        mirrorRuntimeFrame = 0;
    }
    if (mirrorRuntimeField) mirrorRuntimeField.dataset.fieldState = 'paused';
}

function startMirrorRuntimeField() {
    if (!mirrorRuntimeField || !mirrorRuntimeCtx) return;
    stopMirrorRuntimeField();
    if (isMirrorRuntimeStatic()) {
        drawMirrorRuntimeField(0, true);
        return;
    }
    mirrorRuntimeFrame = requestAnimationFrame(drawMirrorRuntimeField);
}

if (mirrorRuntimeField && mirrorRuntimeCtx && mirrorRuntimeStage) {
    resizeMirrorRuntimeField();
    window.addEventListener('resize', resizeMirrorRuntimeField, { passive: true });
    mirrorRuntimeCompactQuery?.addEventListener?.('change', resizeMirrorRuntimeField);

    mirrorRuntimeStage.addEventListener('pointermove', (event) => {
        if (isMirrorRuntimeStatic()) return;
        const rect = mirrorRuntimeStage.getBoundingClientRect();
        const nextX = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
        const nextY = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;
        mirrorRuntimePointer.energy = Math.min(1, mirrorRuntimePointer.energy + Math.hypot(nextX - mirrorRuntimePointer.tx, nextY - mirrorRuntimePointer.ty) * 1.6);
        mirrorRuntimePointer.tx = nextX;
        mirrorRuntimePointer.ty = nextY;
    }, { passive: true });

    mirrorRuntimeStage.addEventListener('pointerleave', () => {
        mirrorRuntimePointer.tx = 0;
        mirrorRuntimePointer.ty = 0;
    });

    if ('IntersectionObserver' in window) {
        const mirrorRuntimeObserver = new IntersectionObserver((entries) => {
            mirrorRuntimeVisible = entries.some(entry => entry.isIntersecting);
            if (mirrorRuntimeVisible) startMirrorRuntimeField();
            else stopMirrorRuntimeField();
        }, { rootMargin: '120px 0px' });
        mirrorRuntimeObserver.observe(mirrorRuntimeStage);
    } else {
        mirrorRuntimeVisible = true;
        startMirrorRuntimeField();
    }
}

// ── Infinity Mirror Brain Route Pulse ──────────────────────────
const mirrorBrainRuntime = document.querySelector('.mirror-brain-system[data-runtime-owner="bounded-brain-route"]');
const mirrorBrainRuntimeCompactQuery = window.matchMedia?.('(max-width: 760px)');
const mirrorBrainRuntimePhases = [
    {
        phase: 'signal',
        tunnelStep: 'signal',
        routeStage: 'signal',
        stateCell: 'signal',
        tunnelCells: ['gateway'],
        cells: ['gateway'],
    },
    {
        phase: 'cells',
        tunnelStep: 'cells',
        routeStage: 'cells',
        stateCell: 'cells',
        tunnelCells: ['cortex', 'memory'],
        cells: ['cortex', 'memory', 'reflection', 'pattern'],
    },
    {
        phase: 'authority',
        tunnelStep: 'boundary',
        routeStage: 'authority',
        stateCell: 'boundary',
        tunnelCells: ['immune'],
        cells: ['immune'],
    },
    {
        phase: 'proof',
        tunnelStep: 'proof',
        routeStage: 'proof',
        stateCell: 'proof',
        tunnelCells: ['proof'],
        cells: ['proof'],
    },
];
const mirrorBrainRuntimeTargets = mirrorBrainRuntime ? {
    tunnelSteps: Array.from(mirrorBrainRuntime.querySelectorAll('[data-tunnel-step]')),
    tunnelCells: Array.from(mirrorBrainRuntime.querySelectorAll('[data-tunnel-cell]')),
    routeStages: Array.from(mirrorBrainRuntime.querySelectorAll('[data-route-stage]')),
    cells: Array.from(mirrorBrainRuntime.querySelectorAll('[data-cell]')),
    stateCells: Array.from(mirrorBrainRuntime.querySelectorAll('[data-state-cell]')),
    handoffCopies: Array.from(mirrorBrainRuntime.querySelectorAll('[data-brain-handoff]')).reduce((acc, node) => {
        acc[node.dataset.brainHandoff] = node;
        return acc;
    }, {}),
    routeCopies: Array.from(mirrorBrainRuntime.querySelectorAll('[data-brain-route-copy]')).reduce((acc, node) => {
        acc[node.dataset.brainRouteCopy] = node;
        return acc;
    }, {}),
    stateCopies: Array.from(mirrorBrainRuntime.querySelectorAll('[data-brain-state-copy]')).reduce((acc, node) => {
        acc[node.dataset.brainStateCopy] = node;
        return acc;
    }, {}),
} : null;
let mirrorBrainRuntimeFrame = 0;
let mirrorBrainRuntimeVisible = false;
let mirrorBrainRuntimeStartedAt = 0;
let mirrorBrainRuntimePhaseIndex = -1;

function isMirrorBrainRuntimeCompact() {
    return mirrorBrainRuntimeCompactQuery ? mirrorBrainRuntimeCompactQuery.matches : window.innerWidth <= 760;
}

function isMirrorBrainRuntimeStatic() {
    return prefersReducedMotion || isMirrorBrainRuntimeCompact();
}

function toggleMirrorBrainRuntimeNodes(nodes, dataName, activeValues) {
    nodes.forEach((node) => {
        node.classList.toggle('is-runtime-active', activeValues.includes(node.dataset[dataName]));
    });
}

function toggleMirrorBrainSignalNodes(nodes, dataName, activeValues) {
    nodes.forEach((node) => {
        node.classList.toggle('is-signal-selected', activeValues.includes(node.dataset[dataName]));
    });
}

function setMirrorBrainRuntimePhase(index) {
    if (!mirrorBrainRuntime || !mirrorBrainRuntimeTargets) return;

    const phase = mirrorBrainRuntimePhases[index] || mirrorBrainRuntimePhases[0];
    mirrorBrainRuntimePhaseIndex = index;
    mirrorBrainRuntime.dataset.routePhase = phase.phase;
    mirrorBrainRuntime.dataset.brainRuntime = isMirrorBrainRuntimeStatic()
        ? 'static'
        : mirrorBrainRuntimeVisible ? 'active' : 'paused';

    toggleMirrorBrainRuntimeNodes(mirrorBrainRuntimeTargets.tunnelSteps, 'tunnelStep', [phase.tunnelStep]);
    toggleMirrorBrainRuntimeNodes(mirrorBrainRuntimeTargets.tunnelCells, 'tunnelCell', phase.tunnelCells);
    toggleMirrorBrainRuntimeNodes(mirrorBrainRuntimeTargets.routeStages, 'routeStage', [phase.routeStage]);
    toggleMirrorBrainRuntimeNodes(mirrorBrainRuntimeTargets.cells, 'cell', phase.cells);
    toggleMirrorBrainRuntimeNodes(mirrorBrainRuntimeTargets.stateCells, 'stateCell', [phase.stateCell]);
}

function setMirrorBrainSignalProfile(signalId, brain) {
    if (!mirrorBrainRuntime || !mirrorBrainRuntimeTargets || !brain) return;

    mirrorBrainRuntime.dataset.signalProfile = signalId;
    toggleMirrorBrainSignalNodes(mirrorBrainRuntimeTargets.cells, 'cell', brain.cells || []);

    Object.entries(brain.handoff || {}).forEach(([field, key]) => {
        setMirrorTranslatedText(mirrorBrainRuntimeTargets.handoffCopies[field], key);
        setMirrorTranslatedText(mirrorBrainRuntimeTargets.routeCopies[field], key);
        setMirrorTranslatedText(mirrorBrainRuntimeTargets.stateCopies[field], key);
    });
}

function stopMirrorBrainRuntimePulse() {
    if (mirrorBrainRuntimeFrame) {
        cancelAnimationFrame(mirrorBrainRuntimeFrame);
        mirrorBrainRuntimeFrame = 0;
    }
    if (mirrorBrainRuntime) mirrorBrainRuntime.dataset.brainRuntime = 'paused';
}

function updateMirrorBrainRuntimePulse(timestamp = 0) {
    if (!mirrorBrainRuntime) return;

    if (isMirrorBrainRuntimeStatic()) {
        setMirrorBrainRuntimePhase(0);
        return;
    }

    if (!mirrorBrainRuntimeStartedAt) mirrorBrainRuntimeStartedAt = timestamp;
    const nextIndex = Math.floor((timestamp - mirrorBrainRuntimeStartedAt) / 1850) % mirrorBrainRuntimePhases.length;
    if (nextIndex !== mirrorBrainRuntimePhaseIndex) setMirrorBrainRuntimePhase(nextIndex);

    if (mirrorBrainRuntimeVisible) {
        mirrorBrainRuntimeFrame = requestAnimationFrame(updateMirrorBrainRuntimePulse);
    }
}

function startMirrorBrainRuntimePulse() {
    if (!mirrorBrainRuntime) return;
    stopMirrorBrainRuntimePulse();
    if (isMirrorBrainRuntimeStatic()) {
        setMirrorBrainRuntimePhase(0);
        return;
    }
    mirrorBrainRuntimeFrame = requestAnimationFrame(updateMirrorBrainRuntimePulse);
}

if (mirrorBrainRuntime) {
    setMirrorBrainRuntimePhase(0);
    mirrorBrainRuntimeCompactQuery?.addEventListener?.('change', startMirrorBrainRuntimePulse);

    if ('IntersectionObserver' in window) {
        const mirrorBrainRuntimeObserver = new IntersectionObserver((entries) => {
            mirrorBrainRuntimeVisible = entries.some(entry => entry.isIntersecting);
            if (mirrorBrainRuntimeVisible) startMirrorBrainRuntimePulse();
            else stopMirrorBrainRuntimePulse();
        }, { rootMargin: '80px 0px' });
        mirrorBrainRuntimeObserver.observe(mirrorBrainRuntime);
    } else {
        mirrorBrainRuntimeVisible = true;
        startMirrorBrainRuntimePulse();
    }
}

// ── Infinity Mirror Organism Growth Relay ──────────────────────
const mirrorOrganismRelay = document.querySelector('.mirror-organism-visualizer[data-runtime-owner="bounded-organism-relay"]');
const mirrorGrowthRelay = document.querySelector('.mirror-growth-system[data-runtime-owner="bounded-growth-relay"]');
const mirrorRelayRuntimeCompactQuery = window.matchMedia?.('(max-width: 760px)');
const mirrorOrganismRelayPhases = [
    { organism: 'visual', spine: ['gateway', 'cells'] },
    { organism: 'mirror', spine: ['memory', 'cells'] },
    { organism: 'financial', spine: ['immune', 'proof'] },
    { organism: 'research', spine: ['gateway', 'proof'] },
];
const mirrorGrowthRelayPhases = [
    { phase: 'pattern' },
    { phase: 'candidate' },
    { phase: 'sandbox' },
    { phase: 'approval' },
    { phase: 'integration' },
    { phase: 'proof' },
];
const mirrorOrganismRelayTargets = mirrorOrganismRelay ? {
    core: mirrorOrganismRelay.querySelector('.mirror-organism-core'),
    links: Array.from(mirrorOrganismRelay.querySelectorAll('[data-organism]')),
    spineNodes: Array.from(mirrorOrganismRelay.querySelectorAll('[data-spine-node]')),
} : null;
const mirrorGrowthRelayTargets = mirrorGrowthRelay ? {
    nodes: Array.from(mirrorGrowthRelay.querySelectorAll('[data-growth-node]')),
    steps: Array.from(mirrorGrowthRelay.querySelectorAll('[data-growth-step]')),
} : null;
let mirrorOrganismRelayFrame = 0;
let mirrorOrganismRelayVisible = false;
let mirrorOrganismRelayStartedAt = 0;
let mirrorOrganismRelayPhaseIndex = -1;
let mirrorGrowthRelayFrame = 0;
let mirrorGrowthRelayVisible = false;
let mirrorGrowthRelayStartedAt = 0;
let mirrorGrowthRelayPhaseIndex = -1;

function isMirrorRelayRuntimeCompact() {
    return mirrorRelayRuntimeCompactQuery ? mirrorRelayRuntimeCompactQuery.matches : window.innerWidth <= 760;
}

function isMirrorRelayRuntimeStatic() {
    return prefersReducedMotion || isMirrorRelayRuntimeCompact();
}

function toggleMirrorRelayNodes(nodes, dataName, activeValues) {
    nodes.forEach((node) => {
        node.classList.toggle('is-runtime-active', activeValues.includes(node.dataset[dataName]));
    });
}

function setMirrorOrganismRelayPhase(index) {
    if (!mirrorOrganismRelay || !mirrorOrganismRelayTargets) return;

    const phase = mirrorOrganismRelayPhases[index] || mirrorOrganismRelayPhases[0];
    mirrorOrganismRelayPhaseIndex = index;
    mirrorOrganismRelay.dataset.organismPhase = phase.organism;
    mirrorOrganismRelay.dataset.relayRuntime = isMirrorRelayRuntimeStatic()
        ? 'static'
        : mirrorOrganismRelayVisible ? 'active' : 'paused';
    mirrorOrganismRelayTargets.core?.classList.toggle('is-runtime-active', mirrorOrganismRelay.dataset.relayRuntime === 'active');
    toggleMirrorRelayNodes(mirrorOrganismRelayTargets.links, 'organism', [phase.organism]);
    toggleMirrorRelayNodes(mirrorOrganismRelayTargets.spineNodes, 'spineNode', phase.spine);
}

function stopMirrorOrganismRelay() {
    if (mirrorOrganismRelayFrame) {
        cancelAnimationFrame(mirrorOrganismRelayFrame);
        mirrorOrganismRelayFrame = 0;
    }
    if (mirrorOrganismRelay) mirrorOrganismRelay.dataset.relayRuntime = 'paused';
}

function updateMirrorOrganismRelay(timestamp = 0) {
    if (!mirrorOrganismRelay) return;

    if (isMirrorRelayRuntimeStatic()) {
        setMirrorOrganismRelayPhase(0);
        return;
    }

    if (!mirrorOrganismRelayStartedAt) mirrorOrganismRelayStartedAt = timestamp;
    const nextIndex = Math.floor((timestamp - mirrorOrganismRelayStartedAt) / 2200) % mirrorOrganismRelayPhases.length;
    if (nextIndex !== mirrorOrganismRelayPhaseIndex) setMirrorOrganismRelayPhase(nextIndex);

    if (mirrorOrganismRelayVisible) {
        mirrorOrganismRelayFrame = requestAnimationFrame(updateMirrorOrganismRelay);
    }
}

function startMirrorOrganismRelay() {
    if (!mirrorOrganismRelay) return;
    stopMirrorOrganismRelay();
    if (isMirrorRelayRuntimeStatic()) {
        setMirrorOrganismRelayPhase(0);
        return;
    }
    mirrorOrganismRelayFrame = requestAnimationFrame(updateMirrorOrganismRelay);
}

function setMirrorGrowthRelayPhase(index) {
    if (!mirrorGrowthRelay || !mirrorGrowthRelayTargets) return;

    const phase = mirrorGrowthRelayPhases[index] || mirrorGrowthRelayPhases[0];
    mirrorGrowthRelayPhaseIndex = index;
    mirrorGrowthRelay.dataset.growthPhase = phase.phase;
    mirrorGrowthRelay.dataset.growthRuntime = isMirrorRelayRuntimeStatic()
        ? 'static'
        : mirrorGrowthRelayVisible ? 'active' : 'paused';
    toggleMirrorRelayNodes(mirrorGrowthRelayTargets.nodes, 'growthNode', [phase.phase]);
    toggleMirrorRelayNodes(mirrorGrowthRelayTargets.steps, 'growthStep', [phase.phase]);
}

function stopMirrorGrowthRelay() {
    if (mirrorGrowthRelayFrame) {
        cancelAnimationFrame(mirrorGrowthRelayFrame);
        mirrorGrowthRelayFrame = 0;
    }
    if (mirrorGrowthRelay) mirrorGrowthRelay.dataset.growthRuntime = 'paused';
}

function updateMirrorGrowthRelay(timestamp = 0) {
    if (!mirrorGrowthRelay) return;

    if (isMirrorRelayRuntimeStatic()) {
        setMirrorGrowthRelayPhase(0);
        return;
    }

    if (!mirrorGrowthRelayStartedAt) mirrorGrowthRelayStartedAt = timestamp;
    const nextIndex = Math.floor((timestamp - mirrorGrowthRelayStartedAt) / 1650) % mirrorGrowthRelayPhases.length;
    if (nextIndex !== mirrorGrowthRelayPhaseIndex) setMirrorGrowthRelayPhase(nextIndex);

    if (mirrorGrowthRelayVisible) {
        mirrorGrowthRelayFrame = requestAnimationFrame(updateMirrorGrowthRelay);
    }
}

function startMirrorGrowthRelay() {
    if (!mirrorGrowthRelay) return;
    stopMirrorGrowthRelay();
    if (isMirrorRelayRuntimeStatic()) {
        setMirrorGrowthRelayPhase(0);
        return;
    }
    mirrorGrowthRelayFrame = requestAnimationFrame(updateMirrorGrowthRelay);
}

if (mirrorOrganismRelay) {
    setMirrorOrganismRelayPhase(0);
    mirrorRelayRuntimeCompactQuery?.addEventListener?.('change', startMirrorOrganismRelay);

    if ('IntersectionObserver' in window) {
        const mirrorOrganismRelayObserver = new IntersectionObserver((entries) => {
            mirrorOrganismRelayVisible = entries.some(entry => entry.isIntersecting);
            if (mirrorOrganismRelayVisible) startMirrorOrganismRelay();
            else stopMirrorOrganismRelay();
        }, { rootMargin: '90px 0px' });
        mirrorOrganismRelayObserver.observe(mirrorOrganismRelay);
    } else {
        mirrorOrganismRelayVisible = true;
        startMirrorOrganismRelay();
    }
}

if (mirrorGrowthRelay) {
    setMirrorGrowthRelayPhase(0);
    mirrorRelayRuntimeCompactQuery?.addEventListener?.('change', startMirrorGrowthRelay);

    if ('IntersectionObserver' in window) {
        const mirrorGrowthRelayObserver = new IntersectionObserver((entries) => {
            mirrorGrowthRelayVisible = entries.some(entry => entry.isIntersecting);
            if (mirrorGrowthRelayVisible) startMirrorGrowthRelay();
            else stopMirrorGrowthRelay();
        }, { rootMargin: '90px 0px' });
        mirrorGrowthRelayObserver.observe(mirrorGrowthRelay);
    } else {
        mirrorGrowthRelayVisible = true;
        startMirrorGrowthRelay();
    }
}

// ── Infinity Mirror Adaptive Artifact Relay ────────────────────
const mirrorAdaptiveArtifactRelay = document.querySelector('.mirror-adaptive-engine[data-runtime-owner="bounded-adaptive-lens-relay"]');
const mirrorArtifactReturnRelay = document.querySelector('.mirror-returned-artifact[data-runtime-owner="bounded-artifact-return"]');
const mirrorSignalComposer = document.querySelector('.mirror-signal-composer[data-runtime-owner="bounded-signal-composer"]');
const mirrorConceptRelayRoot = mirrorAdaptiveArtifactRelay?.closest('.mirror-reflection-stack') || mirrorAdaptiveArtifactRelay || mirrorArtifactReturnRelay;
const mirrorConceptRelayCompactQuery = window.matchMedia?.('(max-width: 760px)');
const mirrorConceptRelayPhases = [
    { lens: 'architect', loop: 'capture', artifact: 'signal', decisions: ['correct'] },
    { lens: 'cartographer', loop: 'translate', artifact: 'lens', decisions: ['keep'] },
    { lens: 'translator', loop: 'translate', artifact: 'map', decisions: ['deepen'] },
    { lens: 'ritualist', loop: 'keep', artifact: 'proof', decisions: ['keep', 'close'] },
];
const mirrorArtifactRouteOrder = ['signal', 'lens', 'map', 'boundary', 'proof'];
const mirrorConceptRelayTargets = mirrorAdaptiveArtifactRelay || mirrorArtifactReturnRelay ? {
    lensNodes: mirrorAdaptiveArtifactRelay ? Array.from(mirrorAdaptiveArtifactRelay.querySelectorAll('[data-lens-node]')) : [],
    lensCards: mirrorAdaptiveArtifactRelay ? Array.from(mirrorAdaptiveArtifactRelay.querySelectorAll('[data-lens]')) : [],
    lensControls: mirrorAdaptiveArtifactRelay ? Array.from(mirrorAdaptiveArtifactRelay.querySelectorAll('[data-lens-control]')) : [],
    lensLoops: mirrorAdaptiveArtifactRelay ? Array.from(mirrorAdaptiveArtifactRelay.querySelectorAll('[data-lens-loop]')) : [],
    artifactNodes: mirrorArtifactReturnRelay ? Array.from(mirrorArtifactReturnRelay.querySelectorAll('[data-artifact-node]')) : [],
    artifactSteps: mirrorArtifactReturnRelay ? Array.from(mirrorArtifactReturnRelay.querySelectorAll('[data-artifact-step]')) : [],
    artifactDecisions: mirrorArtifactReturnRelay ? Array.from(mirrorArtifactReturnRelay.querySelectorAll('[data-artifact-decision]')) : [],
} : null;
const mirrorSignalComposerTargets = mirrorSignalComposer ? {
    controls: Array.from(mirrorSignalComposer.querySelectorAll('[data-signal-control]')),
    outputs: Array.from(mirrorSignalComposer.querySelectorAll('[data-composer-output]')).reduce((acc, node) => {
        acc[node.dataset.composerOutput] = node;
        return acc;
    }, {}),
    artifactFields: mirrorArtifactReturnRelay ? Array.from(mirrorArtifactReturnRelay.querySelectorAll('[data-artifact-field]')).reduce((acc, node) => {
        acc[node.dataset.artifactField] = node;
        return acc;
    }, {}) : {},
} : null;
const mirrorSignalComposerPackets = {
    'mental-room': {
        lens: 'translator',
        artifact: 'map',
        decisions: ['deepen', 'close'],
        output: {
            signal: 'mirrorExp.composer.mental.signal',
            lens: 'mirrorExp.composer.mental.lens',
            artifact: 'mirrorExp.composer.mental.artifact',
            boundary: 'mirrorExp.composer.mental.boundary',
        },
        artifactFields: {
            signal: 'mirrorExp.composer.mental.artifactSignal',
            lens: 'mirrorExp.composer.mental.artifactLens',
            map: 'mirrorExp.composer.mental.artifactMap',
            boundary: 'mirrorExp.composer.mental.artifactBoundary',
            proof: 'mirrorExp.composer.mental.artifactProof',
        },
        brain: {
            cells: ['gateway', 'memory', 'reflection', 'pattern', 'proof'],
            handoff: {
                signal: 'mirrorExp.composer.mental.brainSignal',
                cells: 'mirrorExp.composer.mental.brainCells',
                authority: 'mirrorExp.composer.mental.brainAuthority',
                proof: 'mirrorExp.composer.mental.brainProof',
            },
        },
    },
    'build-stuck': {
        lens: 'architect',
        artifact: 'boundary',
        decisions: ['correct', 'deepen'],
        output: {
            signal: 'mirrorExp.composer.build.signal',
            lens: 'mirrorExp.composer.build.lens',
            artifact: 'mirrorExp.composer.build.artifact',
            boundary: 'mirrorExp.composer.build.boundary',
        },
        artifactFields: {
            signal: 'mirrorExp.composer.build.artifactSignal',
            lens: 'mirrorExp.composer.build.artifactLens',
            map: 'mirrorExp.composer.build.artifactMap',
            boundary: 'mirrorExp.composer.build.artifactBoundary',
            proof: 'mirrorExp.composer.build.artifactProof',
        },
        brain: {
            cells: ['gateway', 'cortex', 'reflection', 'immune', 'proof'],
            handoff: {
                signal: 'mirrorExp.composer.build.brainSignal',
                cells: 'mirrorExp.composer.build.brainCells',
                authority: 'mirrorExp.composer.build.brainAuthority',
                proof: 'mirrorExp.composer.build.brainProof',
            },
        },
    },
    'trust-proof': {
        lens: 'cartographer',
        artifact: 'proof',
        decisions: ['keep', 'correct'],
        output: {
            signal: 'mirrorExp.composer.trust.signal',
            lens: 'mirrorExp.composer.trust.lens',
            artifact: 'mirrorExp.composer.trust.artifact',
            boundary: 'mirrorExp.composer.trust.boundary',
        },
        artifactFields: {
            signal: 'mirrorExp.composer.trust.artifactSignal',
            lens: 'mirrorExp.composer.trust.artifactLens',
            map: 'mirrorExp.composer.trust.artifactMap',
            boundary: 'mirrorExp.composer.trust.artifactBoundary',
            proof: 'mirrorExp.composer.trust.artifactProof',
        },
        brain: {
            cells: ['gateway', 'cortex', 'memory', 'pattern', 'immune', 'proof'],
            handoff: {
                signal: 'mirrorExp.composer.trust.brainSignal',
                cells: 'mirrorExp.composer.trust.brainCells',
                authority: 'mirrorExp.composer.trust.brainAuthority',
                proof: 'mirrorExp.composer.trust.brainProof',
            },
        },
    },
    'quiet-listen': {
        lens: 'ritualist',
        artifact: 'signal',
        decisions: ['close'],
        output: {
            signal: 'mirrorExp.composer.quiet.signal',
            lens: 'mirrorExp.composer.quiet.lens',
            artifact: 'mirrorExp.composer.quiet.artifact',
            boundary: 'mirrorExp.composer.quiet.boundary',
        },
        artifactFields: {
            signal: 'mirrorExp.composer.quiet.artifactSignal',
            lens: 'mirrorExp.composer.quiet.artifactLens',
            map: 'mirrorExp.composer.quiet.artifactMap',
            boundary: 'mirrorExp.composer.quiet.artifactBoundary',
            proof: 'mirrorExp.composer.quiet.artifactProof',
        },
        brain: {
            cells: ['gateway', 'reflection', 'immune', 'proof'],
            handoff: {
                signal: 'mirrorExp.composer.quiet.brainSignal',
                cells: 'mirrorExp.composer.quiet.brainCells',
                authority: 'mirrorExp.composer.quiet.brainAuthority',
                proof: 'mirrorExp.composer.quiet.brainProof',
            },
        },
    },
};
let mirrorConceptRelayFrame = 0;
let mirrorConceptRelayVisible = false;
let mirrorConceptRelayStartedAt = 0;
let mirrorConceptRelayPhaseIndex = -1;
let mirrorConceptRelayManualUntil = 0;

function isMirrorConceptRelayCompact() {
    return mirrorConceptRelayCompactQuery ? mirrorConceptRelayCompactQuery.matches : window.innerWidth <= 760;
}

function isMirrorConceptRelayStatic() {
    return prefersReducedMotion || isMirrorConceptRelayCompact();
}

function getMirrorConceptRelayRuntime(manual = false) {
    if (isMirrorConceptRelayStatic()) return 'static';
    if (manual) return 'manual';
    return mirrorConceptRelayVisible ? 'active' : 'paused';
}

function setMirrorArtifactRouteState(artifact, decisions, runtime) {
    if (!mirrorArtifactReturnRelay || !mirrorConceptRelayTargets) return;

    const artifactStop = Math.max(0, mirrorArtifactRouteOrder.indexOf(artifact));
    const activeArtifactSteps = mirrorArtifactRouteOrder.slice(0, artifactStop + 1);

    mirrorArtifactReturnRelay.dataset.artifactPhase = artifact;
    mirrorArtifactReturnRelay.dataset.artifactRuntime = runtime;
    toggleMirrorRelayNodes(mirrorConceptRelayTargets.artifactNodes, 'artifactNode', [artifact]);
    toggleMirrorRelayNodes(mirrorConceptRelayTargets.artifactSteps, 'artifactStep', activeArtifactSteps);
    toggleMirrorRelayNodes(mirrorConceptRelayTargets.artifactDecisions, 'artifactDecision', decisions);
}

function setMirrorConceptRelayPhase(index, { manual = false } = {}) {
    if (!mirrorConceptRelayTargets) return;

    const phase = mirrorConceptRelayPhases[index] || mirrorConceptRelayPhases[0];
    const runtime = getMirrorConceptRelayRuntime(manual);

    mirrorConceptRelayPhaseIndex = index;

    if (mirrorAdaptiveArtifactRelay) {
        mirrorAdaptiveArtifactRelay.dataset.activeLens = phase.lens;
        mirrorAdaptiveArtifactRelay.dataset.lensRuntime = runtime;
        toggleMirrorRelayNodes(mirrorConceptRelayTargets.lensNodes, 'lensNode', [phase.lens]);
        toggleMirrorRelayNodes(mirrorConceptRelayTargets.lensCards, 'lens', [phase.lens]);
        toggleMirrorRelayNodes(mirrorConceptRelayTargets.lensLoops, 'lensLoop', [phase.loop]);
        mirrorConceptRelayTargets.lensControls.forEach((control) => {
            control.setAttribute('aria-pressed', String(control.dataset.lensControl === phase.lens));
        });
    }

    if (mirrorArtifactReturnRelay) {
        setMirrorArtifactRouteState(phase.artifact, phase.decisions, runtime);
    }
}

function stopMirrorConceptRelay() {
    if (mirrorConceptRelayFrame) {
        cancelAnimationFrame(mirrorConceptRelayFrame);
        mirrorConceptRelayFrame = 0;
    }
    if (mirrorAdaptiveArtifactRelay) mirrorAdaptiveArtifactRelay.dataset.lensRuntime = 'paused';
    if (mirrorArtifactReturnRelay) mirrorArtifactReturnRelay.dataset.artifactRuntime = 'paused';
}

function updateMirrorConceptRelay(timestamp = 0) {
    if (!mirrorConceptRelayTargets) return;

    if (isMirrorConceptRelayStatic()) {
        setMirrorConceptRelayPhase(0);
        return;
    }

    if (mirrorConceptRelayManualUntil && timestamp < mirrorConceptRelayManualUntil) {
        mirrorConceptRelayFrame = requestAnimationFrame(updateMirrorConceptRelay);
        return;
    }

    mirrorConceptRelayManualUntil = 0;
    if (!mirrorConceptRelayStartedAt) mirrorConceptRelayStartedAt = timestamp;
    const nextIndex = Math.floor((timestamp - mirrorConceptRelayStartedAt) / 2100) % mirrorConceptRelayPhases.length;
    if (nextIndex !== mirrorConceptRelayPhaseIndex) setMirrorConceptRelayPhase(nextIndex);

    if (mirrorConceptRelayVisible) {
        mirrorConceptRelayFrame = requestAnimationFrame(updateMirrorConceptRelay);
    }
}

function startMirrorConceptRelay() {
    if (!mirrorConceptRelayTargets) return;
    stopMirrorConceptRelay();
    if (isMirrorConceptRelayStatic()) {
        setMirrorConceptRelayPhase(0);
        return;
    }
    mirrorConceptRelayFrame = requestAnimationFrame(updateMirrorConceptRelay);
}

function setMirrorTranslatedText(node, key) {
    if (!node || !key) return;
    node.setAttribute('data-i18n', key);
    node.textContent = getTranslation(key);
}

function setMirrorSignalComposer(signalId, { manual = false } = {}) {
    if (!mirrorSignalComposer || !mirrorSignalComposerTargets) return;

    const packet = mirrorSignalComposerPackets[signalId] || mirrorSignalComposerPackets['mental-room'];
    const runtime = getMirrorConceptRelayRuntime(manual);
    const lensIndex = mirrorConceptRelayPhases.findIndex(phase => phase.lens === packet.lens);

    mirrorSignalComposer.dataset.activeSignal = signalId;
    mirrorSignalComposerTargets.controls.forEach((control) => {
        control.setAttribute('aria-pressed', String(control.dataset.signalControl === signalId));
    });

    Object.entries(packet.output).forEach(([field, key]) => {
        setMirrorTranslatedText(mirrorSignalComposerTargets.outputs[field], key);
    });

    Object.entries(packet.artifactFields).forEach(([field, key]) => {
        setMirrorTranslatedText(mirrorSignalComposerTargets.artifactFields[field], key);
    });

    if (lensIndex >= 0) setMirrorConceptRelayPhase(lensIndex, { manual });
    setMirrorArtifactRouteState(packet.artifact, packet.decisions, runtime);
    setMirrorBrainSignalProfile(signalId, packet.brain);
}

if (mirrorConceptRelayTargets) {
    setMirrorConceptRelayPhase(0);
    mirrorConceptRelayCompactQuery?.addEventListener?.('change', startMirrorConceptRelay);

    mirrorConceptRelayTargets.lensControls.forEach((control) => {
        control.addEventListener('click', () => {
            const nextIndex = mirrorConceptRelayPhases.findIndex(phase => phase.lens === control.dataset.lensControl);
            if (nextIndex < 0) return;
            mirrorConceptRelayManualUntil = performance.now() + 9000;
            setMirrorConceptRelayPhase(nextIndex, { manual: true });
            if (mirrorConceptRelayVisible && !isMirrorConceptRelayStatic() && !mirrorConceptRelayFrame) {
                mirrorConceptRelayFrame = requestAnimationFrame(updateMirrorConceptRelay);
            }
        });
    });

    if ('IntersectionObserver' in window && mirrorConceptRelayRoot) {
        const mirrorConceptRelayObserver = new IntersectionObserver((entries) => {
            mirrorConceptRelayVisible = entries.some(entry => entry.isIntersecting);
            if (mirrorConceptRelayVisible) startMirrorConceptRelay();
            else stopMirrorConceptRelay();
        }, { rootMargin: '90px 0px' });
        mirrorConceptRelayObserver.observe(mirrorConceptRelayRoot);
    } else {
        mirrorConceptRelayVisible = true;
        startMirrorConceptRelay();
    }
}

if (mirrorSignalComposer && mirrorSignalComposerTargets) {
    setMirrorSignalComposer(mirrorSignalComposer.dataset.activeSignal || 'mental-room');

    mirrorSignalComposerTargets.controls.forEach((control) => {
        control.addEventListener('click', () => {
            const nextSignal = control.dataset.signalControl || 'mental-room';
            mirrorConceptRelayManualUntil = performance.now() + 9000;
            setMirrorSignalComposer(nextSignal, { manual: true });
            if (mirrorConceptRelayVisible && !isMirrorConceptRelayStatic() && !mirrorConceptRelayFrame) {
                mirrorConceptRelayFrame = requestAnimationFrame(updateMirrorConceptRelay);
            }
        });
    });

    document.addEventListener('uc:languagechange', () => {
        setMirrorSignalComposer(mirrorSignalComposer.dataset.activeSignal || 'mental-room');
    });
}

// ── Infinity Mirror State Sequencer ────────────────────────────
const mirrorStateSequencer = document.querySelector('.mirror-state-sequencer[data-runtime-owner="bounded-state-sequencer"]');
const mirrorStateSequencerPackets = {
    mirror: {
        href: '#mirror-question-title',
        output: {
            signal: 'mirrorExp.stateSeq.mirror.signal',
            response: 'mirrorExp.stateSeq.mirror.response',
            proof: 'mirrorExp.stateSeq.mirror.proof',
            boundary: 'mirrorExp.stateSeq.mirror.boundary',
        },
        link: 'mirrorExp.stateSeq.mirror.link',
    },
    reflection: {
        href: '#mirror-reflection-title',
        output: {
            signal: 'mirrorExp.stateSeq.reflection.signal',
            response: 'mirrorExp.stateSeq.reflection.response',
            proof: 'mirrorExp.stateSeq.reflection.proof',
            boundary: 'mirrorExp.stateSeq.reflection.boundary',
        },
        link: 'mirrorExp.stateSeq.reflection.link',
    },
    brain: {
        href: '#mirror-brain-title',
        output: {
            signal: 'mirrorExp.stateSeq.brain.signal',
            response: 'mirrorExp.stateSeq.brain.response',
            proof: 'mirrorExp.stateSeq.brain.proof',
            boundary: 'mirrorExp.stateSeq.brain.boundary',
        },
        link: 'mirrorExp.stateSeq.brain.link',
    },
    organisms: {
        href: '#mirror-organisms-title',
        output: {
            signal: 'mirrorExp.stateSeq.organisms.signal',
            response: 'mirrorExp.stateSeq.organisms.response',
            proof: 'mirrorExp.stateSeq.organisms.proof',
            boundary: 'mirrorExp.stateSeq.organisms.boundary',
        },
        link: 'mirrorExp.stateSeq.organisms.link',
    },
    growth: {
        href: '#mirror-growth-title',
        output: {
            signal: 'mirrorExp.stateSeq.growth.signal',
            response: 'mirrorExp.stateSeq.growth.response',
            proof: 'mirrorExp.stateSeq.growth.proof',
            boundary: 'mirrorExp.stateSeq.growth.boundary',
        },
        link: 'mirrorExp.stateSeq.growth.link',
    },
    proof: {
        href: '#mirror-proof-title',
        output: {
            signal: 'mirrorExp.stateSeq.proof.signal',
            response: 'mirrorExp.stateSeq.proof.response',
            proof: 'mirrorExp.stateSeq.proof.proof',
            boundary: 'mirrorExp.stateSeq.proof.boundary',
        },
        link: 'mirrorExp.stateSeq.proof.link',
    },
    join: {
        href: '#mirror-join-title',
        output: {
            signal: 'mirrorExp.stateSeq.join.signal',
            response: 'mirrorExp.stateSeq.join.response',
            proof: 'mirrorExp.stateSeq.join.proof',
            boundary: 'mirrorExp.stateSeq.join.boundary',
        },
        link: 'mirrorExp.stateSeq.join.link',
    },
};
const mirrorStateSequencerTargets = mirrorStateSequencer ? {
    controls: Array.from(mirrorStateSequencer.querySelectorAll('[data-mirror-state-control]')),
    nodes: Array.from(mirrorStateSequencer.querySelectorAll('[data-mirror-state-node]')),
    outputs: Array.from(mirrorStateSequencer.querySelectorAll('[data-mirror-state-output]')).reduce((acc, node) => {
        acc[node.dataset.mirrorStateOutput] = node;
        return acc;
    }, {}),
    link: mirrorStateSequencer.querySelector('[data-mirror-state-link]'),
} : null;

function setMirrorStateSequencer(stateId) {
    if (!mirrorStateSequencer || !mirrorStateSequencerTargets) return;

    const packet = mirrorStateSequencerPackets[stateId] || mirrorStateSequencerPackets.mirror;
    const activeState = mirrorStateSequencerPackets[stateId] ? stateId : 'mirror';
    mirrorStateSequencer.dataset.activeState = activeState;
    mirrorStateSequencerTargets.controls.forEach((control) => {
        control.setAttribute('aria-pressed', String(control.dataset.mirrorStateControl === activeState));
    });
    mirrorStateSequencerTargets.nodes.forEach((node) => {
        node.dataset.active = String(node.dataset.mirrorStateNode === activeState);
    });

    Object.entries(packet.output).forEach(([field, key]) => {
        setMirrorTranslatedText(mirrorStateSequencerTargets.outputs[field], key);
    });

    if (mirrorStateSequencerTargets.link) {
        mirrorStateSequencerTargets.link.setAttribute('href', packet.href);
        setMirrorTranslatedText(mirrorStateSequencerTargets.link, packet.link);
    }
}

if (mirrorStateSequencer && mirrorStateSequencerTargets) {
    setMirrorStateSequencer(mirrorStateSequencer.dataset.activeState || 'mirror');

    mirrorStateSequencerTargets.controls.forEach((control) => {
        control.addEventListener('click', () => {
            setMirrorStateSequencer(control.dataset.mirrorStateControl || 'mirror');
        });
    });

    if ('IntersectionObserver' in window) {
        const stateAnchors = [
            ['mirror', '#mirror-question-title'],
            ['reflection', '#mirror-reflection-title'],
            ['brain', '#mirror-brain-title'],
            ['organisms', '#mirror-organisms-title'],
            ['growth', '#mirror-growth-title'],
            ['proof', '#mirror-proof-title'],
            ['join', '#mirror-join-title'],
        ];
        const stateSections = new Map();
        const stateObserver = new IntersectionObserver((entries) => {
            const visibleEntries = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
            const nextState = stateSections.get(visibleEntries[0]?.target);
            if (nextState) setMirrorStateSequencer(nextState);
        }, { rootMargin: '-28% 0px -58% 0px', threshold: 0.01 });

        stateAnchors.forEach(([stateId, selector]) => {
            const target = document.querySelector(selector);
            const section = target?.closest('.mirror-experience-hero, .mirror-experience-section') || target;
            if (!section || stateSections.has(section)) return;
            stateSections.set(section, stateId);
            stateObserver.observe(section);
        });
    }

    document.addEventListener('uc:languagechange', () => {
        setMirrorStateSequencer(mirrorStateSequencer.dataset.activeState || 'mirror');
    });
}

// ── Infinity Mirror Emotional Progression ──────────────────────
const mirrorEmotionalProgression = document.querySelector('.mirror-emotional-progression[data-runtime-owner="bounded-emotional-progress"]');
const mirrorEmotionPackets = {
    curiosity: {
        feeling: 'mirrorExp.emotion.curiosity.feeling',
        organism: 'mirrorExp.emotion.curiosity.organism',
        proof: 'mirrorExp.emotion.curiosity.proof',
        boundary: 'mirrorExp.emotion.curiosity.boundary',
    },
    unease: {
        feeling: 'mirrorExp.emotion.unease.feeling',
        organism: 'mirrorExp.emotion.unease.organism',
        proof: 'mirrorExp.emotion.unease.proof',
        boundary: 'mirrorExp.emotion.unease.boundary',
    },
    recognition: {
        feeling: 'mirrorExp.emotion.recognition.feeling',
        organism: 'mirrorExp.emotion.recognition.organism',
        proof: 'mirrorExp.emotion.recognition.proof',
        boundary: 'mirrorExp.emotion.recognition.boundary',
    },
    wonder: {
        feeling: 'mirrorExp.emotion.wonder.feeling',
        organism: 'mirrorExp.emotion.wonder.organism',
        proof: 'mirrorExp.emotion.wonder.proof',
        boundary: 'mirrorExp.emotion.wonder.boundary',
    },
    relief: {
        feeling: 'mirrorExp.emotion.relief.feeling',
        organism: 'mirrorExp.emotion.relief.organism',
        proof: 'mirrorExp.emotion.relief.proof',
        boundary: 'mirrorExp.emotion.relief.boundary',
    },
    agency: {
        feeling: 'mirrorExp.emotion.agency.feeling',
        organism: 'mirrorExp.emotion.agency.organism',
        proof: 'mirrorExp.emotion.agency.proof',
        boundary: 'mirrorExp.emotion.agency.boundary',
    },
};
const mirrorEmotionTargets = mirrorEmotionalProgression ? {
    controls: Array.from(mirrorEmotionalProgression.querySelectorAll('[data-emotion-control]')),
    outputs: Array.from(mirrorEmotionalProgression.querySelectorAll('[data-emotion-output]')).reduce((acc, node) => {
        acc[node.dataset.emotionOutput] = node;
        return acc;
    }, {}),
} : null;

function setMirrorEmotionalProgression(emotionId) {
    if (!mirrorEmotionalProgression || !mirrorEmotionTargets) return;

    const packet = mirrorEmotionPackets[emotionId] || mirrorEmotionPackets.curiosity;
    const activeEmotion = mirrorEmotionPackets[emotionId] ? emotionId : 'curiosity';
    mirrorEmotionalProgression.dataset.activeEmotion = activeEmotion;
    mirrorEmotionTargets.controls.forEach((control) => {
        control.setAttribute('aria-pressed', String(control.dataset.emotionControl === activeEmotion));
    });

    Object.entries(packet).forEach(([field, key]) => {
        setMirrorTranslatedText(mirrorEmotionTargets.outputs[field], key);
    });
}

if (mirrorEmotionalProgression && mirrorEmotionTargets) {
    setMirrorEmotionalProgression(mirrorEmotionalProgression.dataset.activeEmotion || 'curiosity');

    mirrorEmotionTargets.controls.forEach((control) => {
        control.addEventListener('click', () => {
            setMirrorEmotionalProgression(control.dataset.emotionControl || 'curiosity');
        });
    });

    document.addEventListener('uc:languagechange', () => {
        setMirrorEmotionalProgression(mirrorEmotionalProgression.dataset.activeEmotion || 'curiosity');
    });
}

// ── Infinity Mirror Proof Observatory ──────────────────────────
const mirrorProofObservatory = document.querySelector('.mirror-proof-observatory[data-runtime-owner="bounded-proof-observatory"]');
const mirrorProofObservatoryPackets = {
    architecture: {
        href: '/architecture/',
        output: {
            evidence: 'mirrorExp.proofObs.architecture.evidence',
            signal: 'mirrorExp.proofObs.architecture.signal',
            boundary: 'mirrorExp.proofObs.architecture.boundary',
        },
        link: 'mirrorExp.proofObs.architecture.link',
    },
    metrics: {
        href: '/proof/#proof-register-title',
        output: {
            evidence: 'mirrorExp.proofObs.metrics.evidence',
            signal: 'mirrorExp.proofObs.metrics.signal',
            boundary: 'mirrorExp.proofObs.metrics.boundary',
        },
        link: 'mirrorExp.proofObs.metrics.link',
    },
    deployments: {
        href: '/transmissions/#transmission-atlas-title',
        output: {
            evidence: 'mirrorExp.proofObs.deployments.evidence',
            signal: 'mirrorExp.proofObs.deployments.signal',
            boundary: 'mirrorExp.proofObs.deployments.boundary',
        },
        link: 'mirrorExp.proofObs.deployments.link',
    },
    status: {
        href: '/proof/#authority-gate-title',
        output: {
            evidence: 'mirrorExp.proofObs.status.evidence',
            signal: 'mirrorExp.proofObs.status.signal',
            boundary: 'mirrorExp.proofObs.status.boundary',
        },
        link: 'mirrorExp.proofObs.status.link',
    },
};
const mirrorProofObservatoryTargets = mirrorProofObservatory ? {
    controls: Array.from(mirrorProofObservatory.querySelectorAll('[data-proof-observatory-control]')),
    nodes: Array.from(mirrorProofObservatory.querySelectorAll('[data-proof-observatory-node]')),
    outputs: Array.from(mirrorProofObservatory.querySelectorAll('[data-proof-observatory-output]')).reduce((acc, node) => {
        acc[node.dataset.proofObservatoryOutput] = node;
        return acc;
    }, {}),
    link: mirrorProofObservatory.querySelector('[data-proof-observatory-link]'),
} : null;

function setMirrorProofObservatory(proofId) {
    if (!mirrorProofObservatory || !mirrorProofObservatoryTargets) return;

    const packet = mirrorProofObservatoryPackets[proofId] || mirrorProofObservatoryPackets.architecture;
    const activeProof = mirrorProofObservatoryPackets[proofId] ? proofId : 'architecture';
    mirrorProofObservatory.dataset.activeProof = activeProof;
    mirrorProofObservatoryTargets.controls.forEach((control) => {
        control.setAttribute('aria-pressed', String(control.dataset.proofObservatoryControl === activeProof));
    });
    mirrorProofObservatoryTargets.nodes.forEach((node) => {
        node.dataset.active = String(node.dataset.proofObservatoryNode === activeProof);
    });

    Object.entries(packet.output).forEach(([field, key]) => {
        setMirrorTranslatedText(mirrorProofObservatoryTargets.outputs[field], key);
    });

    if (mirrorProofObservatoryTargets.link) {
        mirrorProofObservatoryTargets.link.setAttribute('href', packet.href);
        setMirrorTranslatedText(mirrorProofObservatoryTargets.link, packet.link);
    }
}

if (mirrorProofObservatory && mirrorProofObservatoryTargets) {
    setMirrorProofObservatory(mirrorProofObservatory.dataset.activeProof || 'architecture');

    mirrorProofObservatoryTargets.controls.forEach((control) => {
        control.addEventListener('click', () => {
            setMirrorProofObservatory(control.dataset.proofObservatoryControl || 'architecture');
        });
    });

    document.addEventListener('uc:languagechange', () => {
        setMirrorProofObservatory(mirrorProofObservatory.dataset.activeProof || 'architecture');
    });
}

// ── Nav Scroll ──────────────────────────────────────────────────
const nav = document.getElementById('nav');
const homeReturn = document.getElementById('home-return');

function updateScrollNavigationState() {
    const scrollY = getCurrentScrollY();
    nav?.classList.toggle('scrolled', scrollY > 60);
    homeReturn?.classList.toggle('is-visible', scrollY > Math.min(360, window.innerHeight * 0.45));
}

window.addEventListener('scroll', updateScrollNavigationState, { passive: true });
updateScrollNavigationState();

// ── Mobile Nav Toggle ───────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const navCta = document.querySelector('.nav-actions .nav-cta');

if (navToggle && navLinks) {
    navToggle.setAttribute('aria-controls', navLinks.id || 'nav-links');
}

if (navLinks && navCta && !navLinks.querySelector('.nav-drawer-cta')) {
    const drawerCta = navCta.cloneNode(true);
    drawerCta.classList.add('nav-drawer-cta');
    navLinks.appendChild(drawerCta);
}

function setNavDrawerOpen(isOpen) {
    navLinks?.classList.toggle('open', isOpen);
    nav?.classList.toggle('menu-open', isOpen);
    navToggle?.classList.toggle('active', isOpen);
    navToggle?.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-drawer-open', isOpen);
}

navToggle?.addEventListener('click', () => {
    setNavDrawerOpen(!navLinks?.classList.contains('open'));
});

// Close mobile nav on link click
navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        setNavDrawerOpen(false);
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks?.classList.contains('open')) {
        setNavDrawerOpen(false);
        navToggle?.focus();
    }
});

document.addEventListener('click', (event) => {
    if (!navLinks?.classList.contains('open') || !nav || !navToggle) return;
    if (nav.contains(event.target)) return;
    setNavDrawerOpen(false);
});

// ── Smooth Anchor ───────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        if (a.id === 'footer-chat-link') { e.preventDefault(); openChat(); return; }
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const behavior = prefersReducedMotion ? 'auto' : 'smooth';
            if (window.location.hash !== a.getAttribute('href')) {
                window.history.pushState(null, '', a.getAttribute('href'));
            }
            scrollToHashTarget(target, { behavior });
            requestAnimationFrame(() => queueMirrorExperienceStepUpdate());
        }
    });
});

// ── Organism Card Glow ──────────────────────────────────────────
document.querySelectorAll('.organism-card').forEach(card => {
    const glow = card.querySelector('.card-glow');
    card.addEventListener('mousemove', (e) => {
        if (!glow) return;
        const rect = card.getBoundingClientRect();
        glow.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(110, 45, 190, 0.12), transparent 60%)`;
    });
    card.addEventListener('mouseleave', () => { if (glow) glow.style.background = 'transparent'; });
});

// ── Email Signup ────────────────────────────────────────────────
const emailForm = document.getElementById('email-form');
const emailInput = document.getElementById('email-input');
const signupStatus = document.getElementById('signup-status');

async function subscribeEmail(email) {
    const payload = JSON.stringify({ email, page_path: window.location.pathname });
    const primary = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
    });

    if (primary.ok) return primary;

    const primaryData = await primary.json().catch(() => ({}));
    const fallback = await fetch(`${SUPABASE_URL}/functions/v1/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON}` },
        body: JSON.stringify({ email }),
    });

    if (fallback.ok) return fallback;

    const fallbackData = await fallback.json().catch(() => ({}));
    throw new Error(fallbackData.error || primaryData.error || 'Failed');
}

emailForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput?.value.trim();
    if (!email || !signupStatus) return;

    signupStatus.className = 'signup-status';
    signupStatus.textContent = 'Subscribing…';

    try {
        const res = await subscribeEmail(email);

        if (res.ok) {
            signupStatus.textContent = "You're in. The organism will reach out. ∞";
            signupStatus.className = 'signup-status success';
            if (emailInput) emailInput.value = '';
        } else {
            const data = await res.json();
            throw new Error(data.error || 'Failed');
        }
    } catch (err) {
        signupStatus.textContent = `Error: ${err.message}`;
        signupStatus.className = 'signup-status error';
    }
});

// ── Wallet Copy ─────────────────────────────────────────────────
document.querySelectorAll('.wallet-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
        const address = btn.dataset.address;
        try {
            await navigator.clipboard.writeText(address);
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
        } catch { btn.textContent = 'Failed'; }
    });
});

// ── Chat Modal ──────────────────────────────────────────────────
const chatModal = document.getElementById('chat-modal');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
let conversationId = null;
let chatReturnFocusTarget = null;

function getChatFocusableElements() {
    if (!chatModal) return [];
    return Array.from(chatModal.querySelectorAll('button, input, textarea, select, [href], [tabindex]:not([tabindex="-1"])'))
        .filter((el) => el instanceof HTMLElement && !el.hasAttribute('disabled') && el.tabIndex >= 0);
}

function focusChatInput() {
    if (!chatModal?.classList.contains('open') || !chatInput) return;
    chatInput.focus({ preventScroll: true });
}

function restoreChatFocus(target) {
    if (!target || !document.contains(target)) return;
    target.focus({ preventScroll: true });
    requestAnimationFrame(() => {
        if (document.contains(target)) target.focus({ preventScroll: true });
    });
    setTimeout(() => {
        if (document.contains(target)) target.focus({ preventScroll: true });
    }, 0);
}

function openChat(event) {
    if (!chatModal || !chatInput || !chatMessages) return;
    chatReturnFocusTarget = event?.currentTarget instanceof HTMLElement
        ? event.currentTarget
        : document.activeElement instanceof HTMLElement ? document.activeElement : null;
    chatModal.classList.add('open');
    chatModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    focusChatInput();
    requestAnimationFrame(focusChatInput);
    setTimeout(focusChatInput, 0);

    // Greeting on first open
    if (chatMessages.children.length === 0) {
        addMessage('organism', getTranslation('chat.greeting'));
    }
}

function openChatWithPrompt(event) {
    const target = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    const promptKey = target?.dataset.chatPromptKey;
    const prompt = promptKey ? getTranslation(promptKey) : target?.dataset.chatPrompt;
    openChat(event);
    if (!chatInput || !prompt) return;
    chatInput.value = prompt;
    chatInput.dispatchEvent(new Event('input', { bubbles: true }));
    focusChatInput();
}

function closeChat() {
    if (!chatModal) return;
    const restoreTarget = chatReturnFocusTarget;
    chatReturnFocusTarget = null;
    chatModal.classList.remove('open');
    chatModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    restoreChatFocus(restoreTarget);
}

function addMessage(role, text) {
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = 'chat-typing';
    div.id = 'typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

document.getElementById('open-chat')?.addEventListener('click', openChat);
document.querySelectorAll('[data-chat-prompt]').forEach((button) => {
    button.addEventListener('click', openChatWithPrompt);
});
document.getElementById('close-chat')?.addEventListener('click', closeChat);
document.getElementById('footer-chat-link')?.addEventListener('click', (e) => { e.preventDefault(); openChat(e); });
chatModal?.querySelector('.chat-overlay')?.addEventListener('click', closeChat);

document.addEventListener('keydown', (e) => {
    if (!chatModal?.classList.contains('open')) return;
    if (e.key === 'Escape') {
        closeChat();
        return;
    }
    if (e.key !== 'Tab') return;

    const focusable = getChatFocusableElements();
    if (focusable.length === 0) {
        e.preventDefault();
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

chatForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = chatInput?.value.trim();
    if (!msg) return;

    addMessage('user', msg);
    if (chatInput) chatInput.value = '';
    showTyping();

    try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON}` },
            body: JSON.stringify({ conversation_id: conversationId, message: msg }),
        });

        hideTyping();

        if (res.ok) {
            const data = await res.json();
            conversationId = data.conversation_id;
            addMessage('organism', data.reply);
        } else {
            addMessage('organism', 'The organism encountered interference. Please try again.');
        }
    } catch {
        hideTyping();
        addMessage('organism', 'Connection lost. The organism is recalibrating.');
    }
});
