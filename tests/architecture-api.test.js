import assert from 'node:assert/strict';
import test from 'node:test';

import architectureHandler from '../api/architecture.js';
import * as architectureApi from '../api/architecture.js';

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

test('returns the public architecture registry with cache headers', async () => {
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.match(res.headers['cache-control'], /public/);
  assert.equal(res.body.success, true);
  assert.equal(res.body.registry.review_status, 'public_safe_draft');
  assert.ok(res.body.registry.concepts.length >= 5);
});

test('returns one public architecture concept by id', async () => {
  const req = {
    method: 'GET',
    query: { id: 'four-tier-memory-architecture' },
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(Object.keys(res.body).sort(), ['concept', 'success']);
  assert.equal(res.body.concept.id, 'four-tier-memory-architecture');
  assert.equal(res.body.concept.review_status, 'public_safe');
});

test('filters public architecture concepts by category', async () => {
  const req = {
    method: 'GET',
    query: { category: 'memory' },
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.concepts.length >= 1);
  assert.ok(
    res.body.concepts.every((concept) => concept.category === 'memory'),
    'category filter should only return matching concepts',
  );
});

test('rejects malformed architecture lookup values', async () => {
  const req = {
    method: 'GET',
    query: { id: '../../private' },
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Invalid architecture id' });
});

test('rejects malformed architecture filters before loading the registry', async () => {
  const handler = architectureApi.createArchitectureHandler({
    loadRegistry: async () => {
      throw new Error('registry should not be loaded for invalid filters');
    },
  });
  const req = {
    method: 'GET',
    query: { category: '../memory' },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Invalid category' });
});

test('returns non-cacheable errors for unknown architecture concepts', async () => {
  const req = {
    method: 'GET',
    query: { id: 'missing-concept' },
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Architecture concept not found' });
});

test('rejects write methods on the public architecture registry', async () => {
  const req = {
    method: 'POST',
    query: {},
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'GET, HEAD, OPTIONS');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Method not allowed' });
});

test('returns 429 when durable architecture rate limit denies the request', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        allowed: false,
        retry_after: 45,
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  };

  const req = {
    method: 'GET',
    headers: {
      'x-forwarded-for': '203.0.113.8',
    },
    query: { id: 'four-tier-memory-architecture' },
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['retry-after'], '45');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Too many requests' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://limits.example.test/check');

  const limitBody = JSON.parse(calls[0].options.body);
  assert.equal(limitBody.route, '/api/architecture');
  assert.equal(limitBody.limit, 60);
  assert.equal(limitBody.window_seconds, 60);
  assert.match(limitBody.key, /^sha256:/);
  assert.equal(calls[0].options.body.includes('four-tier-memory-architecture'), false);
  assert.equal(calls[0].options.body.includes('203.0.113.8'), false);
});

test('fails closed in production when architecture rate limiting is not configured', async (t) => {
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

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response('{}');
  };

  const req = {
    method: 'GET',
    headers: {},
    query: {},
  };
  const res = createMockResponse();

  await architectureHandler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['retry-after'], '60');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Request limit unavailable' });
  assert.equal(called, false);
});

test('architecture registry loader failures are non-cacheable and generic', async () => {
  assert.equal(typeof architectureApi.createArchitectureHandler, 'function');

  const handler = architectureApi.createArchitectureHandler({
    loadRegistry: async () => {
      throw new Error('/private/path/architecture.json failed');
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
  assert.deepEqual(res.body, { success: false, error: 'Unable to load architecture registry' });
  assert.equal(JSON.stringify(res.body).includes('/private/path'), false);
});
