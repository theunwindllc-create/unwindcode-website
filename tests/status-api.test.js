import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import statusHandler from '../api/status.js';
import * as statusApi from '../api/status.js';

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end() {
      this.body = '';
      return this;
    },
  };
}

function minimalStatusRegistries() {
  return {
    services: {
      review_status: 'public_safe',
      services: [
        {
          id: 'asset-registry',
          endpoint: '/api/assets',
          operational_controls: { durable_rate_limit: true },
        },
      ],
    },
    architecture: { review_status: 'public_safe', concepts: [] },
    claims: { review_status: 'public_safe', claims: [] },
    organisms: { review_status: 'public_safe', organisms: [] },
    transmissions: { review_status: 'public_safe', transmissions: [] },
  };
}

function invalidDigestAssetPackage() {
  return {
    id: 'status-invalid-asset-package',
    type: 'social-carousel',
    title: 'Status Invalid Asset Package',
    summary: 'Synthetic invalid asset package for status validation.',
    source_route: '/transmissions/24-the-mirror-found-its-form.html',
    asset_package_sha256: 'a'.repeat(64),
    source_files: ['social/status-invalid-asset-package/README.md'],
    alt_text: 'Synthetic invalid asset package used to verify status validation.',
    provenance: {
      created_from: 'test-renderer',
      source_files: ['social/status-invalid-asset-package/README.md'],
      source_file_hashes: [
        {
          path: 'social/status-invalid-asset-package/README.md',
          sha256: 'b'.repeat(64),
          bytes: 10,
        },
      ],
      generated_files: [
        {
          path: 'social/status-invalid-asset-package/exports/slide-01.png',
          sha256: 'c'.repeat(64),
          bytes: 20,
        },
      ],
    },
    rights: {
      usage_scope: 'Prepared for validation tests only.',
      license_notes: 'Synthetic package.',
    },
    approval_gates: ['Creator approval is required before publication.'],
    authority_boundary: {
      posting_authority: false,
      wallet_authority: false,
      paid_media_authority: false,
      on_chain_attestation_authority: false,
      approval_state: 'creator_approval_required',
      allowed_uses: [
        'manual_review',
        'provenance_lookup',
        'local_asset_inspection',
        'manual_social_post_after_creator_approval',
      ],
      prohibited_uses: [
        'automated_public_posting',
        'wallet_signing',
        'paid_media_activation',
        'on_chain_publication',
        'unreviewed_rag_answer_evidence',
      ],
    },
    approval_record_schema: {
      schema_version: '2026-06-06.public-asset-approval-record.v1',
      storage_boundary: {
        public_record_only: true,
        secrets_excluded: true,
        raw_prompts_excluded: true,
        private_notes_excluded: true,
        on_chain_sensitive_data_excluded: true,
      },
      required_fields: [
        'approval_id',
        'asset_package_id',
        'asset_package_sha256',
        'approved_by_role',
        'approved_at',
        'approved_scope',
        'source_file_hashes_verified',
        'generated_file_hashes_verified',
      ],
      allowed_approval_scopes: ['manual_social_publication'],
      prohibited_record_content: ['private_approver_identity', 'raw_prompts', 'private_notes'],
    },
    approval_records: [],
    review_status: 'creator_approval_required',
    publication_status: 'prepared_not_posted',
    manual_approval_required: true,
    confidence: 'high',
  };
}

