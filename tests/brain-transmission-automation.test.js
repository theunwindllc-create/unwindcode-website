import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import test from 'node:test';

const execFileAsync = promisify(execFile);
const ROOT = new URL('../', import.meta.url);

function projectFile(path) {
  return readFile(new URL(path, ROOT), 'utf8');
}

test('brain transmission automation chooses the next public-safe transmission', async () => {
  const { stdout } = await execFileAsync('node', ['scripts/unwind-transmission-brain.mjs', '--dry-run'], {
    cwd: ROOT,
  });
  const decision = JSON.parse(stdout);

  assert.equal(decision.next.number, 27);
  assert.equal(decision.next.slug, 'the-quotation-cell');
  assert.equal(decision.next.route, '/transmissions/27-the-quotation-cell');
  assert.equal(decision.next.topic, 'Quotation Cell');
  assert.equal(decision.review.status, 'public_safe_draft');
  assert.equal(decision.review.synthesis_boundary, 'human_approval_before_commitment');
  assert.equal(decision.review.execution_mode, 'manual_brain_protocol');
  assert.equal(decision.review.private_business_names_allowed, false);
  assert.ok(decision.next.reason.includes('quoting'));
  assert.ok(decision.next.reason.includes('approval'));
  assert.ok(decision.outputs.includes('transmissions/27-the-quotation-cell.html'));
  assert.ok(decision.outputs.includes('transmissions/index.html'));
  assert.ok(decision.outputs.includes('index.html'));
  assert.ok(decision.outputs.includes('sitemap.xml'));
  assert.ok(decision.outputs.includes('llms.txt'));
  assert.ok(decision.outputs.includes('ai-services.json'));
  assert.ok(decision.outputs.includes('assets/asset-manifest.json'));
  assert.ok(decision.outputs.includes('social/transmission-27-quotation-cell/carousel.html'));
  assert.ok(decision.outputs.includes('social/transmission-27-quotation-cell/ready-to-upload/01-quotation-cell.png'));

  for (const phrase of decision.review.blocked_phrases) {
    assert.equal(decision.preview.toLowerCase().includes(phrase.toLowerCase()), false);
  }
});

