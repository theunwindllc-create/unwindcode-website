import { readFile } from 'node:fs/promises';
import {
  checkDurableRateLimit,
  sendRateLimitResponse,
  sendRateLimitUnavailableResponse,
} from './_shared/rate-limit.js';

const REGISTRY_URL = new URL('../public/data/architecture.json', import.meta.url);
const ALLOWED_METHODS = 'GET, HEAD, OPTIONS';
const ARCHITECTURE_ID_PATTERN = /^[a-z0-9-]{1,120}$/;
const CATEGORY_PATTERN = /^[a-z0-9-]{1,80}$/;
const SUCCESS_CACHE_CONTROL = 'public, max-age=300, stale-while-revalidate=3600';
const ERROR_CACHE_CONTROL = 'no-store';
const DEFAULT_ARCHITECTURE_RATE_LIMIT = 60;
const DEFAULT_ARCHITECTURE_RATE_LIMIT_WINDOW_SECONDS = 60;

let cachedRegistry;

async function loadRegistry() {
  if (!cachedRegistry) {
    cachedRegistry = JSON.parse(await readFile(REGISTRY_URL, 'utf8'));
  }

  return cachedRegistry;
}

function getQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function sendJson(res, status, body) {
  res.status(status);
  res.json(body);
}

function sendSuccess(res, status, body) {
  res.setHeader('Cache-Control', SUCCESS_CACHE_CONTROL);
  sendJson(res, status, body);
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
      process.env.ARCHITECTURE_RATE_LIMIT_MAX || process.env.ARCHITECTURE_RATE_LIMIT,
      DEFAULT_ARCHITECTURE_RATE_LIMIT,
    ),
    windowSeconds: positiveInteger(
      process.env.ARCHITECTURE_RATE_LIMIT_WINDOW_SECONDS,
      DEFAULT_ARCHITECTURE_RATE_LIMIT_WINDOW_SECONDS,
    ),
  };
}

export function createArchitectureHandler(deps = {}) {
  const registryLoader = deps.loadRegistry || loadRegistry;

  return async function architectureHandler(req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method === 'OPTIONS') {
      res.setHeader('Allow', ALLOWED_METHODS);
      res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);
      res.status(204);
      res.end();
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', ALLOWED_METHODS);
      sendError(res, 405, 'Method not allowed');
      return;
    }

    const id = String(getQueryValue(req.query?.id) || '').trim();
    const category = String(getQueryValue(req.query?.category) || '').trim();

    if (id && !ARCHITECTURE_ID_PATTERN.test(id)) {
      sendError(res, 400, 'Invalid architecture id');
      return;
    }

    if (category && !CATEGORY_PATTERN.test(category)) {
      sendError(res, 400, 'Invalid category');
      return;
    }

    const rateLimitConfig = getRateLimitConfig();
    const rateLimit = await checkDurableRateLimit({
      req,
      route: '/api/architecture',
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

    if (req.method === 'HEAD') {
      res.setHeader('Cache-Control', SUCCESS_CACHE_CONTROL);
      res.status(200);
      res.end();
      return;
    }

    try {
      const registry = await registryLoader();

      if (id) {
        const concept = registry.concepts.find((entry) => entry.id === id);
        if (!concept) {
          sendError(res, 404, 'Architecture concept not found');
          return;
        }

        sendSuccess(res, 200, { success: true, concept });
        return;
      }

      if (category) {
        const concepts = registry.concepts.filter((entry) => entry.category === category);
        sendSuccess(res, 200, { success: true, category, concepts });
        return;
      }

      sendSuccess(res, 200, { success: true, registry });
    } catch {
      sendError(res, 500, 'Unable to load architecture registry');
    }
  };
}

export default createArchitectureHandler();
