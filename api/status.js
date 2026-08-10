import { readFile } from 'node:fs/promises';
import { stat } from 'node:fs/promises';
import { validateAssetRegistry } from './assets.js';

const STATUS_URLS = {
  services: new URL('../public/ai-services.json', import.meta.url),
  architecture: new URL('../public/data/architecture.json', import.meta.url),
  assets: new URL('../public/data/assets.json', import.meta.url),
  claims: new URL('../public/data/claims.json', import.meta.url),
  organisms: new URL('../public/data/organisms.json', import.meta.url),
  transmissions: new URL('../public/data/transmissions.json', import.meta.url),
};
const ALLOWED_METHODS = 'GET, HEAD, OPTIONS';
const SUCCESS_CACHE_CONTROL = 'public, max-age=120, stale-while-revalidate=600';
const ERROR_CACHE_CONTROL = 'no-store';

async function readJson(url) {
  return JSON.parse(await readFile(url, 'utf8'));
}

async function statusSignature(urls) {
  const parts = await Promise.all(
    Object.entries(urls).map(async ([key, url]) => {
      const stats = await stat(url);
      return `${key}:${stats.size}:${stats.mtimeMs}`;
    }),
  );

  return parts.join('|');
}

function serviceStatus(services) {
  const ids = services.services.map((service) => service.id).sort();

  return {
    count: ids.length,
    ids,
    endpoints: services.services.map((service) => service.endpoint).sort(),
    review_status: services.review_status,
  };
}

function operationalControls(services) {
  const controls = services.services
    .map((service) => ({
      endpoint: service.endpoint,
      controls: service.operational_controls || {},
    }))
    .filter((service) => service.endpoint);

  const endpointsWhere = (key) =>
    controls
      .filter((service) => service.controls[key] === true)
      .map((service) => service.endpoint)
      .sort();

  return {
    durable_rate_limited_endpoints: endpointsWhere('durable_rate_limit'),
    production_fail_closed_endpoints: endpointsWhere('production_fail_closed'),
    answer_generation_disabled_endpoints: endpointsWhere('answer_generation_disabled'),
    grounding_review_required_endpoints: endpointsWhere('grounding_review_required'),
    same_origin_guarded_endpoints: endpointsWhere('same_origin_guarded'),
    limiter_payload_boundary: {
      salted_route_client_hashes_only: true,
      raw_queries_excluded: true,
      raw_client_addresses_excluded: true,
      secrets_excluded: true,
      runtime_evidence_excluded: true,
    },
  };
}

function registryStatus(registry, collectionName) {
  const collection = registry[collectionName];

  return {
    count: collection.length,
    review_status: registry.review_status,
    public_safe_count: collection.filter((entry) => entry.review_status === 'public_safe').length,
  };
}

function latestPublicTransmission(transmissions) {
  const latest = transmissions
    .filter((entry) => entry.review_status === 'public_safe')
    .sort((a, b) => b.transmission_number - a.transmission_number)[0];

  if (!latest) {
    return null;
  }

  return {
    id: latest.id,
    transmission_number: latest.transmission_number,
    title: latest.title,
    route: latest.route,
    source_file: latest.source_file,
    review_status: latest.review_status,
  };
}

function transmissionNumbering(transmissions) {
  const numbers = transmissions
    .map((entry) => entry.transmission_number)
    .filter((number) => Number.isInteger(number))
    .sort((a, b) => a - b);
  const latestNumber = numbers.at(-1) || 0;
  const numberSet = new Set(numbers);
  const missingNumbers = [];

  for (let number = 1; number <= latestNumber; number += 1) {
    if (!numberSet.has(number)) {
      missingNumbers.push(number);
    }
  }

  return {
    latest_number: latestNumber,
    published_count: numbers.length,
    has_gaps: missingNumbers.length > 0,
    missing_numbers: missingNumbers,
  };
}

function transmissionStatus(registry) {
  const baseStatus = registryStatus(registry, 'transmissions');

  return {
    ...baseStatus,
    latest_public_transmission: latestPublicTransmission(registry.transmissions),
    numbering: transmissionNumbering(registry.transmissions),
  };
}

function assetStatus(registry) {
  const packages = registry.packages;

  return {
    count: packages.length,
    review_status: registry.review_status,
    creator_approval_required_count: packages.filter(
      (entry) => entry.review_status === 'creator_approval_required',
    ).length,
    prepared_not_posted_count: packages.filter(
      (entry) => entry.publication_status === 'prepared_not_posted',
    ).length,
  };
}

