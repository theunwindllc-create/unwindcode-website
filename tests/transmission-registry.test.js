import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const ROOT = new URL('../', import.meta.url);
const REGISTRY_URL = new URL('../public/data/transmissions.json', import.meta.url);

async function activeTransmissionFiles() {
  return (await readdir(new URL('../transmissions/', import.meta.url)))
    .filter((file) => file.endsWith('.html') && file !== 'index.html')
    .sort();
}

async function loadRegistry() {
  return JSON.parse(await readFile(REGISTRY_URL, 'utf8'));
}

async function assertFileExists(path) {
  await access(new URL(path, ROOT));
}

test('transmission registry covers every active public transmission', async () => {
  const registry = await loadRegistry();
  const activeFiles = await activeTransmissionFiles();
  const expectedRoutes = activeFiles.map((file) => `/transmissions/${file}`);
  const actualRoutes = registry.transmissions.map((entry) => entry.route).sort();

  assert.equal(registry.schema_version, '2026-06-06.public-transmission-registry.v1');
  assert.equal(registry.review_status, 'public_safe_draft');
  assert.deepEqual(actualRoutes, expectedRoutes);

  for (const entry of registry.transmissions) {
    assert.match(entry.id, /^[0-9]{2}-[a-z0-9-]+$/);
    assert.equal(Number.isInteger(entry.transmission_number), true);
    assert.ok(entry.title.startsWith(`Transmission ${String(entry.transmission_number).padStart(2, '0')}:`));
    assert.ok(entry.summary.length >= 40, `${entry.id} needs a useful summary`);
    assert.equal(entry.route, `/transmissions/${entry.id}.html`);
    assert.equal(entry.source_file, `transmissions/${entry.id}.html`);
    assert.ok(entry.topic_tags.length >= 1, `${entry.id} needs topic tags`);
    assert.ok(entry.memory_layers.length >= 1, `${entry.id} needs memory layers`);
    assert.ok(entry.citations.length >= 1, `${entry.id} needs citations`);
    assert.equal(entry.review_status, 'public_safe');
    assert.match(entry.confidence, /^(high|medium|low)$/);

    for (const citation of entry.citations) {
      assert.equal(citation.route, entry.route);
      assert.equal(citation.source_file, entry.source_file);
      await assertFileExists(citation.source_file);
    }
  }
});

