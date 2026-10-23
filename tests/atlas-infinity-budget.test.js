import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { curve, projectLoop } from '../public/lab/loop-geometry.js';

const source = readFileSync(new URL('../public/lab/infinity.js', import.meta.url), 'utf8');
function harness({ width = 390, dpr = 3, reducedMotion = false, contextAvailable = true } = {}) {
  const doc = new EventTarget(), win = new EventTarget(), stage = new EventTarget(), canvas = new EventTarget();
  const classes = new Set(), stageClasses = new Set(), attributes = new Set();
  const frames = new Map(), intersections = [], resizes = [], mutations = [], uniforms = new Map();
  const reduced = Object.assign(new EventTarget(), { matches: reducedMotion });
  let contextReads = 0, draws = 0, serial = 0, time = 100;
  const root = {
    classList: { contains: name => classes.has(name) }, hasAttribute: name => attributes.has(name),
  };
  const gl = new Proxy({
    createShader: () => ({}), getShaderParameter: () => true,
    createProgram: () => ({}), getProgramParameter: () => true,
    createBuffer: () => ({}), getAttribLocation: () => 0, getUniformLocation: (_program, name) => name,
    uniform1f: (name, value) => uniforms.set(name, value),
    uniform2f: (name, x, y) => uniforms.set(name, [x, y]),
    clear: () => draws++,
  }, { get: (object, property) => object[property] ?? (/^[A-Z_]+$/.test(property) ? 1 : () => {}) });
  Object.assign(canvas, { width: 0, height: 0, getContext: () => { contextReads++; return contextAvailable ? gl : null; } });
  Object.assign(stage, {
    dataset: { step: '0' }, clientWidth: width, clientHeight: 210,
    querySelector: () => canvas,
    getBoundingClientRect: () => ({ left: 0, top: 0, width, height: 210 }),
    classList: { add: name => stageClasses.add(name), remove: name => stageClasses.delete(name) },
  });
  Object.assign(doc, { documentElement: root, hidden: false, querySelector: () => stage });
  class Intersection {
    constructor(callback) { this.callback = callback; intersections.push(this); }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
  }
  win.IntersectionObserver = Intersection;
  const context = {
    window: win, document: doc, curve, projectLoop, innerWidth: width, devicePixelRatio: dpr,
    performance: { now: () => time }, matchMedia: () => reduced,
    IntersectionObserver: Intersection,
    ResizeObserver: class { constructor(callback) { resizes.push(callback); } observe() {} },
    MutationObserver: class { constructor(callback) { mutations.push(callback); } observe() {} },
    requestAnimationFrame: callback => { frames.set(++serial, callback); return serial; },
    cancelAnimationFrame: id => frames.delete(id),
  };
  vm.runInNewContext(source.replace(/^import .*;\r?\n/gm, ''), context);
  const event = (name, values = {}) => Object.assign(new Event(name, { cancelable: true }), values);
  function enter() {
    intersections[0].callback([{ target: stage, isIntersecting: true }]);
    intersections[1]?.callback([{ target: stage, isIntersecting: true }]);
  }
  function frame(after = 16) {
    time += after;
    const pending = [...frames.entries()];
    pending.forEach(([id]) => frames.delete(id));
    pending.forEach(([, callback]) => callback(time));
  }
  function settle() {
    let count = 0;
    while (frames.size && count++ < 60) frame();
    assert.equal(frames.size, 0, 'finite gesture must leave no animation callback');
    return count;
  }
  return { doc, win, stage, canvas, classes, stageClasses, attributes, reduced, frames,
    intersections, resizes, mutations, uniforms, context, event, enter, frame, settle,
    draws: () => draws, contextReads: () => contextReads,
  };
}

test('infinity initializes only on intersection and visible resting artwork schedules zero RAF', () => {
  const h = harness();
  assert.equal(h.contextReads(), 0);
  assert.equal(h.draws(), 0);
  assert.equal(h.frames.size, 0);
  assert.deepEqual(h.stage.projectStep(2), projectLoop(2, 390, 210));
  h.enter();
  assert.equal(h.contextReads(), 1);
  assert.ok(h.draws() > 0);
  assert.equal(h.frames.size, 0);
  const before = h.draws();
  for (let index = 0; index < 90; index++) h.frame();
  assert.equal(h.draws(), before, 'no idle GPU draw or phase drift');
  h.intersections[0].callback([{ isIntersecting: true }]);
  assert.equal(h.contextReads(), 1, 'late loader delivery cannot initialize a second context');
});

test('every scroll samples exactly one draw and retires any prior witness clock', () => {
  const h = harness(); h.enter();
  h.stage.dispatchEvent(h.event('atlas:witness'));
  assert.equal(h.frames.size, 1);
  const stale = [...h.frames.values()][0];
  const before = h.draws();
  h.stage.dispatchEvent(h.event('atlas:scroll', { detail: { progress: .6 } }));
  assert.equal(h.draws(), before + 1);
  assert.equal(h.uniforms.get('u_phase'), .6);
  assert.equal(h.frames.size, 0);
  stale(500);
  assert.equal(h.draws(), before + 1, 'already queued old callbacks cannot repaint');
  h.stage.dispatchEvent(h.event('atlas:scroll', { detail: { progress: NaN } }));
  assert.equal(h.draws(), before + 1, 'invalid progress leaves the current phase intact');
});

