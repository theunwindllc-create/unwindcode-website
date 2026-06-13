import assert from 'node:assert/strict';
import test from 'node:test';

import { checkDurableRateLimit } from '../api/_shared/rate-limit.js';

const RATE_LIMIT_ENV = {
  RATE_LIMIT_REST_URL: 'https://limits.example.test/check',
  RATE_LIMIT_REST_TOKEN: 'limit-token',
  RATE_LIMIT_SALT: 'test-salt',
};

async function captureRateLimitBody(t, { headers = {}, socketAddress = '10.0.0.5', env = {} }) {
  const previousFetch = globalThis.fetch;
  const calls = [];

  t.after(() => {
    globalThis.fetch = previousFetch;
  });

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify({ allowed: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  await checkDurableRateLimit({
    req: {
      headers: {
        'user-agent': 'rate-limit-test',
        ...headers,
      },
      socket: {
        remoteAddress: socketAddress,
      },
    },
    route: '/api/chat',
    limit: 20,
    windowSeconds: 60,
    env: {
      ...RATE_LIMIT_ENV,
      ...env,
    },
  });

  assert.equal(calls.length, 1);
  return JSON.parse(calls[0].options.body);
}

test('rate limit identity ignores forwarded client headers unless proxy trust is explicit', async (t) => {
  const first = await captureRateLimitBody(t, {
    headers: {
      'cf-connecting-ip': '198.51.100.10',
      'x-real-ip': '198.51.100.11',
      'x-forwarded-for': '198.51.100.12, 10.0.0.1',
    },
  });
  const second = await captureRateLimitBody(t, {
    headers: {
      'cf-connecting-ip': '203.0.113.10',
      'x-real-ip': '203.0.113.11',
      'x-forwarded-for': '203.0.113.12, 10.0.0.1',
    },
  });

  assert.equal(first.route, '/api/chat');
  assert.equal(first.key, second.key);
  assert.match(first.key, /^sha256:/);
  assert.equal(JSON.stringify(first).includes('198.51.100'), false);
  assert.equal(JSON.stringify(first).includes('10.0.0.5'), false);
});

test('rate limit identity can opt in to trusted proxy headers after deployment review', async (t) => {
  const env = {
    RATE_LIMIT_TRUST_PROXY_HEADERS: 'true',
  };
  const first = await captureRateLimitBody(t, {
    env,
    headers: {
      'x-forwarded-for': '198.51.100.20, 10.0.0.1',
    },
  });
  const second = await captureRateLimitBody(t, {
    env,
    headers: {
      'x-forwarded-for': '203.0.113.20, 10.0.0.1',
    },
  });

  assert.notEqual(first.key, second.key);
  assert.equal(JSON.stringify(first).includes('198.51.100.20'), false);
  assert.equal(JSON.stringify(second).includes('203.0.113.20'), false);
});

test('rate limit identity ignores malformed trusted proxy addresses', async (t) => {
  const env = {
    RATE_LIMIT_TRUST_PROXY_HEADERS: 'true',
  };
  const first = await captureRateLimitBody(t, {
    env,
    headers: {
      'x-forwarded-for': 'not-an-ip, 198.51.100.30',
    },
  });
  const second = await captureRateLimitBody(t, {
    env,
    headers: {
      'x-forwarded-for': 'also-not-an-ip, 203.0.113.30',
    },
  });

  assert.equal(first.key, second.key);
  assert.equal(JSON.stringify(first).includes('not-an-ip'), false);
});

test('rate limit identity does not split the primary bucket by user agent', async (t) => {
  const first = await captureRateLimitBody(t, {
    headers: {
      'user-agent': 'rotating-agent-one',
    },
  });
  const second = await captureRateLimitBody(t, {
    headers: {
      'user-agent': 'rotating-agent-two',
    },
  });

  assert.equal(first.key, second.key);
  assert.equal(JSON.stringify(first).includes('rotating-agent-one'), false);
});
