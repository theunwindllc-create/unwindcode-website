import assert from 'node:assert/strict';
import test from 'node:test';

import claimsHandler from '../api/claims.js';
import * as claimsApi from '../api/claims.js';

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

test('returns the public claim registry with cache headers', async () => {
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await claimsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.match(res.headers['cache-control'], /public/);
  assert.equal(res.body.success, true);
  assert.equal(res.body.registry.review_status, 'public_safe_draft');
  assert.equal(res.body.registry.claims.length, 6);
});

test('returns one public claim by id', async () => {
  const req = {
    method: 'GET',
    query: { id: 'financial-organisms-real-markets' },
  };
  const res = createMockResponse();

  await claimsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(Object.keys(res.body).sort(), ['claim', 'success']);
  assert.equal(res.body.claim.id, 'financial-organisms-real-markets');
  assert.equal(res.body.claim.claim_status, 'safety_qualified');
});

test('filters public claims by claim status', async () => {
  const req = {
    method: 'GET',
    query: { claim_status: 'needs_context' },
  };
  const res = createMockResponse();

  await claimsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.claims.length >= 1);
  assert.ok(
    res.body.claims.every((claim) => claim.claim_status === 'needs_context'),
    'claim status filter should only return matching claims',
  );
});

test('filters public claims by evidence status and category', async () => {
  const req = {
    method: 'GET',
    query: {
      evidence_status: 'qualified_by_public_transmission',
      category: 'financial-safety',
    },
  };
  const res = createMockResponse();

  await claimsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.evidence_status, 'qualified_by_public_transmission');
  assert.equal(res.body.category, 'financial-safety');
  assert.ok(res.body.claims.length >= 1);
  assert.ok(
    res.body.claims.every(
      (claim) =>
        claim.evidence_status === 'qualified_by_public_transmission' &&
        claim.category === 'financial-safety',
    ),
    'combined filters should only return matching claims',
  );
});

test('rejects malformed claim lookup values', async () => {
  const req = {
    method: 'GET',
    query: { id: '../../private' },
  };
  const res = createMockResponse();

  await claimsHandler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Invalid claim id' });
});

test('returns non-cacheable errors for unknown claim ids', async () => {
  const req = {
    method: 'GET',
    query: { id: 'missing-claim' },
  };
  const res = createMockResponse();

  await claimsHandler(req, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Claim not found' });
});

test('rejects write methods on the public claims endpoint', async () => {
  const req = {
    method: 'POST',
    query: {},
  };
  const res = createMockResponse();

  await claimsHandler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'GET, HEAD, OPTIONS');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Method not allowed' });
});

test('claim registry loader failures are non-cacheable and generic', async () => {
  assert.equal(typeof claimsApi.createClaimsHandler, 'function');

  const handler = claimsApi.createClaimsHandler({
    loadRegistry: async () => {
      throw new Error('/private/path/claims.json failed');
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
  assert.deepEqual(res.body, { success: false, error: 'Unable to load claim registry' });
  assert.equal(JSON.stringify(res.body).includes('/private/path'), false);
});

test('returns 429 when durable claim registry rate limit denies the request', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';
  process.env.CLAIMS_RATE_LIMIT_MAX = '13';
  process.env.CLAIMS_RATE_LIMIT_WINDOW_SECONDS = '90';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        allowed: false,
        retry_after: 90,
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  };

  let loaded = false;
  const handler = claimsApi.createClaimsHandler({
    loadRegistry: async () => {
      loaded = true;
      return { review_status: 'public_safe_draft', claims: [] };
    },
  });
  const req = {
    method: 'GET',
    headers: {
      'x-real-ip': '198.51.100.42',
    },
    query: {
      id: 'financial-organisms-real-markets',
    },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '90');
  assert.deepEqual(res.body, { success: false, error: 'Too many requests' });
  assert.equal(loaded, false);
  assert.equal(calls.length, 1);

  const limitBody = JSON.parse(calls[0].options.body);
  assert.equal(limitBody.route, '/api/claims');
  assert.equal(limitBody.limit, 13);
  assert.equal(limitBody.window_seconds, 90);
  assert.match(limitBody.key, /^sha256:/);
  assert.equal(calls[0].options.body.includes('financial-organisms-real-markets'), false);
  assert.equal(calls[0].options.body.includes('198.51.100.42'), false);
});

test('fails closed in production when claim registry rate limiting is not configured', async (t) => {
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
  const handler = claimsApi.createClaimsHandler({
    loadRegistry: async () => {
      loaded = true;
      return { review_status: 'public_safe_draft', claims: [] };
    },
  });
  const req = {
    method: 'GET',
    query: {
      claim_status: 'needs_context',
    },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '60');
  assert.deepEqual(res.body, { success: false, error: 'Request limit unavailable' });
  assert.equal(loaded, false);
});