test('returns public-safe backend status from active registries', async () => {
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await statusHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.match(res.headers['cache-control'], /public/);
  assert.equal(res.body.success, true);
  assert.equal(res.body.status.schema_version, '2026-06-06.public-backend-status.v1');
  assert.equal(res.body.status.review_status, 'public_safe');
  assert.deepEqual(res.body.status.services.ids.sort(), [
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
  assert.equal(res.body.status.services.count, 10);
  assert.equal(res.body.status.registries.assets.count, 7);
  assert.equal(res.body.status.registries.assets.creator_approval_required_count, 7);
  assert.equal(res.body.status.registries.assets.prepared_not_posted_count, 7);
  assert.equal(res.body.status.registries.architecture.count, 5);
  assert.equal(res.body.status.registries.claims.count, 6);
  assert.equal(res.body.status.registries.claims.needs_context_count, 2);
  assert.equal(res.body.status.registries.claims.safety_qualified_count, 2);
  assert.equal(res.body.status.registries.organisms.count, 5);
  assert.equal(res.body.status.registries.transmissions.count, 32);
  assert.deepEqual(res.body.status.registries.transmissions.latest_public_transmission, {
    id: '31-the-active-source-of-truth-gate',
    transmission_number: 31,
    title: 'Transmission 31: The Active Source-of-Truth Gate',
    route: '/transmissions/31-the-active-source-of-truth-gate.html',
    source_file: 'transmissions/31-the-active-source-of-truth-gate.html',
    review_status: 'public_safe',
  });
  assert.deepEqual(res.body.status.registries.transmissions.numbering, {
    latest_number: 31,
    published_count: 32,
    has_gaps: false,
    missing_numbers: [],
  });
  assert.deepEqual(res.body.status.operational_controls.durable_rate_limited_endpoints.sort(), [
    '/api/architecture',
    '/api/assets',
    '/api/chat',
    '/api/claims',
    '/api/grounding',
    '/api/organisms',
    '/api/search',
    '/api/subscribe',
    '/api/transmissions',
  ]);
  assert.deepEqual(res.body.status.operational_controls.production_fail_closed_endpoints.sort(), [
    '/api/architecture',
    '/api/assets',
    '/api/chat',
    '/api/claims',
    '/api/grounding',
    '/api/organisms',
    '/api/search',
    '/api/subscribe',
    '/api/transmissions',
  ]);
  assert.deepEqual(res.body.status.operational_controls.answer_generation_disabled_endpoints, [
    '/api/grounding',
    '/api/search',
  ]);
  assert.deepEqual(res.body.status.operational_controls.grounding_review_required_endpoints, [
    '/api/chat',
    '/api/grounding',
  ]);
  assert.deepEqual(res.body.status.operational_controls.same_origin_guarded_endpoints.sort(), [
    '/api/chat',
    '/api/subscribe',
  ]);
  assert.equal(res.body.status.operational_controls.limiter_payload_boundary.raw_queries_excluded, true);
  assert.equal(res.body.status.operational_controls.limiter_payload_boundary.raw_client_addresses_excluded, true);
  assert.equal(res.body.status.operational_controls.limiter_payload_boundary.secrets_excluded, true);
  assert.equal(res.body.status.boundaries.secrets_excluded, true);
  assert.equal(res.body.status.boundaries.public_only, true);
});

test('backend status avoids secrets and private runtime material', async () => {
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await statusHandler(req, res);

  const raw = JSON.stringify(res.body);

  assert.equal(/SUPABASE_SERVICE_ROLE_KEY|PRIVATE_KEY|BEGIN RSA PRIVATE KEY/i.test(raw), false);
  assert.equal(/\brnd_[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/\bsk-[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/wallet_private_key|service-role|raw prompt|hidden repo/i.test(raw), false);
  assert.equal(raw.includes('owner-filled-redacted-manifest'), false);
  assert.equal(raw.includes('RATE_LIMIT_REST_TOKEN'), false);
  assert.equal(raw.includes('SUPABASE_ANON_KEY'), false);
});

test('rejects write methods on the public backend status endpoint', async () => {
  const req = {
    method: 'POST',
    query: {},
  };
  const res = createMockResponse();

  await statusHandler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'GET, HEAD, OPTIONS');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Method not allowed' });
});

test('successful status HEAD validates backend status without returning a body', async () => {
  assert.equal(typeof statusApi.createStatusHandler, 'function');

  let loaded = false;
  const handler = statusApi.createStatusHandler({
    readStatus: async () => {
      loaded = true;
      return {
        schema_version: 'test-status',
        review_status: 'public_safe',
      };
    },
  });
  const res = createMockResponse();

  await handler({ method: 'HEAD', query: {} }, res);

  assert.equal(res.statusCode, 200);
  assert.match(res.headers['cache-control'], /public/);
  assert.equal(res.body, '');
  assert.equal(loaded, true);
});

test('status registry loader failures are non-cacheable and generic', async () => {
  assert.equal(typeof statusApi.createStatusHandler, 'function');

  const failingHandler = statusApi.createStatusHandler({
    readStatus: async () => {
      throw new Error('/private/path/status source failed');
    },
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await failingHandler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load backend status' });
  assert.equal(JSON.stringify(res.body).includes('/private/path'), false);
});

test('status HEAD registry loader failures are non-cacheable and bodyless', async () => {
  assert.equal(typeof statusApi.createStatusHandler, 'function');

  const failingHandler = statusApi.createStatusHandler({
    readStatus: async () => {
      throw new Error('/private/path/status source failed');
    },
  });
  const req = {
    method: 'HEAD',
    query: {},
  };
  const res = createMockResponse();

  await failingHandler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.body, '');
});

test('status fails closed when public asset provenance validation fails', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'unwind-status-invalid-assets-'));
  const servicesPath = join(dir, 'ai-services.json');
  const architecturePath = join(dir, 'architecture.json');
  const assetsPath = join(dir, 'assets.json');
  const claimsPath = join(dir, 'claims.json');
  const organismsPath = join(dir, 'organisms.json');
  const transmissionsPath = join(dir, 'transmissions.json');
  const registries = minimalStatusRegistries();
  const writeJson = (file, data) => writeFile(file, JSON.stringify(data), 'utf8');

  await Promise.all([
    writeJson(servicesPath, registries.services),
    writeJson(architecturePath, registries.architecture),
    writeJson(assetsPath, {
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [invalidDigestAssetPackage()],
    }),
    writeJson(claimsPath, registries.claims),
    writeJson(organismsPath, registries.organisms),
    writeJson(transmissionsPath, registries.transmissions),
  ]);

  const handler = statusApi.createStatusHandler({
    urls: {
      services: new URL(`file://${servicesPath}`),
      architecture: new URL(`file://${architecturePath}`),
      assets: new URL(`file://${assetsPath}`),
      claims: new URL(`file://${claimsPath}`),
      organisms: new URL(`file://${organismsPath}`),
      transmissions: new URL(`file://${transmissionsPath}`),
    },
  });
  const res = createMockResponse();

  await handler({ method: 'GET', query: {} }, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load backend status' });
});

test('status cache reloads when public metadata source signatures change', async () => {
  assert.equal(typeof statusApi.createStatusHandler, 'function');

  const dir = await mkdtemp(join(tmpdir(), 'unwind-status-'));
  const servicesPath = join(dir, 'ai-services.json');
  const architecturePath = join(dir, 'architecture.json');
  const assetsPath = join(dir, 'assets.json');
  const claimsPath = join(dir, 'claims.json');
  const organismsPath = join(dir, 'organisms.json');
  const transmissionsPath = join(dir, 'transmissions.json');

  const writeJson = (file, data) => writeFile(file, JSON.stringify(data), 'utf8');
  await Promise.all([
    writeJson(servicesPath, {
      review_status: 'public_safe',
      services: [
        {
          id: 'one',
          endpoint: '/api/one',
          operational_controls: { durable_rate_limit: true },
        },
      ],
    }),
    writeJson(architecturePath, { review_status: 'public_safe', concepts: [] }),
    writeJson(assetsPath, {
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [],
    }),
    writeJson(claimsPath, { review_status: 'public_safe', claims: [] }),
    writeJson(organismsPath, { review_status: 'public_safe', organisms: [] }),
    writeJson(transmissionsPath, { review_status: 'public_safe', transmissions: [] }),
  ]);

  const handler = statusApi.createStatusHandler({
    urls: {
      services: new URL(`file://${servicesPath}`),
      architecture: new URL(`file://${architecturePath}`),
      assets: new URL(`file://${assetsPath}`),
      claims: new URL(`file://${claimsPath}`),
      organisms: new URL(`file://${organismsPath}`),
      transmissions: new URL(`file://${transmissionsPath}`),
    },
  });

  const firstRes = createMockResponse();
  await handler({ method: 'GET', query: {} }, firstRes);
  assert.equal(firstRes.statusCode, 200);
  assert.equal(firstRes.body.status.services.count, 1);
  assert.deepEqual(firstRes.body.status.operational_controls.durable_rate_limited_endpoints, [
    '/api/one',
  ]);

  await writeJson(servicesPath, {
    review_status: 'public_safe',
    services: [
      {
        id: 'one',
        endpoint: '/api/one',
        operational_controls: { durable_rate_limit: true },
      },
      {
        id: 'two',
        endpoint: '/api/two',
        operational_controls: { durable_rate_limit: true },
      },
    ],
  });

  const secondRes = createMockResponse();
  await handler({ method: 'GET', query: {} }, secondRes);

  assert.equal(secondRes.statusCode, 200);
  assert.equal(secondRes.body.status.services.count, 2);
  assert.deepEqual(secondRes.body.status.operational_controls.durable_rate_limited_endpoints, [
    '/api/one',
    '/api/two',
  ]);
});
