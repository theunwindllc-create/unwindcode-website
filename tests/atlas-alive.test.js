import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createMotionArbiter, syncVideos } from '../public/lab/alive-motion.js';

const source = name => readFileSync(new URL(`../public/lab/${name}`, import.meta.url), 'utf8');
function animatedElement() {
  const animations = [];
  return { animations, animate(frames, options) {
    const animation = { frames, options, cancelled: 0, cancel() { this.cancelled++; } };
    animations.push(animation);
    return animation;
  } };
}

test('foreground arbiter has exactly one finite animation owner and releases it on completion', () => {
  const reports = [];
  const arbiter = createMotionArbiter(() => true, value => reports.push(value));
  const element = animatedElement();
  let completed = 0;
  const animation = arbiter.play(element, [{ opacity: 0 }, { opacity: 1 }], 360, { finish: () => completed++ });
  assert.equal(arbiter.active, true);
  assert.equal(animation.options.iterations, 1);
  assert.equal(animation.options.duration, 360);
  assert.equal(animation.options.fill, 'none');
  animation.onfinish();
  assert.equal(arbiter.active, false);
  assert.equal(completed, 1);
  assert.equal(reports.at(-1), false);
  animation.onfinish();
  assert.equal(completed, 1, 'duplicate finish event cannot run cleanup again');
});

test('replacement cancels the previous owner before another can start', () => {
  const arbiter = createMotionArbiter(() => true);
  const element = animatedElement();
  let finished = 0;
  const old = arbiter.play(element, [], 320, { finish: () => finished++ });
  const next = arbiter.play(element, [], 360);
  assert.equal(old.cancelled, 1);
  assert.equal(next.cancelled, 0);
  assert.equal(finished, 1);
  old.onfinish();
  assert.equal(arbiter.active, true, 'late finish cannot release a newer owner');
  arbiter.cancel();
  assert.equal(next.cancelled, 1);
  assert.equal(arbiter.active, false);
  arbiter.cancel();
  assert.equal(next.cancelled, 1, 'cancel is idempotent');
});

test('sheet priority resists decorative pulses and denied motion still completes cleanup', () => {
  let allowed = true;
  const arbiter = createMotionArbiter(() => allowed);
  const element = animatedElement();
  const sheet = arbiter.play(element, [], 360, { priority: 2 });
  let declined = 0;
  assert.equal(arbiter.play(element, [], 320, { finish: () => declined++ }), null);
  assert.equal(declined, 1);
  assert.equal(sheet.cancelled, 0);
  allowed = false;
  arbiter.cancel();
  assert.equal(arbiter.play(element, [], 180, { finish: () => declined++ }), null);
  assert.equal(element.animations.length, 1);
  assert.equal(declined, 2);
  assert.equal(arbiter.active, false);
  assert.equal(createMotionArbiter(() => true).play({}, [], 1, { finish: () => declined++ }), null);
  assert.equal(declined, 3, 'no-WAAPI browsers still settle sheet visibility');
});

test('video brake pauses every video when paused, hidden, or reduced, and allows at most one in view', async () => {
  const make = inView => ({ dataset: { inView }, pauses: 0, plays: 0,
    pause() { this.pauses++; }, play() { this.plays++; return Promise.reject(new Error('autoplay denied')); } });
  const videos = [make('false'), make('true'), make('true')];
  syncVideos(videos, true);
  assert.deepEqual(videos.map(video => video.plays), [0, 1, 0]);
  assert.deepEqual(videos.map(video => video.pauses), [1, 0, 1]);
  for (const reason of ['manual pause', 'hidden tab', 'reduced motion']) {
    syncVideos(videos, false);
    assert.equal(videos.reduce((sum, video) => sum + video.plays, 0), 1, reason);
  }
  assert.deepEqual(videos.map(video => video.pauses), [4, 3, 4]);
  await Promise.resolve(); // Rejected browser autoplay promises are consumed.
});

