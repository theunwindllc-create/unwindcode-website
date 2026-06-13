import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import {
  checkDurableRateLimit,
  sendRateLimitResponse,
  sendRateLimitUnavailableResponse,
} from './_shared/rate-limit.js';

const REGISTRY_URL = new URL('../public/data/assets.json', import.meta.url);
const ALLOWED_METHODS = 'GET, HEAD, OPTIONS';
const ASSET_ID_PATTERN = /^[a-z0-9-]{1,120}$/;
const REVIEW_STATUS_PATTERN = /^[a-z0-9_-]{1,80}$/;
const PUBLICATION_STATUS_PATTERN = /^[a-z0-9_-]{1,80}$/;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const SUCCESS_CACHE_CONTROL = 'public, max-age=60, must-revalidate';
const ERROR_CACHE_CONTROL = 'no-store';
const DEFAULT_ASSETS_RATE_LIMIT = 60;
const DEFAULT_ASSETS_RATE_LIMIT_WINDOW_SECONDS = 60;

async function defaultLoadRegistry() {
  return JSON.parse(await readFile(REGISTRY_URL, 'utf8'));
}

async function defaultLoadRegistryMetadata() {
  const [source, stats] = await Promise.all([readFile(REGISTRY_URL), stat(REGISTRY_URL)]);

  return {
    etag: `"sha256-${createHash('sha256').update(source).digest('hex')}"`,
    lastModified: stats.mtime.toUTCString(),
  };
}

function getQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function sendJson(res, status, body) {
  res.status(status);
  res.json(body);
}

function sendError(res, status, body) {
  res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);
  sendJson(res, status, body);
}

function setSuccessCacheHeaders(res, metadata) {
  res.setHeader('Cache-Control', SUCCESS_CACHE_CONTROL);
  res.setHeader('ETag', metadata.etag);
  res.setHeader('Last-Modified', metadata.lastModified);
}

function requestValidatorsMatch(req, metadata) {
  const ifNoneMatch = getQueryValue(req.headers?.['if-none-match']);

  return String(ifNoneMatch || '')
    .split(',')
    .map((value) => value.trim())
    .includes(metadata.etag);
}

function validateAssetRegistry(registry) {
  for (const assetPackage of registry.packages || []) {
    if (!SHA256_PATTERN.test(assetPackage.asset_package_sha256 || '')) {
      throw new Error('Invalid asset package digest');
    }

    for (const approvalRecord of assetPackage.approval_records || []) {
      if (
        approvalRecord.asset_package_id !== assetPackage.id ||
        approvalRecord.asset_package_sha256 !== assetPackage.asset_package_sha256
      ) {
        throw new Error('Approval record does not match asset package digest');
      }
    }
  }
}

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getRateLimitConfig() {
  return {
    limit: positiveInteger(
      process.env.ASSETS_RATE_LIMIT_MAX || process.env.ASSETS_RATE_LIMIT,
      DEFAULT_ASSETS_RATE_LIMIT,
    ),
    windowSeconds: positiveInteger(
      process.env.ASSETS_RATE_LIMIT_WINDOW_SECONDS,
      DEFAULT_ASSETS_RATE_LIMIT_WINDOW_SECONDS,
    ),
  };
}

export function createAssetsHandler({
  loadRegistry = defaultLoadRegistry,
  loadRegistryMetadata = defaultLoadRegistryMetadata,
} = {}) {
  return async function assetsHandler(req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method === 'OPTIONS') {
      res.setHeader('Allow', ALLOWED_METHODS);
      res.setHeader('Cache-Control', 'no-store');
      res.status(204);
      res.end();
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', ALLOWED_METHODS);
      sendError(res, 405, { success: false, error: 'Method not allowed' });
      return;
    }

    const id = String(getQueryValue(req.query?.id) || '').trim();
    const reviewStatus = String(getQueryValue(req.query?.review_status) || '').trim();
    const publicationStatus = String(getQueryValue(req.query?.publication_status) || '').trim();

    if (id && !ASSET_ID_PATTERN.test(id)) {
      sendError(res, 400, { success: false, error: 'Invalid asset package id' });
      return;
    }

    if (reviewStatus && !REVIEW_STATUS_PATTERN.test(reviewStatus)) {
      sendError(res, 400, { success: false, error: 'Invalid review status' });
      return;
    }

    if (publicationStatus && !PUBLICATION_STATUS_PATTERN.test(publicationStatus)) {
      sendError(res, 400, { success: false, error: 'Invalid publication status' });
      return;
    }

    const rateLimitConfig = getRateLimitConfig();
    const rateLimit = await checkDurableRateLimit({
      req,
      route: '/api/assets',
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
      const [registry, metadata] = await Promise.all([loadRegistry(), loadRegistryMetadata()]);
      validateAssetRegistry(registry);

      setSuccessCacheHeaders(res, metadata);

      if (!id && !reviewStatus && !publicationStatus && requestValidatorsMatch(req, metadata)) {
        res.status(304);
        res.end();
        return;
      }

      if (req.method === 'HEAD') {
        res.status(200);
        res.end();
        return;
      }

      if (id) {
        const assetPackage = registry.packages.find((entry) => entry.id === id);
        if (!assetPackage) {
          sendError(res, 404, { success: false, error: 'Asset package not found' });
          return;
        }

        sendJson(res, 200, { success: true, asset_package: assetPackage });
        return;
      }

      if (reviewStatus) {
        sendJson(res, 200, {
          success: true,
          review_status: reviewStatus,
          packages: registry.packages.filter((entry) => entry.review_status === reviewStatus),
        });
        return;
      }

      if (publicationStatus) {
        sendJson(res, 200, {
          success: true,
          publication_status: publicationStatus,
          packages: registry.packages.filter((entry) => entry.publication_status === publicationStatus),
        });
        return;
      }

      sendJson(res, 200, { success: true, registry });
    } catch {
      sendError(res, 500, {
        success: false,
        error: 'Unable to load asset registry',
      });
    }
  };
}

export default createAssetsHandler();
