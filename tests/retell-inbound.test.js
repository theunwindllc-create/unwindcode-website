import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import test from 'node:test';

import handler, { MAX_CALL_DURATION_MS } from '../api/retell-inbound.js';

const TOKEN = 'test-inbound-token-not-live';
const KEY = 'test-api-key';
const STAMP = 1_700_000_000_000;
const ENV = {
  RETELL_PASSPHRASE: 'test-phrase-not-live',
  RETELL_INBOUND_TOKEN: TOKEN,
  RETELL_AGENT_ID: 'agent_test',
  RETELL_API_KEY: KEY,
  RETELL_ALLOWED_NUMBERS: '+15551234567',
  KV_REST_API_URL: '', KV_REST_API_TOKEN: '',
  UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '',
};

function response() {
  return {
    statusCode: 200, body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    end() { this.body = ''; return this; },
  };
}

function request(chunks, { token = TOKEN, signature, headers = {}, method = 'POST' } = {}) {
  const req = Readable.from(chunks);
  req.method = method;
  req.url = '/api/retell-inbound?t=' + encodeURIComponent(token);
  req.headers = { ...headers, ...(signature === undefined ? {} : { 'x-retell-signature': signature }) };
  return req;
}

function signature(raw, timestamp = STAMP) {
  return `v=${timestamp},d=${crypto.createHmac('sha256', KEY).update(raw + timestamp).digest('hex')}`;
}

async function withFixture(fn, overrides = {}) {
  const values = { ...ENV, ...overrides };
  const saved = Object.fromEntries(Object.keys(values).map(key => [key, process.env[key]]));
  const oldNow = Date.now;
  const oldLog = console.log;
  const oldFetch = globalThis.fetch;
  const logs = [];
  try {
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    Date.now = () => STAMP;
    console.log = value => logs.push(String(value));
    globalThis.fetch = () => { throw new Error('network must not be used in this fixture'); };
    await fn(logs);
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    Date.now = oldNow;
    console.log = oldLog;
    globalThis.fetch = oldFetch;
  }
}

test('accepts the official SDK signature vector, then rejects its non-inbound event', async () => {
  await withFixture(async () => {
    const raw = '{"event":"call_ended"}';
    // RetellAI/retell-typescript-sdk tests/webhook-auth.test.ts, pinned test vector.
    const signed = 'v=1700000000000,d=07024cabe7dd8f6d1c6e4a8324ca92c812e6ad4a7ee506c04f7e462e3321823e';
    const res = response();
    await handler(request([Buffer.from(raw)], { signature: signed }), res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { call_inbound: { reject: true } });
  });
});

test('accepts a signed inbound call split across UTF-8 chunks without logging the phrase', async () => {
  await withFixture(async logs => {
    const raw = JSON.stringify({ event: 'call_inbound', call_inbound: {
      from_number: '+15551234567', to_number: '+18084449386', name: 'Jos\u00e9',
    } });
    const bytes = Buffer.from(raw);
    const accent = bytes.indexOf(Buffer.from('\u00e9'));
    assert.ok(accent > 0);
    const res = response();
    await handler(request([bytes.subarray(0, accent + 1), bytes.subarray(accent + 1)],
      { signature: signature(raw) }), res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.call_inbound.override_agent_id, 'agent_test');
    assert.equal(res.body.call_inbound.dynamic_variables.security_code, ENV.RETELL_PASSPHRASE);
    assert.equal(res.body.call_inbound.dynamic_variables.caller_recognized, 'true');
    assert.ok(!logs.join('').includes(ENV.RETELL_PASSPHRASE));
  });
});

test('forged, stale, malformed and altered signed calls all get the same empty 404', async () => {
  await withFixture(async () => {
    const raw = JSON.stringify({ event: 'call_inbound', call_inbound: { from_number: '+15551234567' } });
    const attempts = [
      { token: 'wrong-token', signature: signature(raw) },
      { signature: undefined },
      { signature: signature(raw, STAMP - 300_001) },
      { signature: 'v=1700000000000,d=not-hex' },
      { signature: signature(raw), body: raw + ' ' },
      { signature: signature(raw), body: raw, method: 'GET' },
    ];
    for (const item of attempts) {
      const res = response();
      await handler(request([Buffer.from(item.body ?? raw)], item), res);
      assert.equal(res.statusCode, 404, JSON.stringify(item));
      assert.equal(res.body, '');
    }
  });
});

test('IP fallback ignores caller-set forwarded-for and accepts only the trusted Vercel header', async () => {
  await withFixture(async () => {
    const raw = JSON.stringify({ event: 'call_inbound', call_inbound: { from_number: '+15551234567' } });
    const forged = response();
    await handler(request([Buffer.from(raw)], { headers: {
      'x-forwarded-for': '100.20.5.228', 'x-vercel-forwarded-for': '198.51.100.9',
    } }), forged);
    assert.equal(forged.statusCode, 404);
    const trusted = response();
    await handler(request([Buffer.from(raw)], { headers: { 'x-vercel-forwarded-for': '100.20.5.228' } }), trusted);
    assert.equal(trusted.statusCode, 200);
    assert.equal(trusted.body.call_inbound.override_agent_id, 'agent_test');
  }, { RETELL_API_KEY: undefined });
});

test('oversize signed bodies refuse before parsing or exposing dynamic variables', async () => {
  await withFixture(async () => {
    const raw = 'x'.repeat(65537);
    const res = response();
    await handler(request([Buffer.from(raw)], { signature: signature(raw) }), res);
    assert.equal(res.statusCode, 404);
    assert.equal(res.body, '');
  });
});

test('unknown caller cap rejects, while a KV outage preserves the passphrase gate', async () => {
  await withFixture(async () => {
    const raw = JSON.stringify({ event: 'call_inbound', call_inbound: { from_number: '+15557654321' } });
    globalThis.fetch = async () => ({ ok: true, json: async () => [{ result: 9 }] });
    const capped = response();
    await handler(request([Buffer.from(raw)], { signature: signature(raw) }), capped);
    assert.deepEqual(capped.body, { call_inbound: { reject: true } });

    globalThis.fetch = () => { throw new Error('synthetic KV outage'); };
    const outage = response();
    await handler(request([Buffer.from(raw)], { signature: signature(raw) }), outage);
    assert.equal(outage.statusCode, 200);
    assert.equal(outage.body.call_inbound.override_agent_id, 'agent_test');
    assert.equal(outage.body.call_inbound.dynamic_variables.caller_recognized, 'false');
  }, { KV_REST_API_URL: 'https://kv.example.invalid', KV_REST_API_TOKEN: 'test-token' });
});

test('per-call override sent to Retell is 180000 ms (3 minutes), never above, for recognised and unrecognised numbers', async () => {
  await withFixture(async () => {
    assert.equal(MAX_CALL_DURATION_MS, 180000);
    for (const from of ['+15551234567', '+15557654321']) {
      const raw = JSON.stringify({ event: 'call_inbound', call_inbound: { from_number: from } });
      const res = response();
      await handler(request([Buffer.from(raw)], { signature: signature(raw) }), res);
      assert.equal(res.statusCode, 200);
      const limit = res.body.call_inbound.agent_override.agent.max_call_duration_ms;
      assert.equal(limit, 180000);
      assert.ok(limit <= 180000);
    }
  });
});
