import test from 'node:test';
import assert from 'node:assert/strict';
import { curve, projectLoop } from '../public/lab/loop-geometry.js';

test('six stage coordinates project the same lemniscate used by the renderer', () => {
  for (let step = 0; step < 6; step++) {
    const [x,y,z] = curve(step / 6 * Math.PI * 2);
    const actual = projectLoop(step, 1200, 540, 0, 0);
    const perspective = 3.6 / (3.6-z);
    assert.ok(Math.abs(actual.x - (1+x*perspective/(1200/540))*600)<1e-9);
    assert.ok(Math.abs(actual.y - (1-y*perspective)*270)<1e-9);
  }
});

test('stage projection remains in bounds through desktop and mobile aspect floors and pointer tilt', () => {
  for (const [width,height] of [[1268,540],[786,540],[400,270],[320,270]]) {
    const points = Array.from({length:6}, (_,i)=>projectLoop(i,width,height));
    assert.equal(new Set(points.map(p=>`${p.x},${p.y}`)).size,6);
    for (const tiltX of [-.3,-.1,.1]) for (const tiltY of [.05,.19,.33]) {
      for (let step=0;step<6;step++) {
        const p = projectLoop(step,width,height,tiltX,tiltY);
        assert.ok(p.x>0 && p.x<width && p.y>0 && p.y<height);
      }
    }
    assert.ok(points[0].x>width/2 && points[3].x<width/2);
  }
});
