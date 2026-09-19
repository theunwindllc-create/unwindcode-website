import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import config, { publishedSocialPackets } from '../vite.config.js';

test('production HTML inputs exclude creator packets and duplicate public-directory routes', () => {
  const inputs = Object.values(config.build.rollupOptions.input).map(path => relative(process.cwd(), path));
  assert.ok(inputs.includes('index.html'));
  assert.ok(inputs.includes('organisms/visual-cortex/index.html'));
  assert.ok(inputs.includes('transmissions/35-the-ledger-learned-to-be-witnessed.html'));
  for (const path of inputs) {
    assert.doesNotMatch(path, /^(?:social|social 2|public|assets|docs|artifacts|scripts|tests)\//, path);
  }
});

test('build does not copy creator packets but preserves publicly linked proof specifications', () => {
  const source = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /resolve\(__dirname, ['"]social['"]\)/);
  assert.deepEqual(publishedSocialPackets, ['transmission-25-homepage-pulse-carousel', 'transmission-27-quotation-cell']);
  assert.match(source, /['"]dist\/assets\/social['"]/);
  assert.match(source, /['"]dist\/assets\/specs['"]/);
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts.build, 'vite build && node scripts/apply-atlas-shell.mjs && node scripts/promote-lab-homepage.mjs');
});

test('discovery files are served from the active public copies without creator-packet advertising', () => {
  const source = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
  for (const name of ['sitemap.xml', 'llms.txt', 'ai-services.json']) {
    assert.ok(source.includes(`resolve(__dirname, 'public', '${name}')`));
    const contents = readFileSync(new URL(`../public/${name}`, import.meta.url), 'utf8');
    assert.doesNotMatch(contents, /(?:https:\/\/www\.unwindcode\.ai)?\/social\//);
  }
});
