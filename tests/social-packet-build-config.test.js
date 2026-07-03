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
  const captionTxt = await readFile(new URL(`${packetRoot}/caption.txt`, ROOT), 'utf8');
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
  assert.match(captionTxt, /Agent-readable does not mean agent-authorized/i);
  assert.match(captionTxt, /Manual posting boundary/i);
  assert.equal(captionTxt.startsWith('#'), false, 'plain caption should be copy/paste text, not markdown');
  assert.match(readme, /Caption source: .*caption\.md/);
  assert.match(readme, /Caption copy\/paste: .*caption\.txt/);
  assert.match(readme, /render-carousel\.sh social\/transmission-29-agent-readable-organism-carousel 6/);

  for (const slide of ['01', '02', '03', '04', '05', '06']) {
    await assertFileExists(`${packetRoot}/exports/slide-${slide}.png`);
    await assertFileExists(`${packetRoot}/previews/slide-${slide}-preview.png`);
    await assertFileExists(`${packetRoot}/ready-to-upload/${slide}-agent-readable-organism.png`);
  }

  await assertFileExists(`${packetRoot}/downloads/transmission-29-agent-readable-organism-carousel.zip`);
});

test('operator readiness layer internal carousel is prepared for creator handoff', async () => {
  const packetRoot = 'social/transmission-30-operator-readiness-layer-carousel';
  const carousel = await readFile(new URL(`${packetRoot}/carousel.html`, ROOT), 'utf8');
  const caption = await readFile(new URL(`${packetRoot}/caption.md`, ROOT), 'utf8');
  const captionTxt = await readFile(new URL(`${packetRoot}/caption.txt`, ROOT), 'utf8');
  const readme = await readFile(new URL(`${packetRoot}/README.md`, ROOT), 'utf8');

  assert.match(carousel, /Readiness before <span class="gold">authority<\/span>/i);
  assert.match(carousel, /The signal passed because the work is <span class="cyan">verifiable<\/span>/i);
  assert.match(carousel, /six organs/i);
  assert.match(carousel, /inspect.*ask.*receipt/i);
  assert.match(carousel, /False autonomy/i);
  assert.match(carousel, /Operator Readiness Cell/i);
  assert.match(carousel, /<span class="green">Ready<\/span> does not mean allowed/i);
  assert.match(carousel, /Next-cell memory/i);
  assert.equal([...carousel.matchAll(/class="slide"/g)].length, 8);

  assert.match(caption, /Operator Readiness Layer/i);
  assert.match(caption, /Manual posting boundary/i);
  assert.match(caption, /does not authorize automated posting, deployment, wallet activity/i);
  assert.match(caption, /content-free operator surface/i);
  assert.match(captionTxt, /Operator Readiness Layer/i);
  assert.match(captionTxt, /Manual posting boundary/i);
  assert.equal(captionTxt.startsWith('#'), false, 'plain caption should be copy/paste text, not markdown');
  assert.match(readme, /Caption source: .*caption\.md/);
  assert.match(readme, /Caption copy\/paste: .*caption\.txt/);
  assert.match(readme, /render-carousel\.sh social\/transmission-30-operator-readiness-layer-carousel 8/);

  for (const slide of ['01', '02', '03', '04', '05', '06', '07', '08']) {
    await assertFileExists(`${packetRoot}/exports/slide-${slide}.png`);
    await assertFileExists(`${packetRoot}/previews/slide-${slide}-preview.png`);
    await assertFileExists(`${packetRoot}/ready-to-upload/${slide}-operator-readiness-layer.png`);
  }

  await assertFileExists(`${packetRoot}/downloads/transmission-30-operator-readiness-layer-carousel.zip`);
});

test('active source-of-truth gate internal carousel is prepared for creator handoff', async () => {
  const packetRoot = 'social/transmission-31-active-source-of-truth-gate-carousel';
  const carousel = await readFile(new URL(`${packetRoot}/carousel.html`, ROOT), 'utf8');
  const caption = await readFile(new URL(`${packetRoot}/caption.md`, ROOT), 'utf8');
  const captionTxt = await readFile(new URL(`${packetRoot}/caption.txt`, ROOT), 'utf8');
  const readme = await readFile(new URL(`${packetRoot}/README.md`, ROOT), 'utf8');

  assert.match(carousel, /<span class="cyan">Ready<\/span> is not live truth/i);
  assert.match(carousel, /which body/i);
  assert.match(carousel, /five <span class="cyan">truth surfaces<\/span>/i);
  assert.match(carousel, /Inspect\. Compare\. Verify\./i);
  assert.match(carousel, /identity failures/i);
  assert.match(carousel, /Release Identity Controller/i);
  assert.match(carousel, /Proof opens clarity/i);
  assert.match(carousel, /Know which body you are writing into/i);
  assert.equal([...carousel.matchAll(/class="slide"/g)].length, 8);

  assert.match(caption, /Active Source-of-Truth Gate/i);
  assert.match(caption, /Manual posting boundary/i);
  assert.match(caption, /does not authorize automated posting, deployment, aliasing/i);
  assert.match(caption, /Release Identity Controller/i);
  assert.match(captionTxt, /Active Source-of-Truth Gate/i);
  assert.match(captionTxt, /Manual posting boundary/i);
  assert.equal(captionTxt.startsWith('#'), false, 'plain caption should be copy/paste text, not markdown');
  assert.match(readme, /Caption source: .*caption\.md/);
  assert.match(readme, /Caption copy\/paste: .*caption\.txt/);
  assert.match(readme, /render-carousel\.sh social\/transmission-31-active-source-of-truth-gate-carousel 8/);

  for (const slide of ['01', '02', '03', '04', '05', '06', '07', '08']) {
    await assertFileExists(`${packetRoot}/exports/slide-${slide}.png`);
    await assertFileExists(`${packetRoot}/previews/slide-${slide}-preview.png`);
    await assertFileExists(`${packetRoot}/ready-to-upload/${slide}-active-source-of-truth-gate.png`);
  }

  await assertFileExists(`${packetRoot}/downloads/transmission-31-active-source-of-truth-gate-carousel.zip`);
});
