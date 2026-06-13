import {
  checkDurableRateLimit,
  sendRateLimitResponse,
  sendRateLimitUnavailableResponse,
} from './_shared/rate-limit.js';

const DEFAULT_SUPABASE_URL = '';
const DEFAULT_SUPABASE_ANON = '';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_ALLOWED_ORIGINS = ['https://unwindcode.ai', 'https://www.unwindcode.ai'];
const MAX_PAGE_PATH_LENGTH = 160;
const DEFAULT_SUBSCRIBE_RATE_LIMIT = 10;
const DEFAULT_SUBSCRIBE_RATE_LIMIT_WINDOW_SECONDS = 60;

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function normalizePagePath(value) {
  if (value === undefined || value === null || value === '') {
    return { ok: true, value: '/' };
  }

  if (typeof value !== 'string') {
    return { ok: false };
  }

  const candidate = value.trim();
  if (
    !candidate ||
    candidate.length > MAX_PAGE_PATH_LENGTH ||
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    /[\u0000-\u001f\u007f]/.test(candidate)
  ) {
    return { ok: false };
  }

  try {
    const url = new URL(candidate, 'https://unwindcode.ai');
    if (url.origin !== 'https://unwindcode.ai' || url.pathname.length > MAX_PAGE_PATH_LENGTH) {
      return { ok: false };
    }
    return { ok: true, value: url.pathname || '/' };
  } catch {
    return { ok: false };
  }
}

function getHeader(headers, name) {
  if (!headers) return '';
  const direct = headers[name] || headers[name.toLowerCase()];
  if (direct) return Array.isArray(direct) ? direct[0] : direct;

  const match = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
  if (!match) return '';
  const value = match[1];
  return Array.isArray(value) ? value[0] : value;
}

