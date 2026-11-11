import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const id = '55-what-one-machines-day-says';
const route = `/transmissions/${id}`;
const canonical = `https://www.unwindcode.ai${route}`;
const read = file => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('Transmission 55 has one consistent clean route across article and discovery surfaces', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<title>Transmission 55: What One Machine\'s Day Says About the Next Ten Years \| Unwind Code<\/title>/);
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

test('Transmission 55 is dated and carries each of its six sections', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /"datePublished": "2026-11-09"/);
  assert.match(page, /"dateModified": "2026-11-09"/);
  for (const heading of [
    'Five dated things that happened on one machine',
    'Cheap by default, not by discipline',
    'A record remembers; a prompt doesn\'t',
    'Authority stayed with a wallet, not a model',
    'Counting only what has a receipt',
    'Keep the observed apart from the hoped-for.',
  ]) {
    assert.ok(page.includes(heading), `Transmission 55 missing section: ${heading}`);
  }
});

test('Transmission 55 is interactive, works without JavaScript, and makes no network calls', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<body class="tx-page">/);
  for (const interactiveId of ['five-dates', 'mod-grid', 'mod-detail', 'wf-steps', 'cost-tiers', 'records-not-prompts', 'the-human-key', 'receipts-over-claims', 'dl-filters', 'dl-count', 'dl-grid', 'cr-faults', 'cr-raw', 'cr-verify', 'cr-outcome', 'mem-grid', 'oh-list']) {
    assert.ok(page.includes(`id="${interactiveId}"`), `Transmission 55 missing interactive ${interactiveId}`);
  }
  assert.match(page, /aria-pressed=/);
  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.equal(/<script[^>]+src="https?:\/\//.test(page), false, 'no external scripts beyond the site bundle');
  assert.equal(/fetch\(|XMLHttpRequest|new Image\(|navigator\.sendBeacon|WebSocket\(/.test(page), false, 'the page makes no network calls of its own');
  assert.equal(/\/social\/transmission-/i.test(page), false, 'no internal posting assets are linked');
});

test('Transmission 55 public copy carries no internal paths, hosts, model vendors or operational identifiers', async () => {
  const page = await read(`transmissions/${id}.html`);
  const registry = await read('public/data/transmissions.json');
  const entry = JSON.stringify(JSON.parse(registry).transmissions.find(item => item.id === id));
  const services = await read('ai-services.json');
  const library = JSON.stringify(JSON.parse(services).transmission_library.transmission_55);
  for (const text of [page, entry, library]) {
    assert.equal(/[A-Za-z]:[\\/](?:unwind|Users)|\/root\/|receipt\.json|START_HERE|buildloop|icp_pulse|\b8162\b|\b8110\b|\bH6\b|Kling|Higgsfield|job_id|localhost|127\.0\.0\.1|lmstudio|lm-studio|ollama|\bJ-0\d\d\b/i.test(text), false);
  }
});

test('public retrieval metadata binds Transmission 55 to its dated field note without operational authority', async () => {
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  assert.equal(registry.transmissions[0].id, id, 'the newest transmission is registered first');
  const records = registry.transmissions.filter(item => item.id === id);
  assert.equal(records.length, 1);
  const entry = records[0];
  assert.equal(entry.transmission_number, 55);
  assert.equal(entry.title, 'Transmission 55: What One Machine\'s Day Says About the Next Ten Years');
  assert.equal(entry.source_file, `transmissions/${id}.html`);
  assert.equal(entry.route, route);
  assert.equal(entry.review_status, 'public_safe');
  assert.equal(entry.confidence, 'high');
  assert.ok(entry.topic_tags.includes('outlook'));
  assert.ok(entry.topic_tags.includes('receipts'));
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

test('archive and service counts measure actual articles with Transmission 55 as the latest', async () => {
  const files = (await readdir(new URL('../transmissions/', import.meta.url)))
    .filter(file => /^\d{2}-.+\.html$/.test(file));
  const expected = files.map(file => `/transmissions/${file.slice(0, -5)}`).sort();
  const archive = await read('transmissions/index.html');
  const cards = [...archive.matchAll(/<a href="(\/transmissions\/[^" ]+)" class="tx-card"/g)].map(match => match[1]);
  assert.deepEqual([...cards].sort(), expected, 'archive includes every real article exactly once');
  assert.deepEqual(cards.slice(0, 3), [route, '/transmissions/54-proof-before-promotion', '/transmissions/53-a-board-not-a-prompt'], 'the newest three lead the archive in number order');
  assert.equal(archive.match(/<a href="([^"]+)" class="tx-featured-card"/)[1], route, 'the featured card is the latest transmission');
  assert.match(archive, /<span class="tx-card-number">055<\/span>\s*<h2 id="tx-featured-title">What One Machine's Day Says About the Next Ten Years<\/h2>/);
  const schema = JSON.parse(archive.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const list = schema['@graph'].find(item => item['@type'] === 'ItemList');
  assert.equal(list.numberOfItems, files.length);
  assert.deepEqual(list.itemListElement.map(item => item.position), Array.from({ length: files.length }, (_, index) => index + 1));
  assert.deepEqual(list.itemListElement.map(item => item.url.replace('https://www.unwindcode.ai', '')).sort(), expected);
  assert.equal(list.itemListElement[0].url, canonical);
  const blog = schema['@graph'].find(item => item['@type'] === 'Blog');
  assert.equal(blog.blogPost[0].url, canonical);
  assert.equal(blog.blogPost[0].datePublished, '2026-11-09');
  assert.ok(archive.includes(`<span>${files.length}</span> transmissions published`));
  assert.ok(archive.includes(`<dt>${files.length}</dt>`));
  const services = JSON.parse(await read('ai-services.json'));
  assert.equal(services.transmission_library.total_transmissions, files.length);
  assert.equal(services.transmission_library.latest.url, canonical, 'the latest pointer is Transmission 55');
  assert.equal(services.transmission_library.latest.id, 'transmission_55');
  assert.deepEqual(services.transmission_library.transmission_55, services.transmission_library.latest, 'the library entry and the latest pointer agree');
  const llms = await read('llms.txt');
  assert.ok(llms.includes(`${files.length} dispatches as a proof library`));
  assert.ok(llms.includes('Transmission 55 documents five dated observations'));
  assert.ok((await read('public/llms.txt')).includes(canonical));
});

test('both homepages lead with Transmission 55, followed in number order by 54 and 53', async () => {
  const homepage = await read('public/lab/index.html');
  const cards = [...homepage.matchAll(/class="transmission-card"\s+href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(cards, [route, '/transmissions/54-proof-before-promotion', '/transmissions/53-a-board-not-a-prompt']);
  assert.match(homepage, /<span class="mono">055<\/span>/);
  const legacy = await read('index.html');
  const legacyCards = [...legacy.matchAll(/class="blog-card" href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(legacyCards.slice(0, 3), [route, '/transmissions/54-proof-before-promotion', '/transmissions/53-a-board-not-a-prompt']);
  assert.ok(legacy.includes("Transmission 55: What One Machine's Day Says About the Next Ten Years"));
});

test('the transmission numbering is contiguous through Transmission 55', async () => {
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  const numbers = new Set(registry.transmissions.map(item => item.transmission_number));
  const latest = Math.max(...numbers);
  assert.equal(latest, 55);
  const missing = Array.from({ length: latest }, (_, index) => index + 1).filter(number => !numbers.has(number));
  assert.deepEqual(missing, []);
  const parityTest = await read('tests/public-parity-script.test.js');
  assert.match(parityTest, /latest_number: 55,\s+published_count: 56,\s+has_gaps: false,\s+missing_numbers: \[\]/, 'the parity snapshot states the new latest with no gap');
  const statusTest = await read('tests/status-api.test.js');
  assert.match(statusTest, /latest_number: 55,\s+published_count: 56,/, 'the status snapshot states the new latest');
});
