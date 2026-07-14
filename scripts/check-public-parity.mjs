import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import groundingHandler from '../api/grounding.js';
import searchHandler from '../api/search.js';
import statusHandler from '../api/status.js';

const ROOT = new URL('../', import.meta.url);
const PUBLIC_RAG_SMOKE_QUERY = 'financial proof';
const PUBLIC_RAG_SMOKE_QUERY_ID = 'public_financial_proof';

async function readText(path) {
  return readFile(new URL(path, ROOT), 'utf8');
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

async function fetchText(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(`Unable to fetch ${url}: ${response.status}`);
    error.statusCode = response.status;
    error.code = safeHttpErrorCode(response.status);
    throw error;
  }

  return response.text();
}

function responseMock() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end() {
      this.body = '';
      return this;
    },
  };
}

async function readLocalStatus() {
  const res = responseMock();
  await statusHandler({ method: 'GET', query: {} }, res);

  if (res.statusCode !== 200 || res.body?.success !== true) {
    throw new Error('Unable to read local public backend status');
  }

  return res.body.status;
}

async function readLocalApiJson(handler, { query }) {
  const res = responseMock();
  await handler({ method: 'GET', query }, res);

  return {
    statusCode: res.statusCode,
    body: res.body,
  };
}

async function readLocalPublicRagSmoke() {
  const query = { q: PUBLIC_RAG_SMOKE_QUERY };
  const [search, grounding] = await Promise.all([
    readLocalApiJson(searchHandler, { query }),
    readLocalApiJson(groundingHandler, { query }),
  ]);

  return { search, grounding };
}

function latestPublicTransmission(transmissions) {
  return transmissions
    .filter((entry) => entry.review_status === 'public_safe')
    .sort((a, b) => b.transmission_number - a.transmission_number)[0];
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

function check(name, pass, details = {}) {
  return { name, pass, details };
}

function safeErrorCode(error) {
  const code = error?.cause?.code || error?.code;

  return typeof code === 'string' && /^[A-Z0-9_]+$/.test(code) ? code : undefined;
}

function safeHttpErrorCode(statusCode) {
  return Number.isInteger(statusCode) && statusCode >= 400 && statusCode <= 599
    ? `HTTP_${statusCode}`
    : undefined;
}

function endpointFailureClass(statusCode) {
  return statusCode === 429 || statusCode === 503
    ? 'endpoint_fail_closed_http_status'
    : 'endpoint_fetch_failed';
}

async function readLiveApiJson({ fetcher, url }) {
  try {
    const raw = await fetcher(url);

    return {
      statusCode: 200,
      body: JSON.parse(raw),
    };
  } catch (error) {
    const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : undefined;

    return {
      statusCode,
      body: undefined,
      failureClass: endpointFailureClass(statusCode),
      errorCode: safeErrorCode(error) || safeHttpErrorCode(statusCode),
    };
  }
}

function buildLiveFetchFailureReport({ baseUrl, error }) {
  const details = {
    reason: 'fetch_failed',
  };
  const errorCode = safeErrorCode(error);

  if (errorCode) {
    details.error_code = errorCode;
  }

  const failure = check('live_fetch_reachable', false, details);

  return {
    success: false,
    live_base_url: normalizeBaseUrl(baseUrl),
    checks: [failure],
    failures: [failure],
    boundaries: {
      local_public_files_only: false,
      live_deployment_verified: false,
      secrets_excluded: true,
      social_assets_not_public_discovery: true,
    },
  };
}

function hasPublicSocialLink(text) {
  return /href=["']\/social\/transmission-|https:\/\/www\.unwindcode\.ai\/social\/transmission-/i.test(
    text,
  );
}

function normalizeBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, '');
}

function liveUrl(baseUrl, path) {
  return `${normalizeBaseUrl(baseUrl)}${path}`;
}

async function readLocalSources() {
  const [status, ragSmoke, transmissions, sitemap, llms, aiServicesRaw, archive, homepage] = await Promise.all([
      readLocalStatus(),
      readLocalPublicRagSmoke(),
      readJson('public/data/transmissions.json'),
      readText('public/sitemap.xml'),
      readText('public/llms.txt'),
      readText('public/ai-services.json'),
      readText('transmissions/index.html'),
      readText('index.html'),
  ]);

  return {
    status,
    ragSmoke,
    transmissions,
    sitemap,
    llms,
    aiServicesRaw,
    archive,
    homepage,
  };
}

