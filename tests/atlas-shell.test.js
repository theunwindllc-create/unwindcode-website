import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { enhanceHtml, publicRoutes, cellAssets } from '../scripts/apply-atlas-shell.mjs';

test('Atlas public allowlist is unique, local and excludes internal artifacts', () => {
  assert.equal(publicRoutes.length, new Set(publicRoutes).size);
  for (const route of publicRoutes) {
    assert.match(route, /^\/(lab|home|architecture|philosophy|vision|build-with-us|organisms|proof|transmissions)(\/|$)/);
    const file = route === '/lab' ? 'public/lab/index.html' : [`.${route}.html`, `.${route}/index.html`].find(existsSync);
    assert.ok(file, route);
    const html = readFileSync(file, 'utf8');
    const enhanced = enhanceHtml(html, route);
    assert.equal((enhanced.match(/data-atlas-shell="v2"/g) || []).length, 1);
    assert.equal((enhanced.match(/src="\/atlas\/brain.js"/g) || []).length, 1);
    assert.equal(enhanceHtml(enhanced, route), enhanced, 'idempotent');
    assert.equal((html.match(/<h1\b/g) || []).length, (enhanced.match(/<h1\b/g) || []).length);
  }
  for (const internal of ['/social', '/assets/specs/example', '/api/chat', '/arbitrary']) {
    const input = '<html><head></head><body>Private creator artifact</body></html>';
    assert.equal(enhanceHtml(input, internal), input);
  }
});

test('each cell receives its own artwork while retaining authored page copy', () => {
  for (const [cell, {asset}] of Object.entries(cellAssets)) {
    const route = `/organisms/${cell}`;
    const input = readFileSync(`.${route}/index.html`, 'utf8');
    const html = enhanceHtml(input, route);
    assert.ok(html.includes(`data-atlas-cell="${cell}"`));
    assert.ok(html.includes(`${asset}-1536.webp`));
    assert.ok(html.includes('CONCEPTUAL STUDY'));
    for (const width of [480,960,1536]) assert.ok(existsSync(`public/lab/media/atlas/${asset}-${width}.webp`));
    assert.equal(html.match(/<h1[^>]*>[\s\S]*?<\/h1>/)[0], input.match(/<h1[^>]*>[\s\S]*?<\/h1>/)[0]);
  }
});

test('archive counts derive from the registry rather than numbering', () => {
  const {transmissions} = JSON.parse(readFileSync('public/data/transmissions.json', 'utf8'));
  const html = enhanceHtml(readFileSync('transmissions/index.html','utf8'), '/transmissions');
  assert.ok(html.includes(`<p class="tx-index-standard"><span>${transmissions.length}</span>`));
  assert.ok(html.includes(`<dt>${transmissions.length}</dt>`));
});
