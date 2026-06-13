import assert from 'node:assert/strict';
import test from 'node:test';

import assetsHandler from '../api/assets.js';
import * as assetsApi from '../api/assets.js';

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

test('returns the public asset provenance registry with cache headers', async () => {
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.equal(res.headers['cache-control'], 'public, max-age=60, must-revalidate');
  assert.match(res.headers.etag, /^"sha256-[a-f0-9]{64}"$/);
  assert.match(res.headers['last-modified'], /^[A-Z][a-z]{2}, /);
  assert.equal(res.body.success, true);
  assert.equal(res.body.registry.review_status, 'public_safe_draft');
  assert.equal(res.body.registry.packages.length, 4);
  assert.ok(
    res.body.registry.packages.some(
      (assetPackage) => assetPackage.id === 'transmission-26-property-sales-intelligence-cell-carousel',
    ),
  );
});

test('returns 304 for matching public asset registry validators', async () => {
  const firstReq = {
    method: 'GET',
    query: {},
    headers: {},
  };
  const firstRes = createMockResponse();

  await assetsHandler(firstReq, firstRes);

  const secondReq = {
    method: 'GET',
    query: {},
    headers: { 'if-none-match': firstRes.headers.etag },
  };
  const secondRes = createMockResponse();

  await assetsHandler(secondReq, secondRes);

  assert.equal(secondRes.statusCode, 304);
  assert.equal(secondRes.headers['cache-control'], 'public, max-age=60, must-revalidate');
  assert.equal(secondRes.headers.etag, firstRes.headers.etag);
  assert.equal(secondRes.headers['last-modified'], firstRes.headers['last-modified']);
  assert.equal(secondRes.body, '');
});

test('returns one public asset package by id', async () => {
  const req = {
    method: 'GET',
    query: { id: 'transmission-24-mirror-carousel' },
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(Object.keys(res.body).sort(), ['asset_package', 'success']);
  assert.equal(res.body.asset_package.id, 'transmission-24-mirror-carousel');
  assert.match(res.body.asset_package.asset_package_sha256, /^[a-f0-9]{64}$/);
  assert.equal(res.body.asset_package.review_status, 'creator_approval_required');
});

test('filters public asset packages by publication status', async () => {
  const req = {
    method: 'GET',
    query: { publication_status: 'prepared_not_posted' },
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.packages.length, 4);
  assert.ok(
    res.body.packages.every((assetPackage) => assetPackage.publication_status === 'prepared_not_posted'),
    'publication status filter should only return matching asset packages',
  );
});

test('rejects malformed asset lookup values', async () => {
  const req = {
    method: 'GET',
    query: { id: '../private' },
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Invalid asset package id' });
});

test('returns non-cacheable errors for unknown asset packages', async () => {
  const req = {
    method: 'GET',
    query: { id: 'unknown-asset-package' },
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Asset package not found' });
});

test('rejects write methods on the public asset provenance endpoint', async () => {
  const req = {
    method: 'POST',
    query: {},
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'GET, HEAD, OPTIONS');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Method not allowed' });
});

test('returns a non-cacheable generic error when the asset registry cannot load', async () => {
  const assetsModule = await import('../api/assets.js');

  assert.equal(typeof assetsModule.createAssetsHandler, 'function');

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => {
      throw new Error('parser leaked filesystem/path/details');
    },
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when approval records reference a mismatched package digest', async () => {
  const assetsModule = await import('../api/assets.js');

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [
        {
          id: 'unsafe-package',
          asset_package_sha256: 'a'.repeat(64),
          approval_records: [
            {
              approval_id: 'approval-1',
              asset_package_id: 'unsafe-package',
              asset_package_sha256: 'b'.repeat(64),
            },
          ],
        },
      ],
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('returns 429 when durable asset registry rate limit denies the request', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';
  process.env.ASSETS_RATE_LIMIT_MAX = '11';
  process.env.ASSETS_RATE_LIMIT_WINDOW_SECONDS = '75';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        allowed: false,
        retry_after: 75,
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  };

  let loaded = false;
  const handler = assetsApi.createAssetsHandler({
    loadRegistry: async () => {
      loaded = true;
      return { review_status: 'public_safe_draft', packages: [] };
    },
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Sat, 06 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    headers: {
      'x-forwarded-for': '203.0.113.42, 10.0.0.1',
    },
    query: { id: 'transmission-24-mirror-carousel' },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '75');
  assert.deepEqual(res.body, { success: false, error: 'Too many requests' });
  assert.equal(loaded, false);
  assert.equal(calls.length, 1);

  const limitBody = JSON.parse(calls[0].options.body);
  assert.equal(limitBody.route, '/api/assets');
  assert.equal(limitBody.limit, 11);
  assert.equal(limitBody.window_seconds, 75);
  assert.match(limitBody.key, /^sha256:/);
  assert.equal(calls[0].options.body.includes('transmission-24-mirror-carousel'), false);
  assert.equal(calls[0].options.body.includes('203.0.113.42'), false);
});

test('fails closed in production when asset registry rate limiting is not configured', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.VERCEL_ENV = 'production';
  delete process.env.RATE_LIMIT_REST_URL;
  delete process.env.RATE_LIMIT_REST_TOKEN;
  delete process.env.RATE_LIMIT_SALT;

  let loaded = false;
  const handler = assetsApi.createAssetsHandler({
    loadRegistry: async () => {
      loaded = true;
      return { review_status: 'public_safe_draft', packages: [] };
    },
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Sat, 06 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: { publication_status: 'prepared_not_posted' },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '60');
  assert.deepEqual(res.body, { success: false, error: 'Request limit unavailable' });
  assert.equal(loaded, false);
});
