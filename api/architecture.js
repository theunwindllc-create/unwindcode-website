import { readFile } from 'node:fs/promises';

const REGISTRY_URL = new URL('../public/data/architecture.json', import.meta.url);
const ALLOWED_METHODS = 'GET, HEAD, OPTIONS';
const ARCHITECTURE_ID_PATTERN = /^[a-z0-9-]{1,120}$/;
const CATEGORY_PATTERN = /^[a-z0-9-]{1,80}$/;
const SUCCESS_CACHE_CONTROL = 'public, max-age=300, stale-while-revalidate=3600';
const ERROR_CACHE_CONTROL = 'no-store';

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

  if (req.method === 'HEAD') {
    res.setHeader('Cache-Control', SUCCESS_CACHE_CONTROL);
    res.status(200);
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ALLOWED_METHODS);
    sendError(res, 405, 'Method not allowed');
    return;
  }

  try {
    const registry = await registryLoader();
    const id = String(getQueryValue(req.query?.id) || '').trim();
    const category = String(getQueryValue(req.query?.category) || '').trim();

    if (id) {
      if (!ARCHITECTURE_ID_PATTERN.test(id)) {
        sendError(res, 400, 'Invalid architecture id');
        return;
      }

      const concept = registry.concepts.find((entry) => entry.id === id);
      if (!concept) {
        sendError(res, 404, 'Architecture concept not found');
        return;
      }

      sendSuccess(res, 200, { success: true, concept });
      return;
    }

    if (category) {
      if (!CATEGORY_PATTERN.test(category)) {
        sendError(res, 400, 'Invalid category');
        return;
      }

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