test('pointer interpolation settles within 280 ms and updates the shared projected stage position', () => {
  const h = harness({ width: 1440 }); h.enter();
  const original = h.stage.projectStep(1);
  for (let index = 0; index < 30; index++) {
    h.stage.dispatchEvent(h.event('pointermove', { pointerType: 'mouse', clientX: 1400, clientY: 10 }));
  }
  assert.equal(h.frames.size, 1, 'pointer events share one pending frame');
  assert.ok(h.settle() <= 18);
  assert.notDeepEqual(h.stage.projectStep(1), original);
  const before = h.draws();
  h.frame(1000);
  assert.equal(h.draws(), before);
  h.stage.dispatchEvent(h.event('pointerleave'));
  assert.ok(h.settle() <= 18);
  assert.deepEqual(h.stage.projectStep(1), original);
});

test('witness pulse lasts at most 360 ms plus one refresh and never starts an idle phase loop', () => {
  const h = harness(); h.enter();
  h.stage.dispatchEvent(h.event('atlas:witness'));
  assert.ok(h.settle() <= 23);
  assert.equal(h.uniforms.get('u_phase'), 1);
  const before = h.draws();
  for (let index = 0; index < 60; index++) h.frame();
  assert.equal(h.draws(), before);
});

test('pause, reduced motion, hidden, offscreen, foreground and pagehide cancel without restarting on resume', () => {
  for (const reason of ['paused', 'reduced', 'hidden', 'offscreen', 'foreground', 'pagehide']) {
    const h = harness(); h.enter();
    h.stage.dispatchEvent(h.event('atlas:witness'));
    const stale = [...h.frames.values()][0];
    if (reason === 'paused') { h.classes.add('motion-paused'); h.mutations[0](); }
    if (reason === 'reduced') { h.reduced.matches = true; h.reduced.dispatchEvent(h.event('change')); }
    if (reason === 'hidden') { h.doc.hidden = true; h.doc.dispatchEvent(h.event('visibilitychange')); }
    if (reason === 'offscreen') h.intersections[1].callback([{ isIntersecting: false }]);
    if (reason === 'foreground') { h.attributes.add('data-alive-busy'); h.doc.dispatchEvent(h.event('atlas:foreground')); }
    if (reason === 'pagehide') h.win.dispatchEvent(h.event('pagehide'));
    assert.equal(h.frames.size, 0, reason);
    const before = h.draws();
    stale(600);
    assert.equal(h.draws(), before, `${reason} invalidates queued callbacks`);
    h.classes.clear(); h.reduced.matches = false; h.doc.hidden = false; h.attributes.clear();
    h.win.dispatchEvent(h.event('pageshow'));
    h.intersections[1].callback([{ isIntersecting: true }]);
    assert.equal(h.frames.size, 0, `${reason} resume leaves a still frame`);
  }
});

test('open sheet freezes pointer tilt while step changes still draw the selected marker', () => {
  const h = harness(); h.enter();
  h.stage.dispatchEvent(h.event('pointermove', { pointerType: 'mouse', clientX: 380, clientY: 10 }));
  h.frame();
  h.stage.dataset.sheetOpen = 'true';
  h.stage.dataset.step = '4';
  h.stage.dispatchEvent(h.event('stepchange'));
  assert.equal(h.frames.size, 0);
  const point = h.stage.projectStep(4);
  const before = h.draws();
  h.stage.dispatchEvent(h.event('pointermove', { pointerType: 'mouse', clientX: 10, clientY: 190 }));
  h.frame();
  assert.equal(h.draws(), before);
  assert.deepEqual(h.stage.projectStep(4), point);
  assert.equal(h.uniforms.get('u_step'), 4 / 6);
});

test('mobile uses one device pixel per CSS pixel; desktop stays below 1.6 DPR', () => {
  for (const [width, ratio] of [[390, 1], [700, 1], [1440, 1.6]]) {
    const h = harness({ width, dpr: 3 }); h.enter();
    assert.equal(h.canvas.width, Math.round(width * ratio));
    assert.equal(h.canvas.height, Math.round(210 * ratio));
    const before = h.draws();
    h.intersections[1].callback([{ isIntersecting: false }]);
    h.resizes[0]();
    assert.equal(h.draws(), before, 'offscreen resize performs no GPU draw');
  }
});

test('context loss keeps the vector fallback and cannot restart GPU work', () => {
  const h = harness(); h.enter();
  h.stage.dispatchEvent(h.event('atlas:witness'));
  h.canvas.dispatchEvent(h.event('webglcontextlost'));
  assert.equal(h.frames.size, 0);
  assert.equal(h.stageClasses.has('webgl-ready'), false);
  const before = h.draws();
  h.stage.dispatchEvent(h.event('atlas:witness'));
  h.stage.dispatchEvent(h.event('stepchange'));
  h.resizes[0]();
  h.frame();
  assert.equal(h.draws(), before);
  const denied = harness({ contextAvailable: false }); denied.enter();
  assert.equal(denied.stageClasses.has('webgl-ready'), false);
  assert.deepEqual(denied.stage.projectStep(0), projectLoop(0, 390, 210));
});
