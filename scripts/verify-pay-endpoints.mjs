import { createHmac, generateKeyPairSync, verify as cryptoVerify } from 'node:crypto';
import payHandler, { buildCoinbaseJwt } from '../api/pay.js';
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
    apiKeyName,
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
