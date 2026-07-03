import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * Durable rate-limit store adapter.
 *
 * Implements the limiter contract expected by api/_shared/rate-limit.js
 * (POST { route, key, limit, window_seconds } with Authorization: Bearer
 * <RATE_LIMIT_STORE_SECRET> → { allowed, retry_after }) on top of Upstash
 * Redis REST (KV_REST_API_URL / KV_REST_API_TOKEN, auto-provisioned by the
 * Vercel × Upstash marketplace integration).
 *
 * Fixed-window counter: INCR + EXPIRE NX in one pipeline round trip. Only
 * salted hash keys ever reach Redis — no raw addresses, no prompt text.
 */

const DEFAULT_WINDOW_SECONDS = 60;

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function constantTimeMatch(a, b) {
  const ha = createHash('sha256').update(String(a)).digest();
  const hb = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

function storeConfig(env = process.env) {
  return {
    url: String(env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL || '').trim().replace(/\/$/, ''),
    token: String(env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN || '').trim(),
    secret: String(env.RATE_LIMIT_STORE_SECRET || '').trim(),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { url, token, secret } = storeConfig();
  if (!url || !token || !secret) {
    res.status(503).json({ error: 'Limiter store not configured' });
    return;
  }

  const auth = String(req.headers.authorization || '');
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!bearer || !constantTimeMatch(bearer, secret)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const key = String(body.key || '').trim();
  if (!key.startsWith('sha256:') || key.length > 200) {
    res.status(400).json({ error: 'Invalid key' });
    return;
  }
  const limit = positiveInteger(body.limit, 1);
  const windowSeconds = positiveInteger(body.window_seconds, DEFAULT_WINDOW_SECONDS);
  const redisKey = `rl:${key}`;

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', redisKey],
        ['EXPIRE', redisKey, String(windowSeconds), 'NX'],
        ['TTL', redisKey],
      ]),
    });

    if (!response.ok) {
      res.status(503).json({ error: 'Limiter store unavailable' });
      return;
    }

    const results = await response.json();
    const count = Number(results?.[0]?.result);
    const ttl = Number(results?.[2]?.result);
    if (!Number.isFinite(count)) {
      res.status(503).json({ error: 'Limiter store unavailable' });
      return;
    }

    const retryAfter = ttl > 0 ? ttl : windowSeconds;
    if (count > limit) {
      res.setHeader('Retry-After', String(retryAfter));
      res.status(429).json({ allowed: false, retry_after: retryAfter });
      return;
    }

    res.status(200).json({ allowed: true, remaining: Math.max(limit - count, 0) });
  } catch {
    res.status(503).json({ error: 'Limiter store unavailable' });
  }
}
