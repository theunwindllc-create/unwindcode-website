import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const ROOT = new URL('../', import.meta.url);
const AI_SERVICES_URL = new URL('../public/ai-services.json', import.meta.url);
const ASSETS_URL = new URL('../public/data/assets.json', import.meta.url);
const CANONICAL_ORIGIN = 'https://www.unwindcode.ai';
const ALLOWED_ENDPOINTS = new Set([
  '/api/architecture',
  '/api/assets',
  '/api/chat',
  '/api/claims',
  '/api/grounding',
  '/api/organisms',
  '/api/search',
  '/api/status',
  '/api/subscribe',
  '/api/transmissions',
]);
const ALLOWED_CLAIM_SCOPES = new Set(['public_api_behavior', 'public_architecture']);

async function loadServices() {
  return JSON.parse(await readFile(AI_SERVICES_URL, 'utf8'));
}

async function loadAssets() {
  return JSON.parse(await readFile(ASSETS_URL, 'utf8'));
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

test('ai services metadata describes bounded active services only', async () => {
  const metadata = await loadServices();
  const serviceIds = metadata.services.map((service) => service.id).sort();

  assert.equal(metadata.schema_version, '2026-06-06.public-ai-services.v1');
  assert.equal(metadata.review_status, 'public_safe_draft');
  assert.deepEqual(serviceIds, [
    'architecture-registry',
    'asset-registry',
    'brain-chat',
    'claim-registry',
    'organism-registry',
    'public-backend-status',
    'public-grounding',
    'public-search',
    'subscriber-intake',
    'transmission-registry',
  ]);

  for (const service of metadata.services) {
    assert.match(service.id, /^[a-z0-9-]+$/);
    assert.equal(service.public, true);
    assert.equal(service.review_status, 'public_safe');
    assert.ok(ALLOWED_ENDPOINTS.has(service.endpoint), `${service.id} must use an allowed public endpoint`);
    assert.ok(ALLOWED_CLAIM_SCOPES.has(service.claim_scope), `${service.id} must have a bounded claim scope`);
    assert.ok(service.capabilities.length >= 1, `${service.id} needs capabilities`);
    assert.ok(service.safety_boundaries.length >= 1, `${service.id} needs safety boundaries`);
    assert.ok(service.source_files.length >= 1, `${service.id} needs source files`);
    assert.ok(service.citations.length >= 1, `${service.id} needs citations`);

    for (const route of service.source_routes) {
      await assertRouteExists(route);
    }

    for (const sourceFile of service.source_files) {
      assert.equal(sourceFile.startsWith('.'), false, `source file must not be hidden: ${sourceFile}`);
      assert.equal(sourceFile.includes('..'), false, `source file must not escape root: ${sourceFile}`);
      assert.equal(/(^|\/)(\.env|\.worktrees|dist|node_modules|DEPLOYMENTS)(\/|$)/.test(sourceFile), false);
      await access(new URL(sourceFile, ROOT));
    }

    for (const citation of service.citations) {
      assert.equal(typeof citation.label, 'string');
      await assertRouteExists(citation.route);
    }
  }
});

test('ai services metadata avoids secrets and inactive route claims', async () => {
  const raw = await readFile(AI_SERVICES_URL, 'utf8');

  assert.equal(/SUPABASE_SERVICE_ROLE_KEY|PRIVATE_KEY|BEGIN RSA PRIVATE KEY/i.test(raw), false);
  assert.equal(/\brnd_[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/\bsk-[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/wallet_private_key|service-role|raw prompt|hidden repo/i.test(raw), false);
  assert.equal(raw.includes('/organisms/'), false);
  assert.equal(raw.includes('/architecture/'), false);
  assert.equal(raw.includes('/proof/'), false);
  assert.equal(raw.includes('25-the-homepage-learned-to-pulse'), false);
  assert.equal(raw.includes('autonomous trading'), false);
  assert.equal(raw.includes('live trading'), false);
});

test('ai services metadata documents memory-aware retrieval boundaries', async () => {
  const metadata = await loadServices();
  const search = metadata.services.find((service) => service.id === 'public-search');
  const grounding = metadata.services.find((service) => service.id === 'public-grounding');

  assert.ok(search, 'public search service metadata should exist');
  assert.ok(grounding, 'public grounding service metadata should exist');
  assert.ok(
    search.capabilities.some((capability) => capability.includes('memory_layer')),
    'public search should document memory_layer filtering',
  );
  assert.ok(
    search.capabilities.some((capability) => capability.includes('memory_context')),
    'public search should document memory context fields',
  );
  assert.ok(
    grounding.capabilities.some((capability) => capability.includes('memory_layers')),
    'public grounding should document memory-aware sources',
  );
  assert.ok(
    grounding.safety_boundaries.some((boundary) => boundary.includes('private memory')),
    'public grounding should exclude private memory',
  );
});

test('ai services asset registry metadata cites registered asset package sources', async () => {
  const metadata = await loadServices();
  const assets = await loadAssets();
  const assetService = metadata.services.find((service) => service.id === 'asset-registry');

  assert.ok(assetService, 'asset-registry service metadata should exist');

  for (const assetPackage of assets.packages) {
    assert.ok(
      assetService.source_routes.includes(assetPackage.source_route),
      `asset-registry service metadata should cite ${assetPackage.source_route}`,
    );

    for (const sourceFile of assetPackage.source_files) {
      assert.ok(
        assetService.source_files.includes(sourceFile),
        `asset-registry service metadata should cite ${sourceFile}`,
      );
    }

    assert.ok(
      assetService.citations.some((citation) => citation.route === assetPackage.source_route),
      `asset-registry service metadata should cite package route ${assetPackage.source_route}`,
    );
  }
});
