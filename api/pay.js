import {
  createHash,
  createPrivateKey,
  createPublicKey,
  randomBytes,
  randomUUID,
  sign as cryptoSign,
  timingSafeEqual,
} from 'node:crypto';

const COINBASE_CHECKOUT_HOST = 'business.coinbase.com';
const COINBASE_CHECKOUT_PATH = '/api/v1/checkouts';
// Business Checkouts sandbox is a path prefix on the SAME host, using the SAME
// CDP keys; payments settle in Base Sepolia USDC. Set CDP_CHECKOUT_SANDBOX=true
// to route there. The signed `uri` claim must match the sandbox path too — a
// mismatch is a silent 401, so both are derived from one place below.
const COINBASE_SANDBOX_PATH = '/sandbox/api/v1/checkouts';
// PKCS8 DER prefix for a raw Ed25519 seed (RFC 8410 OID 1.3.101.112).
const ED25519_PKCS8_PREFIX = Buffer.from('302e020100300506032b657004220420', 'hex');

function checkoutTarget(env = process.env) {
  const sandbox = String(env.CDP_CHECKOUT_SANDBOX || '').trim().toLowerCase() === 'true';
  const path = sandbox ? COINBASE_SANDBOX_PATH : COINBASE_CHECKOUT_PATH;
  return { host: COINBASE_CHECKOUT_HOST, path, url: `https://${COINBASE_CHECKOUT_HOST}${path}` };
}
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
    // CDP_API_KEY_ID is canonical (CDP_API_KEY_NAME is the legacy SDK fallback).
    // Trim before selecting so a whitespace-only ID can't shadow a valid alias.
    apiKeyId:
      String(env.CDP_API_KEY_ID || '').trim() || String(env.CDP_API_KEY_NAME || '').trim(),
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

/**
 * Detect the CDP key type. The Portal issues Ed25519 by default (since Feb
 * 2025) and ECDSA only if explicitly chosen, so both must work: an EC PEM signs
 * ES256, a 64-byte base64 secret (32B seed + 32B pubkey) signs EdDSA.
 */
function ed25519KeyFromSeed(seed) {
  return createPrivateKey({
    key: Buffer.concat([ED25519_PKCS8_PREFIX, seed]),
    format: 'der',
    type: 'pkcs8',
  });
}

/**
 * Validate a Coinbase Ed25519 secret: canonical base64, exactly 64 bytes, and —
 * decisively — the public half must be the one the seed actually derives. That
 * turns a corrupted or wrong-key paste into an immediate local failure instead
 * of an unexplained 401 from Coinbase at the worst moment.
 */
function ed25519Seed(secret) {
  if (!/^[A-Za-z0-9+/]{86}==$/.test(secret)) return null;
  const raw = Buffer.from(secret, 'base64');
  if (raw.length !== 64) return null;
  const seed = raw.subarray(0, 32);
  const claimedPublic = raw.subarray(32);
  let derivedPublic;
  try {
    derivedPublic = createPublicKey(ed25519KeyFromSeed(seed))
      .export({ type: 'spki', format: 'der' })
      .subarray(-32);
  } catch {
    return null;
  }
  return timingSafeEqual(derivedPublic, claimedPublic) ? seed : null;
}

/**
 * A PEM is only ES256-signable if it is genuinely an EC P-256 key. An RSA,
 * Ed25519, or wrong-curve PEM would otherwise be labelled ES256 and rejected
 * remotely as a bare 401 — the same opaque failure the Ed25519 validation above
 * exists to prevent. Fail locally instead.
 */
function isEcP256Pem(secret) {
  try {
    const key = createPrivateKey(secret);
    return (
      key.asymmetricKeyType === 'ec' &&
      key.asymmetricKeyDetails?.namedCurve === 'prime256v1'
    );
  } catch {
    return false;
  }
}

export function detectKeyAlgorithm(apiKeySecret) {
  const secret = String(apiKeySecret || '').trim();
  if (secret.includes('BEGIN')) return isEcP256Pem(secret) ? 'ES256' : null;
  return ed25519Seed(secret) ? 'EdDSA' : null;
}

function signJwt(algorithm, signingInput, apiKeySecret) {
  const input = Buffer.from(signingInput);
  if (algorithm === 'ES256') {
    // JOSE requires raw R‖S, not DER — hence ieee-p1363.
    return cryptoSign('sha256', input, { key: apiKeySecret, dsaEncoding: 'ieee-p1363' });
  }
  const seed = ed25519Seed(String(apiKeySecret).trim());
  if (!seed) throw new Error('invalid Ed25519 key material');
  return cryptoSign(null, input, ed25519KeyFromSeed(seed));
}

export function buildCoinbaseJwt({
  apiKeyId,
  apiKeyName,
  apiKeySecret,
  method = 'POST',
  host = COINBASE_CHECKOUT_HOST,
  path = COINBASE_CHECKOUT_PATH,
  nowSeconds = Math.floor(Date.now() / 1000),
  nonce = randomBytes(16).toString('hex'),
}) {
  // CDP_API_KEY_ID is canonical; CDP_API_KEY_NAME is the legacy alias. Whatever
  // the Portal gave you goes into kid/sub verbatim — bare UUID or full
  // organizations/.../apiKeys/... path.
  const keyId = apiKeyId || apiKeyName;
  const algorithm = detectKeyAlgorithm(apiKeySecret);
  if (!algorithm) throw new Error('unrecognized CDP key format');

  const header = { alg: algorithm, kid: keyId, nonce, typ: 'JWT' };
  const payload = {
    iss: 'cdp',
    sub: keyId,
    nbf: nowSeconds,
    exp: nowSeconds + 120,
    uri: `${method} ${host}${path}`,
  };
  const signingInput = `${base64UrlJson(header)}.${base64UrlJson(payload)}`;
  return `${signingInput}.${signJwt(algorithm, signingInput, apiKeySecret).toString('base64url')}`;
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

  if (!config.apiKeyId || !config.apiKeySecret) {
    sendJson(res, 503, { error: 'payment rail not configured' });
    return;
  }

  const payment = validatePaymentBody(parseBody(req.body), config.maximumUsd);
  if (!payment.ok) {
    sendJson(res, 400, { error: payment.error });
    return;
  }

  try {
    // One source of truth for host/path: the signed `uri` claim and the fetch
    // target must agree, or Coinbase rejects with a bare 401.
    const target = checkoutTarget();
    const token = buildCoinbaseJwt({
      apiKeyId: config.apiKeyId,
      apiKeySecret: config.apiKeySecret,
      method: 'POST',
      host: target.host,
      path: target.path,
    });
    const response = await fetch(target.url, {
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