class DetailEvent extends Event { constructor(type, init = {}) { super(type, init); this.detail = init.detail; } }
function sheetHarness(reducedMotion = false) {
  const doc = new EventTarget();
  const win = new EventTarget();
  const root = {
    lang: 'en', classList: { contains: () => false, add() {} }, toggleAttribute() {},
  };
  const panels = { ...animatedElement(), hidden: false, classList: { add() {} }, style: { setProperty() {} } };
  const dialog = { open: false, querySelectorAll: () => [], close() { this.open = false; } };
  const loop = new EventTarget();
  loop.dataset = {};
  loop.closest = () => ({ dataset: {} });
  const close = new EventTarget();
  Object.assign(doc, {
    documentElement: root, hidden: false,
    querySelector: selector => selector === '.loop-panels' ? panels : selector === '[data-infinity]' ? loop : null,
    querySelectorAll: selector => selector === '[data-sheet-close]' ? [close] : [],
    getElementById: () => dialog,
  });
  const media = new EventTarget();
  media.matches = reducedMotion;
  let witnessStarted = 0;
  const context = {
    window: win, document: doc, matchMedia: () => media, CustomEvent: DetailEvent, Event, queueMicrotask,
    createMotionArbiter, syncVideos, initWitness: () => witnessStarted++,
    MutationObserver: class { observe() {} },
    requestAnimationFrame: () => { throw new Error('No idle rAF allowed'); }, cancelAnimationFrame() {},
  };
  vm.runInNewContext(source('alive.js').replace(/^import .*;\r?\n/gm, ''), context);
  const trigger = () => ({ dataset: { layer: '0' }, attrs: {}, focused: 0,
    setAttribute(name, value) { this.attrs[name] = value; }, focus() { this.focused++; } });
  const select = tab => doc.dispatchEvent(new DetailEvent('atlas:loop-select', { detail: { tab } }));
  const escape = () => { const event = new Event('keydown', { cancelable: true }); event.key = 'Escape'; doc.dispatchEvent(event); return event; };
  function wireActualTabs() {
    const children = Array.from({ length: 6 }, (_, index) => ({ hidden: index !== 0 }));
    const tabs = children.map((_panel, index) => Object.assign(new EventTarget(), {
      dataset: { layer: String(index) }, focused: 0,
      attrs: { 'aria-controls': `loop-panel-${index}`, 'aria-selected': String(index === 0) },
      setAttribute(name, value) { this.attrs[name] = value; },
      getAttribute(name) { return this.attrs[name]; },
      focus() { this.focused++; },
    }));
    loop.dataset = { step: '0' };
    const group = {
      querySelectorAll: () => tabs,
      querySelector: selector => selector === '[data-infinity]' ? loop : null,
    };
    const oldQuery = doc.querySelectorAll;
    doc.querySelectorAll = selector => selector === '[data-tabs]' ? [group] : oldQuery(selector);
    doc.getElementById = id => id.startsWith('loop-panel-') ? children[Number(id.slice(-1))] : dialog;
    const main = source('main.js');
    // Execute the real shared tab controller against the actual Alive event handlers.
    vm.runInNewContext(main.slice(main.indexOf('  // Tab groups'), main.indexOf('  // Native dialog')), context);
    const click = index => tabs[index].dispatchEvent(new Event('click'));
    const key = (index, value) => { const event = new Event('keydown', { cancelable: true }); event.key = value; tabs[index].dispatchEvent(event); };
    return { tabs, children, click, key, active: () => tabs.findIndex(tab => tab.attrs['aria-selected'] === 'true') };
  }
  return { doc, panels, close, trigger, select, escape, witnessStarted, wireActualTabs };
}

test('loop sheet initializes at rest and Escape dissolves it then returns focus to the activating tab', () => {
  const h = sheetHarness();
  assert.equal(h.panels.hidden, true);
  assert.equal(h.panels.animations.length, 0);
  assert.equal(h.witnessStarted, 1);
  const tab = h.trigger();
  h.select(tab);
  assert.equal(h.panels.hidden, false);
  assert.equal(tab.attrs['aria-expanded'], 'true');
  assert.equal(h.escape().defaultPrevented, true);
  h.panels.animations.at(-1).onfinish();
  assert.equal(h.panels.hidden, true);
  assert.equal(tab.attrs['aria-expanded'], 'false');
  assert.equal(tab.focused, 1);
});

test('loop sheet close control is immediate under reduced motion and returns keyboard focus', () => {
  const h = sheetHarness(true);
  const tab = h.trigger();
  h.select(tab);
  assert.equal(h.panels.hidden, false);
  assert.equal(h.panels.animations.length, 0);
  h.close.dispatchEvent(new Event('click'));
  assert.equal(h.panels.hidden, true);
  assert.equal(tab.focused, 1);
  assert.equal(tab.attrs['aria-expanded'], 'false');
});

test('changing a loop stage retires the old sheet without stealing focus', () => {
  const h = sheetHarness();
  const first = h.trigger();
  const second = h.trigger();
  second.dataset.layer = '2';
  h.select(first);
  const oldAnimation = h.panels.animations.at(-1);
  h.select(second);
  assert.equal(oldAnimation.cancelled, 1);
  assert.equal(first.focused, 0);
  assert.equal(first.attrs['aria-expanded'], 'false');
  assert.equal(second.attrs['aria-expanded'], 'true');
  assert.equal(h.panels.hidden, false);
});

test('actual tab controller defers content replacement until the outgoing sheet dissolves', () => {
  const h = sheetHarness();
  const t = h.wireActualTabs();
  t.click(0);
  h.panels.animations.at(-1).onfinish();
  t.key(0, 'ArrowRight');
  const outgoing = h.panels.animations.at(-1);
  assert.equal(outgoing.options.duration, 180);
  assert.equal(t.active(), 0, 'old tab remains selected throughout its exit');
  assert.equal(t.children[0].hidden, false);
  assert.equal(t.children[1].hidden, true);
  assert.equal(t.tabs[1].focused, 0);
  outgoing.onfinish();
  assert.equal(t.active(), 1);
  assert.equal(t.children[0].hidden, true);
  assert.equal(t.children[1].hidden, false);
  assert.equal(t.tabs[1].focused, 1);
  assert.equal(h.panels.animations.at(-1).options.duration, 360);
  assert.equal(t.tabs[0].attrs['aria-expanded'], 'false');
  assert.equal(t.tabs[1].attrs['aria-expanded'], 'true');
});

