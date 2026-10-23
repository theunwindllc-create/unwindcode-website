import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import { createScrollCinema } from '../public/lab/scroll-cinema.js';

const manifestUrl = '/lab/media/atlas/scroll/infinity-v1/manifest.json';
const manifest = {
  version: 1,
  variants: {
    mobile: { width: 640, height: 360, frameCount: 24, base: '/lab/media/atlas/scroll/infinity-v1/mobile/frame-', extension: '.webp', bytes: 800000 },
    desktop: { width: 960, height: 540, frameCount: 36, base: '/lab/media/atlas/scroll/infinity-v1/desktop/frame-', extension: '.webp', bytes: 1500000 },
  },
};
const tick = () => new Promise(resolve => setImmediate(resolve));
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function harness(options = {}) {
  const win = new EventTarget(), doc = new EventTarget(), reduced = new EventTarget();
  reduced.matches = options.reduced || false;
  const connection = Object.assign(new EventTarget(), { saveData: false, effectiveType: '4g' }, options.connection);
  const requests = [], decodes = [], bitmaps = [], painted = [], observers = [];
  let allowed = true, drawingFails = false, inFlight = 0, maxInFlight = 0;
  const box = { top: 0, bottom: 800, left: 0, right: 400, width: 400, height: 800 };
  const attributes = new Map();
  const canvas = {
    hidden: false, width: 0, height: 0, removed: false,
    setAttribute(name, value) { attributes.set(name, value); },
    remove() { this.removed = true; },
    getContext() { return { drawImage(bitmap, ...size) {
      if (drawingFails) throw new Error('Canvas lost');
      painted.push({ bitmap, size });
    } }; },
  };
  const artAttrs = new Map();
  const hero = {
    ownerDocument: doc, classList: { contains: name => name === 'hero-art' },
    closest: () => hero, getBoundingClientRect: () => box,
    setAttribute: (name, value) => artAttrs.set(name, value),
    removeAttribute: name => artAttrs.delete(name),
    append: node => { assert.equal(node, canvas); },
  };
  Object.assign(doc, { defaultView: win, hidden: false, createElement: () => canvas });
  Object.assign(win, {
    innerWidth: options.width ?? 390, innerHeight: 900,
    navigator: { deviceMemory: options.memory ?? 8, ...(options.unknownNetwork ? {} : { connection }) },
    AbortController, matchMedia: () => reduced,
    fetch(url, init) {
      const item = { ...deferred(), url, signal: init.signal, init };
      requests.push(item);
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      return item.promise.finally(() => { inFlight--; });
    },
    createImageBitmap(blob, size) {
      const item = { ...deferred(), blob, size };
      decodes.push(item);
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      return item.promise.finally(() => { inFlight--; });
    },
    IntersectionObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe(target) { this.target = target; }
      disconnect() { this.disconnected = true; }
    },
  });
  function resolveRequest(index = requests.length - 1, value = manifest) {
    requests[index].resolve({ ok: true, json: async () => value, blob: async () => ({ request: index }) });
  }
  function resolveDecode(index = decodes.length - 1) {
    const bitmap = { id: index, closed: 0, close() { this.closed++; } };
    bitmaps.push(bitmap);
    decodes[index].resolve(bitmap);
    return bitmap;
  }
  const cinema = createScrollCinema({ hero, allowed: () => allowed, manifestUrl, compact: options.compact });
  return { cinema, win, doc, hero, box, reduced, connection, requests, decodes, bitmaps, painted, canvas,
    artAttrs, attributes, observers, resolveRequest, resolveDecode,
    allow: value => { allowed = value; }, failDrawing: () => { drawingFails = true; },
    maxInFlight: () => maxInFlight,
    async firstFrame(progress = .5) {
      cinema.sample(progress, true);
      resolveRequest(); await tick();
      resolveRequest(); await tick();
      resolveDecode(); await tick();
    },
    async frame(progress) {
      const before = requests.length;
      cinema.sample(progress, true);
      if (requests.length > before) {
        resolveRequest(); await tick();
        resolveDecode(); await tick();
      }
    },
  };
}