test('transmission 26 publishes the brain-selected real estate cell with bounded automation', async () => {
  const transmission = await projectFile('transmissions/26-property-sales-intelligence-cell.html');
  const archive = await projectFile('transmissions/index.html');
  const homepage = await projectFile('index.html');
  const sitemap = await projectFile('sitemap.xml');
  const llms = await projectFile('llms.txt');
  const services = await projectFile('ai-services.json');
  const manifest = JSON.parse(await projectFile('assets/asset-manifest.json'));
  const css = await projectFile('style.css');

  for (const snippet of [
    'Transmission 26: The Property Sales Intelligence Cell',
    'rel="canonical" href="https://www.unwindcode.ai/transmissions/26-property-sales-intelligence-cell"',
    '<meta property="og:type" content="article" />',
    '"@type":"Article"',
    '"datePublished":"2026-06-06"',
    'id="brain-decision"',
    'id="cell-map"',
    'id="approval-gates"',
    'id="signal-chart"',
    'id="tx26-authority-title"',
    'class="tx26-authority-meter"',
    'class="tx26-meter-item meter-activate"',
    'id="boundary-cards"',
    'Real Estate Property Sales Intelligence',
    'permitted lead sources',
    'human approval before outreach',
  ]) {
    assert.ok(transmission.includes(snippet), `Transmission 26 missing ${snippet}`);
  }

  assert.equal(transmission.includes('https://cdn.jsdelivr.net/npm/chart.js'), false, 'Transmission 26 should not depend on CDN chart JavaScript');
  assert.equal(transmission.includes('<canvas'), false, 'Transmission 26 should not need canvas for the authority meter');
  assert.equal(transmission.includes('new Chart('), false, 'Transmission 26 should not run inline chart JavaScript');
  assert.equal(transmission.includes('<style>'), false, 'Transmission 26 styles should live in shared CSS');

  for (const snippet of [
    '.tx26-authority-meter',
    '.tx26-meter-track',
    '.meter-activate .tx26-meter-bar',
    '.tx26-module-tabs label:hover',
  ]) {
    assert.ok(css.includes(snippet), `shared CSS missing Transmission 26 snippet ${snippet}`);
  }

  for (const blocked of [
    'autonomous cold outreach',
    'scrape property owners',
    'find motivated sellers automatically',
    'text leads for you',
    'call leads for you',
    'TCPA compliant',
    'DNC safe',
    'guaranteed appointments',
    'guaranteed ROI',
    'predict seller intent',
  ]) {
    assert.equal(transmission.toLowerCase().includes(blocked.toLowerCase()), false);
  }

  assert.ok(archive.includes('"numberOfItems":36'), 'archive JSON-LD should count 36 transmission pages');
  assert.ok(archive.includes('/transmissions/26-property-sales-intelligence-cell'), 'archive missing Transmission 26 route');
  assert.ok(archive.includes('<dt>33</dt>'), 'archive metric should show the latest transmission number');
  assert.ok(homepage.includes('/transmissions/27-the-quotation-cell'), 'homepage latest teaser should point to Transmission 27');
  assert.ok(sitemap.includes('https://www.unwindcode.ai/transmissions/26-property-sales-intelligence-cell'), 'sitemap missing Transmission 26');
  assert.ok(sitemap.includes('https://www.unwindcode.ai/social/transmission-26-property-sales-intelligence-cell/carousel'), 'sitemap missing Transmission 26 carousel');
  assert.ok(llms.includes('Transmission 26: https://www.unwindcode.ai/transmissions/26-property-sales-intelligence-cell'), 'llms missing Transmission 26');
  assert.ok(llms.includes('Transmission 26 social carousel: https://www.unwindcode.ai/social/transmission-26-property-sales-intelligence-cell/carousel#slide-1'), 'llms missing Transmission 26 carousel');
  assert.ok(llms.includes('https://www.unwindcode.ai/social/transmission-26-property-sales-intelligence-cell/downloads/transmission-26-property-sales-intelligence-cell.zip'), 'llms missing Transmission 26 carousel ZIP');
  assert.ok(llms.includes('35 dispatches as a proof library'), 'llms should update library count');
  assert.ok(llms.includes('dependency-free semantic HTML and shared CSS'), 'llms missing Transmission 26 dependency-free authority scale note');
  assert.ok(services.includes('"id": "transmission_26"'), 'ai-services missing Transmission 26 proof artifact');
  assert.ok(services.includes('"id": "transmission_26_social_carousel"'), 'ai-services missing Transmission 26 social carousel');
  assert.ok(services.includes('"download_packet": "https://www.unwindcode.ai/social/transmission-26-property-sales-intelligence-cell/downloads/transmission-26-property-sales-intelligence-cell.zip"'), 'ai-services missing Transmission 26 carousel ZIP');
  assert.ok(services.includes('"total_transmissions": 35'), 'ai-services should update latest transmission number');
  assert.ok(services.includes('"audience": "real_estate_teams"'), 'ai-services missing real estate audience boundary');
  assert.ok(services.includes('"interface_boundary": "The authority scale is rendered as semantic HTML and shared CSS'), 'ai-services missing dependency-free interface boundary');

  const asset = manifest.assets.find(item => item.id === 'transmission-26-social-carousel');
  assert.ok(asset, 'asset manifest missing Transmission 26 social carousel');
  assert.equal(asset.file, 'social/transmission-26-property-sales-intelligence-cell/ready-to-upload/01-property-sales-intelligence-cell.png');
  assert.equal(asset.download_packet, 'social/transmission-26-property-sales-intelligence-cell/downloads/transmission-26-property-sales-intelligence-cell.zip');
  assert.equal(asset.surface, '#social-proof-packet');
  assert.equal(asset.performance.loading, 'lazy');
});

