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
    destination: 'supabase-rest',
  });
  assert.equal(JSON.stringify(res.body).includes('person@example.com'), false);
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

test('rejects cross-site browser origins before storage', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response('{}');
  };

  const req = {
    method: 'POST',
    headers: {
      host: 'unwindcode.ai',
      origin: 'https://attacker.example',
    },
    body: { email: 'reader@example.com' },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { success: false, error: 'Origin not allowed' });
  assert.equal(called, false);
});

test('rejects host-spoofed browser origins before subscriber storage', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response('{}');
  };

  const req = {
    method: 'POST',
    headers: {
      host: 'attacker.example',
      origin: 'https://attacker.example',
      'x-forwarded-proto': 'https',
    },
    body: { email: 'reader@example.com' },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { success: false, error: 'Origin not allowed' });
  assert.equal(called, false);
});

test('rejects missing-origin subscriber requests with unreviewed host headers', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response('{}');
  };

  const req = {
    method: 'POST',
    headers: {
      host: 'attacker.example',
      'x-forwarded-proto': 'https',
    },
    body: { email: 'reader@example.com' },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { success: false, error: 'Origin not allowed' });
  assert.equal(called, false);
});

test('rejects localhost subscriber origins in production unless explicitly configured', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.VERCEL_ENV = 'production';
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  delete process.env.SUBSCRIBE_ALLOWED_ORIGINS;

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response('{}');
  };

  const req = {
    method: 'POST',
    headers: {
      origin: 'http://localhost:5173',
    },
    body: { email: 'reader@example.com' },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { success: false, error: 'Origin not allowed' });
  assert.equal(called, false);
});

test('accepts configured preview origins for subscriber storage', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  process.env.SUBSCRIBE_ALLOWED_ORIGINS = 'https://preview.unwindcode.ai';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify([{ id: 8, email: 'reader@example.com' }]), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  };

  const req = {
    method: 'POST',
    headers: {
      host: 'unwindcode.ai',
      origin: 'https://preview.unwindcode.ai',
    },
    body: { email: 'reader@example.com' },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(calls.length, 1);
});

test('does not echo subscriber email when forwarding to the edge function', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_SERVICE_KEY;

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  const req = {
    method: 'POST',
    headers: {
      origin: 'https://www.unwindcode.ai',
    },
    body: {
      email: 'Reader@Example.com',
      page_path: '/',
    },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: true,
    stored: true,
    destination: 'supabase-edge-function',
  });
  assert.equal(JSON.stringify(res.body).includes('reader@example.com'), false);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://example.supabase.co/functions/v1/subscribe');
  assert.deepEqual(JSON.parse(calls[0].options.body), { email: 'reader@example.com' });
});

test('hides upstream storage details from public error responses', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        message: 'permission denied for table website_subscribers using service-key',
      }),
      {
        status: 403,
        headers: { 'content-type': 'application/json' },
      },
    );

  const req = {
    method: 'POST',
    headers: {},
    body: { email: 'reader@example.com' },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, {
    success: false,
    error: 'Unable to store subscriber email',
  });
});

test('rejects external page path metadata before storage', async (t) => {
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
    body: {
      email: 'reader@example.com',
      page_path: 'https://attacker.example/signup',
    },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { success: false, error: 'Invalid page path' });
  assert.equal(called, false);
});

test('emits non-sensitive operational logs when enabled', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;
  const previousInfo = console.info;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
    console.info = previousInfo;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  process.env.SUBSCRIBE_LOG_EVENTS = 'true';

  const logs = [];
  console.info = (message) => {
    logs.push(message);
  };

  globalThis.fetch = async () =>
    new Response(JSON.stringify([{ id: 9, email: 'reader@example.com' }]), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });

  const req = {
    method: 'POST',
    headers: {
      origin: 'https://unwindcode.ai',
    },
    body: {
      email: 'reader@example.com',
      page_path: '/transmissions/24-the-mirror-found-its-form.html?utm_source=newsletter',
    },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(logs.length, 1);
  const entry = JSON.parse(logs[0]);
  assert.equal(entry.event, 'subscribe_stored');
  assert.equal(entry.destination, 'supabase-rest');
  assert.equal(entry.pagePath, '/transmissions/24-the-mirror-found-its-form.html');
  assert.equal(logs[0].includes('reader@example.com'), false);
  assert.equal(logs[0].includes('service-key'), false);
});