async function readLiveSources({ baseUrl, fetcher }) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const [statusRaw, transmissions, sitemap, llms, aiServicesRaw, archive, homepage] =
    await Promise.all([
      fetcher(liveUrl(normalizedBaseUrl, '/api/status')),
      readJson('public/data/transmissions.json'),
      fetcher(liveUrl(normalizedBaseUrl, '/sitemap.xml')),
      fetcher(liveUrl(normalizedBaseUrl, '/llms.txt')),
      fetcher(liveUrl(normalizedBaseUrl, '/ai-services.json')),
      fetcher(liveUrl(normalizedBaseUrl, '/transmissions')),
      fetcher(liveUrl(normalizedBaseUrl, '/')),
    ]);
  const parsedStatus = JSON.parse(statusRaw);
  const status = parsedStatus.success === true ? parsedStatus.status : null;
  const liveStatusContractReason =
    parsedStatus.success === true ? undefined : 'missing_status_registries_transmissions';
  let ragSmoke;

  if (status?.registries?.transmissions) {
    const searchPath = `/api/search?q=${encodeURIComponent(PUBLIC_RAG_SMOKE_QUERY)}`;
    const groundingPath = `/api/grounding?q=${encodeURIComponent(PUBLIC_RAG_SMOKE_QUERY)}`;
    const [search, grounding] = await Promise.all([
      readLiveApiJson({ fetcher, url: liveUrl(normalizedBaseUrl, searchPath) }),
      readLiveApiJson({ fetcher, url: liveUrl(normalizedBaseUrl, groundingPath) }),
    ]);

    ragSmoke = {
      search,
      grounding,
    };
  }

  return {
    status,
    liveStatusContractReason,
    ragSmoke,
    transmissions,
    sitemap,
    llms,
    aiServicesRaw,
    archive,
    homepage,
    liveBaseUrl: normalizedBaseUrl,
  };
}

function buildSearchRagCheck(search) {
  const body = search?.body;
  const results = Array.isArray(body?.results) ? body.results : [];
  const citedResultCount = results.filter((result) => Array.isArray(result.citations) && result.citations.length > 0).length;
  const pass =
    search?.statusCode === 200 &&
    body?.success === true &&
    body?.answer_generation === 'disabled' &&
    body?.synthesis_requires_grounding === true &&
    results.length > 0 &&
    citedResultCount > 0;

  return check('search_rag_contract_supported', pass, {
    endpoint: '/api/search',
    query_id: PUBLIC_RAG_SMOKE_QUERY_ID,
    status_code: search?.statusCode,
    failure_class: search?.failureClass,
    error_code: search?.errorCode,
    answer_generation: body?.answer_generation,
    synthesis_requires_grounding: body?.synthesis_requires_grounding,
    result_count: results.length,
    cited_result_count: citedResultCount,
  });
}

function buildGroundingRagCheck(grounding) {
  const body = grounding?.body;
  const packet = body?.packet;
  const citations = Array.isArray(packet?.citations) ? packet.citations : [];
  const sources = Array.isArray(packet?.sources) ? packet.sources : [];
  const pass =
    grounding?.statusCode === 200 &&
    body?.success === true &&
    packet?.answer_generation === 'disabled' &&
    packet?.answer_policy?.synthesis_allowed === false &&
    citations.length > 0 &&
    sources.length > 0;

  return check('grounding_rag_contract_supported', pass, {
    endpoint: '/api/grounding',
    query_id: PUBLIC_RAG_SMOKE_QUERY_ID,
    status_code: grounding?.statusCode,
    failure_class: grounding?.failureClass,
    error_code: grounding?.errorCode,
    answer_generation: packet?.answer_generation,
    synthesis_allowed: packet?.answer_policy?.synthesis_allowed,
    source_count: sources.length,
    citation_count: citations.length,
  });
}

function buildPublicRagChecks(ragSmoke) {
  return [
    buildSearchRagCheck(ragSmoke?.search),
    buildGroundingRagCheck(ragSmoke?.grounding),
  ];
}

