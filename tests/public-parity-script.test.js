import assert from 'node:assert/strict';
import test from 'node:test';

import { checkPublicParity } from '../scripts/check-public-parity.mjs';

test('public parity checker compares latest transmission across discovery surfaces', async () => {
  const report = await checkPublicParity();

  assert.equal(report.success, true);
  assert.deepEqual(report.latest_public_transmission, {
    id: '33-the-organization-found-its-hands',
    transmission_number: 33,
    route: '/transmissions/33-the-organization-found-its-hands',
    source_file: 'transmissions/33-the-organization-found-its-hands.html',
  });
  assert.deepEqual(report.transmission_numbering, {
    latest_number: 33,
    published_count: 34,
    has_gaps: false,
    missing_numbers: [],
  });

  const checkNames = report.checks.map((check) => check.name).sort();

  assert.deepEqual(checkNames, [
    'ai_services_has_latest_route',
    'archive_has_latest_route',
    'grounding_rag_contract_supported',
    'homepage_has_latest_route',
    'llms_has_latest_route',
    'no_public_social_links',
    'search_rag_contract_supported',
    'sitemap_has_latest_route',
    'status_latest_matches_registry',
    'status_numbering_matches_registry',
  ]);
  assert.equal(report.checks.every((check) => check.pass === true), true);
  assert.deepEqual(report.failures, []);
  assert.deepEqual(report.boundaries, {
    local_public_files_only: true,
    live_deployment_not_verified: true,
    public_rag_routes_verified: true,
    public_safe_smoke_queries_only: true,
    chat_smoke_not_exercised: true,
    secrets_excluded: true,
    social_assets_not_public_discovery: true,
  });
});

test('public parity checker can verify live discovery surfaces without using local files as proof', async () => {
  const latestRoute = '/transmissions/33-the-organization-found-its-hands';
  const latestStatus = {
    id: '33-the-organization-found-its-hands',
    transmission_number: 33,
    title: 'Transmission 33: The Organization Found Its Hands',
    route: latestRoute,
    source_file: 'transmissions/33-the-organization-found-its-hands.html',
    review_status: 'public_safe',
  };
  const responses = new Map([
    ['https://www.unwindcode.ai/', `<a href="${latestRoute}">latest</a>`],
    ['https://www.unwindcode.ai/transmissions', `<a href="${latestRoute}">latest</a>`],
    ['https://www.unwindcode.ai/sitemap.xml', `<loc>https://www.unwindcode.ai${latestRoute}</loc>`],
    ['https://www.unwindcode.ai/llms.txt', `Latest: https://www.unwindcode.ai${latestRoute}`],
    ['https://www.unwindcode.ai/ai-services.json', JSON.stringify({ latestRoute })],
    [
      'https://www.unwindcode.ai/api/search?q=financial%20proof',
      JSON.stringify({
        success: true,
        answer_generation: 'disabled',
        synthesis_requires_grounding: true,
        results: [
          {
            id: 'proof-gated-financial-motion',
            citations: [{ route: latestRoute }],
          },
        ],
      }),
    ],
    [
      'https://www.unwindcode.ai/api/grounding?q=financial%20proof',
      JSON.stringify({
        success: true,
        packet: {
          answer_generation: 'disabled',
          answer_policy: { synthesis_allowed: false },
          citations: [{ route: latestRoute }],
          sources: [{ id: 'proof-gated-financial-motion' }],
        },
      }),
    ],
    [
      'https://www.unwindcode.ai/api/status',
      JSON.stringify({
        success: true,
        status: {
          registries: {
            transmissions: {
              latest_public_transmission: latestStatus,
              numbering: {
                latest_number: 33,
                published_count: 34,
                has_gaps: false,
                missing_numbers: [],
              },
            },
          },
        },
      }),
    ],
  ]);
  const requestedUrls = [];

  const report = await checkPublicParity({
    mode: 'live',
    baseUrl: 'https://www.unwindcode.ai/',
    fetchText: async (url) => {
      requestedUrls.push(url);
      return responses.get(url);
    },
  });

  assert.equal(report.success, true);
  assert.deepEqual(report.live_base_url, 'https://www.unwindcode.ai');
  assert.ok(
    requestedUrls.includes('https://www.unwindcode.ai/api/search?q=financial%20proof'),
    'live parity should fetch the public search contract',
  );
  assert.ok(
    requestedUrls.includes('https://www.unwindcode.ai/api/grounding?q=financial%20proof'),
    'live parity should fetch the public grounding contract',
  );
  assert.equal(report.checks.every((check) => check.pass === true), true);
  assert.deepEqual(report.failures, []);
  assert.deepEqual(report.boundaries, {
    local_public_files_only: false,
    live_deployment_verified: true,
    public_rag_routes_verified: true,
    public_safe_smoke_queries_only: true,
    chat_smoke_not_exercised: true,
    secrets_excluded: true,
    social_assets_not_public_discovery: true,
  });
});

