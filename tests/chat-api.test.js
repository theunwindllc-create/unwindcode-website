import assert from 'node:assert/strict';
import test from 'node:test';

import chatHandler from '../api/chat.js';

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

test('forwards valid chat messages through the same-origin proxy', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        conversation_id: 'conv-123',
        reply: 'The organism is online.',
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
    },
    body: {
      conversation_id: 'conv-001',
      message: 'What do you build?',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: true,
    conversation_id: 'conv-123',
    reply: 'The organism is online.',
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://example.supabase.co/functions/v1/chat');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer anon-key');
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    conversation_id: 'conv-001',
    message: 'What do you build?',
  });
});

test('rejects untrusted browser origins before forwarding chat prompts', async (t) => {
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
    headers: {
      host: 'unwindcode.ai',
      origin: 'https://attacker.example',
    },
    body: { message: 'steal this prompt' },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { success: false, error: 'Origin not allowed' });
  assert.equal(called, false);
});

test('rejects host-spoofed browser origins before forwarding chat prompts', async (t) => {
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
    headers: {
      host: 'attacker.example',
      origin: 'https://attacker.example',
      'x-forwarded-proto': 'https',
    },
    body: { message: 'should not forward through host spoofing' },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { success: false, error: 'Origin not allowed' });
  assert.equal(called, false);
});

test('rejects missing-origin chat requests with unreviewed host headers', async (t) => {
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
    headers: {
      host: 'attacker.example',
      'x-forwarded-proto': 'https',
    },
    body: { message: 'missing origin should not trust host' },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { success: false, error: 'Origin not allowed' });
  assert.equal(called, false);
});

test('rejects localhost chat origins in production unless explicitly configured', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.VERCEL_ENV = 'production';
  delete process.env.CHAT_ALLOWED_ORIGINS;
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
    body: { message: 'local origin should not be implicit in production' },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { success: false, error: 'Origin not allowed' });
  assert.equal(called, false);
});

test('does not authorize chat origins from subscribe-only allowlist config', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  delete process.env.CHAT_ALLOWED_ORIGINS;
  process.env.SUBSCRIBE_ALLOWED_ORIGINS = 'https://preview.unwindcode.ai';

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response('{}');
  };

  const req = {
    method: 'POST',
    headers: {
      origin: 'https://preview.unwindcode.ai',
    },
    body: { message: 'subscribe preview should not imply chat access' },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { success: false, error: 'Origin not allowed' });
  assert.equal(called, false);
});

test('rejects invalid chat payloads before forwarding', async (t) => {
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
      conversation_id: '../../etc/passwd',
      message: 'Hello',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { success: false, error: 'Invalid conversation' });
  assert.equal(called, false);
});

test('rejects chat messages with control characters before forwarding', async (t) => {
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
      message: 'hello\u0000world',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { success: false, error: 'Invalid message' });
  assert.equal(called, false);
});

test('hides upstream chat details from public error responses', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';

  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        error: 'provider failed with anon-key and raw prompt',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    );

  const req = {
    method: 'POST',
    headers: {},
    body: { message: 'private prompt text' },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, {
    success: false,
    error: 'Unable to reach the Brain chat service',
  });
});

test('emits metadata-only chat logs when enabled', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;
  const previousInfo = console.info;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
    console.info = previousInfo;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';
  process.env.CHAT_LOG_EVENTS = 'true';

  const logs = [];
  console.info = (message) => {
    logs.push(message);
  };

  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        conversation_id: 'conv-999',
        reply: 'Ready.',
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );

  const req = {
    method: 'POST',
    headers: { origin: 'https://unwindcode.ai' },
    body: {
      conversation_id: 'conv-123',
      message: 'private prompt text',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(logs.length, 1);
  const entry = JSON.parse(logs[0]);
  assert.equal(entry.event, 'chat_forwarded');
  assert.equal(entry.hasConversationId, true);
  assert.equal(entry.messageLength, 19);
  assert.equal(logs[0].includes('private prompt text'), false);
  assert.equal(logs[0].includes('anon-key'), false);
});

