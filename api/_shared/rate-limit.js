import { createHash } from 'node:crypto';
import { isIP } from 'node:net';

const DEFAULT_WINDOW_SECONDS = 60;
function getHeader(headers, name) {
  if (!headers) return '';
  const direct = headers[name] || headers[name.toLowerCase()];
  if (direct) return Array.isArray(direct) ? direct[0] : direct;

  const match = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
  if (!match) return '';
  const value = match[1];
  return Array.isArray(value) ? value[0] : value;
}

function firstForwardedAddress(value) {
  return String(value || '')
    .split(',')[0]
    .trim();
}

function trustProxyHeaders(env) {
  return String(env.RATE_LIMIT_TRUST_PROXY_HEADERS || '').trim().toLowerCase() === 'true';
}

function validAddress(value) {
  const candidate = String(value || '').trim();
  return isIP(candidate) ? candidate : '';
}

function getTrustedProxyAddress(req) {
  return (
    validAddress(getHeader(req.headers, 'cf-connecting-ip')) ||
    validAddress(getHeader(req.headers, 'x-real-ip')) ||
    validAddress(firstForwardedAddress(getHeader(req.headers, 'x-forwarded-for')))
  );
}

function getClientAddress(req, env) {
  if (trustProxyHeaders(env)) {
    return getTrustedProxyAddress(req) || req.socket?.remoteAddress || 'unknown';
  }

  return req.socket?.remoteAddress || 'unknown';
}

function hashRateLimitKey({ req, route, salt, env }) {
  const source = [route, getClientAddress(req, env)].join('|');
  const digest = createHash('sha256')
    .update(`${salt}:${source}`)
    .digest('hex');

  return `sha256:${digest}`;
}

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

async function readLimitDecision(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function retryAfterFrom(value, fallback = 60) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? String(parsed) : String(fallback);
}

function productionRequiresRateLimit(env) {
  return env.VERCEL_ENV === 'production';
}

export async function checkDurableRateLimit({
  req,
  route,
  limit,
  windowSeconds = DEFAULT_WINDOW_SECONDS,
  env = process.env,
}) {
  const endpoint = String(env.RATE_LIMIT_REST_URL || '').trim();
  const token = String(env.RATE_LIMIT_REST_TOKEN || '').trim();
  const salt = String(env.RATE_LIMIT_SALT || '').trim();
  if (!endpoint || !token || !salt) {
    if (productionRequiresRateLimit(env)) {
      return {
        allowed: false,
        configured: false,
        unavailable: true,
        retryAfter: String(DEFAULT_WINDOW_SECONDS),
      };
    }

    return { allowed: true, configured: false };
  }

  const body = {
    route,
    key: hashRateLimitKey({
      req,
      route,
      salt,
      env,
    }),
    limit: positiveInteger(limit, 1),
    window_seconds: positiveInteger(windowSeconds, DEFAULT_WINDOW_SECONDS),
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const decision = await readLimitDecision(response);
    if (response.status === 429 || decision.allowed === false) {
      return {
        allowed: false,
        configured: true,
        retryAfter: retryAfterFrom(
          response.headers.get('retry-after') || decision.retry_after || decision.retryAfter,
          body.window_seconds,
        ),
      };
    }

    if (!response.ok) {
      const retryAfter = retryAfterFrom(
        response.headers.get('retry-after') || decision.retry_after || decision.retryAfter,
        body.window_seconds,
      );

      if (productionRequiresRateLimit(env)) {
        return {
          allowed: false,
          configured: true,
          unavailable: true,
          retryAfter,
        };
      }

      return { allowed: true, configured: true, unavailable: true, retryAfter };
    }

    return { allowed: true, configured: true };
  } catch {
    if (productionRequiresRateLimit(env)) {
      return {
        allowed: false,
        configured: true,
        unavailable: true,
        retryAfter: String(DEFAULT_WINDOW_SECONDS),
      };
    }

    return { allowed: true, configured: true, unavailable: true };
  }
}

export function sendRateLimitResponse(res, retryAfter) {
  res.setHeader('Retry-After', retryAfter);
  res.status(429);
  res.json({ success: false, error: 'Too many requests' });
}

export function sendRateLimitUnavailableResponse(res, retryAfter = String(DEFAULT_WINDOW_SECONDS)) {
  res.setHeader('Retry-After', retryAfter);
  res.status(503);
  res.json({ success: false, error: 'Request limit unavailable' });
}
