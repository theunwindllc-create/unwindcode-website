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
  const expectedRoutes = activeFiles.map((file) => `/transmissions/${file.replace(/\.html$/u, '')}`);
  const actualRoutes = registry.transmissions.map((entry) => entry.route).sort();

  assert.equal(registry.schema_version, '2026-06-06.public-transmission-registry.v1');
  assert.equal(registry.review_status, 'public_safe_draft');
  assert.deepEqual(actualRoutes, expectedRoutes);

  for (const entry of registry.transmissions) {
    assert.match(entry.id, /^[0-9]{2}-[a-z0-9-]+$/);
    assert.equal(Number.isInteger(entry.transmission_number), true);
    assert.ok(entry.title.startsWith(`Transmission ${String(entry.transmission_number).padStart(2, '0')}:`));
    assert.ok(entry.summary.length >= 40, `${entry.id} needs a useful summary`);
    assert.equal(entry.route, `/transmissions/${entry.id}`);
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
  assert.equal(raw.includes('/organisms'), false);
  assert.equal(raw.includes('/architecture'), false);
  assert.equal(raw.includes('/proof'), false);
});

test('property sales intelligence transmission uses the live canonical slug', async () => {
  const registry = await loadRegistry();
  const entry = registry.transmissions.find((candidate) => candidate.transmission_number === 26);

  assert.ok(entry, 'Transmission 26 should be registered');
  assert.equal(entry.id, '26-property-sales-intelligence-cell');
  assert.equal(entry.route, '/transmissions/26-property-sales-intelligence-cell');
  assert.equal(entry.source_file, 'transmissions/26-property-sales-intelligence-cell.html');
  assert.equal(entry.route.includes('26-the-property-sales-intelligence-cell'), false);
  await assertFileExists(entry.source_file);
});