test('transmission 27 publishes the quotation cell without private business names or outcome claims', async () => {
  const transmission = await projectFile('transmissions/27-the-quotation-cell.html');
  const archive = await projectFile('transmissions/index.html');
  const homepage = await projectFile('index.html');
  const sitemap = await projectFile('sitemap.xml');
  const llms = await projectFile('llms.txt');
  const services = await projectFile('ai-services.json');
  const manifest = JSON.parse(await projectFile('assets/asset-manifest.json'));
  const caption = await projectFile('social/transmission-27-quotation-cell/caption.md');
  const carousel = await projectFile('social/transmission-27-quotation-cell/carousel.html');

  for (const snippet of [
    'Transmission 27: The Quotation Cell',
    'rel="canonical" href="https://www.unwindcode.ai/transmissions/27-the-quotation-cell"',
    '<meta property="og:type" content="article" />',
    '"@type":"Article"',
    '"datePublished":"2026-06-07"',
    'id="brain-decision"',
    'id="manual-brain-run"',
    'id="cell-map"',
    'id="organism-build-recipe"',
    'id="correction-loop"',
    'id="readiness-meter"',
    'id="tx27-readiness-title"',
    'class="tx26-authority-meter"',
    'id="boundary-cards"',
    'id="proof-ledger"',
    'id="social-proof-packet"',
    '/social/transmission-27-quotation-cell/previews/slide-01-preview.png',
    '/social/transmission-27-quotation-cell/ready-to-upload/01-quotation-cell.png',
    '/social/transmission-27-quotation-cell/downloads/transmission-27-quotation-cell.zip',
    '/social/transmission-27-quotation-cell/carousel#slide-1',
    '/social/transmission-27-quotation-cell/caption.md',
    'supplier memory',
    'manual Brain protocol',
    'Organism build recipe',
    'public page, metadata, tests, social packet, deployment route, and production smoke',
    'transaction readiness',
    'human approval before commitment',
  ]) {
    assert.ok(transmission.includes(snippet), `Transmission 27 missing ${snippet}`);
  }

  for (const blocked of [
    'Lizard Solutions',
    'guaranteed price',
    'guaranteed availability',
    'automatic purchasing',
    'legally binding quote',
    'final price',
    'guaranteed fulfillment',
    'purchase for you',
    'fulfill automatically',
    'no human review',
  ]) {
    const lowered = blocked.toLowerCase();
    assert.equal(transmission.toLowerCase().includes(lowered), false, `Transmission 27 contains ${blocked}`);
    assert.equal(caption.toLowerCase().includes(lowered), false, `Transmission 27 caption contains ${blocked}`);
    assert.equal(carousel.toLowerCase().includes(lowered), false, `Transmission 27 carousel contains ${blocked}`);
  }

  assert.ok(archive.includes('"numberOfItems":36'), 'archive JSON-LD should count 36 transmission pages');
  assert.ok(archive.includes('/transmissions/27-the-quotation-cell'), 'archive missing Transmission 27 route');
  assert.ok(archive.includes('<dt>33</dt>'), 'archive metric should show the latest transmission number');
  assert.ok(homepage.includes('/transmissions/27-the-quotation-cell'), 'homepage missing Transmission 27 teaser');
  assert.ok(sitemap.includes('https://www.unwindcode.ai/transmissions/27-the-quotation-cell'), 'sitemap missing Transmission 27');
  assert.ok(sitemap.includes('https://www.unwindcode.ai/social/transmission-27-quotation-cell/carousel'), 'sitemap missing Transmission 27 carousel');
  assert.ok(llms.includes('Transmission 27: https://www.unwindcode.ai/transmissions/27-the-quotation-cell'), 'llms missing Transmission 27');
  assert.ok(llms.includes('Transmission 27 social carousel: https://www.unwindcode.ai/social/transmission-27-quotation-cell/carousel#slide-1'), 'llms missing Transmission 27 carousel');
  assert.ok(llms.includes('https://www.unwindcode.ai/social/transmission-27-quotation-cell/downloads/transmission-27-quotation-cell.zip'), 'llms missing Transmission 27 carousel ZIP');
  assert.ok(llms.includes('35 dispatches as a proof library'), 'llms should update library count');
  assert.ok(services.includes('"id": "transmission_27"'), 'ai-services missing Transmission 27 proof artifact');
  assert.ok(services.includes('"id": "transmission_27_social_carousel"'), 'ai-services missing Transmission 27 social carousel');
  assert.ok(services.includes('"privacy_boundary": "Public copy abstracts the domain cell'), 'ai-services missing private business name boundary');
  assert.ok(services.includes('"total_transmissions": 35'), 'ai-services should update latest transmission number');

  const asset = manifest.assets.find(item => item.id === 'transmission-27-social-carousel');
  assert.ok(asset, 'asset manifest missing Transmission 27 social carousel');
  assert.equal(asset.file, 'social/transmission-27-quotation-cell/ready-to-upload/01-quotation-cell.png');
  assert.equal(asset.download_packet, 'social/transmission-27-quotation-cell/downloads/transmission-27-quotation-cell.zip');
  assert.equal(asset.surface, '#social-proof-packet');
  assert.equal(asset.performance.loading, 'lazy');
});