test('cinema starts only after visible eligible scroll intent beyond the hero threshold', async () => {
  const h = harness();
  assert.equal(h.canvas.hidden, true);
  assert.equal(h.attributes.get('aria-hidden'), 'true');
  h.cinema.sample(.5);
  h.cinema.sample(.01, true);
  h.box.top = 1000; h.box.bottom = 1800;
  h.cinema.sample(.5, true);
  assert.equal(h.requests.length, 0);
  h.box.top = 0; h.box.bottom = 800;
  h.cinema.sample(.5);
  assert.equal(h.requests.length, 0, 'offscreen intent cannot arm a future visible sample');
  h.cinema.sample(.5, true);
  assert.equal(h.requests[0].url, manifestUrl);
  assert.equal(h.requests[0].init.mode, 'same-origin');
  assert.equal(h.canvas.hidden, true);
  h.resolveRequest(); await tick();
  assert.match(h.requests[1].url, /mobile\/frame-012.webp$/);
  h.resolveRequest(); await tick();
  assert.equal(h.canvas.hidden, true, 'poster remains until decoding completes');
  h.resolveDecode(); await tick();
  assert.equal(h.canvas.hidden, false);
  assert.equal(h.artAttrs.get('data-cinema-ready'), 'true');
  assert.deepEqual(h.painted[0].size, [0, 0, 640, 360]);
  h.cinema.destroy();
});

test('reduced motion, Save-Data, 2g, slow-2g, hidden and denied motion make zero requests', () => {
  for (const options of [
    { reduced: true }, { connection: { saveData: true } },
    { connection: { effectiveType: '2g' } }, { connection: { effectiveType: 'slow-2g' } },
    { deny: true }, { hidden: true },
  ]) {
    const h = harness(options);
    if (options.deny) h.allow(false);
    if (options.hidden) h.doc.hidden = true;
    h.cinema.sample(.7, true);
    assert.equal(h.requests.length, 0, JSON.stringify(options));
    assert.equal(h.canvas.hidden, true);
    h.cinema.destroy();
  }
});

test('manifest loading coalesces targets and obsolete fetches skip decoding', async () => {
  const h = harness();
  h.cinema.sample(.2, true);
  h.cinema.sample(.4, true);
  h.cinema.sample(.8, true);
  assert.equal(h.requests.length, 1);
  h.resolveRequest(); await tick();
  assert.match(h.requests[1].url, /frame-018.webp$/);
  h.cinema.sample(.3, true);
  h.cinema.sample(.6, true);
  assert.equal(h.requests.length, 2);
  h.resolveRequest(); await tick();
  assert.equal(h.decodes.length, 0, 'obsolete response must not be decoded');
  assert.match(h.requests[2].url, /frame-014.webp$/);
  h.resolveRequest(); await tick();
  h.resolveDecode(); await tick();
  assert.equal(h.cinema.metrics.displayed, 14);
  assert.equal(h.maxInFlight(), 1);
  h.cinema.destroy();
});

test('a superseded decode is closed and cannot paint over the newest reverse scroll target', async () => {
  const h = harness();
  await h.firstFrame(.2);
  h.cinema.sample(.9, true);
  h.resolveRequest(); await tick();
  h.cinema.sample(.4, true);
  assert.equal(h.canvas.hidden, false, 'keep the last valid frame during a miss');
  assert.equal(h.cinema.metrics.displayed, 5);
  const obsolete = h.resolveDecode(); await tick();
  assert.equal(obsolete.closed, 1);
  assert.equal(h.painted.length, 1);
  assert.match(h.requests.at(-1).url, /frame-009.webp$/);
  h.resolveRequest(); await tick();
  h.resolveDecode(); await tick();
  assert.equal(h.cinema.metrics.displayed, 9);
  assert.equal(h.maxInFlight(), 1);
  h.cinema.destroy();
});

test('braking invalidates even uncancelable decoding and resumption waits for fresh intent', async () => {
  const h = harness();
  await h.firstFrame(.2);
  h.cinema.sample(.8, true);
  h.resolveRequest(); await tick();
  h.cinema.brake();
  assert.equal(h.requests.at(-1).signal.aborted, true);
  assert.equal(h.canvas.hidden, true);
  assert.equal(h.canvas.width * h.canvas.height, 1);
  assert.equal(h.artAttrs.has('data-cinema-ready'), false);
  assert.equal(h.bitmaps[0].closed, 1);
  h.cinema.sample(.4);
  const obsolete = h.resolveDecode(); await tick();
  assert.equal(obsolete.closed, 1);
  assert.equal(h.requests.length, 3);
  assert.equal(h.canvas.hidden, true);
  h.cinema.sample(.4, true);
  assert.equal(h.requests.length, 4);
  h.resolveRequest(); await tick();
  h.resolveDecode(); await tick();
  assert.equal(h.cinema.metrics.displayed, 9);
  h.cinema.destroy();
});

