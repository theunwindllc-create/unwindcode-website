import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import viteConfig from '../vite.config.js';

const ROOT = new URL('../', import.meta.url);

async function assertFileExists(path) {
  await access(new URL(path, ROOT));
}

test('vite build keeps prepared social packets out of public dist routes', () => {
  const config = typeof viteConfig === 'function'
    ? viteConfig({ command: 'build', mode: 'test' })
    : viteConfig;

  const plugins = Array.isArray(config.plugins) ? config.plugins : [];
  const copyPlugin = plugins.find((plugin) => plugin?.name === 'copy-social-packets-to-dist');

  assert.equal(copyPlugin, undefined, 'Vite should not publish internal social packets as website routes');
});

test('memory control plane internal carousel matches upgraded whitepaper framing', async () => {
  const packetRoot = 'social/transmission-28-memory-control-plane-carousel';
  const carousel = await readFile(new URL(`${packetRoot}/carousel.html`, ROOT), 'utf8');
  const caption = await readFile(new URL(`${packetRoot}/caption.md`, ROOT), 'utf8');
  const readme = await readFile(new URL(`${packetRoot}/README.md`, ROOT), 'utf8');

  assert.match(carousel, /Whitepaper-grade Brain guide/);
  assert.match(carousel, /Memory without governance becomes/i);
  assert.match(carousel, /Six surfaces make recall governable/i);
  assert.match(carousel, /No mutation without receipt/i);
  assert.match(carousel, /Build memory as an approval path/i);
  assert.match(carousel, /The Brain can recommend\. It cannot quietly rewrite itself/i);
  assert.equal([...carousel.matchAll(/class="slide"/g)].length, 6);

  assert.match(caption, /metadata before memory body/i);
  assert.match(caption, /Manual posting boundary/i);
  assert.match(caption, /does not authorize automated posting, memory mutation, deployment/i);
  assert.match(readme, /render-carousel\.sh social\/transmission-28-memory-control-plane-carousel 6/);

  for (const slide of ['01', '02', '03', '04', '05', '06']) {
    await assertFileExists(`${packetRoot}/exports/slide-${slide}.png`);
    await assertFileExists(`${packetRoot}/previews/slide-${slide}-preview.png`);
    await assertFileExists(`${packetRoot}/ready-to-upload/${slide}-memory-control-plane.png`);
  }

  await assertFileExists(`${packetRoot}/downloads/transmission-28-memory-control-plane-carousel.zip`);
});

test('agent-readable organism internal carousel is prepared for creator handoff', async () => {
  const packetRoot = 'social/transmission-29-agent-readable-organism-carousel';
  const carousel = await readFile(new URL(`${packetRoot}/carousel.html`, ROOT), 'utf8');
  const caption = await readFile(new URL(`${packetRoot}/caption.md`, ROOT), 'utf8');
  const readme = await readFile(new URL(`${packetRoot}/README.md`, ROOT), 'utf8');

  assert.match(carousel, /agent-readable contract/i);
  assert.match(carousel, /model choice.*harness choice/i);
  assert.match(carousel, /Grounding packet/i);
  assert.match(carousel, /Agent Contract Protocol/i);
  assert.match(carousel, /public text becomes private permission/i);
  assert.match(carousel, /Agent Readiness Cell/i);
  assert.match(carousel, /Manual posting only/i);
  assert.equal([...carousel.matchAll(/class="slide"/g)].length, 6);

  assert.match(caption, /Agent-readable does not mean agent-authorized/i);
  assert.match(caption, /Manual posting boundary/i);
  assert.match(caption, /does not authorize automated posting, deployment, wallet activity/i);
  assert.match(readme, /render-carousel\.sh social\/transmission-29-agent-readable-organism-carousel 6/);

  for (const slide of ['01', '02', '03', '04', '05', '06']) {
    await assertFileExists(`${packetRoot}/exports/slide-${slide}.png`);
    await assertFileExists(`${packetRoot}/previews/slide-${slide}-preview.png`);
    await assertFileExists(`${packetRoot}/ready-to-upload/${slide}-agent-readable-organism.png`);
  }

  await assertFileExists(`${packetRoot}/downloads/transmission-29-agent-readable-organism-carousel.zip`);
});
