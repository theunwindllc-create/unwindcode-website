import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const id = '42-pull-sign-seal';
const route = `/transmissions/${id}`;
const canonical = `https://www.unwindcode.ai${route}`;
const latestRoute = '/transmissions/45-where-this-is-going';
const read = file => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('Transmission 42 has one consistent clean route across article and discovery surfaces', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<title>Transmission 42: Pull, Sign, Seal \| Unwind Code<\/title>/);
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

test('Transmission 42 is dated to 8 November 2026 and states it is a design, not a build', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /"datePublished": "2026-11-08"/);
  assert.match(page, /"dateModified": "2026-11-08"/);
  for (const required of [
    'the machine pulls requests, every request is signed by the operator',
    'secrets travel sealed',
    'It is a design, not a build',
    'the machine never accepts a connection',
    'Nothing built',
    'Remote acts to date: 0',
  ]) {
    assert.ok(page.includes(required), `Transmission 42 missing: ${required}`);
  }
  assert.equal(/remote (?:control|access) (?:is|has been) (?:built|live|deployed|enabled)/i.test(page), false, 'remote control is never claimed as built or live');
});

test('Transmission 42 is interactive, works without JavaScript, and makes no network calls', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<body class="tx-page">/);
  for (const interactiveId of ['dl-filters', 'dl-count', 'dl-grid', 'mod-grid', 'mod-detail', 'cr-faults', 'cr-outcome', 'cr-raw', 'cr-verify', 'wf-steps', 'mem-grid', 'oh-list', 'not-done']) {
    assert.ok(page.includes(`id="${interactiveId}"`), `Transmission 42 missing interactive ${interactiveId}`);
  }
  assert.match(page, /aria-pressed=/);
  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.ok(page.includes('Nothing on this page makes a network call.'), 'the script states its own boundary');
  assert.equal(/<script[^>]+src="https?:\/\//.test(page), false, 'no external scripts beyond the site bundle');
  assert.equal(/fetch\(|XMLHttpRequest|new Image\(|navigator\.sendBeacon|WebSocket\(/.test(page), false, 'the page makes no network calls of its own');
  assert.equal(/\/social\/transmission-/i.test(page), false, 'no internal posting assets are linked');
});

test('Transmission 42 public copy carries no internal paths, hosts, model vendors or operational identifiers', async () => {
  const page = await read(`transmissions/${id}.html`);
  const registry = await read('public/data/transmissions.json');
  const entry = JSON.stringify(JSON.parse(registry).transmissions.find(item => item.id === id));
  const services = await read('ai-services.json');
  const library = JSON.stringify(JSON.parse(services).transmission_library.transmission_42);
  for (const text of [page, entry, library]) {
    assert.equal(/[A-Za-z]:[\\/](?:unwind|Users)|\/root\/|receipt\.json|START_HERE|buildloop|icp_pulse|\b8162\b|\b8110\b|\bH6\b|Kling|Higgsfield|job_id|localhost|127\.0\.0\.1|lmstudio|lm-studio|ollama|\bJ-0\d\d\b/i.test(text), false);
  }
});

test('public retrieval metadata binds Transmission 42 to its dated field note without operational authority', async () => {
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  const records = registry.transmissions.filter(item => item.id === id);
  assert.equal(records.length, 1);
  const entry = records[0];
  assert.equal(entry.transmission_number, 42);
  assert.equal(entry.title, 'Transmission 42: Pull, Sign, Seal');
  assert.equal(entry.source_file, `transmissions/${id}.html`);
  assert.equal(entry.route, route);
  assert.equal(entry.review_status, 'public_safe');
  assert.equal(entry.confidence, 'high');
  assert.ok(entry.topic_tags.includes('remote-control'));
  assert.ok(entry.topic_tags.includes('custody-boundary'));
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

test('archive, homepages and numbering place Transmission 42 correctly beneath the newest transmission', async () => {
  const files = (await readdir(new URL('../transmissions/', import.meta.url)))
    .filter(file => /^\d{2}-.+\.html$/.test(file));
  const expected = files.map(file => `/transmissions/${file.slice(0, -5)}`).sort();
  const archive = await read('transmissions/index.html');
  const cards = [...archive.matchAll(/<a href="(\/transmissions\/[^" ]+)" class="tx-card"/g)].map(match => match[1]);
  assert.deepEqual([...cards].sort(), expected, 'archive includes every real article exactly once');
  assert.ok(cards.includes(route), 'Transmission 42 is in the archive');
  assert.equal(archive.match(/<a href="([^"]+)" class="tx-featured-card"/)[1], latestRoute, 'the featured card is Transmission 45, not 42');
  const homepage = await read('public/lab/index.html');
  const homeCards = [...homepage.matchAll(/class="transmission-card"\s+href="([^"]+)"/g)].map(match => match[1]);
  assert.equal(homeCards.includes(route), false, 'Transmission 42 is outside the three-card rolling window');
  const legacy = await read('index.html');
  assert.ok(legacy.includes(`href="${route}"`), 'the legacy homepage keeps a link to Transmission 42');
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  const numbers = new Set(registry.transmissions.map(item => item.transmission_number));
  assert.equal(Math.max(...numbers), 45, 'Transmission 45 is the latest, not 42');
  assert.ok(numbers.has(42));
});