function buildReport({ sources, mode }) {
  const { status, ragSmoke, transmissions, sitemap, llms, aiServicesRaw, archive, homepage } = sources;
  const latest = latestPublicTransmission(transmissions.transmissions);
  const numbering = transmissionNumbering(transmissions.transmissions);
  const statusTransmission = status?.registries?.transmissions;
  const liveStatusContractFailure =
    mode === 'live' && !statusTransmission
      ? check('live_status_contract_supported', false, {
          reason: sources.liveStatusContractReason || 'missing_status_registries_transmissions',
        })
      : null;

  if (liveStatusContractFailure) {
    return {
      success: false,
      live_base_url: sources.liveBaseUrl,
      latest_public_transmission: {
        id: latest.id,
        transmission_number: latest.transmission_number,
        route: latest.route,
        source_file: latest.source_file,
      },
      transmission_numbering: numbering,
      checks: [liveStatusContractFailure],
      failures: [liveStatusContractFailure],
      boundaries: {
        local_public_files_only: false,
        live_deployment_verified: true,
        secrets_excluded: true,
        social_assets_not_public_discovery: true,
      },
    };
  }
  const latestReport = {
    id: latest.id,
    transmission_number: latest.transmission_number,
    route: latest.route,
    source_file: latest.source_file,
  };
  const publicDiscoveryTexts = [sitemap, llms, archive, homepage];
  const checks = [
    check(
      'status_latest_matches_registry',
      JSON.stringify(statusTransmission.latest_public_transmission) ===
        JSON.stringify({
          id: latest.id,
          transmission_number: latest.transmission_number,
          title: latest.title,
          route: latest.route,
          source_file: latest.source_file,
          review_status: latest.review_status,
        }),
      { route: latest.route },
    ),
    check(
      'status_numbering_matches_registry',
      JSON.stringify(statusTransmission.numbering) === JSON.stringify(numbering),
      numbering,
    ),
    check('sitemap_has_latest_route', sitemap.includes(latest.route), { route: latest.route }),
    check('llms_has_latest_route', llms.includes(latest.route), { route: latest.route }),
    check('ai_services_has_latest_route', aiServicesRaw.includes(latest.route), {
      route: latest.route,
    }),
    check('archive_has_latest_route', archive.includes(latest.route), { route: latest.route }),
    check('homepage_has_latest_route', homepage.includes(latest.route), { route: latest.route }),
    ...buildPublicRagChecks(ragSmoke),
    check(
      'no_public_social_links',
      publicDiscoveryTexts.every((text) => !hasPublicSocialLink(text)),
      { checked_files: ['public/sitemap.xml', 'public/llms.txt', 'transmissions/index.html', 'index.html'] },
    ),
  ];
  const failures = checks.filter((entry) => !entry.pass);

  return {
    success: failures.length === 0,
    live_base_url: mode === 'live' ? sources.liveBaseUrl : undefined,
    latest_public_transmission: latestReport,
    transmission_numbering: numbering,
    checks,
    failures,
    boundaries: {
      local_public_files_only: mode !== 'live',
      ...(mode === 'live'
        ? { live_deployment_verified: true }
        : { live_deployment_not_verified: true }),
      public_rag_routes_verified: true,
      public_safe_smoke_queries_only: true,
      chat_smoke_not_exercised: true,
      secrets_excluded: true,
      social_assets_not_public_discovery: true,
    },
  };
}

export async function checkPublicParity(options = {}) {
  const mode = options.mode || 'local';
  const baseUrl = options.baseUrl || 'https://www.unwindcode.ai';
  const sources =
    mode === 'live'
      ? await readLiveSources({
          baseUrl,
          fetcher: options.fetchText || fetchText,
        }).catch((error) => ({ liveFetchError: error }))
      : await readLocalSources();

  if (sources.liveFetchError) {
    return buildLiveFetchFailureReport({ baseUrl, error: sources.liveFetchError });
  }

  return buildReport({ sources, mode });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const live = process.argv.includes('--live');
  const baseUrlArg = process.argv.find((arg) => arg.startsWith('--base-url='));
  const report = await checkPublicParity({
    mode: live ? 'live' : 'local',
    baseUrl: baseUrlArg ? baseUrlArg.split('=').slice(1).join('=') : undefined,
  });
  console.log(JSON.stringify(report, null, 2));
  if (!report.success) {
    process.exitCode = 1;
  }
}
