/* Shared with the WebGL vertex projection; coordinates are CSS pixels. */
export const curve = t => [1.63 * Math.cos(t), .65 * Math.sin(2 * t), .3 * Math.sin(t)];
export function projectLoop(step, width, height, tiltX = -.1, tiltY = .19) {
  const [x, y, z] = curve(step / 6 * Math.PI * 2);
  const yy = y * Math.cos(tiltY) - z * Math.sin(tiltY);
  const zz = y * Math.sin(tiltY) + z * Math.cos(tiltY);
  const xx = x * Math.cos(tiltX) + zz * Math.sin(tiltX);
  const depth = -x * Math.sin(tiltX) + zz * Math.cos(tiltX);
  const perspective = 3.6 / (3.6 - depth);
  return { x: (1 + xx * perspective / Math.max(2.08, width / height)) * width / 2,
    y: (1 - yy * perspective) * height / 2 };
}
