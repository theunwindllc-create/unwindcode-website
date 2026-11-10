import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const id = '38-one-board-for-every-hand';
const route = `/transmissions/${id}`;
const canonical = `https://www.unwindcode.ai${route}`;
const route37 = '/transmissions/37-the-organism-drew-its-chain-boundary';
const route36 = '/transmissions/36-movement-needs-a-source';
const latestRoute = '/transmissions/45-where-this-is-going';
const latestCanonical = `https://www.unwindcode.ai${latestRoute}`;
const read = file => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('Transmission 38 has one consistent clean route across article and discovery surfaces', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<title>Transmission 38: One Board for Every Hand \| Unwind Code<\/title>/);
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

test('Transmission 38 is dated to the day it describes and names the rail as interim', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /"datePublished": "2026-11-08"/);
  assert.match(page, /"dateModified": "2026-11-10"/);
  assert.ok(page.includes('8 November 2026'), 'the day is stated in the article');
  assert.ok(page.includes('until a job board exists'), 'the board is framed as a rail before the real job board');
  assert.ok(page.includes('The rail itself is interim'), 'the article says the rail is interim');
  assert.ok(page.includes('a fourth hand that is shelved for now'), 'the fourth hand is reported as shelved, not active');
  assert.ok(page.includes('Claim before you start'), 'the claim rule is the headline rule');
  assert.ok(page.includes('The board grants no authority'), 'the board is not a source of authority');
  assert.ok(page.includes('No private keys on the machine. No autonomous financial execution.'), 'the custody boundary is stated above the board');
  assert.equal(/job board (?:is|was) (?:now )?(?:live|built|deployed|complete)/i.test(page), false, 'the real job board is never claimed as built');
  assert.equal(/deployed from this page/.test(page) && !/none deployed from this page/.test(page), false, 'nothing is presented as deployed from the article');
});