/**
 * Booleans only — whether the rail is configured, never any key material or
 * value. Lets an operator (or Genesis) confirm go-live without holding a secret.
 * money_out_enabled is hard-coded false: money-OUT is closed in code, not config.
 */
function paymentRailStatus(env = process.env) {
  return {
    internal_auth_configured: Boolean(String(env.BANKER_PAY_SECRET || '').trim()),
    coinbase_keys_configured: Boolean(
      (String(env.CDP_API_KEY_ID || '').trim() || String(env.CDP_API_KEY_NAME || '').trim()) &&
        String(env.CDP_API_KEY_SECRET || '').trim(),
    ),
    webhook_secret_configured: Boolean(String(env.BANKER_WEBHOOK_SECRET || '').trim()),
    sandbox_mode: String(env.CDP_CHECKOUT_SANDBOX || '').trim().toLowerCase() === 'true',
    money_out_enabled: false,
  };
}

function claimStatus(registry) {
  const claims = registry.claims;

  return {
    count: claims.length,
    review_status: registry.review_status,
    needs_context_count: claims.filter((entry) => entry.claim_status === 'needs_context').length,
    safety_qualified_count: claims.filter((entry) => entry.claim_status === 'safety_qualified').length,
    future_vision_count: claims.filter((entry) => entry.claim_status === 'future_vision').length,
  };
}

async function buildStatus(urls = STATUS_URLS) {
  const [services, architecture, assets, claims, organisms, transmissions] = await Promise.all([
    readJson(urls.services),
    readJson(urls.architecture),
    readJson(urls.assets),
    readJson(urls.claims),
    readJson(urls.organisms),
    readJson(urls.transmissions),
  ]);

  validateAssetRegistry(assets);

  return {
    schema_version: '2026-06-06.public-backend-status.v1',
    review_status: 'public_safe',
    generated_from: [
      'public/ai-services.json',
      'public/data/architecture.json',
      'public/data/assets.json',
      'public/data/claims.json',
      'public/data/organisms.json',
      'public/data/transmissions.json',
    ],
    services: serviceStatus(services),
    operational_controls: operationalControls(services),
    registries: {
      architecture: registryStatus(architecture, 'concepts'),
      assets: assetStatus(assets),
      claims: claimStatus(claims),
      organisms: registryStatus(organisms, 'organisms'),
      transmissions: transmissionStatus(transmissions),
    },
    boundaries: {
      public_only: true,
      secrets_excluded: true,
      runtime_evidence_excluded: true,
      private_prompts_excluded: true,
      write_methods_rejected: true,
    },
  };
}

function createStatusReader({ urls = STATUS_URLS } = {}) {
  let cachedStatus = null;

  return async function readStatus() {
    const signature = await statusSignature(urls);

    if (!cachedStatus || cachedStatus.signature !== signature) {
      cachedStatus = {
        signature,
        value: await buildStatus(urls),
      };
    }

    // Registry data is cached by file signature; the rail flags are env-derived,
    // so recompute them per read rather than serving a stale "not configured".
    return { ...cachedStatus.value, payment_rail: paymentRailStatus() };
  };
}

function sendJson(res, status, body) {
  res.status(status);
  res.json(body);
}

export function createStatusHandler(deps = {}) {
  const readStatus = deps.readStatus || createStatusReader({ urls: deps.urls || STATUS_URLS });

  return async function statusHandler(req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method === 'OPTIONS') {
      res.setHeader('Allow', ALLOWED_METHODS);
      res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);
      res.status(204);
      res.end();
      return;
    }

    if (req.method === 'HEAD') {
      try {
        await readStatus();
        res.setHeader('Cache-Control', SUCCESS_CACHE_CONTROL);
        res.status(200);
        res.end();
      } catch {
        res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);
        res.status(500);
        res.end();
      }
      return;
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', ALLOWED_METHODS);
      res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);
      sendJson(res, 405, { success: false, error: 'Method not allowed' });
      return;
    }

    try {
      res.setHeader('Cache-Control', SUCCESS_CACHE_CONTROL);
      sendJson(res, 200, {
        success: true,
        status: await readStatus(),
      });
    } catch {
      res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);
      sendJson(res, 500, {
        success: false,
        error: 'Unable to load backend status',
      });
    }
  };
}

export default createStatusHandler();