test('returns 429 when durable chat rate limit denies the request', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';
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
    method: 'POST',
    headers: {
      origin: 'https://www.unwindcode.ai',
      'x-forwarded-for': '203.0.113.9, 10.0.0.1',
    },
    body: {
      conversation_id: 'conv-001',
      message: 'private prompt text',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['retry-after'], '45');
  assert.deepEqual(res.body, { success: false, error: 'Too many requests' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://limits.example.test/check');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer limit-token');

  const limitBody = JSON.parse(calls[0].options.body);
  assert.equal(limitBody.route, '/api/chat');
  assert.equal(limitBody.limit, 20);
  assert.equal(limitBody.window_seconds, 60);
  assert.match(limitBody.key, /^sha256:/);
  assert.equal(calls[0].options.body.includes('private prompt text'), false);
  assert.equal(calls[0].options.body.includes('203.0.113.9'), false);
});

test('fails closed in production when chat rate limiting is not configured', async (t) => {
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
    method: 'POST',
    headers: {
      origin: 'https://www.unwindcode.ai',
    },
    body: {
      message: 'private prompt text',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['retry-after'], '60');
  assert.deepEqual(res.body, { success: false, error: 'Request limit unavailable' });
  assert.equal(called, false);
});

test('fails closed in production when chat upstream env is not configured', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.VERCEL_ENV = 'production';
  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';
  delete process.env.SUPABASE_URL;
  delete process.env.VITE_SUPABASE_URL;
  delete process.env.SUPABASE_ANON_KEY;
  delete process.env.VITE_SUPABASE_ANON_KEY;

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });

    if (url === 'https://limits.example.test/check') {
      return new Response(JSON.stringify({ allowed: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ reply: 'default upstream should not be called' }), {
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
      message: 'hello',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.body, { success: false, error: 'Chat upstream unavailable' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://limits.example.test/check');
});

test('fails closed in production when chat anon key env is not configured', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.VERCEL_ENV = 'production';
  process.env.SUPABASE_URL = 'https://example.supabase.co';
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

    return new Response(JSON.stringify({ reply: 'anon fallback should not be called' }), {
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
      message: 'hello',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.body, { success: false, error: 'Chat upstream unavailable' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://limits.example.test/check');
  assert.equal(JSON.stringify(calls).includes('anon fallback'), false);
});

test('fails closed in production when configured chat rate limiter returns an HTTP error', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.VERCEL_ENV = 'production';
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';
  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });

    if (url === 'https://limits.example.test/check') {
      return new Response(JSON.stringify({ error: 'temporary limiter failure' }), {
        status: 500,
        headers: {
          'content-type': 'application/json',
          'retry-after': '90',
        },
      });
    }

    return new Response(JSON.stringify({ response: 'upstream should not be called' }), {
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
      message: 'private prompt text',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['retry-after'], '90');
  assert.deepEqual(res.body, { success: false, error: 'Request limit unavailable' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://limits.example.test/check');
});

test('blocks high-risk financial chat prompts before returning bare upstream answers', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response(
      JSON.stringify({
        conversation_id: 'conv-risk',
        reply: 'Bare upstream financial answer should not be returned.',
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
    },
    body: {
      conversation_id: 'conv-001',
      message: 'financial organisms real markets',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 409);
  assert.equal(called, false);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error, 'Grounding review required before chat answer');
  assert.equal(res.body.grounding.schema_version, '2026-06-06.public-grounding-packet.v1');
  assert.equal(res.body.grounding.mode, 'public_registry_grounding');
  assert.equal(res.body.grounding.answer_generation, 'disabled');
  assert.equal(res.body.grounding.requires_human_review, true);
  assert.equal(res.body.grounding.answer_policy.synthesis_allowed, false);
  assert.equal(res.body.grounding.answer_policy.decision, 'review_required_before_synthesis');
  assert.ok(
    res.body.grounding.answer_policy.blocked_reasons.includes('high_risk_claim_requires_review'),
  );
  assert.ok(res.body.grounding.answer_policy.required_before_synthesis.includes('render_citations'));
  assert.ok(
    res.body.grounding.answer_policy.required_before_synthesis.includes('render_claim_qualifications'),
  );
  assert.ok(res.body.grounding.citations.length >= 1);
  assert.ok(res.body.grounding.refusal_rules.includes('do_not_claim_wallet_authority'));
  assert.ok(res.body.grounding.sources.some((source) => source.citation_indexes.length >= 1));
  assert.ok(res.body.grounding.review_flags.includes('high_risk_claim'));
  assert.ok(res.body.grounding.blocked_reasons.includes('high_risk_claim_requires_review'));
  assert.ok(res.body.grounding.required_before_answer.includes('render_citations'));
  assert.ok(res.body.grounding.required_before_answer.includes('render_claim_qualifications'));
  assert.ok(
    res.body.grounding.required_qualifications.some(
      (qualification) => qualification.claim_id === 'financial-organisms-real-markets',
    ),
  );
  assert.equal('reply' in res.body, false);
  assert.equal(JSON.stringify(res.body).includes('Bare upstream financial answer'), false);
});

test('blocks risky-domain chat prompts when public grounding has no reviewed match', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response(
      JSON.stringify({
        conversation_id: 'conv-risk',
        reply: 'Bare wallet answer should not be returned.',
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
    },
    body: {
      conversation_id: 'conv-001',
      message: 'how do wallets work',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 409);
  assert.equal(called, false);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error, 'Grounding review required before chat answer');
  assert.equal(res.body.grounding.schema_version, '2026-06-06.public-grounding-packet.v1');
  assert.equal(res.body.grounding.mode, 'public_registry_grounding');
  assert.equal(res.body.grounding.answer_generation, 'disabled');
  assert.equal(res.body.grounding.requires_human_review, true);
  assert.equal(res.body.grounding.answer_policy.synthesis_allowed, false);
  assert.equal(res.body.grounding.answer_policy.decision, 'review_required_before_synthesis');
  assert.ok(
    res.body.grounding.answer_policy.blocked_reasons.includes('risk_domain_requires_grounding_review'),
  );
  assert.ok(
    res.body.grounding.answer_policy.blocked_reasons.includes('missing_grounding_citations'),
  );
  assert.ok(res.body.grounding.answer_policy.required_before_synthesis.includes('render_citations'));
  assert.ok(res.body.grounding.refusal_rules.includes('do_not_generate_uncited_answers'));
  assert.deepEqual(res.body.grounding.citations, []);
  assert.ok(res.body.grounding.review_flags.includes('risky_domain_prompt_missing_grounding'));
  assert.ok(res.body.grounding.blocked_reasons.includes('risk_domain_requires_grounding_review'));
  assert.ok(res.body.grounding.blocked_reasons.includes('missing_grounding_citations'));
  assert.deepEqual(res.body.grounding.required_qualifications, []);
  assert.deepEqual(res.body.grounding.sources, []);
  assert.equal('reply' in res.body, false);
});

test('blocks wallet authority and live deployment chat prompts before upstream answers', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response(JSON.stringify({ reply: 'Unsafe authority answer.' }), {
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
      message: 'Are you live on ICP and can autonomous agents sign transactions?',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 409);
  assert.equal(called, false);
  assert.equal(res.body.error, 'Grounding review required before chat answer');
  assert.ok(res.body.grounding.blocked_reasons.includes('risk_domain_requires_grounding_review'));
});

test('blocks Web3 transaction action prompts before upstream answers', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';

  const forwardedMessages = [];
  globalThis.fetch = async (url, options) => {
    if (String(url).includes('/functions/v1/chat')) {
      forwardedMessages.push(JSON.parse(options.body).message);
    }

    return new Response(JSON.stringify({ reply: 'Unsafe transaction action answer.' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  const prompts = [
    'execute swaps right now',
    'transfer funds right now',
    'move funds right now',
    'sign a transaction right now',
  ];

  for (const message of prompts) {
    const req = {
      method: 'POST',
      headers: {
        origin: 'https://www.unwindcode.ai',
      },
      body: { message },
    };
    const res = createMockResponse();

    await chatHandler(req, res);

    assert.equal(res.statusCode, 409, `${message} should require grounding review`);
    assert.equal(res.body.error, 'Grounding review required before chat answer');
    assert.ok(
      res.body.grounding.blocked_reasons.includes('risk_domain_requires_grounding_review'),
      `${message} should carry risky-domain blocked reason`,
    );
    assert.equal('reply' in res.body, false);
  }

  assert.deepEqual(forwardedMessages, []);
});

test('blocks future-vision site claim prompts before upstream answers', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response(JSON.stringify({ reply: 'Bare availability answer should not be returned.' }), {
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
      message: 'Are independent organisms available now?',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 409);
  assert.equal(called, false);
  assert.equal(res.body.error, 'Grounding review required before chat answer');
  assert.equal(res.body.grounding.schema_version, '2026-06-06.public-grounding-packet.v1');
  assert.ok(res.body.grounding.review_flags.includes('future_vision_claim'));
  assert.ok(res.body.grounding.answer_policy.blocked_reasons.includes('future_vision_label_required'));
  assert.ok(
    res.body.grounding.required_qualifications.some(
      (qualification) => qualification.claim_id === 'future-independent-organisms',
    ),
  );
  assert.ok(res.body.grounding.citations.length >= 1);
  assert.equal('reply' in res.body, false);
});

test('blocks broad future-vision organism prompts before upstream answers', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';

  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response(JSON.stringify({ reply: 'Bare future vision answer should not be returned.' }), {
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
      message: 'Do cognitive organisms operate independently across creative production and cybersecurity today?',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 409);
  assert.equal(called, false);
  assert.equal(res.body.error, 'Grounding review required before chat answer');
  assert.ok(res.body.grounding.review_flags.includes('future_vision_claim'));
  assert.ok(res.body.grounding.answer_policy.blocked_reasons.includes('future_vision_label_required'));
  assert.ok(
    res.body.grounding.required_qualifications.some(
      (qualification) => qualification.claim_id === 'future-independent-organisms',
    ),
  );
  assert.equal('reply' in res.body, false);
});

test('does not treat marketing or security support wording as risky-domain chat by substring', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'anon-key';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        conversation_id: 'conv-safe',
        reply: 'Marketing and security support are routed normally.',
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
    },
    body: {
      message: 'Can you explain your marketing section and security posture?',
    },
  };
  const res = createMockResponse();

  await chatHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(calls.length, 1);
  assert.equal(res.body.reply, 'Marketing and security support are routed normally.');
});
