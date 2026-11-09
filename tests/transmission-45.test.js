import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const id = '45-where-this-is-going';
const route = `/transmissions/${id}`;
const canonical = `https://www.unwindcode.ai${route}`;
const route44 = '/transmissions/44-what-the-organism-is-afraid-of';
const route43 = '/transmissions/43-an-organism-that-hires';
const read = file => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('Transmission 45 has one consistent clean route across article and discovery surfaces', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<title>Transmission 45: Where This Is Going \| Unwind Code<\/title>/);
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

test('Transmission 45 is a plan dated 8 November 2026 and never claims a receipt it does not have', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /"datePublished": "2026-11-08"/);
  assert.match(page, /"dateModified": "2026-11-08"/);
  for (const required of [
    '32,768 tokens',
    '39,000 tokens',
    '14,000',
    'nothing leaves the box',
    'progress is counted only from receipts',
    'No key lands on the machine',
    'nothing on this page has one yet',
    '(plan)',
  ]) {
    assert.ok(page.includes(required), `Transmission 45 missing: ${required}`);
  }
  assert.equal(/\bis (?:now )?(?:live|built|deployed|complete)\b/i.test(page.replace(/<script[\s\S]*?<\/script>/g, '')), false, 'the roadmap is never claimed as built or live');
});

