import {
  checkDurableRateLimit,
  sendRateLimitResponse,
  sendRateLimitUnavailableResponse,
} from './_shared/rate-limit.js';
import {
  buildPublicSearchPayload,
  parsePublicSearchParams,
} from './_shared/public-search.js';
import {
  buildGroundingPacket,
  buildUngroundedRiskPacket,
  GROUNDING_SOURCE_LIMIT,
  REQUIRED_BEFORE_SYNTHESIS,
} from './_shared/grounding-policy.js';

const DEFAULT_SUPABASE_URL = '';
const DEFAULT_SUPABASE_ANON = '';

const DEFAULT_ALLOWED_ORIGINS = ['https://unwindcode.ai', 'https://www.unwindcode.ai'];
const MAX_MESSAGE_LENGTH = 2000;
const MAX_CONVERSATION_ID_LENGTH = 120;
const CONVERSATION_ID_PATTERN = /^[a-zA-Z0-9._:-]+$/;
const DEFAULT_CHAT_RATE_LIMIT = 20;
const DEFAULT_CHAT_RATE_LIMIT_WINDOW_SECONDS = 60;
const CHAT_GROUNDING_TRIGGER_PATTERNS = [
  /\bfinanc(?:e|ial)\b/u,
  /\bmarkets?\b/u,
  /\btrad(?:e|es|ing)\b/u,
  /\bwallets?\b/u,
  /\bweb3\b/u,
  /\bblockchains?\b/u,
  /\bon[-\s]?chain\b/u,
  /\bcrypto\b/u,
  /\btokens?\b/u,
  /\bswaps?\b/u,
  /\btransactions?\b/u,
  /\bcapital\b/u,
  /\bmoney\b/u,
  /\bfunds?\b/u,
  /\bsmart contracts?\b/u,
  /\bsecurities\b/u,
  /\bsec gate\b/u,
  /\bmonad\b/u,
  /\bxrpl\b/u,
  /\bicp\b/u,
  /\bdeployed?\b/u,
  /\blive\b/u,
  /\bautonomous\b/u,
  /\b(?:execute|perform|run|submit|send)\s+(?:a\s+)?swaps?\b/u,
  /\b(?:transfer|move|send)\s+funds?\b/u,
  /\bsign\s+(?:a\s+)?transactions?\b/u,
  /\bsign(?:ing)? transactions?\b/u,
  /\bseed phrases?\b/u,
  /\bprivate keys?\b/u,
];
const CHAT_SITE_CLAIM_GROUNDING_PATTERNS = [
  {
    pattern: /\bindependent organisms?\b/u,
    query: 'independent organisms',
  },
  {
    pattern: /\borganisms?\b.*\bavailable\b/u,
    query: 'independent organisms',
  },
  {
    pattern: /\bavailable\b.*\borganisms?\b/u,
    query: 'independent organisms',
  },
  {
    pattern: /\bcognitive organisms?\b/u,
    query: 'independent organisms',
  },
  {
    pattern: /\boperat(?:e|es|ing)\s+independently\b/u,
    query: 'independent organisms',
  },
  {
    pattern: /\bcreative production\b/u,
    query: 'independent organisms',
  },
  {
    pattern: /\bcultural economics\b/u,
    query: 'independent organisms',
  },
  {
    pattern: /\bcybersecurity\b.*\btoday\b/u,
    query: 'independent organisms',
  },
  {
    pattern: /\b2030\b|\broadmap\b|\bfuture vision\b/u,
    query: 'independent organisms',
  },
];
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

