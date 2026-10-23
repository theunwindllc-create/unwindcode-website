/* A visitor-driven frame renderer. No animation clock, autoplay or eager frame list. */
const clamp = value => Math.max(0, Math.min(1, value));
const localPath = value => typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');
const limits = {
  mobile: { frames: 24, width: 640, height: 426, bytes: 1024 * 1024, cache: 4 },
  desktop: { frames: 36, width: 960, height: 640, bytes: 2 * 1024 * 1024, cache: 6 },
};

function rendition(manifest, name) {
  const item = manifest?.version === 1 && manifest.variants?.[name];
  const limit = limits[name];
  if (!item || !localPath(item.base) || item.extension !== '.webp' ||
      !Number.isInteger(item.frameCount) || item.frameCount < 2 || item.frameCount > limit.frames ||
      !Number.isInteger(item.width) || item.width < 1 || item.width > limit.width ||
      !Number.isInteger(item.height) || item.height < 1 || item.height > limit.height ||
      !Number.isInteger(item.bytes) || item.bytes < 1 || item.bytes > limit.bytes) {
    throw new Error('Invalid cinematic rendition');
  }
  return item;
}

export function createScrollCinema({ hero, allowed = () => true, manifestUrl, compact } = {}) {
  const doc = hero?.ownerDocument;
  const win = doc?.defaultView;
  const art = hero?.classList?.contains('hero-art') ? hero : hero?.querySelector('.hero-art');
  // Eligibility follows the actual pixels, even while the hero caption is still visible.
  const anchor = art || hero;
  const reduced = win?.matchMedia?.('(prefers-reduced-motion: reduce)');
  const connection = win?.navigator?.connection;
  let canvas, context;
  try {
    canvas = doc?.createElement('canvas');
    context = canvas?.getContext('2d', { alpha: false });
  } catch { /* A denied canvas context leaves the original responsive image intact. */ }
  const cache = new Map();
  const cleanups = [];
  let destroyed = false, failed = false, armed = false, pageActive = true;
  let manifest = null, progress = 0, epoch = 0, worker = null, request = null;
  let displayed = -1, cacheHighWater = 0, decoded = 0, draws = 0;
  let intersection = true;

  function chooseVariant() {
    const small = typeof compact === 'function' ? compact() : compact?.matches ?? compact;
    return small || (win?.innerWidth || 0) <= 700 ||
      (win?.navigator?.deviceMemory > 0 && win.navigator.deviceMemory <= 4) || !connection
      ? 'mobile' : 'desktop';
  }
  let variant = chooseVariant();

  function policyAllows() {
    return !destroyed && !failed && pageActive && !doc.hidden &&
      !reduced?.matches && !connection?.saveData &&
      !['slow-2g', '2g'].includes(connection?.effectiveType) && allowed();
  }
  function visible() {
    if (!intersection) return false;
    const box = anchor.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && box.bottom > 0 &&
      box.top < win.innerHeight && box.right > 0 && box.left < win.innerWidth;
  }
  const target = () => manifest ? Math.round(progress * (manifest.variants[variant].frameCount - 1)) : -1;
  const running = () => armed && policyAllows() && visible();
  const current = ticket => ticket === epoch && running();
  function close(bitmap) { bitmap.close?.(); }
  function release() {
    cache.forEach(close);
    cache.clear();
  }
  function brake() {
    armed = false;
    epoch++;
    request?.abort();
    release();
    displayed = -1;
    if (canvas) {
      canvas.hidden = true;
      // Return the backing store as well as the decoded cache while offscreen.
      canvas.width = canvas.height = 1;
    }
    art?.removeAttribute('data-cinema-ready');
  }
  function fail() { brake(); failed = true; }
  function refreshVariant() {
    const next = chooseVariant();
    if (next === variant) return false;
    brake();
    variant = next;
    return true;
  }
  function evict() {
    const oldest = cache.keys().next().value;
    close(cache.get(oldest));
    cache.delete(oldest);
  }
  function paint(bitmap, index, ticket) {
    if (!current(ticket) || index !== target()) return;
    const item = manifest.variants[variant];
    if (canvas.width !== item.width) canvas.width = item.width;
    if (canvas.height !== item.height) canvas.height = item.height;
    context.drawImage(bitmap, 0, 0, item.width, item.height);
    displayed = index;
    draws++;
    canvas.hidden = false;
    art.setAttribute('data-cinema-ready', 'true');
  }
  function paintCached() {
    const index = target();
    const bitmap = cache.get(index);
    if (!bitmap) return false;
    cache.delete(index);
    cache.set(index, bitmap);
    if (displayed !== index) paint(bitmap, index, epoch);
    return true;
  }

  async function load(ticket) {
    const controller = new win.AbortController();
    request = controller;
    const options = { signal: controller.signal, credentials: 'omit', mode: 'same-origin' };
    let bitmap = null;
    try {
      if (!manifest) {
        const response = await win.fetch(manifestUrl, options);
        if (!current(ticket)) return;
        if (!response.ok) throw new Error('Cinematic manifest unavailable');
        const parsed = await response.json();
        if (!current(ticket)) return;
        // Validate both paths once so a later resize cannot escape the media budget.
        rendition(parsed, 'mobile');
        rendition(parsed, 'desktop');
        manifest = parsed;
      }
      if (!current(ticket) || paintCached()) return;
      const item = manifest.variants[variant];
      const index = target();
      const url = `${item.base}${String(index).padStart(3, '0')}${item.extension}`;
      const response = await win.fetch(url, options);
      if (!current(ticket)) return;
      if (!response.ok) throw new Error('Cinematic frame unavailable');
      const blob = await response.blob();
      if (!current(ticket) || index !== target()) return;
      // Make room before decoding: cache + the pending decoded bitmap stays within the cap.
      while (cache.size >= limits[variant].cache) evict();
      bitmap = await win.createImageBitmap(blob, { resizeWidth: item.width, resizeHeight: item.height });
      decoded++;
      if (!current(ticket) || index !== target()) return;
      cache.set(index, bitmap);
      cacheHighWater = Math.max(cacheHighWater, cache.size);
      bitmap = null; // Cache now owns its lifetime.
      paint(cache.get(index), index, ticket);
    } catch {
      // Our aborts always advance epoch first. Any failure in this epoch is terminal.
      if (ticket === epoch && !destroyed) fail();
    } finally {
      if (bitmap) close(bitmap);
      if (request === controller) request = null;
    }
  }
  function pump() {
    if (worker || !running()) return;
    // Only this worker may fetch/decode; cancellation never starts a second decoder.
    worker = load(epoch).finally(() => {
      worker = null;
      if (running() && displayed !== target()) pump();
    });
  }
  function sample(value, intent = false) {
    if (destroyed || failed) return;
    if (refreshVariant()) return;
    if (!policyAllows() || !visible()) { brake(); return; }
    if (!Number.isFinite(value)) return;
    progress = clamp(value);
    if (progress <= .01) { brake(); return; }
    if (intent) armed = true;
    if (!armed) return;
    try {
      if (!paintCached()) pump();
    } catch { fail(); }
  }
  function listen(subject, event, callback) {
    subject?.addEventListener?.(event, callback);
    cleanups.push(() => subject?.removeEventListener?.(event, callback));
  }
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    brake();
    cleanups.forEach(cleanup => cleanup());
    canvas?.remove();
  }
  const controller = {
    sample, brake, destroy,
    get metrics() {
      return { variant, active: armed, loading: Boolean(worker), failed, destroyed,
        displayed, cached: cache.size, cacheHighWater, decoded, draws };
    },
  };
  if (!art || !context || !win?.fetch || !win?.createImageBitmap || !win?.AbortController || !localPath(manifestUrl)) {
    failed = true;
    return controller;
  }
  canvas.className = 'scroll-cinema';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.hidden = true;
  canvas.width = canvas.height = 1;
  art.append(canvas);
  listen(win, 'resize', () => { if (!refreshVariant() && !visible()) brake(); });
  listen(doc, 'visibilitychange', () => { if (doc.hidden) brake(); });
  listen(win, 'pagehide', () => { pageActive = false; brake(); });
  listen(win, 'pageshow', () => { pageActive = true; });
  listen(reduced, 'change', () => { if (reduced.matches) brake(); });
  listen(connection, 'change', () => { if (!policyAllows() || refreshVariant()) brake(); });
  if (win.IntersectionObserver) {
    const observer = new win.IntersectionObserver(entries => {
      const entry = entries.find(item => item.target === anchor);
      if (!entry) return;
      intersection = entry.isIntersecting;
      if (!intersection) brake();
    });
    observer.observe(anchor);
    cleanups.push(() => observer.disconnect());
  }
  return controller;
}