test('public transmission pages keep posting assets internal', async () => {
  const publicPages = [
    '../transmissions/26-property-sales-intelligence-cell.html',
    '../transmissions/27-the-site-became-a-public-index.html',
    '../transmissions/28-the-memory-control-plane.html',
    '../transmissions/29-the-agent-readable-organism.html',
    '../transmissions/30-the-operator-readiness-layer.html',
    '../transmissions/31-the-active-source-of-truth-gate.html',
  ];

  for (const pagePath of publicPages) {
    const page = await readFile(new URL(pagePath, import.meta.url), 'utf8');

    assert.equal(page.includes('id="social-proof-packet"'), false, `${pagePath} should not expose a public social packet section`);
    assert.equal(/\/social\/transmission-[^"']+/i.test(page), false, `${pagePath} should not link to internal posting assets`);
    assert.equal(/Open carousel|Download packet|Caption packet/i.test(page), false, `${pagePath} should not present posting actions`);
  }
});

test('new local transmissions read as Brain guides and compact whitepaper notes', async () => {
  const publicIndex = await readFile(new URL('../transmissions/27-the-site-became-a-public-index.html', import.meta.url), 'utf8');
  const memoryControlPlane = await readFile(new URL('../transmissions/28-the-memory-control-plane.html', import.meta.url), 'utf8');
  const agentReadableOrganism = await readFile(new URL('../transmissions/29-the-agent-readable-organism.html', import.meta.url), 'utf8');
  const operatorReadinessLayer = await readFile(new URL('../transmissions/30-the-operator-readiness-layer.html', import.meta.url), 'utf8');
  const activeSourceOfTruthGate = await readFile(new URL('../transmissions/31-the-active-source-of-truth-gate.html', import.meta.url), 'utf8');

  assert.match(publicIndex, /Public Index Protocol/);
  assert.match(publicIndex, /Context without coordinates becomes agent entropy/i);
  assert.match(publicIndex, /retrieval is not authority/i);
  assert.match(publicIndex, /spatial determinism/i);
  assert.match(publicIndex, /no source without boundary, no answer without citations, no action without approval/i);
  assert.match(publicIndex, /04 \/ Build recipe/);
  assert.match(publicIndex, /How the Brain should use this protocol/i);
  assert.match(publicIndex, /next-cell memory/i);
  assert.match(publicIndex, /posting assets for this transmission remain internal creator material/i);

  assert.match(memoryControlPlane, /Memory Control Plane/);
  assert.match(memoryControlPlane, /Memory without a control plane becomes hidden authority/i);
  assert.match(memoryControlPlane, /make recall governable/i);
  assert.match(memoryControlPlane, /Metadata before memory body/i);
  assert.match(memoryControlPlane, /No mutation without a receipt/i);
  assert.match(memoryControlPlane, /04 \/ Build recipe/);
  assert.match(memoryControlPlane, /How the Brain should use this control plane/i);
  assert.match(memoryControlPlane, /next-cell memory/i);
  assert.match(memoryControlPlane, /posting assets for this transmission remain internal creator material/i);

  assert.match(agentReadableOrganism, /Agent-Readable Organism/);
  assert.match(agentReadableOrganism, /The next web interface is not a page/i);
  assert.match(agentReadableOrganism, /agent-readable design is an architectural discipline/i);
  assert.match(agentReadableOrganism, /Agent Contract Protocol/i);
  assert.match(agentReadableOrganism, /context laundering/i);
  assert.match(agentReadableOrganism, /Agent Readiness Cell/i);
  assert.match(agentReadableOrganism, /Manual Brain Mode transmission/i);
  assert.match(agentReadableOrganism, /Agent-readable does not mean agent-authorized/i);
  assert.match(agentReadableOrganism, /next-cell memory/i);
  assert.match(agentReadableOrganism, /https:\/\/vercel\.com\/changelog\/program-agent-harnesses-with-ai-sdk/);
  assert.match(agentReadableOrganism, /https:\/\/openai\.com\/index\/the-next-evolution-of-the-agents-sdk\//);
  assert.match(agentReadableOrganism, /https:\/\/blog\.cloudflare\.com\/agent-readiness\//);

  assert.match(operatorReadinessLayer, /Operator Readiness Layer/);
  assert.match(operatorReadinessLayer, /Readiness before authority/i);
  assert.match(operatorReadinessLayer, /content-free memory triage/i);
  assert.match(operatorReadinessLayer, /Operator Readiness Cell/);
  assert.match(operatorReadinessLayer, /Manual Brain Mode/i);
  assert.match(operatorReadinessLayer, /Ready is confused with allowed/i);
  assert.match(operatorReadinessLayer, /next-cell memory/i);
  assert.match(operatorReadinessLayer, /Posting assets for this transmission remain internal creator material/i);

  assert.match(activeSourceOfTruthGate, /Active Source-of-Truth Gate/);
  assert.match(activeSourceOfTruthGate, /Publication is identity transfer/i);
  assert.match(activeSourceOfTruthGate, /Ready does not mean current/i);
  assert.match(activeSourceOfTruthGate, /live-lane identity/i);
  assert.match(activeSourceOfTruthGate, /Internal boundary guard/i);
  assert.match(activeSourceOfTruthGate, /Release Identity Controller/i);
  assert.match(activeSourceOfTruthGate, /Manual Brain Mode/i);
  assert.match(activeSourceOfTruthGate, /Posting assets for this transmission remain internal creator material/i);
});

test('transmission archive is a guide library, not a public posting desk', async () => {
  const archive = await readFile(new URL('../transmissions/index.html', import.meta.url), 'utf8');

  assert.match(archive, /whitepaper-style records/i);
  assert.match(archive, /31<\/span> transmissions published/);
  assert.equal(archive.includes('id="social-packet-desk"'), false);
  assert.equal(/Social Packet Desk|Open carousel|Download ZIP|View caption/i.test(archive), false);
  assert.equal(/\/social\/transmission-[^"']+/i.test(archive), false);
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
