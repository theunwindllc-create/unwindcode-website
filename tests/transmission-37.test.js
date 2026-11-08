import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const id = '37-the-organism-drew-its-chain-boundary';
const route = `/transmissions/${id}`;
const canonical = `https://www.unwindcode.ai${route}`;
const latestRoute = '/transmissions/38-one-board-for-every-hand';
const latestCanonical = `https://www.unwindcode.ai${latestRoute}`;
const read = file => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('Transmission 37 has one consistent clean route across article and discovery surfaces', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<title>Transmission 37: The Organism Drew Its Chain Boundary \| Unwind Code<\/title>/);
  assert.ok(page.includes(`<link rel="canonical" href="${canonical}"`));
  assert.ok(page.includes(`<meta property="og:url" content="${canonical}"`));
  assert.match(page, /"datePublished": "2026-11-02"/);
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

test('Transmission 37 is an interactive field note that states its own evidence boundary', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<body class="tx-page">/);
  for (const interactiveId of ['dl-filters', 'dl-grid', 'mod-grid', 'mod-detail', 'cr-faults', 'cr-verify', 'wf-steps', 'mem-grid', 'oh-list']) {
    assert.ok(page.includes(`id="${interactiveId}"`), `Transmission 37 missing interactive ${interactiveId}`);
  }
  assert.match(page, /aria-pressed=/);
  assert.match(page, /aria-expanded=/);
  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.equal(/<script[^>]+src="https?:\/\//.test(page), false, 'no external scripts beyond the site bundle');
  assert.equal(/fetch\(/.test(page), false, 'the page makes no network calls of its own');
  for (const required of [
    'No fourth state',
    'never dfx',
    'skills.internetcomputer.org',
    'local replica',
    'rt6ds-eqaaa-aaaad-agv7q-cai',
    'committed state',
    'silent history rewriting',
    'Refusing to act is always a safe outcome',
    'boundary conflict',
    '/proof/ledger',
    '/transmissions/35-the-ledger-learned-to-be-witnessed',
  ]) {
    assert.ok(page.includes(required), `Transmission 37 missing: ${required}`);
  }
  assert.equal(/mainnet deploy(?:ed|ment) (?:is )?complete|now live on mainnet|deployed to mainnet\b(?! anyway)/i.test(page), false, 'local-replica proofs are never presented as mainnet claims');
});

test('archive and service counts measure actual articles while preserving both legacy Transmission 27 routes', async () => {
  const files = (await readdir(new URL('../transmissions/', import.meta.url)))
    .filter(file => /^\d{2}-.+\.html$/.test(file));
  const expected = files.map(file => `/transmissions/${file.slice(0, -5)}`).sort();
  const archive = await read('transmissions/index.html');
  const cards = [...archive.matchAll(/<a href="(\/transmissions\/[^" ]+)" class="tx-card"/g)].map(match => match[1]);
  assert.deepEqual([...cards].sort(), expected, 'archive includes every real article exactly once');
  assert.equal(cards[0], latestRoute, 'Transmission 38 is now the latest');
  assert.equal(cards[1], route, 'Transmission 37 follows in number order');
  assert.ok(cards.includes('/transmissions/27-the-quotation-cell'));
  assert.ok(cards.includes('/transmissions/27-the-site-became-a-public-index'));
  const schema = JSON.parse(archive.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const list = schema['@graph'].find(item => item['@type'] === 'ItemList');
  assert.equal(list.numberOfItems, files.length);
  assert.deepEqual(list.itemListElement.map(item => item.position), Array.from({ length: files.length }, (_, index) => index + 1));
  assert.deepEqual(list.itemListElement.map(item => item.url.replace('https://www.unwindcode.ai', '')).sort(), expected);
  const blog = schema['@graph'].find(item => item['@type'] === 'Blog');
  assert.equal(blog.blogPost[0].url, latestCanonical);
  assert.equal(blog.blogPost[1].url, canonical);
  assert.ok(archive.includes(`<span>${files.length}</span> transmissions published`));
  assert.ok(archive.includes(`<dt>${files.length}</dt>`));
  const services = JSON.parse(await read('ai-services.json'));
  assert.equal(services.transmission_library.total_transmissions, files.length);
  assert.equal(services.transmission_library.latest.url, latestCanonical, 'the latest pointer moved to Transmission 38');
  assert.equal(services.transmission_library.transmission_37.url, canonical, 'Transmission 37 keeps its own library entry');
  assert.ok((await read('llms.txt')).includes(`${files.length} dispatches as a proof library`));
});

test('the live homepage leads with Transmission 38, followed in number order by 37 and 36', async () => {
  const homepage = await read('public/lab/index.html');
  const cards = [...homepage.matchAll(/class="transmission-card"\s+href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(cards, [latestRoute, route, '/transmissions/36-movement-needs-a-source']);
  assert.match(homepage, /<h3 data-es="El organismo trazó su frontera en cadena">\s+The Organism Drew Its Chain Boundary/);
  const legacy = await read('index.html');
  const legacyCards = [...legacy.matchAll(/class="blog-card" href="([^"]+)"/g)].map(match => match[1]);
  assert.equal(legacyCards[0], latestRoute);
  assert.equal(legacyCards[1], route);
  assert.ok(legacy.includes('href="/transmissions/35-the-ledger-learned-to-be-witnessed"'), 'legacy homepage keeps Transmission 35 linked');
  const archive = await read('transmissions/index.html');
  assert.equal(archive.match(/<a href="([^"]+)" class="tx-featured-card"/)[1], latestRoute, 'the featured card follows the latest transmission');
});

test('public retrieval metadata binds Transmission 37 to its dated field note without operational authority', async () => {
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  const records = registry.transmissions.filter(item => item.id === id);
  assert.equal(records.length, 1);
  const entry = records[0];
  assert.equal(entry.transmission_number, 37);
  assert.equal(entry.title, 'Transmission 37: The Organism Drew Its Chain Boundary');
  assert.equal(entry.source_file, `transmissions/${id}.html`);
  assert.equal(entry.route, route);
  assert.equal(entry.review_status, 'public_safe');
  assert.ok(entry.summary.includes('2026-11-02'), 'the field note is dated rather than presented as live status');
  assert.ok(entry.summary.includes('local replicas only'), 'the summary keeps local-replica proofs distinct from mainnet');
  assert.ok(entry.topic_tags.includes('internet-computer'));
  assert.ok(entry.topic_tags.includes('custody-boundary'));
  assert.equal(entry.citations[0].route, route);
  assert.equal(entry.citations[0].source_file, entry.source_file);
  const services = JSON.parse(await read('public/ai-services.json'));
  for (const serviceId of ['transmission-registry', 'asset-registry']) {
    const service = services.services.find(item => item.id === serviceId);
    assert.ok(service.source_routes.includes(route), `${serviceId} lists the route`);
    assert.ok(service.citations.some(citation => citation.route === route), `${serviceId} cites the route`);
  }
});

test('the numbering gap once left for Transmission 36 is closed by a real article, and the snapshots say so', async () => {
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  const numbers = registry.transmissions.map(item => item.transmission_number);
  assert.ok(numbers.includes(37));
  assert.equal(numbers.filter(number => number === 36).length, 1, 'Transmission 36 is registered exactly once');
  await read('transmissions/36-movement-needs-a-source.html');
  const parityTest = await read('tests/public-parity-script.test.js');
  assert.match(parityTest, /has_gaps: false,\s+missing_numbers: \[\]/, 'the parity snapshot states the closed gap');
  assert.equal(/missing_numbers: \[36\]/.test(parityTest), false, 'no snapshot still reports 36 as missing');
});
