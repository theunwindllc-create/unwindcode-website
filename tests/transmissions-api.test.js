import assert from 'node:assert/strict';
import test from 'node:test';

import transmissionsHandler from '../api/transmissions.js';
import * as transmissionsApi from '../api/transmissions.js';

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

test('returns the public transmission registry with cache headers', async () => {
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await transmissionsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.match(res.headers['cache-control'], /public/);
  assert.equal(res.body.success, true);
  assert.equal(res.body.registry.review_status, 'public_safe_draft');
  assert.ok(res.body.registry.transmissions.length >= 24);
});

test('returns one public transmission by id', async () => {
  const req = {
    method: 'GET',
    query: { id: '24-the-mirror-found-its-form' },
  };
  const res = createMockResponse();

  await transmissionsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(Object.keys(res.body).sort(), ['success', 'transmission']);
  assert.equal(res.body.transmission.id, '24-the-mirror-found-its-form');
  assert.equal(res.body.transmission.review_status, 'public_safe');
});

test('decorates direct transmission lookups with inferred claim context', async () => {
  const req = {
    method: 'GET',
    query: { id: '22-the-monad-hand-clarity-before-motion' },
  };
  const res = createMockResponse();

  await transmissionsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);

  const claimIds = res.body.transmission.claim_references.map((reference) => reference.claim_id);
  assert.ok(claimIds.includes('financial-organisms-real-markets'));
  assert.ok(claimIds.includes('proof-gated-financial-motion'));
  assert.ok(res.body.transmission.claim_context.referenced_claim_ids.includes('financial-organisms-real-markets'));
  assert.ok(res.body.transmission.claim_context.risk_levels.includes('high'));
  assert.equal(res.body.transmission.claim_context.requires_qualification, true);

  const financialQualification = res.body.transmission.claim_qualifications.find(
    (qualification) => qualification.claim_id === 'financial-organisms-real-markets',
  );
  assert.ok(financialQualification, 'financial claim qualification should be included');
  assert.match(financialQualification.interpretation_boundary, /does not grant or prove autonomous money movement/i);
  assert.ok(
    financialQualification.citations.some(
      (citation) => citation.route === '/transmissions/22-the-monad-hand-clarity-before-motion',
    ),
    'financial claim qualification should include public transmission citation',
  );
});

test('filters public transmissions by topic tag', async () => {
  const req = {
    method: 'GET',
    query: { topic: 'web3-safety' },
  };
  const res = createMockResponse();

  await transmissionsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.transmissions.length >= 2);
  assert.ok(
    res.body.transmissions.every((entry) => entry.topic_tags.includes('web3-safety')),
    'topic filter should only return matching entries',
  );
});

test('conservatively qualifies sensitive transmission topics without explicit claims', async () => {
  const req = {
    method: 'GET',
    query: { topic: 'web3-safety' },
  };
  const res = createMockResponse();

  await transmissionsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);

  const onChainTransmission = res.body.transmissions.find(
    (entry) => entry.id === '02-deploying-agents-on-chain',
  );
  assert.ok(onChainTransmission, 'web3-safety topic should include the on-chain transmission');
  assert.deepEqual(onChainTransmission.claim_context.sensitive_topic_tags, ['web3-safety']);
  assert.equal(onChainTransmission.claim_context.requires_qualification, true);
  assert.ok(
    onChainTransmission.claim_context.review_flags.includes('sensitive_topic_requires_grounding'),
    'sensitive topic without explicit claims should still point RAG consumers to grounding',
  );
});

test('rejects malformed transmission lookup values', async () => {
  const req = {
    method: 'GET',
    query: { id: '../../private' },
  };
  const res = createMockResponse();

  await transmissionsHandler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Invalid transmission id' });
});

test('returns non-cacheable JSON for unknown transmission lookups', async () => {
  const req = {
    method: 'GET',
    query: { id: '99-missing-transmission' },
  };
  const res = createMockResponse();

  await transmissionsHandler(req, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Transmission not found' });
});

test('returns a generic JSON error when transmission registries cannot load', async () => {
  assert.equal(typeof transmissionsApi.createTransmissionsHandler, 'function');

  const failingHandler = transmissionsApi.createTransmissionsHandler({
    loadRegistry: async () => {
      throw new Error('/private/path/transmissions.json parse failed');
    },
    loadClaimsRegistry: async () => {
      throw new Error('/private/path/claims.json parse failed');
    },
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await failingHandler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load transmission registry' });
  assert.equal(JSON.stringify(res.body).includes('/private/path'), false);
});

test('rejects write methods on the public transmission registry', async () => {
  const req = {
    method: 'POST',
    query: {},
  };
  const res = createMockResponse();

  await transmissionsHandler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'GET, HEAD, OPTIONS');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Method not allowed' });
});

test('keeps transmission preflight responses non-cacheable', async () => {
  const req = {
    method: 'OPTIONS',
    query: {},
  };
  const res = createMockResponse();

  await transmissionsHandler(req, res);

  assert.equal(res.statusCode, 204);
  assert.equal(res.headers.allow, 'GET, HEAD, OPTIONS');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.body, '');
});

test('returns 429 when durable transmission registry rate limit denies the request', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';
  process.env.TRANSMISSIONS_RATE_LIMIT_MAX = '17';
  process.env.TRANSMISSIONS_RATE_LIMIT_WINDOW_SECONDS = '120';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        allowed: false,
        retry_after: 120,
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  };

  let loadedRegistry = false;
  let loadedClaims = false;
  const handler = transmissionsApi.createTransmissionsHandler({
    loadRegistry: async () => {
      loadedRegistry = true;
      return { review_status: 'public_safe_draft', transmissions: [] };
    },
    loadClaimsRegistry: async () => {
      loadedClaims = true;
      return { review_status: 'public_safe_draft', claims: [] };
    },
  });
  const req = {
    method: 'GET',
    headers: {
      'x-forwarded-for': '203.0.113.55, 10.0.0.1',
    },
    query: {
      id: '22-the-monad-hand-clarity-before-motion',
    },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '120');
  assert.deepEqual(res.body, { success: false, error: 'Too many requests' });
  assert.equal(loadedRegistry, false);
  assert.equal(loadedClaims, false);
  assert.equal(calls.length, 1);

  const limitBody = JSON.parse(calls[0].options.body);
  assert.equal(limitBody.route, '/api/transmissions');
  assert.equal(limitBody.limit, 17);
  assert.equal(limitBody.window_seconds, 120);
  assert.match(limitBody.key, /^sha256:/);
  assert.equal(calls[0].options.body.includes('22-the-monad-hand-clarity-before-motion'), false);
  assert.equal(calls[0].options.body.includes('203.0.113.55'), false);
});

test('fails closed in production when transmission registry rate limiting is not configured', async (t) => {
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

  let loadedRegistry = false;
  let loadedClaims = false;
  const handler = transmissionsApi.createTransmissionsHandler({
    loadRegistry: async () => {
      loadedRegistry = true;
      return { review_status: 'public_safe_draft', transmissions: [] };
    },
    loadClaimsRegistry: async () => {
      loadedClaims = true;
      return { review_status: 'public_safe_draft', claims: [] };
    },
  });
  const req = {
    method: 'GET',
    query: {
      topic: 'web3-safety',
    },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '60');
  assert.deepEqual(res.body, { success: false, error: 'Request limit unavailable' });
  assert.equal(loadedRegistry, false);
  assert.equal(loadedClaims, false);
});