test('a fresh intent during cancellation cannot overlap the old in-flight operation', async () => {
  const h = harness();
  await h.firstFrame(.2);
  h.cinema.sample(.8, true);
  h.resolveRequest(); await tick();
  h.cinema.brake();
  h.cinema.sample(.4, true);
  assert.equal(h.requests.length, 3);
  const obsolete = h.resolveDecode(); await tick();
  assert.equal(obsolete.closed, 1);
  assert.equal(h.requests.length, 4);
  h.resolveRequest(); await tick();
  h.resolveDecode(); await tick();
  assert.equal(h.maxInFlight(), 1);
  assert.equal(h.cinema.metrics.displayed, 9);
  h.cinema.destroy();
});

test('LRU cache respects mobile/desktop budgets, reuses frames and closes evictions', async () => {
  for (const [width, cap, count] of [[390, 4, 24], [1440, 6, 36]]) {
    const h = harness({ width });
    await h.firstFrame(2 / (count - 1));
    for (let index = 3; index <= cap + 3; index++) await h.frame(index / (count - 1));
    assert.equal(h.cinema.metrics.cached, cap);
    assert.equal(h.cinema.metrics.cacheHighWater, cap);
    assert.equal(h.bitmaps.filter(bitmap => bitmap.closed === 0).length, cap);
    const before = h.requests.length;
    await h.frame((cap + 2) / (count - 1));
    assert.equal(h.requests.length, before, 'reverse scroll reuses a recent decoded frame');
    assert.equal(h.cinema.metrics.displayed, cap + 2);
    h.cinema.destroy();
    assert.equal(h.bitmaps.every(bitmap => bitmap.closed === 1), true);
  }
});

test('low-memory, compact and unknown-network desktops use the mobile budget', () => {
  for (const options of [{ memory: 4 }, { compact: true }, { compact: { matches: true } }, { unknownNetwork: true }]) {
    const h = harness({ width: 1440, ...options });
    assert.equal(h.cinema.metrics.variant, 'mobile');
    h.cinema.destroy();
  }
});

test('breakpoint resize releases old frames and cannot load the new rendition without intent', async () => {
  const h = harness();
  await h.firstFrame(.5);
  h.win.innerWidth = 1440;
  h.win.dispatchEvent(new Event('resize'));
  assert.equal(h.cinema.metrics.variant, 'desktop');
  assert.equal(h.cinema.metrics.cached, 0);
  assert.equal(h.bitmaps[0].closed, 1);
  assert.equal(h.canvas.hidden, true);
  h.cinema.sample(.5);
  assert.equal(h.requests.length, 2);
  h.cinema.sample(.5, true);
  assert.match(h.requests.at(-1).url, /desktop\/frame-018.webp$/);
  h.resolveRequest(); await tick(); h.resolveDecode(); await tick();
  assert.equal(h.canvas.width, 960);
  assert.equal(h.canvas.height, 540);
  h.cinema.destroy();
});

test('offscreen, hidden, pagehide and policy changes immediately release and restore the poster', async () => {
  for (const cause of ['offscreen', 'hidden', 'pagehide', 'reduced', 'connection']) {
    const h = harness();
    await h.firstFrame();
    if (cause === 'offscreen') h.observers[0].callback([{ target: h.hero, isIntersecting: false }]);
    if (cause === 'hidden') { h.doc.hidden = true; h.doc.dispatchEvent(new Event('visibilitychange')); }
    if (cause === 'pagehide') h.win.dispatchEvent(new Event('pagehide'));
    if (cause === 'reduced') { h.reduced.matches = true; h.reduced.dispatchEvent(new Event('change')); }
    if (cause === 'connection') { h.connection.saveData = true; h.connection.dispatchEvent(new Event('change')); }
    assert.equal(h.canvas.hidden, true, cause);
    assert.equal(h.cinema.metrics.cached, 0, cause);
    assert.equal(h.bitmaps[0].closed, 1, cause);
    h.doc.hidden = h.reduced.matches = h.connection.saveData = false;
    h.win.dispatchEvent(new Event('pageshow'));
    h.observers[0].callback([{ target: h.hero, isIntersecting: true }]);
    h.cinema.sample(.5);
    assert.equal(h.requests.length, 2, 'resume remains still before fresh scroll');
    h.cinema.destroy();
  }
});

