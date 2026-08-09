import { createHmac, timingSafeEqual } from 'node:crypto';

const WEBHOOK_MAX_AGE_SECONDS = 5 * 60;
// Reject stamps implausibly ahead of our clock: a genuine Coinbase event is
// stamped at send time, so meaningful future skew signals a forged/replayed t.
const WEBHOOK_MAX_FUTURE_SECONDS = 60;

export const config = {
  api: {
    bodyParser: false,
  },
};

function getHeader(headers, name) {
  if (!headers) return '';
  const direct = headers[name] || headers[name.toLowerCase()];
  if (direct) return Array.isArray(direct) ? direct[0] : direct;

  const match = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
  if (!match) return '';
  return Array.isArray(match[1]) ? match[1][0] : match[1];
}

function signatureComponent(header, name) {
  const match = String(header || '').match(new RegExp(`(?:^|,)\\s*${name}=([^,]+)`));
  return match ? match[1].trim() : '';
}

function rawBodyBuffer(rawBody) {
  if (Buffer.isBuffer(rawBody)) return rawBody;
  if (rawBody instanceof Uint8Array) return Buffer.from(rawBody);
  if (typeof rawBody === 'string') return Buffer.from(rawBody);
  return null;
}

async function readRawRequestBody(req) {
  const explicitRawBody = rawBodyBuffer(req.rawBody);
  if (explicitRawBody) return explicitRawBody;

  const bodyBuffer = rawBodyBuffer(req.body);
  if (bodyBuffer) return bodyBuffer;

  if (!req || typeof req[Symbol.asyncIterator] !== 'function') return null;

  const chunks = [];
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

function sendJson(res, status, body) {
  res.status(status);
  res.json(body);
}

export function verifyWebhookSignature({
  signatureHeader,
  rawBody,
  secret,
  nowSeconds = Math.floor(Date.now() / 1000),
  maxAgeSeconds = WEBHOOK_MAX_AGE_SECONDS,
}) {
  const body = rawBodyBuffer(rawBody);
  const timestampValue = signatureComponent(signatureHeader, 't');
  const signatureValue = signatureComponent(signatureHeader, 'v0');

  if (
    !secret ||
    !body ||
    !/^\d+$/.test(timestampValue) ||
    !/^[a-fA-F0-9]{64}$/.test(signatureValue)
  ) {
    return false;
  }

  const timestamp = Number(timestampValue);
  if (
    !Number.isSafeInteger(timestamp) ||
    nowSeconds - timestamp > maxAgeSeconds ||
    timestamp - nowSeconds > WEBHOOK_MAX_FUTURE_SECONDS
  ) {
    return false;
  }

  const expected = createHmac('sha256', secret)
    .update(timestampValue)
    .update('.')
    .update(body)
    .digest();
  const received = Buffer.from(signatureValue, 'hex');
  return timingSafeEqual(expected, received);
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

async function forwardLedgerEvent({ url, paySecret, event }) {
  if (!url || !paySecret || !event) return;
  // Never transmit the bearer secret over a non-TLS or malformed target.
  if (!isHttpsUrl(url)) return;

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paySecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
  } catch {
    // Coinbase delivery acknowledgement must not depend on ledger availability.
  }
}

export default async function payWebhookHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const webhookSecret = String(process.env.BANKER_WEBHOOK_SECRET || '').trim();
  if (!webhookSecret) {
    sendJson(res, 503, { error: 'payment rail not configured' });
    return;
  }

  let rawBody;
  try {
    rawBody = await readRawRequestBody(req);
  } catch {
    sendJson(res, 401, { error: 'Unauthorized' });
    return;
  }

  const valid = verifyWebhookSignature({
    signatureHeader: getHeader(req.headers, 'x-hook0-signature'),
    rawBody,
    secret: webhookSecret,
  });
  if (!valid) {
    sendJson(res, 401, { error: 'Unauthorized' });
    return;
  }

  let event = null;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch {
    // A valid signature is acknowledged even when its body cannot be forwarded as JSON.
  }

  await forwardLedgerEvent({
    url: String(process.env.BANKER_LEDGER_FORWARD_URL || '').trim(),
    paySecret: String(process.env.BANKER_PAY_SECRET || '').trim(),
    event,
  });

  sendJson(res, 200, { received: true });
}
