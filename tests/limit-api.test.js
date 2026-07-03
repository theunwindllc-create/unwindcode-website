import test from 'node:test';
import assert from 'node:assert/strict';

import handler from '../api/limit.js';

function makeRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
  return res;
}

function makeReq({ method = 'POST', authorization, body } = {}) {
  return { method, headers: authorization ? { authorization } : {}, body };
}

const GOOD_KEY = `sha256:${'a'.repeat(64)}`;

function withEnv(env, fn) {
  const saved = {};
  for (const [k, v] of Object.entries(env)) {
    saved[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  return Promise.resolve(fn()).finally(() => {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });
}

const CONFIGURED = {
  KV_REST_API_URL: 'https://fake-kv.example.com',
  KV_REST_API_TOKEN: 'store-token',
  RATE_LIMIT_STORE_SECRET: 'shared-secret',
};

test('limit adapter rejects non-POST', () => withEnv(CONFIGURED, async () => {
  const res = makeRes();
  await handler(makeReq({ method: 'GET' }), res);
  assert.equal(res.statusCode, 405);
}));

test('limit adapter fails closed without store config', () => withEnv({
  KV_REST_API_URL: undefined,
  UPSTASH_REDIS_REST_URL: undefined,
  KV_REST_API_TOKEN: undefined,
  UPSTASH_REDIS_REST_TOKEN: undefined,
  RATE_LIMIT_STORE_SECRET: undefined,
}, async () => {
  const res = makeRes();
  await handler(makeReq({ authorization: 'Bearer anything', body: { key: GOOD_KEY } }), res);
  assert.equal(res.statusCode, 503);
}));

test('limit adapter requires the shared secret', () => withEnv(CONFIGURED, async () => {
  const res = makeRes();
  await handler(makeReq({ authorization: 'Bearer wrong', body: { key: GOOD_KEY } }), res);
  assert.equal(res.statusCode, 401);
}));

test('limit adapter accepts only salted hash keys', () => withEnv(CONFIGURED, async () => {
  const res = makeRes();
  await handler(makeReq({
    authorization: 'Bearer shared-secret',
    body: { key: '203.0.113.7' },
  }), res);
  assert.equal(res.statusCode, 400);
}));

test('limit adapter allows under the limit and blocks over it', () => withEnv(CONFIGURED, async () => {
  const originalFetch = globalThis.fetch;
  let count = 0;
  globalThis.fetch = async (url, options) => {
    assert.ok(String(url).startsWith('https://fake-kv.example.com/pipeline'));
    const commands = JSON.parse(options.body);
    assert.equal(commands[0][0], 'INCR');
    assert.ok(commands[0][1].startsWith('rl:sha256:'));
    count += 1;
    return {
      ok: true,
      json: async () => [{ result: count }, { result: 1 }, { result: 42 }],
    };
  };
  try {
    const first = makeRes();
    await handler(makeReq({
      authorization: 'Bearer shared-secret',
      body: { key: GOOD_KEY, limit: 2, window_seconds: 60 },
    }), first);
    assert.equal(first.statusCode, 200);
    assert.equal(first.body.allowed, true);

    const second = makeRes();
    await handler(makeReq({
      authorization: 'Bearer shared-secret',
      body: { key: GOOD_KEY, limit: 2, window_seconds: 60 },
    }), second);
    assert.equal(second.statusCode, 200);

    const third = makeRes();
    await handler(makeReq({
      authorization: 'Bearer shared-secret',
      body: { key: GOOD_KEY, limit: 2, window_seconds: 60 },
    }), third);
    assert.equal(third.statusCode, 429);
    assert.equal(third.body.allowed, false);
    assert.equal(third.body.retry_after, 42);
    assert.equal(third.headers['Retry-After'], '42');
  } finally {
    globalThis.fetch = originalFetch;
  }
}));

test('limit adapter fails closed when the store errors', () => withEnv(CONFIGURED, async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, json: async () => ({}) });
  try {
    const res = makeRes();
    await handler(makeReq({
      authorization: 'Bearer shared-secret',
      body: { key: GOOD_KEY, limit: 2, window_seconds: 60 },
    }), res);
    assert.equal(res.statusCode, 503);
  } finally {
    globalThis.fetch = originalFetch;
  }
}));
