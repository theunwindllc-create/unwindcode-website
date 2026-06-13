import { readFile } from 'node:fs/promises';
import {
  checkDurableRateLimit,
  sendRateLimitResponse,
  sendRateLimitUnavailableResponse,
} from './_shared/rate-limit.js';

const REGISTRY_URL = new URL('../public/data/organisms.json', import.meta.url);
const ALLOWED_METHODS = 'GET, HEAD, OPTIONS';
const ORGANISM_ID_PATTERN = /^[a-z0-9-]{1,80}$/;
const SUCCESS_CACHE_CONTROL = 'public, max-age=300, stale-while-revalidate=3600';
const ERROR_CACHE_CONTROL = 'no-store';
const DEFAULT_ORGANISMS_RATE_LIMIT = 60;
const DEFAULT_ORGANISMS_RATE_LIMIT_WINDOW_SECONDS = 60;

async function loadRegistry() {
  return JSON.parse(await readFile(REGISTRY_URL, 'utf8'));
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
      process.env.ORGANISMS_RATE_LIMIT_MAX || process.env.ORGANISMS_RATE_LIMIT,
      DEFAULT_ORGANISMS_RATE_LIMIT,
    ),
    windowSeconds: positiveInteger(
      process.env.ORGANISMS_RATE_LIMIT_WINDOW_SECONDS,
      DEFAULT_ORGANISMS_RATE_LIMIT_WINDOW_SECONDS,
    ),
  };
}

export function createOrganismsHandler(deps = {}) {
  const registryLoader = deps.loadRegistry || loadRegistry;

  return async function organismsHandler(req, res) {
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

    if (id && !ORGANISM_ID_PATTERN.test(id)) {
      sendError(res, 400, 'Invalid organism id');
      return;
    }

    const rateLimitConfig = getRateLimitConfig();
    const rateLimit = await checkDurableRateLimit({
      req,
      route: '/api/organisms',
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
        const organism = registry.organisms.find((candidate) => candidate.id === id);
        if (!organism) {
          sendError(res, 404, 'Organism not found');
          return;
        }

        sendSuccess(res, 200, { success: true, organism });
        return;
      }

      sendSuccess(res, 200, { success: true, registry });
    } catch {
      sendError(res, 500, 'Unable to load organism registry');
    }
  };
}

export default createOrganismsHandler();