test('fetch, decode and draw failures fail once to the poster without a retry loop', async () => {
  for (const cause of ['fetch', 'decode', 'draw', 'unexpected-abort']) {
    const h = harness();
    h.cinema.sample(.5, true);
    h.resolveRequest(); await tick();
    if (cause === 'fetch' || cause === 'unexpected-abort') {
      const error = new Error('Unavailable');
      if (cause === 'unexpected-abort') error.name = 'AbortError';
      h.requests.at(-1).reject(error);
    } else {
      h.resolveRequest(); await tick();
      if (cause === 'decode') h.decodes.at(-1).reject(new Error('Decode failed'));
      else { h.failDrawing(); h.resolveDecode(); }
    }
    await tick();
    assert.equal(h.cinema.metrics.failed, true, cause);
    assert.equal(h.canvas.hidden, true);
    const before = h.requests.length;
    for (let index = 0; index < 10; index++) h.cinema.sample(index / 10, true);
    await tick();
    assert.equal(h.requests.length, before);
    assert.equal(h.cinema.metrics.cached, 0);
    assert.equal(h.bitmaps.every(bitmap => bitmap.closed === 1), true);
    h.cinema.destroy();
  }
});

test('invalid manifest dimensions, frame counts, byte budgets and off-origin paths never fetch a frame', async () => {
  for (const patch of [{ width: 4096 }, { frameCount: 1000 }, { bytes: 9999999 }, { base: '//elsewhere.test/frame-' }]) {
    const h = harness();
    h.cinema.sample(.5, true);
    h.resolveRequest(0, { ...manifest, variants: { ...manifest.variants, mobile: { ...manifest.variants.mobile, ...patch } } });
    await tick();
    assert.equal(h.requests.length, 1);
    assert.equal(h.cinema.metrics.failed, true);
    h.cinema.destroy();
  }
});

test('destroy disconnects observers and a late decode cannot resurrect the canvas', async () => {
  const h = harness();
  h.cinema.sample(.5, true);
  h.resolveRequest(); await tick(); h.resolveRequest(); await tick();
  h.cinema.destroy();
  h.cinema.destroy();
  const bitmap = h.resolveDecode(); await tick();
  assert.equal(bitmap.closed, 1);
  assert.equal(h.canvas.removed, true);
  assert.equal(h.canvas.hidden, true);
  assert.equal(h.observers[0].disconnected, true);
  assert.equal(h.painted.length, 0);
  h.cinema.sample(.8, true);
  h.win.dispatchEvent(new Event('resize'));
  assert.equal(h.requests.length, 2);
});

