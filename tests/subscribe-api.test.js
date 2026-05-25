import assert from 'node:assert/strict';
import test from 'node:test';

import subscribeHandler from '../api/subscribe.js';

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

test('stores a normalized website subscriber through Supabase REST', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  process.env.SUBSCRIBERS_TABLE = 'website_subscribers';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify([{ id: 7, email: 'person@example.com' }]), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  };

  const req = {
    method: 'POST',
    headers: {
      'user-agent': 'node-test',
      origin: 'https://www.unwindcode.ai',
    },
    body: {
      email: '  Person@Example.COM  ',
      page_path: '/',
    },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: true,
    stored: true,
    email: 'person@example.com',
    destination: 'supabase-rest',
  });
  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].url,
    'https://example.supabase.co/rest/v1/website_subscribers?on_conflict=email',
  );
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.headers.apikey, 'service-key');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer service-key');
  assert.equal(calls[0].options.headers.Prefer, 'resolution=merge-duplicates,return=representation');
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    email: 'person@example.com',
    source: 'unwindcode.ai',
  });
});

test('rejects malformed subscriber emails before storage', async (t) => {
  const previousFetch = globalThis.fetch;

  t.after(() => {
    globalThis.fetch = previousFetch;
  });

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response('{}');
  };

  const req = {
    method: 'POST',
    headers: {},
    body: { email: 'not-an-email' },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { success: false, error: 'Invalid email' });
  assert.equal(called, false);
});
