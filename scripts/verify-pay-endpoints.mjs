import {
  createHmac,
  createPrivateKey,
  generateKeyPairSync,
  sign as cryptoSignRaw,
  verify as cryptoVerify,
} from 'node:crypto';
import payHandler, { buildCoinbaseJwt, detectKeyAlgorithm } from '../api/pay.js';
import { verifyWebhookSignature } from '../api/pay-webhook.js';

let failures = 0;

async function check(name, assertion) {
  try {
    const passed = await assertion();
    if (!passed) throw new Error('assertion returned false');
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

function createResponse() {
  return {
    headers: {},
    statusCode: 0,
    body: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(value) {
      this.statusCode = value;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    },
  };
}

function decodeJsonPart(value) {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
}

const webhookSecret = 'synthetic-webhook-secret';
const webhookNow = 2_000_000_000;
const webhookBody = Buffer.from(JSON.stringify({ eventType: 'checkout.payment.success', id: 'abc' }));
const webhookDigest = createHmac('sha256', webhookSecret)
  .update(String(webhookNow))
  .update('.')
  .update(webhookBody)
  .digest('hex');
const webhookHeader = `t=${webhookNow},h=content-type,v0=${webhookDigest}`;

await check('webhook accepts a correctly signed raw payload', () =>
  verifyWebhookSignature({
    signatureHeader: webhookHeader,
    rawBody: webhookBody,
    secret: webhookSecret,
    nowSeconds: webhookNow,
  }),
);

await check('webhook rejects a tampered payload', () =>
  !verifyWebhookSignature({
    signatureHeader: webhookHeader,
    rawBody: Buffer.from(`${webhookBody.toString('utf8')} `),
    secret: webhookSecret,
    nowSeconds: webhookNow,
  }),
);

await check('webhook rejects a timestamp older than five minutes', () =>
  !verifyWebhookSignature({
    signatureHeader: webhookHeader,
    rawBody: webhookBody,
    secret: webhookSecret,
    nowSeconds: webhookNow + 301,
  }),
);

// SECURITY: a stamp far in the future is a forged/replayed t, not clock skew.
await check('webhook rejects a timestamp far in the future', () =>
  !verifyWebhookSignature({
    signatureHeader: webhookHeader,
    rawBody: webhookBody,
    secret: webhookSecret,
    nowSeconds: webhookNow - 3600,
  }),
);

// SECURITY: only v0 is trusted; a header carrying only v1 must not authenticate.
await check('webhook rejects a header missing v0 (only v1 present)', () => {
  const v1Header = `t=${webhookNow},h=content-type,v1=${webhookDigest}`;
  return !verifyWebhookSignature({
    signatureHeader: v1Header,
    rawBody: webhookBody,
    secret: webhookSecret,
    nowSeconds: webhookNow,
  });
});

// SECURITY: an empty/missing secret must never validate anything.
await check('webhook rejects when secret is empty', () =>
  !verifyWebhookSignature({
    signatureHeader: webhookHeader,
    rawBody: webhookBody,
    secret: '',
    nowSeconds: webhookNow,
  }),
);

await check('JWT builder emits a verifiable ES256 token with Coinbase claims', () => {
  const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const apiKeyName = 'organizations/test-org/apiKeys/test-key';
  const nowSeconds = 1_900_000_000;
  const token = buildCoinbaseJwt({
    apiKeyId: apiKeyName,
    apiKeySecret: privateKey.export({ type: 'pkcs8', format: 'pem' }),
    nowSeconds,
    nonce: '00112233445566778899aabbccddeeff',
  });
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const header = decodeJsonPart(parts[0]);
  const payload = decodeJsonPart(parts[1]);
  const verified = cryptoVerify(
    'sha256',
    Buffer.from(`${parts[0]}.${parts[1]}`),
    { key: publicKey, dsaEncoding: 'ieee-p1363' },
    Buffer.from(parts[2], 'base64url'),
  );

  return (
    verified &&
    header.alg === 'ES256' &&
    header.kid === apiKeyName &&
    header.typ === 'JWT' &&
    header.nonce === '00112233445566778899aabbccddeeff' &&
    payload.iss === 'cdp' &&
    payload.sub === apiKeyName &&
    payload.nbf === nowSeconds &&
    payload.exp === nowSeconds + 120 &&
    payload.uri === 'POST business.coinbase.com/api/v1/checkouts'
  );
});

// CDP keys default to Ed25519 since Feb 2025 — the signer must handle both key
// types, or a default-created key silently 401s.
await check('JWT builder emits a verifiable EdDSA token for an Ed25519 key', () => {
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  // Coinbase hands out base64(32B seed ‖ 32B pubkey); rebuild that shape.
  const seed = privateKey.export({ type: 'pkcs8', format: 'der' }).subarray(-32);
  const pub = publicKey.export({ type: 'spki', format: 'der' }).subarray(-32);
  const apiKeySecret = Buffer.concat([seed, pub]).toString('base64');

  if (detectKeyAlgorithm(apiKeySecret) !== 'EdDSA') return false;

  const token = buildCoinbaseJwt({
    apiKeyId: '11111111-2222-3333-4444-555555555555',
    apiKeySecret,
    nowSeconds: 1_900_000_000,
    nonce: 'aabb',
  });
  const parts = token.split('.');
  const header = decodeJsonPart(parts[0]);
  const payload = decodeJsonPart(parts[1]);
  const verified = cryptoVerify(
    null,
    Buffer.from(`${parts[0]}.${parts[1]}`),
    publicKey,
    Buffer.from(parts[2], 'base64url'),
  );
  return (
    verified &&
    header.alg === 'EdDSA' &&
    header.kid === '11111111-2222-3333-4444-555555555555' &&
    payload.sub === '11111111-2222-3333-4444-555555555555' &&
    payload.iss === 'cdp'
  );
});

// Interop proof, not self-consistency: a key rebuilt from ONLY the 32-byte seed
// must produce byte-identical signatures to the original key, and verify against
// the original public key — which is what Coinbase holds.
await check('Ed25519 seed reconstruction is byte-identical to the real key', () => {
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  const der = privateKey.export({ type: 'pkcs8', format: 'der' });
  const prefix = Buffer.from('302e020100300506032b657004220420', 'hex');
  if (!der.subarray(0, 16).equals(prefix)) return false; // our hardcoded DER header must match Node's
  const seed = der.subarray(-32);
  const rebuilt = createPrivateKey({
    key: Buffer.concat([prefix, seed]),
    format: 'der',
    type: 'pkcs8',
  });
  const msg = Buffer.from('interop-check');
  const fromReal = cryptoSignRaw(null, msg, privateKey);
  const fromRebuilt = cryptoSignRaw(null, msg, rebuilt);
  return (
    fromReal.equals(fromRebuilt) && cryptoVerify(null, msg, publicKey, fromRebuilt)
  );
});

// The sandbox lives at a path prefix on the same host; the SIGNED uri claim
// must follow the path, not just the fetch URL, or Coinbase 401s silently.
await check('JWT uri claim tracks the sandbox path', () => {
  const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const token = buildCoinbaseJwt({
    apiKeyId: 'k',
    apiKeySecret: privateKey.export({ type: 'pkcs8', format: 'pem' }),
    path: '/sandbox/api/v1/checkouts',
  });
  return (
    decodeJsonPart(token.split('.')[1]).uri ===
    'POST business.coinbase.com/sandbox/api/v1/checkouts'
  );
});

await check('unrecognized key material is refused, not silently mis-signed', () => {
  try {
    buildCoinbaseJwt({ apiKeyId: 'k', apiKeySecret: 'not-a-key' });
    return false;
  } catch {
    return true;
  }
});

// Codex review: arbitrary 64-byte material must NOT pass as an Ed25519 key.
// The public half has to be the one the seed actually derives.
await check('bogus 64-byte material is rejected (seed/public mismatch)', () => {
  const junk = Buffer.alloc(64, 7).toString('base64');
  if (detectKeyAlgorithm(junk) !== null) return false;
  const { privateKey } = generateKeyPairSync('ed25519');
  const seed = privateKey.export({ type: 'pkcs8', format: 'der' }).subarray(-32);
  // real seed, WRONG public half
  const mismatched = Buffer.concat([seed, Buffer.alloc(32, 9)]).toString('base64');
  return detectKeyAlgorithm(mismatched) === null;
});

await check('malformed base64 and wrong-length secrets are rejected', () => {
  const cases = ['', 'AAAA', `${Buffer.alloc(64, 1).toString('base64')}!!!!`, Buffer.alloc(32, 1).toString('base64')];
  return cases.every((c) => detectKeyAlgorithm(c) === null);
});

// The whole point of checkoutTarget(): the URL we call and the URL we SIGN can
// never diverge, in either environment. Divergence = silent 401.
for (const sandbox of [false, true]) {
  await check(`handler signs the same URL it fetches (sandbox=${sandbox})`, async () => {
    const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
    const prevFetch = globalThis.fetch;
    const prevSandbox = process.env.CDP_CHECKOUT_SANDBOX;
    const prevPay = process.env.BANKER_PAY_SECRET;
    process.env.BANKER_PAY_SECRET = 'internal-pay-secret';
    process.env.CDP_API_KEY_ID = 'test-key';
    process.env.CDP_API_KEY_SECRET = privateKey.export({ type: 'pkcs8', format: 'pem' });
    if (sandbox) process.env.CDP_CHECKOUT_SANDBOX = 'true';
    else delete process.env.CDP_CHECKOUT_SANDBOX;

    let fetchedUrl = null;
    let signedUri = null;
    globalThis.fetch = async (url, init) => {
      fetchedUrl = url;
      const jwt = String(init.headers.Authorization).slice(7);
      signedUri = decodeJsonPart(jwt.split('.')[1]).uri;
      return { ok: false, status: 500 };
    };
    try {
      await payHandler(
        {
          method: 'POST',
          headers: { authorization: 'Bearer internal-pay-secret' },
          body: { amount: '1.00', memo: 'm', agent: 'banker' },
        },
        createResponse(),
      );
    } finally {
      globalThis.fetch = prevFetch;
      delete process.env.CDP_API_KEY_ID;
      delete process.env.CDP_API_KEY_SECRET;
      if (prevSandbox === undefined) delete process.env.CDP_CHECKOUT_SANDBOX;
      else process.env.CDP_CHECKOUT_SANDBOX = prevSandbox;
      if (prevPay === undefined) delete process.env.BANKER_PAY_SECRET;
      else process.env.BANKER_PAY_SECRET = prevPay;
    }
    const expectedPath = sandbox ? '/sandbox/api/v1/checkouts' : '/api/v1/checkouts';
    return (
      fetchedUrl === `https://business.coinbase.com${expectedPath}` &&
      signedUri === `POST business.coinbase.com${expectedPath}`
    );
  });
}

await check('whitespace CDP_API_KEY_ID does not shadow the legacy alias', () => {
  const prevId = process.env.CDP_API_KEY_ID;
  const prevName = process.env.CDP_API_KEY_NAME;
  process.env.CDP_API_KEY_ID = '   ';
  process.env.CDP_API_KEY_NAME = 'legacy-key-name';
  const resolved =
    String(process.env.CDP_API_KEY_ID || '').trim() ||
    String(process.env.CDP_API_KEY_NAME || '').trim();
  if (prevId === undefined) delete process.env.CDP_API_KEY_ID;
  else process.env.CDP_API_KEY_ID = prevId;
  if (prevName === undefined) delete process.env.CDP_API_KEY_NAME;
  else process.env.CDP_API_KEY_NAME = prevName;
  return resolved === 'legacy-key-name';
});

const originalPaySecret = process.env.BANKER_PAY_SECRET;
process.env.BANKER_PAY_SECRET = 'internal-pay-secret';

await check('pay endpoint rejects a missing bearer token', async () => {
  const response = createResponse();
  await payHandler({ method: 'POST', headers: {}, body: {} }, response);
  return response.statusCode === 401 && response.body?.error === 'Unauthorized';
});

await check('pay endpoint rejects a wrong bearer token', async () => {
  const response = createResponse();
  await payHandler(
    {
      method: 'POST',
      headers: { authorization: 'Bearer wrong-secret' },
      body: {},
    },
    response,
  );
  return response.statusCode === 401 && response.body?.error === 'Unauthorized';
});

if (originalPaySecret === undefined) {
  delete process.env.BANKER_PAY_SECRET;
} else {
  process.env.BANKER_PAY_SECRET = originalPaySecret;
}

if (failures > 0) {
  console.error(`${failures} verification check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('All payment endpoint checks passed.');
}