test('renderer adds no timer, animation frame loop, video decoder or unrestricted DPR allocation', () => {
  const source = readFileSync(new URL('../public/lab/scroll-cinema.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /requestAnimationFrame|setTimeout|setInterval|devicePixelRatio|createElement\(['"]video/);
});

function webpSize(bytes) {
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  assert.equal(bytes.readUInt32LE(4) + 8, bytes.length, 'RIFF size must cover the complete file');
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const type = bytes.toString('ascii', offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const data = offset + 8;
    assert.ok(data + size <= bytes.length, 'WebP chunk cannot extend past the file');
    if (type === 'VP8 ') {
      assert.equal(bytes.toString('hex', data + 3, data + 6), '9d012a', 'Expected a VP8 key frame');
      return [bytes.readUInt16LE(data + 6) & 0x3fff, bytes.readUInt16LE(data + 8) & 0x3fff];
    }
    if (type === 'VP8L') {
      assert.equal(bytes[data], 0x2f);
      const dimensions = bytes.readUInt32LE(data + 1);
      return [(dimensions & 0x3fff) + 1, ((dimensions >>> 14) & 0x3fff) + 1];
    }
    if (type === 'VP8X') {
      assert.equal(bytes[data] & 2, 0, 'Scroll frames must be still images, not animated WebP');
      return [bytes.readUIntLE(data + 4, 3) + 1, bytes.readUIntLE(data + 7, 3) + 1];
    }
    offset = data + size + (size % 2);
  }
  assert.fail('No WebP image dimensions found');
}

test('shipped cinema manifest matches every actual WebP dimension, frame count and byte budget', () => {
  const shipped = JSON.parse(readFileSync(new URL(`../public${manifestUrl}`, import.meta.url), 'utf8'));
  assert.equal(shipped.version, 1);
  for (const [variant, maxFrames, maxWidth, maxHeight, maxBytes] of [
    ['mobile', 24, 640, 426, 1024 * 1024],
    ['desktop', 36, 960, 640, 2 * 1024 * 1024],
  ]) {
    const item = shipped.variants[variant];
    assert.equal(item.base, `/lab/media/atlas/scroll/infinity-v1/${variant}/frame-`);
    assert.equal(item.extension, '.webp');
    assert.ok(Number.isInteger(item.frameCount) && item.frameCount >= 2 && item.frameCount <= maxFrames);
    assert.ok(item.width > 0 && item.width <= maxWidth && item.height > 0 && item.height <= maxHeight);
    const folder = new URL(`../public/lab/media/atlas/scroll/infinity-v1/${variant}/`, import.meta.url);
    const files = readdirSync(folder).filter(file => file.endsWith('.webp')).sort();
    const expected = Array.from({ length: item.frameCount }, (_, index) => `frame-${String(index).padStart(3, '0')}.webp`);
    assert.deepEqual(files, expected, `${variant} contains exactly the contiguous manifest frame range`);
    let bytes = 0;
    for (const file of files) {
      const frame = readFileSync(new URL(file, folder));
      assert.deepEqual(webpSize(frame), [item.width, item.height], `${variant}/${file} dimensions match the manifest`);
      bytes += frame.length;
    }
    assert.equal(bytes, item.bytes, `${variant} encoded byte count matches every shipped frame`);
    assert.ok(bytes <= maxBytes, `${variant} fits its compressed media budget`);
  }
});

test('actual Alive input routing requires a recent input plus scroll, and resize retires stale intent', () => {
  const source = readFileSync(new URL('../public/lab/alive.js', import.meta.url), 'utf8');
  const begin = source.indexOf("window.addEventListener('resize', () => {");
  const end = source.indexOf('\nfunction retire(', begin);
  assert.ok(begin >= 0 && end > begin);
  const win = new EventTarget(), snapshots = [];
  let now = 100;
  const context = vm.createContext({ window: win, snapshots, performance: { now: () => now } });
  vm.runInContext(`
    let inputAt = -Infinity, scrollIntent = false, scrolled = false;
    function scheduleInput() { snapshots.push({ intent: scrollIntent, scrolled }); }
    function refreshDepth() { scheduleInput(); }
    ${source.slice(begin, end)}
  `, context);
  win.dispatchEvent(new Event('pointerdown'));
  assert.equal(snapshots.length, 0, 'a click alone cannot select cinematic frames');
  win.dispatchEvent(new Event('resize'));
  assert.equal(snapshots.at(-1).intent, false, 'layout refresh cannot inherit click intent');
  win.dispatchEvent(new Event('scroll'));
  assert.equal(snapshots.at(-1).intent, false, 'restored or programmatic scrolling after resize stays still');
  win.dispatchEvent(new Event('wheel'));
  win.dispatchEvent(new Event('scroll'));
  assert.equal(snapshots.at(-1).intent, true, 'a scroll immediately following wheel input is intentional');
  now += 1500;
  win.dispatchEvent(new Event('scroll'));
  assert.equal(snapshots.at(-1).intent, false, 'an old gesture cannot authorize later scrolling');
  const key = new Event('keydown'); key.key = 'PageDown';
  win.dispatchEvent(key);
  win.dispatchEvent(new Event('scroll'));
  assert.equal(snapshots.at(-1).intent, true, 'keyboard scrolling is eligible');
});
