import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const ROOT = new URL('../', import.meta.url);
const REGISTRY_URL = new URL('../public/data/claims.json', import.meta.url);
const CANONICAL_ORIGIN = 'https://www.unwindcode.ai';
const CLAIM_STATUSES = new Set(['public_safe', 'safety_qualified', 'needs_context', 'future_vision']);
const EVIDENCE_STATUSES = new Set([
  'source_backed',
  'source_copy_present',
  'qualified_by_public_transmission',
  'roadmap_language',
]);

async function loadRegistry() {
  try {
    return JSON.parse(await readFile(REGISTRY_URL, 'utf8'));
  } catch (error) {
    assert.fail(`claim registry should exist and parse as JSON: ${error.message}`);
  }
}

async function assertRouteExists(route) {
  const url = new URL(route, CANONICAL_ORIGIN);
  assert.equal(url.origin, CANONICAL_ORIGIN, `route must stay on canonical origin: ${route}`);
  assert.equal(url.hash, '', `route must not include fragments: ${route}`);

  const pathname = url.pathname;
  assert.equal(pathname.includes('..'), false, `route must not escape root: ${route}`);

  if (pathname === '/') {
    await access(new URL('index.html', ROOT));
    return;
  }

  if (pathname.endsWith('/')) {
    await access(new URL(`${pathname.slice(1)}index.html`, ROOT));
    return;
  }

  await access(new URL(pathname.slice(1), ROOT));
}

async function assertSourceFileExists(sourceFile) {
  assert.equal(sourceFile.startsWith('.'), false, `source file must not be hidden: ${sourceFile}`);
  assert.equal(sourceFile.includes('..'), false, `source file must not escape root: ${sourceFile}`);
  assert.equal(/(^|\/)(\.env|\.worktrees|dist|node_modules|DEPLOYMENTS)(\/|$)/.test(sourceFile), false);
  await access(new URL(sourceFile, ROOT));
}

test('claim registry labels homepage and financial claims before broad retrieval', async () => {
  const registry = await loadRegistry();
  const claimIds = registry.claims.map((claim) => claim.id).sort();

  assert.equal(registry.schema_version, '2026-06-06.public-claim-registry.v1');
  assert.equal(registry.review_status, 'public_safe_draft');
  assert.deepEqual(claimIds, [
    'financial-organisms-real-markets',
    'future-independent-organisms',
    'hero-live-blockchains-stat',
    'hero-on-chain-autonomous-positioning',
    'proof-gated-financial-motion',
    'real-estate-property-sales-intelligence-boundary',
  ]);

  for (const claim of registry.claims) {
    assert.match(claim.id, /^[a-z0-9-]+$/);
    assert.ok(claim.text.length >= 20, `${claim.id} needs claim text`);
    assert.ok(CLAIM_STATUSES.has(claim.claim_status), `${claim.id} has unknown claim status`);
    assert.ok(EVIDENCE_STATUSES.has(claim.evidence_status), `${claim.id} has unknown evidence status`);
    assert.ok(['low', 'medium', 'high'].includes(claim.risk_level), `${claim.id} needs risk level`);
    assert.ok(claim.public_label.length >= 20, `${claim.id} needs public label`);
    assert.ok(claim.interpretation_boundary.length >= 40, `${claim.id} needs interpretation boundary`);
    assert.ok(claim.source_routes.length >= 1, `${claim.id} needs source routes`);
    assert.ok(claim.source_files.length >= 1, `${claim.id} needs source files`);
    assert.ok(claim.citations.length >= 1, `${claim.id} needs citations`);

    for (const route of claim.source_routes) {
      await assertRouteExists(route);
    }

    for (const sourceFile of claim.source_files) {
      await assertSourceFileExists(sourceFile);
    }

    for (const citation of claim.citations) {
      assert.equal(typeof citation.label, 'string');
      await assertRouteExists(citation.route);
      await assertSourceFileExists(citation.source_file);
    }
  }
});

test('claim registry keeps high-risk Web3 claims qualified and public-safe', async () => {
  const registry = await loadRegistry();
  const highRiskClaims = registry.claims.filter((claim) => claim.risk_level === 'high');

  assert.ok(highRiskClaims.length >= 2, 'expected high-risk Web3/autonomy claims to be explicitly labeled');
  assert.ok(
    highRiskClaims.every((claim) => ['needs_context', 'safety_qualified'].includes(claim.claim_status)),
    'high-risk claims should not be unlabeled public-safe claims',
  );
  assert.ok(
    highRiskClaims.every((claim) => /not|does not|no |without/i.test(claim.interpretation_boundary)),
    'high-risk claims should include a clear non-expansion boundary',
  );
});

test('claim registry does not expose secrets or private operational material', async () => {
  const raw = await readFile(REGISTRY_URL, 'utf8');

  assert.equal(/SUPABASE_SERVICE_ROLE_KEY|PRIVATE_KEY|BEGIN RSA PRIVATE KEY/i.test(raw), false);
  assert.equal(/\brnd_[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/\bsk-[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/wallet_private_key|service-role|raw prompt|hidden repo/i.test(raw), false);
  assert.equal(raw.includes('owner-filled-redacted-manifest'), false);
  assert.equal(raw.includes('auto-post'), false);
  assert.equal(raw.includes('posted_publicly'), false);
  assert.equal(raw.includes('25-the-homepage-learned-to-pulse'), false);
});