test('newest loop request supersedes pending selection without stale content or focus', () => {
  const h = sheetHarness();
  const t = h.wireActualTabs();
  t.click(0);
  t.key(0, 'ArrowRight');
  const obsolete = h.panels.animations.at(-1);
  t.key(0, 'End');
  const latest = h.panels.animations.at(-1);
  assert.equal(obsolete.cancelled, 1);
  assert.equal(t.active(), 0);
  obsolete.onfinish();
  assert.equal(t.active(), 0, 'late canceled callback must not commit the obsolete request');
  latest.onfinish();
  assert.equal(t.active(), 5);
  assert.equal(t.tabs[1].focused, 0);
  assert.equal(t.tabs[5].focused, 1);
  assert.equal(h.panels.hidden, false);
});

test('Escape during deferred selection cancels its commit and returns focus to the current tab', () => {
  const h = sheetHarness();
  const t = h.wireActualTabs();
  t.click(0);
  t.key(0, 'ArrowRight');
  const pending = h.panels.animations.at(-1);
  h.escape();
  assert.equal(pending.cancelled, 1);
  pending.onfinish();
  assert.equal(t.active(), 0);
  h.panels.animations.at(-1).onfinish();
  assert.equal(h.panels.hidden, true);
  assert.equal(t.tabs[0].focused, 1);
  assert.equal(t.tabs[1].focused, 0);
  assert.equal(t.tabs[0].attrs['aria-expanded'], 'false');
});

test('reduced motion commits requested tab changes immediately without either transition', () => {
  const h = sheetHarness(true);
  const t = h.wireActualTabs();
  t.click(0);
  t.key(0, 'ArrowRight');
  assert.equal(t.active(), 1);
  assert.equal(t.tabs[1].focused, 1);
  assert.equal(h.panels.animations.length, 0);
});

test('Alive CSS disables perpetual animations and provides reduced motion/transparency and mobile drawers', () => {
  const css = source('alive.css');
  assert.match(css, /html\[data-alive\][\s\S]*?animation:\s*none\s*!important/);
  assert.doesNotMatch(css, /@keyframes|\binfinite\b/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[^}]*alive-refraction[^}]*alive-seed[^}]*display:\s*none/);
  assert.match(css, /prefers-reduced-transparency:\s*reduce[^}]*background:\s*#16121e[^}]*backdrop-filter:\s*none/);
  assert.match(css, /@media\s*\(max-width:\s*700px\)[\s\S]*?\.specimen-sheet\s*\{[^}]*position:\s*fixed/);
  assert.match(source('styles.css'), /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
});

test('Alive runtime has no autonomous animation timer and only schedules a scroll-driven frame', () => {
  const js = source('alive.js');
  assert.doesNotMatch(source('alive-motion.js'), /requestAnimationFrame|setInterval|setTimeout/);
  assert.doesNotMatch(js, /setInterval/);
  assert.equal((js.match(/requestAnimationFrame\(/g) || []).length, 1);
  assert.match(js, /addEventListener\('scroll',[\s\S]*?requestAnimationFrame\(scrollLight\)/);
  const scrollCallback = js.slice(js.indexOf('function scrollLight()'), js.indexOf("window.addEventListener('scroll'"));
  assert.doesNotMatch(scrollCallback, /requestAnimationFrame/);
  assert.match(js, /!document\.hidden\s*&&\s*!reduced\.matches/);
  assert.match(js, /motion-paused/);
  assert.match(js, /cancelAnimationFrame\(scrollFrame\)/);
  assert.match(js, /addEventListener\('visibilitychange', brake\)/);
});

test('public honesty labels, financial qualifications, source isolation and native loop tabs remain present', () => {
  const html = source('index.html');
  assert.match(html, /CONCEPT(?:UAL)? STUDY/);
  assert.match(html, /RESEARCH \/ SIMULATION/);
  assert.match(html, /human review precedes consequential action/);
  for (let index = 0; index < 6; index++) {
    assert.match(html, new RegExp(`<button[^>]*id="loop-tab-${index}"[^>]*role="tab"[^>]*aria-controls="loop-panel-${index}"`));
    assert.match(html, new RegExp(`id="loop-panel-${index}"[^>]*role="tabpanel"[^>]*aria-labelledby="loop-tab-${index}"`));
  }
  const js = source('alive.js');
  assert.match(js, /fetch\('\/data\/organisms\.json'/);
  assert.doesNotMatch(js, /https?:\/\//);
  assert.match(js, /record\.review_status !== 'public_safe'/);
  assert.match(js, /PUBLIC REGISTRY UNREACHABLE/);
});
