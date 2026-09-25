/* One finite animation owns the foreground. No timer or idle frame loop. */
export function createMotionArbiter(allowed, report = () => {}) {
  let current = null;
  function cancel() {
    const old = current;
    current = null;
    if (old) { old.animation.cancel(); old.finish?.(); }
    report(false);
  }
  function play(element, frames, duration, { priority = 0, finish } = {}) {
    if (current && current.priority > priority) { finish?.(); return null; }
    cancel();
    if (!allowed() || !element?.animate) { finish?.(); return null; }
    const animation = element.animate(frames, {
      duration, iterations: 1, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'none',
    });
    const item = { animation, priority, finish };
    current = item;
    report(true);
    animation.onfinish = () => {
      if (current !== item) return;
      current = null;
      animation.cancel();
      report(false);
      finish?.();
    };
    return animation;
  }
  return { play, cancel, get active() { return current !== null; } };
}

// Future media must use the same brake. This pass deliberately ships no video.
export function syncVideos(videos, allowed) {
  let playing = false;
  for (const video of videos) {
    if (!allowed || playing || video.dataset.inView !== 'true') video.pause();
    else { playing = true; video.play()?.catch(() => {}); }
  }
}
