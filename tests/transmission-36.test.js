import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const id = '36-movement-needs-a-source';
const route = `/transmissions/${id}`;
const canonical = `https://www.unwindcode.ai${route}`;
const latestRoute = '/transmissions/55-what-one-machines-day-says';
const route37 = '/transmissions/37-the-organism-drew-its-chain-boundary';
const route38 = '/transmissions/38-one-board-for-every-hand';
const latestCanonical = `https://www.unwindcode.ai${latestRoute}`;
const read = file => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('Transmission 36 has one consistent clean route across article and discovery surfaces', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<title>Transmission 36: Movement Needs a Source \| Unwind Code<\/title>/);
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

test('Transmission 36 is published on its real date and dated to the assessment it describes', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /"datePublished": "2026-11-08"/);
  assert.match(page, /"temporalCoverage": "2026-10-22"/);
  assert.equal(/"datePublished": "2026-10-/.test(page), false, 'the publish date is not backdated to the assessment');
  assert.ok(page.includes('22 October 2026'), 'the assessment date is stated in the article');
  assert.ok(page.includes('8 November 2026'), 'the publication date is stated in the article');
  assert.ok(page.includes('published after Transmission 37'), 'the article says it fills the gap after the latest transmission');
});

test('Transmission 36 is interactive, works without JavaScript, and makes no network calls', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<body class="tx-page">/);
  for (const interactiveId of ['gx-grid', 'gx-detail', 'rb-switch', 'rb-meters', 'rb-progress', 'rb-strip', 'wf-steps', 'stop-list', 'ev-filters', 'ev-grid']) {
    assert.ok(page.includes(`id="${interactiveId}"`), `Transmission 36 missing interactive ${interactiveId}`);
  }
  assert.match(page, /aria-pressed=/);
  assert.match(page, /aria-expanded=/);
  assert.match(page, /<details class="stop-card">/);
  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.equal(/<script[^>]+src="https?:\/\//.test(page), false, 'no external scripts beyond the site bundle');
  assert.equal(/fetch\(|XMLHttpRequest|new Image\(/.test(page), false, 'the page makes no network calls of its own');
  assert.equal(/\/lab\/media\/atlas\/scroll\//.test(page), false, 'the article loads no cinematic frames');
  assert.equal(/<article class="gx-panel"[^>]*\shidden/.test(page), false, 'every gesture panel is readable without JavaScript');
  assert.equal(/class="ev-why"[^>]*\shidden/.test(page), false, 'every evidence explanation is readable without JavaScript');
  assert.equal(/\/social\/transmission-/i.test(page), false, 'no internal posting assets are linked');
});

test('the article budget numbers are the shipped manifest and renderer limits', async () => {
  const page = await read(`transmissions/${id}.html`);
  const manifest = JSON.parse(await read('public/lab/media/atlas/scroll/infinity-v1/manifest.json'));
  const renderer = await read('public/lab/scroll-cinema.js');
  for (const [variant, cache] of [['mobile', 4], ['desktop', 6]]) {
    const item = manifest.variants[variant];
    assert.ok(page.includes(`${item.bytes.toLocaleString('en-US')} bytes`), `${variant} encoded bytes are printed from the manifest`);
    assert.ok(page.includes(`bytes: ${item.bytes},`), `${variant} simulator uses the manifest bytes`);
    assert.ok(page.includes(`${item.width} × ${item.height}`), `${variant} frame size matches the manifest`);
    assert.ok(page.includes(`frames: ${item.frameCount}, width: ${item.width}, height: ${item.height}`), `${variant} simulator matches the manifest`);
    assert.ok(renderer.includes(`${variant}: { frames: ${item.frameCount}, width: ${item.width}, height: ${item.height}`), `${variant} renderer limit is the documented one`);
    assert.ok(renderer.includes(`cache: ${cache} }`), `${variant} renderer keeps ${cache} decoded frames`);
  }
  assert.ok(page.includes('614,186 of 1,048,576'));
  assert.ok(page.includes('1,814,132 of 2,097,152'));
  assert.match(page, /estimate/i, 'decoded memory is labelled as an estimate');
  assert.ok(page.includes('One worker fetches and decodes, on both renditions.'), 'the article states the shipped single-worker behaviour');
  assert.match(renderer, /Only this worker may fetch\/decode/);
});

test('Transmission 36 keeps the interface release separate from Genesis readiness', async () => {
  const page = await read(`transmissions/${id}.html`);
  for (const required of [
    '382 repository tests and 80 browser checks',
    'Nothing was pushed or published that day.',
    'Autonomous building was held',
    'recovery is still pending and unproven',
    'acceptance targets, not results',
    'not a frame-by-frame certification',
    'Not supported',
    'Not measured',
  ]) {
    assert.ok(page.includes(required), `Transmission 36 missing: ${required}`);
  }
  const unsupported = [...page.matchAll(/<article class="ev-card ev-unsupported"[\s\S]*?<\/article>/g)].map(match => match[0]);
  assert.equal(unsupported.length, 3);
  assert.ok(unsupported.some(card => card.includes('Genesis was operationally ready on 22 October.')), 'the readiness claim is shown only as unsupported');
  const remainder = page.replace(/<article class="ev-card ev-unsupported"[\s\S]*?<\/article>/g, '');
  for (const match of remainder.matchAll(/Genesis (?:is|was) (?:operationally )?ready/gi)) {
    const before = remainder.slice(Math.max(0, match.index - 40), match.index);
    assert.ok(/not evidence that $/.test(before), `unqualified readiness claim near: ${before}${match[0]}`);
  }
  assert.equal(/recovery (?:is|was) complete|fully recovered|autonomous building (?:resumed|is running|was running)/i.test(page), false, 'no recovery or autonomy claim beyond the record');
});

test('Transmission 36 public copy carries no internal paths, hosts or operational identifiers', async () => {
  const page = await read(`transmissions/${id}.html`);
  const registry = await read('public/data/transmissions.json');
  const entry = JSON.stringify(JSON.parse(registry).transmissions.find(item => item.id === id));
  for (const text of [page, entry]) {
    assert.equal(/[A-Za-z]:[\\/](?:unwind|Users)|\/root\/|receipt\.json|START_HERE|buildloop|icp_pulse|\b8162\b|\b8110\b|\bH6\b|Kling|Higgsfield|job_id/i.test(text), false);
  }
});

test('archive and service counts measure actual articles while Transmission 55 is the latest', async () => {
  const files = (await readdir(new URL('../transmissions/', import.meta.url)))
    .filter(file => /^\d{2}-.+\.html$/.test(file));
  const expected = files.map(file => `/transmissions/${file.slice(0, -5)}`).sort();
  const archive = await read('transmissions/index.html');
  const cards = [...archive.matchAll(/<a href="(\/transmissions\/[^" ]+)" class="tx-card"/g)].map(match => match[1]);
  assert.deepEqual([...cards].sort(), expected, 'archive includes every real article exactly once');
  assert.equal(cards[0], latestRoute, 'the latest transmission stays first');
  const idx37 = cards.indexOf(route37);
  const idx36 = cards.indexOf(route);
  assert.equal(idx37 + 1, idx36, 'Transmission 36 immediately follows Transmission 37 in number order');
  assert.ok(cards.includes('/transmissions/27-the-quotation-cell'));
  assert.ok(cards.includes('/transmissions/27-the-site-became-a-public-index'));
  const schema = JSON.parse(archive.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const list = schema['@graph'].find(item => item['@type'] === 'ItemList');
  assert.equal(list.numberOfItems, files.length);
  assert.deepEqual(list.itemListElement.map(item => item.position), Array.from({ length: files.length }, (_, index) => index + 1));
  assert.deepEqual(list.itemListElement.map(item => item.url.replace('https://www.unwindcode.ai', '')).sort(), expected);
  assert.equal(list.itemListElement[idx36].url, canonical);
  const blog = schema['@graph'].find(item => item['@type'] === 'Blog');
  assert.equal(blog.blogPost[0].url, latestCanonical);
  const post = blog.blogPost.find(item => item.url === canonical);
  assert.equal(post.datePublished, '2026-11-08');
  assert.ok(archive.includes(`<span>${files.length}</span> transmissions published`));
  assert.ok(archive.includes(`<dt>${files.length}</dt>`));
  const services = JSON.parse(await read('ai-services.json'));
  assert.equal(services.transmission_library.total_transmissions, files.length);
  assert.equal(services.transmission_library.latest.url, latestCanonical, 'every latest pointer is on Transmission 55');
  assert.equal(services.transmission_library.transmission_36.url, canonical);
  assert.ok((await read('llms.txt')).includes(`${files.length} dispatches as a proof library`));
});

test('the live homepage leads with the newest transmissions; Transmission 36 remains in the full archive', async () => {
  const homepage = await read('public/lab/index.html');
  const cards = [...homepage.matchAll(/class="transmission-card"\s+href="([^"]+)"/g)].map(match => match[1]);
  assert.equal(cards.length, 3, 'the lab homepage keeps a three-card rolling window');
  assert.equal(cards[0], latestRoute, 'the rolling window leads with the latest transmission');
  assert.equal(cards.includes(route), false, 'Transmission 36 has rolled out of the three-card window');
  const legacy = await read('index.html');
  const legacyCards = [...legacy.matchAll(/class="blog-card" href="([^"]+)"/g)].map(match => match[1]);
  assert.equal(legacyCards[0], latestRoute);
  const legacyIdx37 = legacyCards.indexOf(route37);
  const legacyIdx36 = legacyCards.indexOf(route);
  const legacyIdx38 = legacyCards.indexOf(route38);
  assert.ok(legacyIdx38 > -1 && legacyIdx37 > legacyIdx38, 'the legacy homepage keeps appending without dropping older transmissions');
  assert.equal(legacyIdx37 + 1, legacyIdx36, 'the legacy homepage keeps Transmission 36 directly after Transmission 37');
  const archive = await read('transmissions/index.html');
  assert.equal(archive.match(/<a href="([^"]+)" class="tx-featured-card"/)[1], latestRoute, 'the featured card follows the latest transmission');
});

test('public retrieval metadata binds Transmission 36 to its dated field note without operational authority', async () => {
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  const records = registry.transmissions.filter(item => item.id === id);
  assert.equal(records.length, 1);
  const entry = records[0];
  assert.equal(entry.transmission_number, 36);
  assert.equal(entry.title, 'Transmission 36: Movement Needs a Source');
  assert.equal(entry.source_file, `transmissions/${id}.html`);
  assert.equal(entry.route, route);
  assert.equal(entry.review_status, 'public_safe');
  assert.ok(entry.summary.includes('2026-10-22'), 'operational assessment is dated rather than presented as live status');
  assert.ok(entry.summary.includes('autonomous building remained held'));
  assert.ok(entry.summary.includes('recovery was incomplete'));
  assert.ok(entry.topic_tags.includes('mobile-performance'));
  assert.ok(entry.topic_tags.includes('evidence-boundaries'));
  assert.equal(entry.citations[0].route, route);
  assert.equal(entry.citations[0].source_file, entry.source_file);
  const services = JSON.parse(await read('public/ai-services.json'));
  for (const serviceId of ['transmission-registry', 'asset-registry']) {
    const service = services.services.find(item => item.id === serviceId);
    assert.ok(service.source_routes.includes(route), `${serviceId} lists the route`);
    assert.ok(service.citations.some(citation => citation.route === route), `${serviceId} cites the route`);
    const order = service.source_routes.filter(item => /\/transmissions\/3[5-8]-/.test(item));
    assert.deepEqual(order, ['/transmissions/35-the-ledger-learned-to-be-witnessed', route, route37, route38], `${serviceId} keeps number order`);
  }
});

test('the transmission numbering is contiguous with Transmission 36 registered', async () => {
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  const numbers = new Set(registry.transmissions.map(item => item.transmission_number));
  const latest = Math.max(...numbers);
  assert.equal(latest, 55);
  const missing = Array.from({ length: latest }, (_, index) => index + 1).filter(number => !numbers.has(number));
  assert.deepEqual(missing, []);
});
