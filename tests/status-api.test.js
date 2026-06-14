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
  assert.equal(res.body.status.registries.assets.count, 5);
  assert.equal(res.body.status.registries.assets.creator_approval_required_count, 5);
  assert.equal(res.body.status.registries.assets.prepared_not_posted_count, 5);
  assert.equal(res.body.status.registries.architecture.count, 5);
  assert.equal(res.body.status.registries.claims.count, 6);
  assert.equal(res.body.status.registries.claims.needs_context_count, 2);
  assert.equal(res.body.status.registries.claims.safety_qualified_count, 2);
  assert.equal(res.body.status.registries.organisms.count, 5);
  assert.equal(res.body.status.registries.transmissions.count, 28);
  assert.deepEqual(res.body.status.operational_controls.durable_rate_limited_endpoints.sort(), [
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
    writeJson(assetsPath, { review_status: 'public_safe', packages: [] }),
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