test('Transmission 45 is interactive, works without JavaScript, and makes no network calls', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<body class="tx-page">/);
  for (const interactiveId of ['dl-filters', 'dl-count', 'dl-grid', 'mod-grid', 'mod-detail', 'cr-faults', 'cr-outcome', 'cr-raw', 'cr-verify', 'wf-steps', 'mem-grid', 'oh-list', 'not-done']) {
    assert.ok(page.includes(`id="${interactiveId}"`), `Transmission 45 missing interactive ${interactiveId}`);
  }
  assert.match(page, /aria-pressed=/);
  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.ok(page.includes('Nothing on this page makes a network call.'), 'the script states its own boundary');
  assert.equal(/<script[^>]+src="https?:\/\//.test(page), false, 'no external scripts beyond the site bundle');
  assert.equal(/fetch\(|XMLHttpRequest|new Image\(|navigator\.sendBeacon|WebSocket\(/.test(page), false, 'the page makes no network calls of its own');
  assert.equal(/\/social\/transmission-/i.test(page), false, 'no internal posting assets are linked');
});

test('Transmission 45 public copy carries no internal paths, hosts, model vendors or operational identifiers', async () => {
  const page = await read(`transmissions/${id}.html`);
  const registry = await read('public/data/transmissions.json');
  const entry = JSON.stringify(JSON.parse(registry).transmissions.find(item => item.id === id));
  const services = await read('ai-services.json');
  const library = JSON.stringify(JSON.parse(services).transmission_library.transmission_45);
  for (const text of [page, entry, library]) {
    assert.equal(/[A-Za-z]:[\\/](?:unwind|Users)|\/root\/|receipt\.json|START_HERE|buildloop|icp_pulse|\b8162\b|\b8110\b|\bH6\b|Kling|Higgsfield|job_id|localhost|127\.0\.0\.1|lmstudio|lm-studio|ollama|\bJ-0\d\d\b/i.test(text), false);
  }
});

test('archive and service counts measure actual articles with Transmission 45 as the latest', async () => {
  const files = (await readdir(new URL('../transmissions/', import.meta.url)))
    .filter(file => /^\d{2}-.+\.html$/.test(file));
  const expected = files.map(file => `/transmissions/${file.slice(0, -5)}`).sort();
  const archive = await read('transmissions/index.html');
  const cards = [...archive.matchAll(/<a href="(\/transmissions\/[^" ]+)" class="tx-card"/g)].map(match => match[1]);
  assert.deepEqual([...cards].sort(), expected, 'archive includes every real article exactly once');
  assert.deepEqual(cards.slice(0, 3), [route, route44, route43], 'the newest three lead the archive in number order');
  assert.ok(cards.includes('/transmissions/27-the-quotation-cell'));
  assert.ok(cards.includes('/transmissions/27-the-site-became-a-public-index'));
  assert.equal(archive.match(/<a href="([^"]+)" class="tx-featured-card"/)[1], route, 'the featured card is the latest transmission');
  assert.match(archive, /<span class="tx-card-number">045<\/span>\s*<h2 id="tx-featured-title">Where This Is Going<\/h2>/);
  const schema = JSON.parse(archive.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const list = schema['@graph'].find(item => item['@type'] === 'ItemList');
  assert.equal(list.numberOfItems, files.length);
  assert.deepEqual(list.itemListElement.map(item => item.position), Array.from({ length: files.length }, (_, index) => index + 1));
  assert.deepEqual(list.itemListElement.map(item => item.url.replace('https://www.unwindcode.ai', '')).sort(), expected);
  assert.equal(list.itemListElement[0].url, canonical);
  assert.equal(list.itemListElement[0].name, 'Where This Is Going');
  const blog = schema['@graph'].find(item => item['@type'] === 'Blog');
  assert.equal(blog.blogPost[0].url, canonical);
  assert.equal(blog.blogPost[0].datePublished, '2026-11-08');
  assert.equal(blog.blogPost[1].url, `https://www.unwindcode.ai${route44}`);
  assert.ok(archive.includes(`<span>${files.length}</span> transmissions published`));
  assert.ok(archive.includes(`<dt>${files.length}</dt>`));
  const services = JSON.parse(await read('ai-services.json'));
  assert.equal(services.transmission_library.total_transmissions, files.length);
  assert.equal(services.transmission_library.latest.url, canonical, 'the latest pointer is Transmission 45');
  assert.equal(services.transmission_library.latest.id, 'transmission_45');
  assert.deepEqual(services.transmission_library.transmission_45, services.transmission_library.latest, 'the library entry and the latest pointer agree');
  assert.equal(services.transmission_library.transmission_44.url, `https://www.unwindcode.ai${route44}`, 'Transmission 44 keeps its own library entry');
  const llms = await read('llms.txt');
  assert.ok(llms.includes(`${files.length} dispatches as a proof library`));
  assert.ok(llms.includes('Transmission 45 documents the roadmap ahead'));
  assert.ok((await read('public/llms.txt')).includes(canonical));
});

test('both homepages lead with Transmission 45, followed in number order by 44 and 43', async () => {
  const homepage = await read('public/lab/index.html');
  const cards = [...homepage.matchAll(/class="transmission-card"\s+href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(cards, [route, route44, route43]);
  assert.match(homepage, /<h3 data-es="Hacia dónde va esto">\s*Where This Is Going\s*<\/h3>/);
  assert.match(homepage, /<span class="mono">045<\/span>/);
  const legacy = await read('index.html');
  const legacyCards = [...legacy.matchAll(/class="blog-card" href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(legacyCards.slice(0, 3), [route, route44, route43]);
  assert.ok(legacy.includes('Transmission 45: Where This Is Going'));
});

test('public retrieval metadata binds Transmission 45 to its dated field note without operational authority', async () => {
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  assert.equal(registry.transmissions[0].id, id, 'the newest transmission is registered first');
  const records = registry.transmissions.filter(item => item.id === id);
  assert.equal(records.length, 1);
  const entry = records[0];
  assert.equal(entry.transmission_number, 45);
  assert.equal(entry.title, 'Transmission 45: Where This Is Going');
  assert.equal(entry.source_file, `transmissions/${id}.html`);
  assert.equal(entry.route, route);
  assert.equal(entry.review_status, 'public_safe');
  assert.equal(entry.confidence, 'high');
  assert.ok(entry.topic_tags.includes('roadmap'));
  assert.ok(entry.topic_tags.includes('custody-boundary'));
  assert.deepEqual(entry.memory_layers, ['procedural', 'semantic', 'episodic']);
  assert.equal(entry.citations.length, 1);
  assert.equal(entry.citations[0].route, route);
  assert.equal(entry.citations[0].source_file, entry.source_file);
  const services = JSON.parse(await read('public/ai-services.json'));
  for (const serviceId of ['transmission-registry', 'asset-registry']) {
    const service = services.services.find(item => item.id === serviceId);
    assert.ok(service.source_routes.includes(route), `${serviceId} lists the route`);
    assert.equal(service.source_routes.at(-1), route, `${serviceId} lists the newest route last, in number order`);
    assert.ok(service.citations.some(citation => citation.route === route), `${serviceId} cites the route`);
  }
});

test('the transmission numbering is contiguous through Transmission 45', async () => {
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  const numbers = new Set(registry.transmissions.map(item => item.transmission_number));
  const latest = Math.max(...numbers);
  assert.equal(latest, 45);
  const missing = Array.from({ length: latest }, (_, index) => index + 1).filter(number => !numbers.has(number));
  assert.deepEqual(missing, []);
  const parityTest = await read('tests/public-parity-script.test.js');
  assert.match(parityTest, /latest_number: 45,\s+published_count: 46,\s+has_gaps: false,\s+missing_numbers: \[\]/, 'the parity snapshot states the new latest with no gap');
  const statusTest = await read('tests/status-api.test.js');
  assert.match(statusTest, /latest_number: 45,\s+published_count: 46,/, 'the status snapshot states the new latest');
});