test('returns 429 when durable subscribe rate limit denies the request', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';

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

  const req = {
    method: 'POST',
    headers: {
      origin: 'https://www.unwindcode.ai',
      'x-real-ip': '198.51.100.77',
    },
    body: {
      email: 'reader@example.com',
      page_path: '/',
    },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['retry-after'], '120');
  assert.deepEqual(res.body, { success: false, error: 'Too many requests' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://limits.example.test/check');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer limit-token');

  const limitBody = JSON.parse(calls[0].options.body);
  assert.equal(limitBody.route, '/api/subscribe');
  assert.equal(limitBody.limit, 10);
  assert.equal(limitBody.window_seconds, 60);
  assert.match(limitBody.key, /^sha256:/);
  assert.equal(calls[0].options.body.includes('reader@example.com'), false);
  assert.equal(calls[0].options.body.includes('198.51.100.77'), false);
});

test('fails closed in production when subscribe rate limiting is not configured', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.VERCEL_ENV = 'production';
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  delete process.env.RATE_LIMIT_REST_URL;
  delete process.env.RATE_LIMIT_REST_TOKEN;
  delete process.env.RATE_LIMIT_SALT;

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response('{}');
  };

  const req = {
    method: 'POST',
    headers: {
      origin: 'https://www.unwindcode.ai',
    },
    body: {
      email: 'reader@example.com',
    },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['retry-after'], '60');
  assert.deepEqual(res.body, { success: false, error: 'Request limit unavailable' });
  assert.equal(called, false);
});

test('fails closed in production when subscribe REST upstream URL is not configured', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.VERCEL_ENV = 'production';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  delete process.env.SUPABASE_URL;
  delete process.env.VITE_SUPABASE_URL;
  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });

    if (url === 'https://limits.example.test/check') {
      return new Response(JSON.stringify({ allowed: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify([{ id: 11, email: 'reader@example.com' }]), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  };

  const req = {
    method: 'POST',
    headers: {
      origin: 'https://www.unwindcode.ai',
    },
    body: {
      email: 'reader@example.com',
      page_path: '/',
    },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.body, { success: false, error: 'Subscribe upstream unavailable' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://limits.example.test/check');
  assert.equal(JSON.stringify(res.body).includes('reader@example.com'), false);
});

test('fails closed in production when subscribe edge upstream env is not configured', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.VERCEL_ENV = 'production';
  delete process.env.SUPABASE_URL;
  delete process.env.VITE_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_SERVICE_KEY;
  delete process.env.SUPABASE_ANON_KEY;
  delete process.env.VITE_SUPABASE_ANON_KEY;
  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });

    if (url === 'https://limits.example.test/check') {
      return new Response(JSON.stringify({ allowed: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  const req = {
    method: 'POST',
    headers: {
      origin: 'https://www.unwindcode.ai',
    },
    body: {
      email: 'reader@example.com',
      page_path: '/',
    },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.body, { success: false, error: 'Subscribe upstream unavailable' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://limits.example.test/check');
  assert.equal(JSON.stringify(res.body).includes('reader@example.com'), false);
});

test('fails closed in production when configured subscribe rate limiter returns an HTTP error', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.VERCEL_ENV = 'production';
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });

    if (url === 'https://limits.example.test/check') {
      return new Response(JSON.stringify({ error: 'limiter auth failed' }), {
        status: 401,
        headers: {
          'content-type': 'application/json',
          'retry-after': '75',
        },
      });
    }

    return new Response(JSON.stringify([{ id: 12, email: 'reader@example.com' }]), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  };

  const req = {
    method: 'POST',
    headers: {
      origin: 'https://www.unwindcode.ai',
    },
    body: {
      email: 'reader@example.com',
      page_path: '/',
    },
  };
  const res = createMockResponse();

  await subscribeHandler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['retry-after'], '75');
  assert.deepEqual(res.body, { success: false, error: 'Request limit unavailable' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://limits.example.test/check');
});
