import {
  checkDurableRateLimit,
  sendRateLimitResponse,
  sendRateLimitUnavailableResponse,
} from './_shared/rate-limit.js';
import {
  MAX_PUBLIC_SEARCH_RESULTS,
  buildPublicSearchPayload as defaultBuildPublicSearchPayload,
  parsePublicSearchParams,
} from './_shared/public-search.js';

const ALLOWED_METHODS = 'GET, HEAD, OPTIONS';
const QUERY_RESPONSE_CACHE_CONTROL = 'private, no-store';
const ERROR_CACHE_CONTROL = 'no-store';
const DEFAULT_SEARCH_RATE_LIMIT = 60;
const DEFAULT_SEARCH_RATE_LIMIT_WINDOW_SECONDS = 60;

function sendJson(res, status, body) {
  res.status(status);
  res.json(body);
}

function sendError(res, status, error) {
  res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);
  sendJson(res, status, { success: false, error });
}

function sendHeadError(res, status) {
  res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);
  res.status(status);
  res.end();
}

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getRateLimitConfig() {
  return {
    limit: positiveInteger(
      process.env.SEARCH_RATE_LIMIT_MAX || process.env.SEARCH_RATE_LIMIT,
      DEFAULT_SEARCH_RATE_LIMIT,
    ),
    windowSeconds: positiveInteger(
      process.env.SEARCH_RATE_LIMIT_WINDOW_SECONDS,
      DEFAULT_SEARCH_RATE_LIMIT_WINDOW_SECONDS,
    ),
  };
}

async function enforceRateLimit(req, res) {
  const rateLimitConfig = getRateLimitConfig();
  const rateLimit = await checkDurableRateLimit({
    req,
    route: '/api/search',
    limit: rateLimitConfig.limit,
    windowSeconds: rateLimitConfig.windowSeconds,
  });

  if (rateLimit.allowed) {
    return true;
  }

  res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);

  if (rateLimit.unavailable) {
    if (req.method === 'HEAD') {
      res.setHeader('Retry-After', rateLimit.retryAfter);
      res.status(503);
      res.end();
      return false;
    }

    sendRateLimitUnavailableResponse(res, rateLimit.retryAfter);
    return false;
  }

  if (req.method === 'HEAD') {
    res.setHeader('Retry-After', rateLimit.retryAfter);
    res.status(429);
    res.end();
    return false;
  }

  sendRateLimitResponse(res, rateLimit.retryAfter);
  return false;
}

export function createSearchHandler(deps = {}) {
  const buildPublicSearchPayload =
    deps.buildPublicSearchPayload || defaultBuildPublicSearchPayload;

  return async function searchHandler(req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method === 'OPTIONS') {
      res.setHeader('Allow', ALLOWED_METHODS);
      res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);
      res.status(204);
      res.end();
      return;
    }

    const isHeadRequest = req.method === 'HEAD';

    if (req.method !== 'GET' && !isHeadRequest) {
      res.setHeader('Allow', ALLOWED_METHODS);
      sendError(res, 405, 'Method not allowed');
      return;
    }

    const parsed = parsePublicSearchParams(req.query);

    if (!parsed.ok) {
      if (isHeadRequest) {
        sendHeadError(res, parsed.status);
        return;
      }

      sendError(res, parsed.status, parsed.error);
      return;
    }

    if (!(await enforceRateLimit(req, res))) {
      return;
    }

    try {
      const { payload } = await buildPublicSearchPayload({
        query: parsed.query,
        filters: parsed.filters,
        tokens: parsed.tokens,
        limit: MAX_PUBLIC_SEARCH_RESULTS,
      });

      res.setHeader('Cache-Control', QUERY_RESPONSE_CACHE_CONTROL);
      if (isHeadRequest) {
        res.status(200);
        res.end();
        return;
      }

      sendJson(res, 200, {
        success: true,
        answer_generation: 'disabled',
        synthesis_requires_grounding: true,
        answer_policy: {
          synthesis_allowed: false,
          decision: 'grounding_required_before_synthesis',
          required_before_synthesis: [
            'request_grounding_packet',
            'render_citations',
            'review_claim_qualifications',
          ],
        },
        ...payload,
        boundaries: {
          public_registries_only: true,
          secrets_excluded: true,
          runtime_evidence_excluded: true,
          write_methods_rejected: true,
          retrieval_only: true,
          snippets_are_not_answers: true,
          answer_synthesis_excluded: true,
        },
      });
    } catch {
      if (isHeadRequest) {
        sendHeadError(res, 500);
        return;
      }

      sendError(res, 500, 'Unable to load public search registries');
    }
  };
}

export default createSearchHandler();
