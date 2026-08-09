import {
  createHash,
  randomBytes,
  randomUUID,
  sign as cryptoSign,
  timingSafeEqual,
} from 'node:crypto';

const COINBASE_CHECKOUT_URL = 'https://business.coinbase.com/api/v1/checkouts';
const COINBASE_CHECKOUT_HOST = 'business.coinbase.com';
const COINBASE_CHECKOUT_PATH = '/api/v1/checkouts';
const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;
const DEFAULT_MAX_USD = '500';
const COINBASE_MAX_USD = '100000000';
const MAX_METADATA_VALUE_LENGTH = 100;

function getHeader(headers, name) {
  if (!headers) return '';
  const direct = headers[name] || headers[name.toLowerCase()];
  if (direct) return Array.isArray(direct) ? direct[0] : direct;

  const match = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
  if (!match) return '';
  return Array.isArray(match[1]) ? match[1][0] : match[1];
}

function base64UrlJson(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function amountToCents(amount) {
  const [whole, fraction = ''] = amount.split('.');
  return (BigInt(whole) * 100n) + BigInt(fraction.padEnd(2, '0'));
}

function normalizeMaximum(value) {
  const candidate = String(value || DEFAULT_MAX_USD).trim();
  if (!AMOUNT_PATTERN.test(candidate)) return DEFAULT_MAX_USD;

  const cents = amountToCents(candidate);
  if (cents < 1n || cents > amountToCents(COINBASE_MAX_USD)) return DEFAULT_MAX_USD;
  return candidate;
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return typeof body === 'object' && !Array.isArray(body) ? body : {};
}

function normalizeMetadataValue(value) {
  if (typeof value !== 'string') return null;
  const candidate = value.trim();
  if (
    !candidate ||
    candidate.length > MAX_METADATA_VALUE_LENGTH ||
    /[\u0000-\u001F\u007F]/u.test(candidate)
  ) {
    return null;
  }
  return candidate;
}

function readConfig(env = process.env) {
  return {
    paySecret: String(env.BANKER_PAY_SECRET || '').trim(),
    maximumUsd: normalizeMaximum(env.BANKER_PAY_MAX_USD),
    apiKeyName: String(env.CDP_API_KEY_NAME || '').trim(),
    apiKeySecret: String(env.CDP_API_KEY_SECRET || '').trim(),
  };
}

function sendJson(res, status, body) {
  res.status(status);
  res.json(body);
}

export function constantTimeSecretMatch(candidate, expected) {
  const candidateDigest = createHash('sha256').update(String(candidate)).digest();
  const expectedDigest = createHash('sha256').update(String(expected)).digest();
  return timingSafeEqual(candidateDigest, expectedDigest);
}

export function verifyBearerAuthorization(authorization, secret) {
  if (!secret) return false;
  const header = String(authorization || '');
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : '';
  return Boolean(bearer) && constantTimeSecretMatch(bearer, secret);
}

export function buildCoinbaseJwt({
  apiKeyName,
  apiKeySecret,
  method = 'POST',
  host = COINBASE_CHECKOUT_HOST,
  path = COINBASE_CHECKOUT_PATH,
  nowSeconds = Math.floor(Date.now() / 1000),
  nonce = randomBytes(16).toString('hex'),
}) {
  const header = {
    alg: 'ES256',
    kid: apiKeyName,
    nonce,
    typ: 'JWT',
  };
  const payload = {
    iss: 'cdp',
    sub: apiKeyName,
    nbf: nowSeconds,
    exp: nowSeconds + 120,
    uri: `${method} ${host}${path}`,
  };
  const signingInput = `${base64UrlJson(header)}.${base64UrlJson(payload)}`;
  const signature = cryptoSign('sha256', Buffer.from(signingInput), {
    key: apiKeySecret,
    dsaEncoding: 'ieee-p1363',
  });

  return `${signingInput}.${signature.toString('base64url')}`;
}

export function validatePaymentBody(body, maximumUsd = DEFAULT_MAX_USD) {
  const amount = typeof body.amount === 'string' ? body.amount : '';
  const memo = normalizeMetadataValue(body.memo);
  const agent = normalizeMetadataValue(body.agent);
  const normalizedMaximum = normalizeMaximum(maximumUsd);

  if (!AMOUNT_PATTERN.test(amount)) {
    return { ok: false, error: 'Invalid amount' };
  }

  const amountCents = amountToCents(amount);
  if (amountCents < 1n || amountCents > amountToCents(normalizedMaximum)) {
    return { ok: false, error: 'Invalid amount' };
  }

  if (!memo || !agent) {
    return { ok: false, error: 'Invalid payment metadata' };
  }

  return { ok: true, amount, memo, agent };
}

export default async function payHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const config = readConfig();
  if (!config.paySecret) {
    sendJson(res, 503, { error: 'payment rail not configured' });
    return;
  }

  if (!verifyBearerAuthorization(getHeader(req.headers, 'authorization'), config.paySecret)) {
    sendJson(res, 401, { error: 'Unauthorized' });
    return;
  }

  if (!config.apiKeyName || !config.apiKeySecret) {
    sendJson(res, 503, { error: 'payment rail not configured' });
    return;
  }

  const payment = validatePaymentBody(parseBody(req.body), config.maximumUsd);
  if (!payment.ok) {
    sendJson(res, 400, { error: payment.error });
    return;
  }

  try {
    const token = buildCoinbaseJwt({
      apiKeyName: config.apiKeyName,
      apiKeySecret: config.apiKeySecret,
    });
    const response = await fetch(COINBASE_CHECKOUT_URL, {
      method: 'POST',
      // A bearer-carrying request must never chase a redirect to another host.
      // The JWT is scoped to this exact URI; a redirect elsewhere is hostile.
      redirect: 'error',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': randomUUID(),
      },
      body: JSON.stringify({
        amount: payment.amount,
        currency: 'USDC',
        description: payment.memo,
        metadata: {
          agent: payment.agent,
          memo: payment.memo,
        },
      }),
    });

    if (!response.ok) {
      sendJson(res, 502, { error: 'payment provider unavailable' });
      return;
    }

    const checkout = await response.json();
    if (
      typeof checkout?.id !== 'string' ||
      typeof checkout?.url !== 'string' ||
      typeof checkout?.x402_url !== 'string' ||
      typeof checkout?.status !== 'string'
    ) {
      sendJson(res, 502, { error: 'payment provider unavailable' });
      return;
    }

    sendJson(res, 201, {
      id: checkout.id,
      url: checkout.url,
      x402_url: checkout.x402_url,
      status: checkout.status,
    });
  } catch {
    sendJson(res, 502, { error: 'payment provider unavailable' });
  }
}