test('Transmission 38 is interactive, works without JavaScript, and makes no network calls', async () => {
  const page = await read(`transmissions/${id}.html`);
  assert.match(page, /<body class="tx-page">/);
  for (const interactiveId of ['dl-filters', 'dl-count', 'dl-grid', 'mod-grid', 'mod-detail', 'cr-faults', 'cr-window', 'cr-left', 'cr-outcome', 'wf-steps', 'mem-grid', 'oh-list']) {
    assert.ok(page.includes(`id="${interactiveId}"`), `Transmission 38 missing interactive ${interactiveId}`);
  }
  assert.match(page, /aria-pressed=/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.ok(page.includes('Nothing on this page makes a network call.'), 'the script states its own boundary');
  assert.equal(/<script[^>]+src="https?:\/\//.test(page), false, 'no external scripts beyond the site bundle');
  assert.equal(/fetch\(|XMLHttpRequest|new Image\(|navigator\.sendBeacon|WebSocket\(/.test(page), false, 'the page makes no network calls of its own');
  assert.equal(/\/social\/transmission-/i.test(page), false, 'no internal posting assets are linked');
  const prose = page.replace(/<script[\s\S]*?<\/script>/g, '');
  assert.ok(prose.includes('one hand per job, with a timestamp'), 'the claim rules are readable without JavaScript');
  assert.ok(prose.includes('A claim older than 24 hours with no note may be reclaimed'), 'the reclaim rule is readable without JavaScript');
});

test('the article numbers are stated consistently wherever they appear', async () => {
  const page = await read(`transmissions/${id}.html`);
  for (const required of ['32,768', '39,000', '14,000', '18,000', '4,096', '12,070', '1,602', '98%', '24 hours']) {
    assert.ok(page.includes(required), `Transmission 38 missing figure: ${required}`);
  }
  assert.ok(page.includes('Measured without loading a model'), 'the prompt measurement is labelled as a dry measurement');
  assert.ok(page.includes('not a live run'), 'the budget widget is labelled as not a live run');
  assert.ok(page.includes('45 video-editor tool definitions'));
  assert.ok(page.includes('29 skills'));
  assert.ok(page.includes('four rows added as proposed, zero existing rows changed'), 'the calendar pass result is verified, not asserted');
  assert.ok(page.includes('the damaged copy was kept so the restore can be undone'), 'the repair is reversible on the record');
});

test('Transmission 38 public copy carries no internal paths, hosts, model vendors or operational identifiers', async () => {
  const page = await read(`transmissions/${id}.html`);
  const registry = await read('public/data/transmissions.json');
  const entry = JSON.stringify(JSON.parse(registry).transmissions.find(item => item.id === id));
  const services = await read('ai-services.json');
  const library = JSON.stringify(JSON.parse(services).transmission_library.transmission_38);
  for (const text of [page, entry, library]) {
    assert.equal(/[A-Za-z]:[\\/](?:unwind|Users)|\/root\/|receipt\.json|START_HERE|buildloop|icp_pulse|\b8162\b|\b8110\b|\bH6\b|Kling|Higgsfield|job_id|localhost|127\.0\.0\.1|lmstudio|lm-studio|ollama|\bJ-0\d\d\b/i.test(text), false);
  }
});

test('archive and service counts measure actual articles with Transmission 38 as the latest', async () => {
  const files = (await readdir(new URL('../transmissions/', import.meta.url)))
    .filter(file => /^\d{2}-.+\.html$/.test(file));
  const expected = files.map(file => `/transmissions/${file.slice(0, -5)}`).sort();
  const archive = await read('transmissions/index.html');
  const cards = [...archive.matchAll(/<a href="(\/transmissions\/[^" ]+)" class="tx-card"/g)].map(match => match[1]);
  assert.deepEqual([...cards].sort(), expected, 'archive includes every real article exactly once');
  const idx38 = cards.indexOf(route);
  const idx37 = cards.indexOf(route37);
  const idx36 = cards.indexOf(route36);
  assert.deepEqual([idx37 - idx38, idx36 - idx38], [1, 2], 'Transmission 38 is still followed in number order by 37 and 36');
  assert.ok(cards.includes('/transmissions/27-the-quotation-cell'));
  assert.ok(cards.includes('/transmissions/27-the-site-became-a-public-index'));
  assert.equal(archive.match(/<a href="([^"]+)" class="tx-featured-card"/)[1], latestRoute, 'the featured card is the latest transmission, now Transmission 45');
  assert.match(archive, /<span class="tx-card-number">038<\/span>\s*<h3>One Board for Every Hand<\/h3>/);
  const schema = JSON.parse(archive.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const list = schema['@graph'].find(item => item['@type'] === 'ItemList');
  assert.equal(list.numberOfItems, files.length);
  assert.deepEqual(list.itemListElement.map(item => item.position), Array.from({ length: files.length }, (_, index) => index + 1));
  assert.deepEqual(list.itemListElement.map(item => item.url.replace('https://www.unwindcode.ai', '')).sort(), expected);
  const listIdx38 = list.itemListElement.findIndex(item => item.url === canonical);
  assert.equal(list.itemListElement[listIdx38].name, 'One Board for Every Hand');
  const blog = schema['@graph'].find(item => item['@type'] === 'Blog');
  assert.equal(blog.blogPost[0].url, latestCanonical);
  const blogIdx38 = blog.blogPost.findIndex(item => item.url === canonical);
  assert.equal(blog.blogPost[blogIdx38].datePublished, '2026-11-08');
  assert.equal(blog.blogPost[blogIdx38 + 1].url, `https://www.unwindcode.ai${route37}`);
  assert.ok(archive.includes(`<span>${files.length}</span> transmissions published`));
  assert.ok(archive.includes(`<dt>${files.length}</dt>`));
  const services = JSON.parse(await read('ai-services.json'));
  assert.equal(services.transmission_library.total_transmissions, files.length);
  assert.equal(services.transmission_library.latest.url, latestCanonical, 'the latest pointer is now Transmission 45');
  assert.equal(services.transmission_library.latest.id, 'transmission_45');
  assert.deepEqual(services.transmission_library.transmission_45, services.transmission_library.latest, 'the library entry and the latest pointer agree');
  assert.equal(services.transmission_library.transmission_38.url, canonical, 'Transmission 38 keeps its own library entry');
  assert.equal(services.transmission_library.transmission_37.url, `https://www.unwindcode.ai${route37}`, 'Transmission 37 keeps its own library entry');
  const llms = await read('llms.txt');
  assert.ok(llms.includes(`${files.length} dispatches as a proof library`));
  assert.ok(llms.includes('Transmission 38 documents the interim job board'));
  assert.ok((await read('public/llms.txt')).includes(canonical));
});

test('both homepages still carry Transmission 38 in number order after 37, even though it has rolled off the newest-three strip', async () => {
  const homepage = await read('public/lab/index.html');
  const cards = [...homepage.matchAll(/class="transmission-card"\s+href="([^"]+)"/g)].map(match => match[1]);
  assert.equal(cards.length, 3, 'the lab homepage keeps a three-card rolling window');
  assert.equal(cards[0], latestRoute, 'the rolling window leads with the latest transmission');
  assert.equal(cards.includes(route), false, 'Transmission 38 has rolled out of the three-card window');
  const legacy = await read('index.html');
  const legacyCards = [...legacy.matchAll(/class="blog-card" href="([^"]+)"/g)].map(match => match[1]);
  assert.equal(legacyCards[0], latestRoute);
  const legacyIdx38 = legacyCards.indexOf(route);
  const legacyIdx37 = legacyCards.indexOf(route37);
  const legacyIdx36 = legacyCards.indexOf(route36);
  assert.deepEqual([legacyIdx37 - legacyIdx38, legacyIdx36 - legacyIdx38], [1, 2], 'the legacy homepage keeps 38, 37, 36 adjacent in number order');
  assert.ok(legacy.includes('Transmission 38: One Board for Every Hand'));
});

test('public retrieval metadata binds Transmission 38 to its dated field note without operational authority', async () => {
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  assert.equal(registry.transmissions[0].id, '45-where-this-is-going', 'the newest transmission is now Transmission 45');
  const records = registry.transmissions.filter(item => item.id === id);
  assert.equal(records.length, 1);
  const entry = records[0];
  assert.equal(entry.transmission_number, 38);
  assert.equal(entry.title, 'Transmission 38: One Board for Every Hand');
  assert.equal(entry.source_file, `transmissions/${id}.html`);
  assert.equal(entry.route, route);
  assert.equal(entry.review_status, 'public_safe');
  assert.equal(entry.confidence, 'high');
  assert.ok(entry.summary.startsWith('Field note on the interim job board every Genesis hand reads before acting'));
  assert.ok(entry.summary.includes("the operator's ruling that nothing stays only on the machine"));
  for (const tag of ['agent-coordination', 'job-board', 'local-models', 'custody-boundary']) {
    assert.ok(entry.topic_tags.includes(tag), `registry entry carries topic tag ${tag}`);
  }
  assert.deepEqual(entry.memory_layers, ['procedural', 'episodic']);
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

test('the transmission numbering is contiguous through Transmission 45, with Transmission 38 still in place', async () => {
  const registry = JSON.parse(await read('public/data/transmissions.json'));
  const numbers = new Set(registry.transmissions.map(item => item.transmission_number));
  const latest = Math.max(...numbers);
  assert.equal(latest, 45);
  assert.ok(numbers.has(38), 'Transmission 38 is still registered');
  const missing = Array.from({ length: latest }, (_, index) => index + 1).filter(number => !numbers.has(number));
  assert.deepEqual(missing, []);
  const parityTest = await read('tests/public-parity-script.test.js');
  assert.match(parityTest, /latest_number: 45,\s+published_count: 46,\s+has_gaps: false,\s+missing_numbers: \[\]/, 'the parity snapshot states the new latest with no gap');
  const statusTest = await read('tests/status-api.test.js');
  assert.match(statusTest, /latest_number: 45,\s+published_count: 46,/, 'the status snapshot states the new latest');
});
