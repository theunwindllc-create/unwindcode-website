import {
  checkDurableRateLimit,
  sendRateLimitResponse,
  sendRateLimitUnavailableResponse,
} from './_shared/rate-limit.js';
import {
  buildPublicSearchPayload as defaultBuildPublicSearchPayload,
  parsePublicSearchParams,
} from './_shared/public-search.js';
import {
  buildGroundingPacket,
  GROUNDING_SOURCE_LIMIT,
} from './_shared/grounding-policy.js';

const ALLOWED_METHODS = 'GET, HEAD, OPTIONS';
const QUERY_RESPONSE_CACHE_CONTROL = 'private, no-store';
const ERROR_CACHE_CONTROL = 'no-store';
const DEFAULT_GROUNDING_RATE_LIMIT = 30;
const DEFAULT_GROUNDING_RATE_LIMIT_WINDOW_SECONDS = 60;

function sendJson(res, status, body) {
  res.status(status);
  res.json(body);
}

function sendError(res, status, error) {
  res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);
  sendJson(res, status, { success: false, error });
}

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getRateLimitConfig() {
  return {
    limit: positiveInteger(
      process.env.GROUNDING_RATE_LIMIT_MAX || process.env.GROUNDING_RATE_LIMIT,
      DEFAULT_GROUNDING_RATE_LIMIT,
    ),
    windowSeconds: positiveInteger(
      process.env.GROUNDING_RATE_LIMIT_WINDOW_SECONDS,
      DEFAULT_GROUNDING_RATE_LIMIT_WINDOW_SECONDS,
    ),
  };
}

export function createGroundingHandler(deps = {}) {
  const buildPublicSearchPayload =
    deps.buildPublicSearchPayload || defaultBuildPublicSearchPayload;

  return async function groundingHandler(req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method === 'OPTIONS') {
      res.setHeader('Allow', ALLOWED_METHODS);
      res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);
      res.status(204);
      res.end();
      return;
    }

    if (req.method === 'HEAD') {
      res.setHeader('Cache-Control', QUERY_RESPONSE_CACHE_CONTROL);
      res.status(200);
      res.end();
      return;
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', ALLOWED_METHODS);
      sendError(res, 405, 'Method not allowed');
      return;
    }

    const parsed = parsePublicSearchParams(req.query, {
      invalidQueryError: 'Invalid grounding query',
      missingInputError: 'Grounding query or filter required',
    });

    if (!parsed.ok) {
      sendError(res, parsed.status, parsed.error);
      return;
    }

    const rateLimitConfig = getRateLimitConfig();
    const rateLimit = await checkDurableRateLimit({
      req,
      route: '/api/grounding',
      limit: rateLimitConfig.limit,
      windowSeconds: rateLimitConfig.windowSeconds,
    });
    if (!rateLimit.allowed) {
      res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);

      if (rateLimit.unavailable) {
        sendRateLimitUnavailableResponse(res, rateLimit.retryAfter);
        return;
      }

      sendRateLimitResponse(res, rateLimit.retryAfter);
      return;
    }

    try {
      const { payload, registries } = await buildPublicSearchPayload({
        query: parsed.query,
        filters: parsed.filters,
        tokens: parsed.tokens,
        limit: GROUNDING_SOURCE_LIMIT,
      });

      res.setHeader('Cache-Control', QUERY_RESPONSE_CACHE_CONTROL);
      sendJson(res, 200, {
        success: true,
        query: payload.query,
        filters: payload.filters,
        ranking: payload.ranking,
        packet: buildGroundingPacket({
          results: payload.results,
          registries,
        }),
      });
    } catch {
      sendError(res, 500, 'Unable to build public grounding packet');
    }
  };
}

export default createGroundingHandler();
