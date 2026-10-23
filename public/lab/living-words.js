/* Bounded arrivals. Content is visible by default; no overlay, idle loop or load gate. */
const clamp = n => Math.max(0, Math.min(1, n));
const ease = n => 1 - (1 - clamp(n)) ** 3;
export function circuitFrames(hero, duration = 360, start = 0, end = duration) {
  const frames = [];
  if (start) frames.push({ offset: 0, opacity: 0, transform: 'scale(.6)' },
    { offset: start / duration * .5, opacity: .85, transform: 'scale(1.3)' });
  for (let i = 0; i <= 24; i++) {
    const t = i / 24 * Math.PI * 2;
    frames.push({ offset: (start + (end - start) * i / 24) / duration,
      transform: `translate(${hero.clientWidth * .35 * Math.sin(t)}px, ${hero.clientHeight * .19 * Math.sin(2 * t)}px)`,
      opacity: i === 0 || i === 24 ? 0 : .8 });
  }
  if (end < duration) frames.push({ offset: 1, opacity: 0, transform: 'none' });
  return frames;
}

export function initLivingWords({ hero, motion, allowed, syncBreath, scrollActive = () => false }) {
  const root = document.documentElement;
  const compact = () => innerWidth <= 700 || matchMedia('(pointer: coarse)').matches;
  const headline = document.querySelector('.hero-headline');
  const witness = document.querySelector('.witness-reading');
  const arrival = [...document.querySelectorAll('#nav, .hero-eyebrow, .hero-actions, .scroll-cue, .figure-note')];
  const sub = document.querySelector('.hero-sub');
  let words = [], entrance = false, preparing = false, witnessSeen = false;
  const queue = new Set();
  const seen = new WeakSet();
  let transient = [];

  function split() {
    words = [];
    for (const line of headline.children) {
      const tokens = line.textContent.trim().split(/(\s+)/);
      line.replaceChildren(...tokens.map(token => {
        if (/^\s+$/.test(token)) return document.createTextNode(token);
        const word = document.createElement('span'); word.className = 'living-word';
        word.textContent = token; words.push(word); return word;
      }));
    }
  }
  split();
  function clear(elements) {
    elements.forEach(el => ['opacity', 'filter', 'letter-spacing', 'width'].forEach(key => el.style.removeProperty(key)));
  }
  function ink(el, progress, blur = 14) {
    const p = ease(progress);
    el.style.opacity = String(p);
    if (!compact()) el.style.filter = `blur(${blur * (1 - p)}px)`;
  }
  function prepareWords() {
    words.forEach(word => {
      word.style.width = `${word.getBoundingClientRect().width}px`;
      word.dataset.spacing = parseFloat(getComputedStyle(word).letterSpacing) || 0;
    });
  }
  function sampleWords(time) {
    words.forEach((word, i) => {
      const p = (time - i * 70) / 700;
      ink(word, p);
      word.style.letterSpacing = `${Number(word.dataset.spacing) + .9 * (1 - ease(p))}px`;
    });
  }
  function finish() {
    entrance = false; preparing = false;
    root.removeAttribute('data-entrance');
    clear([...words, sub, witness, ...arrival, ...transient]);
    transient = [];
    syncBreath();
    queueMicrotask(drain);
  }
  function drain() {
    if (preparing || entrance || motion.active || !queue.size) return;
    const pending = [...queue];
    // A queued witness may have been hidden while another foreground job ran.
    // Even entries excluded for focus or visibility must return to readable rest.
    clear(pending);
    const targets = pending.filter(el => {
      const box = el.getBoundingClientRect(); return box.bottom > 0 && box.top < innerHeight && !el.contains(document.activeElement);
    });
    queue.clear();
    if (!targets.length || !allowed() || compact() || scrollActive()) { clear(targets); return; }
    transient = targets;
    motion.play(targets[0], [{ opacity: 1 }, { opacity: 1 }], 420, {
      sample: t => targets.forEach(el => ink(el, t / 420)), finish, priority: 1,
    });
  }
  function skip(event) {
    const intent = ['keydown', 'pointerdown', 'click', 'touchstart', 'focusin'].includes(event?.type);
    if (entrance || preparing || (intent && transient.length)) {
      clear([...queue]); queue.clear(); motion.cancel(); finish();
    }
  }
  function start() {
    const back = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
    let first = false;
    try {
      first = sessionStorage.getItem('uc-alive-entrance') !== 'seen';
      sessionStorage.setItem('uc-alive-entrance', 'seen');
    } catch { /* Storage denial: words only; never risk a repeated entrance. */ }
    if (!allowed() || back) return;
    // On a phone, show the hero immediately; only a short ink arrival accompanies it.
    if (compact()) {
      preparing = true;
      motion.play(headline, [{ opacity: .65 }, { opacity: 1 }], 280, { finish, priority: 3 });
      return;
    }
    first &&= !location.hash && scrollY < 10;
    preparing = true;
    prepareWords();
    if (!first) {
      motion.play(headline, [{ opacity: 1 }, { opacity: 1 }], 700 + (words.length - 1) * 70, {
        sample: sampleWords, finish, priority: 3,
      });
      return;
    }
    entrance = true;
    root.dataset.entrance = 'seed';
    syncBreath();
    const duration = 2100;
    motion.play(hero.querySelector('.hero-image'), [
      { offset: 0, opacity: 0, filter: 'blur(18px)', transform: 'scale(.96)' },
      { offset: 400 / duration, opacity: 0, filter: 'blur(18px)', transform: 'scale(.96)' },
      { offset: 1300 / duration, opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' },
      { offset: 1, opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' },
    ], duration, {
      priority: 3, easing: 'linear', finish,
      companion: { element: hero.querySelector('.alive-seed'), frames: circuitFrames(hero, duration, 400, 1300) },
      sample: t => {
        root.dataset.entrance = t < 400 ? 'seed' : t < 1100 ? 'glass' : 'words';
        sampleWords(t - 1100);
        ink(sub, (t - 1300) / 420);
        arrival.forEach(el => { el.style.opacity = String(clamp((t - 1800) / 300)); });
        if (witness.querySelector('[data-witness]').dataset.witnessState !== 'loading') ink(witness, (t - 1400) / 420);
      },
    });
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting && !seen.has(entry.target)) {
      seen.add(entry.target); observer.unobserve(entry.target); queue.add(entry.target);
    }
    drain();
  }, { threshold: .12 });
  document.querySelectorAll('h2, .section-intro, .transmissions-intro, .specimen-info, .philosophy-statement > p:not(.eyebrow), .final h2 + p')
    .forEach(el => observer.observe(el));
  // Any intent wins. These listeners never prevent the visitor's original action.
  ['keydown', 'pointerdown', 'click', 'touchstart', 'focusin', 'wheel', 'scroll'].forEach(type => window.addEventListener(type, skip, { passive: true, capture: true }));
  window.addEventListener('pagehide', skip);
  window.addEventListener('pageshow', event => { if (event.persisted) skip(); });
  document.addEventListener('uc:languagechange', () => { motion.cancel(); finish(); split(); resetLight(); });
  window.addEventListener('atlas:witness-reading', event => {
    if (event.detail.state === 'loading') { witnessSeen = false; return; }
    if (witnessSeen) return;
    witnessSeen = true;
    if (!entrance) {
      queue.add(witness);
      if (allowed() && (preparing || motion.active)) witness.style.opacity = '0';
      drain();
    }
  });

  const lightTokens = [...document.querySelectorAll('.hero-sub, .hero-eyebrow, .hero-caption .mono, .witness-label')]
    .map(el => ({ el, base: getComputedStyle(el).color.match(/[\d.]+/g).slice(0, 3).map(Number) }));
  function resetLight() {
    lightTokens.forEach(({ el }) => el.style.removeProperty('color'));
    words.forEach(word => { word.style.removeProperty('--word-light-x'); word.style.removeProperty('--word-light-y'); });
  }
  function light(x, y) {
    if (!allowed() || entrance) return;
    words.forEach(word => {
      const b = word.getBoundingClientRect();
      word.style.setProperty('--word-light-x', `${x - b.left}px`);
      word.style.setProperty('--word-light-y', `${y - b.top}px`);
    });
    lightTokens.forEach(({ el, base }) => {
      const b = el.getBoundingClientRect();
      const distance = Math.hypot(Math.max(b.left - x, 0, x - b.right), Math.max(b.top - y, 0, y - b.bottom));
      const near = clamp(1 - distance / 200) * .28;
      el.style.color = `rgb(${base.map(c => Math.round(c + (255 - c) * near)).join(' ')})`;
    });
  }
  window.addEventListener('blur', resetLight);
  document.addEventListener('atlas:foreground', event => { if (!event.detail.busy) queueMicrotask(drain); });
  start();
  return { light, resetLight, brake() { if (!allowed()) { skip(); clear([...transient, ...queue]); queue.clear(); resetLight(); } },
    get entering() { return entrance; } };
}
