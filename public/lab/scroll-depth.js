/* Visitor-driven depth. No clock, scroll interception, media or private state. */
const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => value * value * (3 - 2 * value);

export function createScrollDepth(doc = document) {
  const scenes = [...doc.querySelectorAll('[data-alive-art], .anatomy-art')].map(element => ({
    element,
    kind: element.classList.contains('hero-art') ? 'hero'
      : element.classList.contains('anatomy-art') ? 'anatomy' : 'specimen',
    anchor: element.closest('.hero') || element,
  }));
  const properties = ['--scene-y', '--scene-scale', '--scene-turn'];
  return {
    sample(height = innerHeight, width = innerWidth) {
      const compact = width <= 700;
      // Read stable container geometry before any style writes; never measure a moving image.
      const measurements = scenes.map(scene => ({ ...scene, box: scene.anchor.getBoundingClientRect() }));
      for (const { element, kind, box } of measurements) {
        if (!box.height || box.bottom <= 0 || box.top >= height) continue;
        const progress = ease(clamp((height - box.top) / (height + box.height)));
        const signed = progress * 2 - 1;
        const exit = ease(clamp(-box.top / box.height));
        const y = kind === 'hero' ? exit * (compact ? 12 : 44)
          : signed * (kind === 'anatomy' ? (compact ? 10 : 24) : (compact ? 8 : 16));
        const scale = kind === 'hero' ? 1 + exit * (compact ? .015 : .03) : 1;
        const values = [`${y.toFixed(2)}px`, scale.toFixed(4), `${(signed * 6).toFixed(2)}deg`];
        properties.forEach((property, index) => {
          if (element.style.getPropertyValue(property) !== values[index]) element.style.setProperty(property, values[index]);
        });
      }
    },
    reset() { scenes.forEach(({ element }) => properties.forEach(property => element.style.removeProperty(property))); },
  };
}