function normalizeMessage(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function hasControlCharacters(value) {
  return /[\u0000-\u001F\u007F]/u.test(value);
}

function normalizeConversationId(value) {
  if (value === undefined || value === null || value === '') return { ok: true, value: null };
  if (typeof value !== 'string') return { ok: false };

  const candidate = value.trim();
  if (
    !candidate ||
    candidate.length > MAX_CONVERSATION_ID_LENGTH ||
    !CONVERSATION_ID_PATTERN.test(candidate)
  ) {
    return { ok: false };
  }

  return { ok: true, value: candidate };
}

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getConfig() {
  const explicitSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const explicitAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  return {
    supabaseUrl: (explicitSupabaseUrl || DEFAULT_SUPABASE_URL).replace(/\/$/, ''),
    anonKey: explicitAnonKey || DEFAULT_SUPABASE_ANON,
    hasExplicitSupabaseUrl: Boolean(explicitSupabaseUrl),
    hasExplicitAnonKey: Boolean(explicitAnonKey),
    allowedOrigins: process.env.CHAT_ALLOWED_ORIGINS || '',
    logEvents: process.env.CHAT_LOG_EVENTS === 'true',
    vercelEnv: process.env.VERCEL_ENV || '',
    rateLimit: positiveInteger(process.env.CHAT_RATE_LIMIT_MAX || process.env.CHAT_RATE_LIMIT, DEFAULT_CHAT_RATE_LIMIT),
    rateLimitWindowSeconds: positiveInteger(
      process.env.CHAT_RATE_LIMIT_WINDOW_SECONDS,
      DEFAULT_CHAT_RATE_LIMIT_WINDOW_SECONDS,
    ),
  };
}

function hasProductionUpstreamConfig(config) {
  if (!isProduction(config)) return true;
  return config.hasExplicitSupabaseUrl && config.hasExplicitAnonKey;
}

function logChatEvent(config, event, metadata = {}) {
  if (!config.logEvents) return;
  console.info(
    JSON.stringify({
      event,
      route: '/api/chat',
      ...metadata,
    }),
  );
}

function shouldEvaluateChatGrounding(message) {
  const normalized = message.toLowerCase();
  return (
    CHAT_GROUNDING_TRIGGER_PATTERNS.some((pattern) => pattern.test(normalized)) ||
    CHAT_SITE_CLAIM_GROUNDING_PATTERNS.some(({ pattern }) => pattern.test(normalized))
  );
}

function chatGroundingQuery(message) {
  const normalized = message.toLowerCase();
  const siteClaimMatch = CHAT_SITE_CLAIM_GROUNDING_PATTERNS.find(({ pattern }) =>
    pattern.test(normalized),
  );

  return siteClaimMatch?.query || message.slice(0, 160);
}

function addChatGroundingAliases(packet) {
  return {
    ...packet,
    blocked_reasons: packet.answer_policy.blocked_reasons,
    required_before_answer: REQUIRED_BEFORE_SYNTHESIS,
  };
}

async function buildChatGroundingGate(message) {
  if (!shouldEvaluateChatGrounding(message)) {
    return { blocked: false };
  }

  const parsed = parsePublicSearchParams(
    { q: chatGroundingQuery(message) },
    {
      invalidQueryError: 'Invalid chat grounding query',
      missingInputError: 'Chat grounding query required',
    },
  );

  if (!parsed.ok) {
    return { blocked: false };
  }

  const { payload, registries } = await buildPublicSearchPayload({
    query: parsed.query,
    filters: parsed.filters,
    tokens: parsed.tokens,
    limit: GROUNDING_SOURCE_LIMIT,
  });
  const packet = buildGroundingPacket({
    results: payload.results,
    registries,
    extraBoundaries: {
      upstream_answer_not_requested: true,
    },
  });

  if (packet.required_qualifications.length === 0) {
    return {
      blocked: true,
      grounding: addChatGroundingAliases(
        buildUngroundedRiskPacket({
          reviewFlags: ['risky_domain_prompt_missing_grounding'],
          blockedReasons: [
            'risk_domain_requires_grounding_review',
            'missing_grounding_citations',
            'policy_requires_chat_grounding_review',
          ],
          extraBoundaries: {
            upstream_answer_not_requested: true,
          },
        }),
      ),
    };
  }

  if (!packet.requires_human_review && packet.required_qualifications.length === 0) {
    return { blocked: false };
  }

  return {
    blocked: true,
    grounding: addChatGroundingAliases(packet),
  };
}

async function readSafeReply(response) {
  const data = await response.json();
  const reply = typeof data?.reply === 'string' ? data.reply : '';
  const conversationId =
    typeof data?.conversation_id === 'string' && data.conversation_id.length <= MAX_CONVERSATION_ID_LENGTH
      ? data.conversation_id
      : null;

  if (!reply) {
    throw new Error('Chat response was missing a reply.');
  }

  return {
    reply,
    conversation_id: conversationId,
  };
}

async function forwardToEdgeFunction({ config, message, conversationId }) {
  const response = await fetch(`${config.supabaseUrl}/functions/v1/chat`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return readSafeReply(response);
}

function sendJson(res, status, body) {
  res.status(status);
  res.json(body);
}

export default async function chatHandler(req, res) {
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

  const config = getConfig();
  if (!isAllowedOrigin(req, config)) {
    logChatEvent(config, 'chat_origin_denied');
    sendJson(res, 403, { success: false, error: 'Origin not allowed' });
    return;
  }

  const body = parseBody(req.body);
  const message = normalizeMessage(body.message);
  const conversationId = normalizeConversationId(body.conversation_id);

  if (!message || message.length > MAX_MESSAGE_LENGTH || hasControlCharacters(message)) {
    logChatEvent(config, 'chat_invalid_message');
    sendJson(res, 400, { success: false, error: 'Invalid message' });
    return;
  }

  if (!conversationId.ok) {
    logChatEvent(config, 'chat_invalid_conversation_id');
    sendJson(res, 400, { success: false, error: 'Invalid conversation' });
    return;
  }

  const rateLimit = await checkDurableRateLimit({
    req,
    route: '/api/chat',
    limit: config.rateLimit,
    windowSeconds: config.rateLimitWindowSeconds,
  });
  if (!rateLimit.allowed) {
    if (rateLimit.unavailable) {
      logChatEvent(config, 'chat_rate_limit_unavailable');
      sendRateLimitUnavailableResponse(res, rateLimit.retryAfter);
      return;
    }

    logChatEvent(config, 'chat_rate_limited', {
      hasConversationId: Boolean(conversationId.value),
      messageLength: message.length,
    });
    sendRateLimitResponse(res, rateLimit.retryAfter);
    return;
  }
  if (rateLimit.unavailable) {
    logChatEvent(config, 'chat_rate_limit_unavailable');
  }

  if (!hasProductionUpstreamConfig(config)) {
    logChatEvent(config, 'chat_upstream_unavailable', {
      hasConversationId: Boolean(conversationId.value),
      messageLength: message.length,
    });
    sendJson(res, 503, {
      success: false,
      error: 'Chat upstream unavailable',
    });
    return;
  }

  try {
    const groundingGate = await buildChatGroundingGate(message);
    if (groundingGate.blocked) {
      logChatEvent(config, 'chat_grounding_review_required', {
        hasConversationId: Boolean(conversationId.value),
        messageLength: message.length,
      });
      sendJson(res, 409, {
        success: false,
        error: 'Grounding review required before chat answer',
        grounding: groundingGate.grounding,
      });
      return;
    }

    const data = await forwardToEdgeFunction({
      config,
      message,
      conversationId: conversationId.value,
    });
    logChatEvent(config, 'chat_forwarded', {
      hasConversationId: Boolean(conversationId.value),
      messageLength: message.length,
    });
    sendJson(res, 200, { success: true, ...data });
  } catch {
    logChatEvent(config, 'chat_forward_or_grounding_failed', {
      hasConversationId: Boolean(conversationId.value),
      messageLength: message.length,
    });
    sendJson(res, 502, {
      success: false,
      error: 'Unable to reach the Brain chat service',
    });
  }
}
