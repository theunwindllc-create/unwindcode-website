import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const ROOT = new URL('../', import.meta.url);
const REGISTRY_URL = new URL('../public/data/organisms.json', import.meta.url);
const CLAIMS_URL = new URL('../public/data/claims.json', import.meta.url);

async function loadRegistry() {
  return JSON.parse(await readFile(REGISTRY_URL, 'utf8'));
}

async function loadClaims() {
  const registry = JSON.parse(await readFile(CLAIMS_URL, 'utf8'));
  return new Map(registry.claims.map((claim) => [claim.id, claim]));
}

async function assertFileExists(path) {
  await access(new URL(path, ROOT));
}

function stripHashAndQuery(route) {
  return route.split(/[?#]/)[0];
}

async function assertRouteExists(route) {
  const pathname = stripHashAndQuery(route);

  assert.ok(pathname.startsWith('/'), `route must be absolute: ${route}`);
  assert.equal(pathname.includes('..'), false, `route must not escape site root: ${route}`);

  if (pathname === '/') {
    await assertFileExists('index.html');
    return;
  }

  if (pathname.endsWith('/')) {
    await assertFileExists(`${pathname.slice(1)}index.html`);
    return;
  }

  const relative = pathname.slice(1);
  if (/\.[a-z0-9]+$/iu.test(relative)) {
    await assertFileExists(relative);
    return;
  }

  // Clean URLs: an extensionless route serves `<path>.html`, else `<path>/index.html`.
  try {
    await assertFileExists(`${relative}.html`);
  } catch {
    await assertFileExists(`${relative}/index.html`);
  }
}

test('organism registry is public safe and source backed', async () => {
  const registry = await loadRegistry();
  const claimsById = await loadClaims();
  const expectedIds = [
    'unwind-brain',
    'visual-cortex',
    'infinity-mirror',
    'financial-organisms',
    'brain-cell-architecture',
  ];

  assert.equal(registry.schema_version, '2026-06-06.public-organism-registry.v1');
  assert.equal(registry.review_status, 'public_safe_draft');
  assert.deepEqual(
    registry.organisms.map((organism) => organism.id).sort(),
    expectedIds.sort(),
  );

  for (const organism of registry.organisms) {
    assert.match(organism.id, /^[a-z0-9-]+$/);
    assert.equal(typeof organism.name, 'string');
    assert.ok(organism.summary.length >= 40, `${organism.id} needs a useful summary`);
    assert.ok(organism.capabilities.length >= 2, `${organism.id} needs capabilities`);
    assert.ok(organism.safety_boundaries.length >= 1, `${organism.id} needs boundaries`);
    assert.ok(organism.claim_references.length >= 1, `${organism.id} needs claim references`);
    assert.ok(organism.site_routes.length >= 1, `${organism.id} needs route references`);
    assert.ok(organism.source_files.length >= 1, `${organism.id} needs source files`);
    assert.equal(organism.review_status, 'public_safe');

    for (const route of organism.site_routes) {
      await assertRouteExists(route);
    }

    for (const sourceFile of organism.source_files) {
      await assertFileExists(sourceFile);
    }

    for (const reference of organism.claim_references) {
      const claim = claimsById.get(reference.claim_id);

      assert.ok(claim, `${organism.id} references unknown claim ${reference.claim_id}`);
      assert.equal(reference.claim_status, claim.claim_status);
      assert.equal(reference.evidence_status, claim.evidence_status);
      assert.equal(reference.risk_level, claim.risk_level);
      assert.ok(reference.purpose.length >= 20, `${organism.id} claim reference needs purpose`);
    }
  }
});

test('organism registry does not expose credentials or runtime evidence', async () => {
  const rawRegistry = await readFile(REGISTRY_URL, 'utf8');

  assert.equal(/SUPABASE_SERVICE_ROLE_KEY|PRIVATE_KEY|BEGIN RSA PRIVATE KEY/i.test(rawRegistry), false);
  assert.equal(/\brnd_[A-Za-z0-9]+\b/.test(rawRegistry), false);
  assert.equal(/\bsk-[A-Za-z0-9]+\b/.test(rawRegistry), false);
  assert.equal(/wallet_private_key|api_key|service-role/i.test(rawRegistry), false);
  assert.equal(rawRegistry.includes('owner-filled-redacted-manifest'), false);
});
