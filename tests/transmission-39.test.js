import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const id = '39-the-entrance-came-back';
const route = `/transmissions/${id}`;
const canonical = `https://www.unwindcode.ai${route}`;
const latestRoute = '/transmissions/45-where-this-is-going';
const latestCanonical = `https://www.unwindcode.ai${latestRoute}`;
const read = file => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('Transmission 39 has one consistent clean route across article and discovery surfaces', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<title>Transmission 39: The Entrance Came Back \| Unwind Code<\/title>/);
  assert.ok(page.includes(`<link rel="canonical" href="${canonical}"`));
  assert.ok(page.includes(`<meta property="og:url" content="${canonical}"`));
  assert.ok(page.includes(`"mainEntityOfPage": "${canonical}"`));
  assert.equal(page.includes(`${route}.html`), false, 'the article never advertises its own disk filename');
  for (const file of ['sitemap.xml', 'public/sitemap.xml', 'llms.txt', 'public/llms.txt', 'ai-services.json', 'public/ai-services.json']) {
    const text = await read(file);
    assert.ok(text.includes(route), `${file} advertises the new article`);
    assert.equal(text.includes(`${route}.html`), false, `${file} uses the served URL, not its disk filename`);
  }
  for (const file of ['sitemap.xml', 'public/sitemap.xml']) {
    const sitemap = await read(file);
    assert.equal(sitemap.split(`<loc>${canonical}</loc>`).length - 1, 1, `${file} lists the route exactly once`);
  }
});

test('Transmission 39 is dated to the production day it describes and keeps the rebuild honest', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /"datePublished": "2026-11-08"/);
  assert.match(page, /"dateModified": "2026-11-10"/);
  for (const required of [
    'twenty of twenty',
    'called final',
    'Why would we change the original entrance?',
    'Approved elements had no lock',
    'LOCKED list',
    '760 frames',
    '45.2 credits',
    'no more topping up',
  ]) {
    assert.ok(page.includes(required), `Transmission 39 missing: ${required}`);
  }
  assert.equal(/\bposted\b.{0,20}\binstagram\b/i.test(page) && !/not posted/i.test(page), false, 'the reel is never claimed as posted');
  assert.ok(page.includes('Not posted'), 'the article states the reel is not yet posted');
});

test('Transmission 39 is interactive, works without JavaScript, and makes no network calls', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<body class="tx-page">/);
  for (const interactiveId of ['dl-filters', 'dl-count', 'dl-grid', 'mod-grid', 'mod-detail', 'cr-faults', 'cr-outcome', 'cr-raw', 'cr-verify', 'wf-steps', 'mem-grid', 'oh-list', 'not-done']) {
    assert.ok(page.includes(`id="${interactiveId}"`), `Transmission 39 missing interactive ${interactiveId}`);
  }
  assert.match(page, /aria-pressed=/);
  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.ok(page.includes('Nothing on this page makes a network call.'), 'the script states its own boundary');
  assert.equal(/<script[^>]+src="https?:\/\//.test(page), false, 'no external scripts beyond the site bundle');
  assert.equal(/fetch\(|XMLHttpRequest|new Image\(|navigator\.sendBeacon|WebSocket\(/.test(page), false, 'the page makes no network calls of its own');
  assert.equal(/\/social\/transmission-/i.test(page), false, 'no internal posting assets are linked');
});

test('Transmission 39 public copy carries no internal paths, hosts, model vendors or operational identifiers', async () => {
  const page = await read(`transmissions/${id}.html`);
  const registry = await read('public/data/transmissions.json');
  const entry = JSON.stringify(JSON.parse(registry).transmissions.find(item => item.id === id));
  const services = await read('ai-services.json');
  const library = JSON.stringify(JSON.parse(services).transmission_library.transmission_39);
  for (const text of [page, entry, library]) {
    assert.equal(/[A-Za-z]:[\\/](?:unwind|Users)|\/root\/|receipt\.json|START_HERE|buildloop|icp_pulse|\b8162\b|\b8110\b|\bH6\b|Kling|Higgsfield|job_id|localhost|127\.0\.0\.1|lmstudio|lm-studio|ollama|\bJ-0\d\d\b/i.test(text), false);
  }
});

test('public retrieval metadata binds Transmission 39 to its dated field note without operational authority', async () => {
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  const records = registry.transmissions.filter(item => item.id === id);
  assert.equal(records.length, 1);
  const entry = records[0];
  assert.equal(entry.transmission_number, 39);
  assert.equal(entry.title, 'Transmission 39: The Entrance Came Back');
  assert.equal(entry.source_file, `transmissions/${id}.html`);
  assert.equal(entry.route, route);
  assert.equal(entry.review_status, 'public_safe');
  assert.equal(entry.confidence, 'high');
  assert.ok(entry.topic_tags.includes('production'));
  assert.ok(entry.topic_tags.includes('pipeline'));
  assert.equal(entry.citations.length, 1);
  assert.equal(entry.citations[0].route, route);
  assert.equal(entry.citations[0].source_file, entry.source_file);
  const services = JSON.parse(await read('public/ai-services.json'));
  for (const serviceId of ['transmission-registry', 'asset-registry']) {
    const service = services.services.find(item => item.id === serviceId);
    assert.ok(service.source_routes.includes(route), `${serviceId} lists the route`);
    assert.ok(service.citations.some(citation => citation.route === route), `${serviceId} cites the route`);
  }
});

test('archive, homepages and numbering place Transmission 39 correctly beneath the newest transmission', async () => {
  const files = (await readdir(new URL('../transmissions/', import.meta.url)))
    .filter(file => /^\d{2}-.+\.html$/.test(file));
  const expected = files.map(file => `/transmissions/${file.slice(0, -5)}`).sort();
  const archive = await read('transmissions/index.html');
  const cards = [...archive.matchAll(/<a href="(\/transmissions\/[^" ]+)" class="tx-card"/g)].map(match => match[1]);
  assert.deepEqual([...cards].sort(), expected, 'archive includes every real article exactly once');
  assert.ok(cards.includes(route), 'Transmission 39 is in the archive');
  assert.equal(archive.match(/<a href="([^"]+)" class="tx-featured-card"/)[1], latestRoute, 'the featured card is Transmission 45, not 39');
  const homepage = await read('public/lab/index.html');
  const homeCards = [...homepage.matchAll(/class="transmission-card"\s+href="([^"]+)"/g)].map(match => match[1]);
  assert.equal(homeCards.includes(route), false, 'Transmission 39 is outside the three-card rolling window');
  const legacy = await read('index.html');
  assert.ok(legacy.includes(`href="${route}"`), 'the legacy homepage keeps a link to Transmission 39');
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  const numbers = new Set(registry.transmissions.map(item => item.transmission_number));
  assert.equal(Math.max(...numbers), 45, 'Transmission 45 is the latest, not 39');
  assert.ok(numbers.has(39));
});
