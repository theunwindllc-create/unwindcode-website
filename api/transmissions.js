import { readFile } from 'node:fs/promises';
import { decorateTransmissionWithClaimContext } from './_shared/claim-context.js';
import {
  checkDurableRateLimit,
  sendRateLimitResponse,
  sendRateLimitUnavailableResponse,
} from './_shared/rate-limit.js';

const REGISTRY_URL = new URL('../public/data/transmissions.json', import.meta.url);
const CLAIMS_URL = new URL('../public/data/claims.json', import.meta.url);
const ALLOWED_METHODS = 'GET, HEAD, OPTIONS';
const TRANSMISSION_ID_PATTERN = /^[0-9]{2}-[a-z0-9-]{1,120}$/;
const TOPIC_PATTERN = /^[a-z0-9-]{1,80}$/;
const SUCCESS_CACHE_CONTROL = 'public, max-age=300, stale-while-revalidate=3600';
const ERROR_CACHE_CONTROL = 'no-store';
const DEFAULT_TRANSMISSIONS_RATE_LIMIT = 60;
const DEFAULT_TRANSMISSIONS_RATE_LIMIT_WINDOW_SECONDS = 60;

async function loadRegistry() {
  return JSON.parse(await readFile(REGISTRY_URL, 'utf8'));
}

async function loadClaimsRegistry() {
  return JSON.parse(await readFile(CLAIMS_URL, 'utf8'));
}

function getQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

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
      process.env.TRANSMISSIONS_RATE_LIMIT_MAX || process.env.TRANSMISSIONS_RATE_LIMIT,
      DEFAULT_TRANSMISSIONS_RATE_LIMIT,
    ),
    windowSeconds: positiveInteger(
      process.env.TRANSMISSIONS_RATE_LIMIT_WINDOW_SECONDS,
      DEFAULT_TRANSMISSIONS_RATE_LIMIT_WINDOW_SECONDS,
    ),
  };
}

export function createTransmissionsHandler(loaders = {}) {
  const registryLoader = loaders.loadRegistry || loadRegistry;
  const claimsRegistryLoader = loaders.loadClaimsRegistry || loadClaimsRegistry;

  return async function transmissionsHandler(req, res) {
    res.setHeader('Cache-Control', SUCCESS_CACHE_CONTROL);
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
    const topic = String(getQueryValue(req.query?.topic) || '').trim();

    if (id && !TRANSMISSION_ID_PATTERN.test(id)) {
      sendError(res, 400, 'Invalid transmission id');
      return;
    }

    if (topic && !TOPIC_PATTERN.test(topic)) {
      sendError(res, 400, 'Invalid topic');
      return;
    }

    const rateLimitConfig = getRateLimitConfig();
    const rateLimit = await checkDurableRateLimit({
      req,
      route: '/api/transmissions',
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
      res.status(200);
      res.end();
      return;
    }

    let registry;
    let transmissions;

    try {
      const [loadedRegistry, claimsRegistry] = await Promise.all([
        registryLoader(),
        claimsRegistryLoader(),
      ]);
      registry = loadedRegistry;
      transmissions = registry.transmissions.map((entry) =>
        decorateTransmissionWithClaimContext(entry, claimsRegistry),
      );
    } catch {
      sendError(res, 500, 'Unable to load transmission registry');
      return;
    }

    if (id) {
      const transmission = transmissions.find((entry) => entry.id === id);
      if (!transmission) {
        sendError(res, 404, 'Transmission not found');
        return;
      }
      sendJson(res, 200, { success: true, transmission });
      return;
    }

    if (topic) {
      sendJson(res, 200, {
        success: true,
        transmissions: transmissions.filter((entry) => entry.topic_tags.includes(topic)),
      });
      return;
    }

    sendJson(res, 200, { success: true, registry: { ...registry, transmissions } });
  };
}

export default createTransmissionsHandler();
