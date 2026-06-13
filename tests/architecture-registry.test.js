import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const ROOT = new URL('../', import.meta.url);
const REGISTRY_URL = new URL('../public/data/architecture.json', import.meta.url);
const CLAIMS_URL = new URL('../public/data/claims.json', import.meta.url);
const CANONICAL_ORIGIN = 'https://www.unwindcode.ai';

async function loadRegistry() {
  return JSON.parse(await readFile(REGISTRY_URL, 'utf8'));
}

async function loadClaims() {
  const registry = JSON.parse(await readFile(CLAIMS_URL, 'utf8'));
  return new Map(registry.claims.map((claim) => [claim.id, claim]));
}

async function assertRouteExists(route) {
  const url = new URL(route, CANONICAL_ORIGIN);
  assert.equal(url.origin, CANONICAL_ORIGIN, `route must stay on canonical origin: ${route}`);

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

test('architecture registry exposes source-backed public architecture concepts', async () => {
  const registry = await loadRegistry();
  const claimsById = await loadClaims();
  const conceptIds = registry.concepts.map((concept) => concept.id).sort();

  assert.equal(registry.schema_version, '2026-06-06.public-architecture-registry.v1');
  assert.equal(registry.review_status, 'public_safe_draft');
  assert.deepEqual(conceptIds, [
    'approval-spine',
    'cell-swap-protocol',
    'four-tier-memory-architecture',
    'public-proof-loop',
    'three-layer-cognitive-architecture',
  ]);

  for (const concept of registry.concepts) {
    assert.match(concept.id, /^[a-z0-9-]+$/);
    assert.match(concept.category, /^[a-z0-9-]+$/);
    assert.ok(concept.summary.length >= 50, `${concept.id} needs a useful summary`);
    assert.ok(concept.claims.length >= 2, `${concept.id} needs source-backed claims`);
    assert.ok(concept.source_routes.length >= 1, `${concept.id} needs source routes`);
    assert.ok(concept.source_files.length >= 1, `${concept.id} needs source files`);
    assert.ok(concept.citations.length >= 1, `${concept.id} needs citations`);
    assert.ok(concept.claim_references.length >= 1, `${concept.id} needs claim references`);
    assert.ok(concept.safety_boundaries.length >= 1, `${concept.id} needs boundaries`);
    assert.equal(concept.review_status, 'public_safe');
    assert.match(concept.confidence, /^(high|medium|low)$/);

    for (const route of concept.source_routes) {
      await assertRouteExists(route);
    }

    for (const sourceFile of concept.source_files) {
      await assertSourceFileExists(sourceFile);
    }

    for (const citation of concept.citations) {
      assert.equal(typeof citation.label, 'string');
      await assertRouteExists(citation.route);
      await assertSourceFileExists(citation.source_file);
    }

    for (const reference of concept.claim_references) {
      const claim = claimsById.get(reference.claim_id);

      assert.ok(claim, `${concept.id} references unknown claim ${reference.claim_id}`);
      assert.equal(reference.claim_status, claim.claim_status);
      assert.equal(reference.evidence_status, claim.evidence_status);
      assert.equal(reference.risk_level, claim.risk_level);
      assert.ok(reference.purpose.length >= 20, `${concept.id} claim reference needs purpose`);
    }
  }
});

test('architecture registry does not expose private or inactive material', async () => {
  const raw = await readFile(REGISTRY_URL, 'utf8');

  assert.equal(/SUPABASE_SERVICE_ROLE_KEY|PRIVATE_KEY|BEGIN RSA PRIVATE KEY/i.test(raw), false);
  assert.equal(/\brnd_[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/\bsk-[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/wallet_private_key|service-role|raw prompt|hidden repo/i.test(raw), false);
  assert.equal(raw.includes('owner-filled-redacted-manifest'), false);
  assert.equal(raw.includes('/architecture/'), false);
  assert.equal(raw.includes('/proof/'), false);
  assert.equal(raw.includes('25-the-homepage-learned-to-pulse'), false);
});