function parseAllowedOrigins(value) {
  return String(value || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

function isLocalOrigin(origin) {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  } catch {
    return false;
  }
}

function isProduction(config) {
  return config.vercelEnv === 'production';
}

function originHost(origin) {
  try {
    return new URL(origin).host;
  } catch {
    return '';
  }
}

function requestHost(req) {
  return String(getHeader(req.headers, 'host') || '')
    .split(',')[0]
    .trim()
    .replace(/\/$/, '');
}

function isAllowedOrigin(req, config) {
  const origin = getHeader(req.headers, 'origin').replace(/\/$/, '');
  const allowedOrigins = new Set([
    ...DEFAULT_ALLOWED_ORIGINS,
    ...parseAllowedOrigins(config.allowedOrigins),
  ]);

  if (origin) {
    if (allowedOrigins.has(origin)) return true;
    if (isLocalOrigin(origin)) return !isProduction(config);
    return false;
  }

  const host = requestHost(req);
  if (!host) return true;
  if (['localhost', '127.0.0.1', '[::1]', '::1'].includes(host)) return !isProduction(config);

  return [...allowedOrigins].some((allowedOrigin) => originHost(allowedOrigin) === host);
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
  return body;
}

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getConfig() {
  const explicitSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const explicitServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
  const explicitAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  return {
    supabaseUrl: (explicitSupabaseUrl || DEFAULT_SUPABASE_URL).replace(/\/$/, ''),
    serviceKey: explicitServiceKey,
    anonKey: explicitAnonKey || DEFAULT_SUPABASE_ANON,
    hasExplicitSupabaseUrl: Boolean(explicitSupabaseUrl),
    hasExplicitServiceKey: Boolean(explicitServiceKey),
    hasExplicitAnonKey: Boolean(explicitAnonKey),
    subscribersTable: process.env.SUBSCRIBERS_TABLE || 'website_subscribers',
    allowedOrigins: process.env.SUBSCRIBE_ALLOWED_ORIGINS || '',
    logEvents: process.env.SUBSCRIBE_LOG_EVENTS === 'true',
    vercelEnv: process.env.VERCEL_ENV || '',
    rateLimit: positiveInteger(
      process.env.SUBSCRIBE_RATE_LIMIT_MAX || process.env.SUBSCRIBE_RATE_LIMIT,
      DEFAULT_SUBSCRIBE_RATE_LIMIT,
    ),
    rateLimitWindowSeconds: positiveInteger(
      process.env.SUBSCRIBE_RATE_LIMIT_WINDOW_SECONDS,
      DEFAULT_SUBSCRIBE_RATE_LIMIT_WINDOW_SECONDS,
    ),
  };
}

function hasProductionUpstreamConfig(config) {
  if (!isProduction(config)) return true;
  return config.hasExplicitSupabaseUrl && (config.hasExplicitServiceKey || config.hasExplicitAnonKey);
}

function logSubscribeEvent(config, event, metadata = {}) {
  if (!config.logEvents) return;
  console.info(
    JSON.stringify({
      event,
      route: '/api/subscribe',
      ...metadata,
    }),
  );
}

async function readError(response) {
  try {
    const data = await response.json();
    return data?.message || data?.error || response.statusText;
  } catch {
    return response.statusText;
  }
}

async function upsertSubscriber({ config, payload }) {
  const response = await fetch(
    `${config.supabaseUrl}/rest/v1/${config.subscribersTable}?on_conflict=email`,
    {
      method: 'POST',
      headers: {
        apikey: config.serviceKey,
        Authorization: `Bearer ${config.serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response;
}

async function forwardToEdgeFunction({ config, email }) {
  const response = await fetch(`${config.supabaseUrl}/functions/v1/subscribe`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response;
}

function sendJson(res, status, body) {
  res.status(status);
  res.json(body);
}

export default async function subscribeHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(204);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    sendJson(res, 405, { success: false, error: 'Method not allowed' });
    return;
  }

  const body = parseBody(req.body);
  const email = normalizeEmail(body.email);
  const pagePath = normalizePagePath(body.page_path);
  const config = getConfig();

  if (!isAllowedOrigin(req, config)) {
    logSubscribeEvent(config, 'subscribe_origin_denied');
    sendJson(res, 403, { success: false, error: 'Origin not allowed' });
    return;
  }

  if (!pagePath.ok) {
    logSubscribeEvent(config, 'subscribe_invalid_page_path');
    sendJson(res, 400, { success: false, error: 'Invalid page path' });
    return;
  }

  if (!EMAIL_PATTERN.test(email)) {
    logSubscribeEvent(config, 'subscribe_invalid_email', { pagePath: pagePath.value });
    sendJson(res, 400, { success: false, error: 'Invalid email' });
    return;
  }

  const rateLimit = await checkDurableRateLimit({
    req,
    route: '/api/subscribe',
    limit: config.rateLimit,
    windowSeconds: config.rateLimitWindowSeconds,
  });
  if (!rateLimit.allowed) {
    if (rateLimit.unavailable) {
      logSubscribeEvent(config, 'subscribe_rate_limit_unavailable', { pagePath: pagePath.value });
      sendRateLimitUnavailableResponse(res, rateLimit.retryAfter);
      return;
    }

    logSubscribeEvent(config, 'subscribe_rate_limited', { pagePath: pagePath.value });
    sendRateLimitResponse(res, rateLimit.retryAfter);
    return;
  }
  if (rateLimit.unavailable) {
    logSubscribeEvent(config, 'subscribe_rate_limit_unavailable', { pagePath: pagePath.value });
  }

  if (!hasProductionUpstreamConfig(config)) {
    logSubscribeEvent(config, 'subscribe_upstream_unavailable', { pagePath: pagePath.value });
    sendJson(res, 503, {
      success: false,
      error: 'Subscribe upstream unavailable',
    });
    return;
  }

  const payload = {
    email,
    source: 'unwindcode.ai',
  };

  try {
    if (config.serviceKey) {
      await upsertSubscriber({ config, payload });
      logSubscribeEvent(config, 'subscribe_stored', {
        destination: 'supabase-rest',
        pagePath: pagePath.value,
      });
      sendJson(res, 200, {
        success: true,
        stored: true,
        destination: 'supabase-rest',
      });
      return;
    }

    await forwardToEdgeFunction({ config, email });
    logSubscribeEvent(config, 'subscribe_stored', {
      destination: 'supabase-edge-function',
      pagePath: pagePath.value,
    });
    sendJson(res, 200, {
      success: true,
      stored: true,
      destination: 'supabase-edge-function',
    });
  } catch {
    logSubscribeEvent(config, 'subscribe_storage_failed', { pagePath: pagePath.value });
    sendJson(res, 502, {
      success: false,
      error: 'Unable to store subscriber email',
    });
  }
}