test('transmission registry is public safe retrieval seed data', async () => {
  const raw = await readFile(REGISTRY_URL, 'utf8');

  assert.equal(/SUPABASE_SERVICE_ROLE_KEY|PRIVATE_KEY|BEGIN RSA PRIVATE KEY/i.test(raw), false);
  assert.equal(/\brnd_[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/\bsk-[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/wallet_private_key|service-role|raw prompt|hidden repo/i.test(raw), false);
  assert.equal(raw.includes('owner-filled-redacted-manifest'), false);
  assert.equal(raw.includes('25-the-homepage-learned-to-pulse'), false);
  assert.equal(raw.includes('/organisms/'), false);
  assert.equal(raw.includes('/architecture/'), false);
  assert.equal(raw.includes('/proof/'), false);
});

test('property sales intelligence transmission uses the live canonical slug', async () => {
  const registry = await loadRegistry();
  const entry = registry.transmissions.find((candidate) => candidate.transmission_number === 26);

  assert.ok(entry, 'Transmission 26 should be registered');
  assert.equal(entry.id, '26-property-sales-intelligence-cell');
  assert.equal(entry.route, '/transmissions/26-property-sales-intelligence-cell.html');
  assert.equal(entry.source_file, 'transmissions/26-property-sales-intelligence-cell.html');
  assert.equal(entry.route.includes('26-the-property-sales-intelligence-cell'), false);
  await assertFileExists(entry.source_file);
});

test('property sales intelligence transmission exposes the prepared social packet boundary', async () => {
  const page = await readFile(new URL('../transmissions/26-property-sales-intelligence-cell.html', import.meta.url), 'utf8');

  assert.match(page, /id="social-proof-packet"/);
  assert.match(page, /07 \/ Social packet/);
  assert.match(page, /eight upload-ready Instagram frames/i);
  assert.match(page, /Creator approval is required before publishing/i);
  assert.match(page, /social\/transmission-26-property-sales-intelligence-cell-carousel\/carousel\.html/);
  assert.match(page, /social\/transmission-26-property-sales-intelligence-cell-carousel\/downloads\/transmission-26-property-sales-intelligence-cell-carousel\.zip/);
  assert.match(page, /social\/transmission-26-property-sales-intelligence-cell-carousel\/caption\.md/);
  assert.match(page, /ready-to-upload\/01-property-sales-intelligence-cell\.png/);
  for (let slide = 1; slide <= 8; slide += 1) {
    const number = String(slide).padStart(2, '0');
    assert.match(
      page,
      new RegExp(`previews/slide-${number}-preview\\.png`),
      `social proof packet should expose preview image ${number}`,
    );
  }
  assert.equal(/four upload-ready Instagram frames/i.test(page), false);
});

test('new local transmissions expose prepared social packet boundaries', async () => {
  const packets = [
    {
      page: '../transmissions/27-the-site-became-a-public-index.html',
      folder: 'transmission-27-site-public-index-carousel',
      zip: 'transmission-27-site-public-index-carousel.zip',
      upload: 'ready-to-upload/01-site-public-index.png',
    },
    {
      page: '../transmissions/28-the-memory-control-plane.html',
      folder: 'transmission-28-memory-control-plane-carousel',
      zip: 'transmission-28-memory-control-plane-carousel.zip',
      upload: 'ready-to-upload/01-memory-control-plane.png',
    },
  ];

  for (const packet of packets) {
    const page = await readFile(new URL(packet.page, import.meta.url), 'utf8');

    assert.match(page, /id="social-proof-packet"/);
    assert.match(page, /four-frame proof packet/i);
    assert.match(page, /Creator approval is required before publishing/i);
    assert.match(page, new RegExp(`social/${packet.folder}/carousel\\.html#slide-1`));
    assert.match(page, new RegExp(`social/${packet.folder}/downloads/${packet.zip}`));
    assert.match(page, new RegExp(`social/${packet.folder}/caption\\.md`));
    assert.ok(page.includes(packet.upload), `${packet.folder} should expose the first upload PNG`);
    for (let slide = 1; slide <= 4; slide += 1) {
      const number = String(slide).padStart(2, '0');
      assert.match(
        page,
        new RegExp(`previews/slide-${number}-preview\\.png`),
        `${packet.folder} should expose preview image ${number}`,
      );
    }
  }
});

test('transmission archive exposes latest social packet desk', async () => {
  const archive = await readFile(new URL('../transmissions/index.html', import.meta.url), 'utf8');

  assert.match(archive, /id="social-packet-desk"/);
  assert.match(archive, /Social Packet Desk/);
  assert.match(archive, /Transmission 28 Memory Control Plane Carousel/);
  assert.match(archive, /social\/transmission-28-memory-control-plane-carousel\/carousel\.html#slide-1/);
  assert.match(archive, /social\/transmission-28-memory-control-plane-carousel\/downloads\/transmission-28-memory-control-plane-carousel\.zip/);
  assert.match(archive, /social\/transmission-28-memory-control-plane-carousel\/caption\.md/);
  assert.match(archive, /Transmission 27 Site Public Index Carousel/);
  assert.match(archive, /social\/transmission-27-site-public-index-carousel\/carousel\.html#slide-1/);
  assert.match(archive, /social\/transmission-27-site-public-index-carousel\/downloads\/transmission-27-site-public-index-carousel\.zip/);
  assert.match(archive, /social\/transmission-27-site-public-index-carousel\/caption\.md/);
  assert.match(archive, /Transmission 26 Property Sales Intelligence Carousel/);
  assert.match(archive, /Creator review required/);
  assert.match(archive, /social\/transmission-26-property-sales-intelligence-cell-carousel\/carousel\.html#slide-1/);
  assert.match(archive, /social\/transmission-26-property-sales-intelligence-cell-carousel\/downloads\/transmission-26-property-sales-intelligence-cell-carousel\.zip/);
  assert.match(archive, /social\/transmission-26-property-sales-intelligence-cell-carousel\/caption\.md/);
  for (let slide = 1; slide <= 8; slide += 1) {
    const number = String(slide).padStart(2, '0');
    assert.match(
      archive,
      new RegExp(`previews/slide-${number}-preview\\.png`),
      `archive social packet desk should expose preview image ${number}`,
    );
  }
});

test('property sales intelligence transmission records source-backed Brain decision', async () => {
  const page = await readFile(new URL('../transmissions/26-property-sales-intelligence-cell.html', import.meta.url), 'utf8');

  assert.match(page, /02 \/ Brain decision/);
  assert.match(page, /The signal passed because housing AI is moving from search into guided action/);
  assert.match(page, /Zillow AI Mode source/);
  assert.match(page, /Redfin ChatGPT source/);
  assert.match(page, /Realtor\.com ChatGPT source/);
  assert.match(page, /NAR TCPA source/);
  assert.match(page, /manual protocol run, not an unattended publication/i);
});

test('property sales intelligence public package avoids blocked outreach phrases verbatim', async () => {
  const publicSources = [
    await readFile(new URL('../transmissions/26-property-sales-intelligence-cell.html', import.meta.url), 'utf8'),
    await readFile(new URL('../social/transmission-26-property-sales-intelligence-cell-carousel/carousel.html', import.meta.url), 'utf8'),
    await readFile(new URL('../social/transmission-26-property-sales-intelligence-cell-carousel/caption.md', import.meta.url), 'utf8'),
  ].join('\n');

  const blockedPhrases = [
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
    'guaranteed valuation',
    'guaranteed financing approval',
  ];

  for (const phrase of blockedPhrases) {
    assert.equal(
      publicSources.toLowerCase().includes(phrase.toLowerCase()),
      false,
      `public package should not include blocked phrase verbatim: ${phrase}`,
    );
  }

  assert.match(publicSources, /consent/i);
  assert.match(publicSources, /human approval/i);
  assert.match(publicSources, /proof before outreach/i);
  assert.match(publicSources, /Do not auto-post|automated social posting/i);
  assert.equal(/auto-posted|automatic posting enabled|automated posting authority/i.test(publicSources), false);
});