test('public parity checker fails when live public RAG contracts are unavailable', async () => {
  const latestRoute = '/transmissions/33-the-organization-found-its-hands';
  const latestStatus = {
    id: '33-the-organization-found-its-hands',
    transmission_number: 33,
    title: 'Transmission 33: The Organization Found Its Hands',
    route: latestRoute,
    source_file: 'transmissions/33-the-organization-found-its-hands.html',
    review_status: 'public_safe',
  };
  const responses = new Map([
    ['https://www.unwindcode.ai/', `<a href="${latestRoute}">latest</a>`],
    ['https://www.unwindcode.ai/transmissions', `<a href="${latestRoute}">latest</a>`],
    ['https://www.unwindcode.ai/sitemap.xml', `<loc>https://www.unwindcode.ai${latestRoute}</loc>`],
    ['https://www.unwindcode.ai/llms.txt', `Latest: https://www.unwindcode.ai${latestRoute}`],
    ['https://www.unwindcode.ai/ai-services.json', JSON.stringify({ latestRoute })],
    [
      'https://www.unwindcode.ai/api/search?q=financial%20proof',
      JSON.stringify({
        success: false,
        error: 'Request limit unavailable',
      }),
    ],
    [
      'https://www.unwindcode.ai/api/grounding?q=financial%20proof',
      JSON.stringify({
        success: true,
        packet: {
          answer_generation: 'enabled',
          answer_policy: { synthesis_allowed: true },
          citations: [],
          sources: [],
        },
      }),
    ],
    [
      'https://www.unwindcode.ai/api/status',
      JSON.stringify({
        success: true,
        status: {
          registries: {
            transmissions: {
              latest_public_transmission: latestStatus,
              numbering: {
                latest_number: 33,
                published_count: 34,
                has_gaps: false,
                missing_numbers: [],
              },
            },
          },
        },
      }),
    ],
  ]);

  const report = await checkPublicParity({
    mode: 'live',
    baseUrl: 'https://www.unwindcode.ai/',
    fetchText: async (url) => responses.get(url),
  });

  assert.equal(report.success, false);
  assert.deepEqual(
    report.failures.map((failure) => failure.name).sort(),
    ['grounding_rag_contract_supported', 'search_rag_contract_supported'],
  );
  assert.deepEqual(report.boundaries, {
    local_public_files_only: false,
    live_deployment_verified: true,
    public_rag_routes_verified: true,
    public_safe_smoke_queries_only: true,
    chat_smoke_not_exercised: true,
    secrets_excluded: true,
    social_assets_not_public_discovery: true,
  });
});

