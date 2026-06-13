import assert from 'node:assert/strict';
import test from 'node:test';

import organismsHandler from '../api/organisms.js';
import * as organismsApi from '../api/organisms.js';

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

test('returns the public organism registry with cache headers', async () => {
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await organismsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.match(res.headers['cache-control'], /public/);
  assert.equal(res.body.success, true);
  assert.equal(res.body.registry.review_status, 'public_safe_draft');
  assert.ok(res.body.registry.organisms.some((organism) => organism.id === 'unwind-brain'));
});

test('returns one public organism by id', async () => {
  const req = {
    method: 'GET',
    query: { id: 'infinity-mirror' },
  };
  const res = createMockResponse();

  await organismsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(Object.keys(res.body).sort(), ['organism', 'success']);
  assert.equal(res.body.organism.id, 'infinity-mirror');
  assert.equal(res.body.organism.review_status, 'public_safe');
});

test('returns 404 for unknown organism ids', async () => {
  const req = {
    method: 'GET',
    query: { id: 'missing-cell' },
  };
  const res = createMockResponse();

  await organismsHandler(req, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Organism not found' });
});

test('rejects malformed organism ids before lookup', async () => {
  const req = {
    method: 'GET',
    query: { id: '../../etc/passwd' },
  };
  const res = createMockResponse();

  await organismsHandler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Invalid organism id' });
});

test('rejects write methods on the public organism registry', async () => {
  const req = {
    method: 'POST',
    query: {},
  };
  const res = createMockResponse();

  await organismsHandler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'GET, HEAD, OPTIONS');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Method not allowed' });
});

test('organism registry loader failures are non-cacheable and generic', async () => {
  assert.equal(typeof organismsApi.createOrganismsHandler, 'function');

  const handler = organismsApi.createOrganismsHandler({
    loadRegistry: async () => {
      throw new Error('/private/path/organisms.json failed');
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
  assert.deepEqual(res.body, { success: false, error: 'Unable to load organism registry' });
  assert.equal(JSON.stringify(res.body).includes('/private/path'), false);
});

test('returns 429 when durable organism registry rate limit denies the request', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';
  process.env.ORGANISMS_RATE_LIMIT_MAX = '19';
  process.env.ORGANISMS_RATE_LIMIT_WINDOW_SECONDS = '150';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        allowed: false,
        retry_after: 150,
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  };

  let loaded = false;
  const handler = organismsApi.createOrganismsHandler({
    loadRegistry: async () => {
      loaded = true;
      return { review_status: 'public_safe_draft', organisms: [] };
    },
  });
  const req = {
    method: 'GET',
    headers: {
      'x-forwarded-for': '198.51.100.64, 10.0.0.1',
    },
    query: {
      id: 'financial-organisms',
    },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '150');
  assert.deepEqual(res.body, { success: false, error: 'Too many requests' });
  assert.equal(loaded, false);
  assert.equal(calls.length, 1);

  const limitBody = JSON.parse(calls[0].options.body);
  assert.equal(limitBody.route, '/api/organisms');
  assert.equal(limitBody.limit, 19);
  assert.equal(limitBody.window_seconds, 150);
  assert.match(limitBody.key, /^sha256:/);
  assert.equal(calls[0].options.body.includes('financial-organisms'), false);
  assert.equal(calls[0].options.body.includes('198.51.100.64'), false);
});

test('fails closed in production when organism registry rate limiting is not configured', async (t) => {
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
  const handler = organismsApi.createOrganismsHandler({
    loadRegistry: async () => {
      loaded = true;
      return { review_status: 'public_safe_draft', organisms: [] };
    },
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '60');
  assert.deepEqual(res.body, { success: false, error: 'Request limit unavailable' });
  assert.equal(loaded, false);
});
