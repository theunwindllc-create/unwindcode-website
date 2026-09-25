/* One finite job owns the foreground: at most two WAAPI targets, one bounded sampler. */
export function createMotionArbiter(allowed, report = () => {}) {
  let current = null;
  function cancel() {
    const old = current;
    current = null;
    if (old) {
      old.animations.forEach(animation => animation.cancel());
      if (old.frame) cancelAnimationFrame(old.frame);
      old.finish?.();
    }
    report(false);
  }
  function play(element, frames, duration, { priority = 0, finish, sample, companion, easing = 'cubic-bezier(.2,.8,.2,1)' } = {}) {
    if (current && current.priority > priority) { finish?.(); return null; }
    cancel();
    if (!allowed() || !element?.animate) { finish?.(); return null; }
    const animation = element.animate(frames, {
      duration, iterations: 1, easing, fill: 'none',
    });
    const animations = [animation];
    if (companion?.element?.animate) animations.push(companion.element.animate(companion.frames, {
      duration, iterations: 1, easing, fill: 'none',
    }));
    const item = { animation, animations, priority, finish, frame: 0 };
    current = item;
    report(true);
    if (sample) {
      sample(0);
      const tick = () => {
        if (current !== item) return;
        sample(Math.min(duration, Number(animation.currentTime) || 0));
        if (current === item && animation.playState !== 'finished') item.frame = requestAnimationFrame(tick);
      };
      item.frame = requestAnimationFrame(tick);
    }
    animation.onfinish = () => {
      if (current !== item) return;
      current = null;
      animations.forEach(active => active.cancel());
      if (item.frame) cancelAnimationFrame(item.frame);
      finish?.();
      report(false);
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