test('public parity checker classifies live RAG fail-closed HTTP states by endpoint', async () => {
  const latestRoute = '/transmissions/33-the-organization-found-its-hands';
  const latestStatus = {
    id: '33-the-organization-found-its-hands',
    transmission_number: 33,
    title: 'Transmission 33: The Organization Found Its Hands',
    route: latestRoute,
    source_file: 'transmissions/33-the-organization-found-its-hands.html',
    review_status: 'public_safe',
  };
  const responses = new Map([
    ['https://www.unwindcode.ai/', `<a href="${latestRoute}">latest</a>`],
    ['https://www.unwindcode.ai/transmissions', `<a href="${latestRoute}">latest</a>`],
    ['https://www.unwindcode.ai/sitemap.xml', `<loc>https://www.unwindcode.ai${latestRoute}</loc>`],
    ['https://www.unwindcode.ai/llms.txt', `Latest: https://www.unwindcode.ai${latestRoute}`],
    ['https://www.unwindcode.ai/ai-services.json', JSON.stringify({ latestRoute })],
    [
      'https://www.unwindcode.ai/api/status',
      JSON.stringify({
        success: true,
        status: {
          registries: {
            transmissions: {
              latest_public_transmission: latestStatus,
              numbering: {
                latest_number: 33,
                published_count: 34,
                has_gaps: false,
                missing_numbers: [],
              },
            },
          },
        },
      }),
    ],
  ]);

  const report = await checkPublicParity({
    mode: 'live',
    baseUrl: 'https://www.unwindcode.ai/',
    fetchText: async (url) => {
      if (url.endsWith('/api/search?q=financial%20proof')) {
        const error = new Error('Unable to fetch search: 429');
        error.statusCode = 429;
        throw error;
      }

      if (url.endsWith('/api/grounding?q=financial%20proof')) {
        const error = new Error('Unable to fetch grounding: 503');
        error.statusCode = 503;
        throw error;
      }

      return responses.get(url);
    },
  });

  assert.equal(report.success, false);
  assert.deepEqual(
    report.failures.map((failure) => failure.name).sort(),
    ['grounding_rag_contract_supported', 'search_rag_contract_supported'],
  );
  assert.equal(
    report.failures.some((failure) => failure.name === 'live_fetch_reachable'),
    false,
  );
  assert.deepEqual(
    report.failures.map((failure) => failure.details).sort((a, b) => a.endpoint.localeCompare(b.endpoint)),
    [
      {
        endpoint: '/api/grounding',
        query_id: 'public_financial_proof',
        status_code: 503,
        failure_class: 'endpoint_fail_closed_http_status',
        error_code: 'HTTP_503',
        answer_generation: undefined,
        synthesis_allowed: undefined,
        source_count: 0,
        citation_count: 0,
      },
      {
        endpoint: '/api/search',
        query_id: 'public_financial_proof',
        status_code: 429,
        failure_class: 'endpoint_fail_closed_http_status',
        error_code: 'HTTP_429',
        answer_generation: undefined,
        synthesis_requires_grounding: undefined,
        result_count: 0,
        cited_result_count: 0,
      },
    ],
  );
  assert.deepEqual(report.boundaries, {
    local_public_files_only: false,
    live_deployment_verified: true,
    public_rag_routes_verified: true,
    public_safe_smoke_queries_only: true,
    chat_smoke_not_exercised: true,
    secrets_excluded: true,
    social_assets_not_public_discovery: true,
  });
});

test('public parity checker reports incompatible live status contracts without throwing', async () => {
  const latestRoute = '/transmissions/33-the-organization-found-its-hands';
  const responses = new Map([
    ['https://www.unwindcode.ai/', `<a href="${latestRoute}">latest</a>`],
    ['https://www.unwindcode.ai/transmissions', `<a href="${latestRoute}">latest</a>`],
    ['https://www.unwindcode.ai/sitemap.xml', `<loc>https://www.unwindcode.ai${latestRoute}</loc>`],
    ['https://www.unwindcode.ai/llms.txt', `Latest: https://www.unwindcode.ai${latestRoute}`],
    ['https://www.unwindcode.ai/ai-services.json', JSON.stringify({ latestRoute })],
    [
      'https://www.unwindcode.ai/api/status',
      JSON.stringify({
        ok: true,
        services: ['legacy-status-shape'],
      }),
    ],
  ]);

  const report = await checkPublicParity({
    mode: 'live',
    baseUrl: 'https://www.unwindcode.ai/',
    fetchText: async (url) => responses.get(url),
  });

  assert.equal(report.success, false);
  assert.deepEqual(report.live_base_url, 'https://www.unwindcode.ai');
  assert.deepEqual(report.failures, [
    {
      name: 'live_status_contract_supported',
      pass: false,
      details: {
        reason: 'missing_status_registries_transmissions',
      },
    },
  ]);
  assert.deepEqual(report.boundaries, {
    local_public_files_only: false,
    live_deployment_verified: true,
    secrets_excluded: true,
    social_assets_not_public_discovery: true,
  });
});

test('public parity checker reports live fetch failures without throwing', async () => {
  const timeout = new Error('fetch failed');
  timeout.cause = {
    code: 'UND_ERR_CONNECT_TIMEOUT',
  };

  const report = await checkPublicParity({
    mode: 'live',
    baseUrl: 'https://www.unwindcode.ai/',
    fetchText: async () => {
      throw timeout;
    },
  });

  assert.equal(report.success, false);
  assert.deepEqual(report.live_base_url, 'https://www.unwindcode.ai');
  assert.deepEqual(report.checks, [
    {
      name: 'live_fetch_reachable',
      pass: false,
      details: {
        reason: 'fetch_failed',
        error_code: 'UND_ERR_CONNECT_TIMEOUT',
      },
    },
  ]);
  assert.deepEqual(report.failures, report.checks);
  assert.equal('stack' in report.failures[0].details, false);
  assert.deepEqual(report.boundaries, {
    local_public_files_only: false,
    live_deployment_verified: false,
    secrets_excluded: true,
    social_assets_not_public_discovery: true,
  });
});
