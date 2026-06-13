import assert from 'node:assert/strict';
import test from 'node:test';

import searchHandler from '../api/search.js';
import * as searchApi from '../api/search.js';
import transmissionsHandler from '../api/transmissions.js';

function createMockResponse() {
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

test('searches public registries with claim-aware context', async () => {
  const req = {
    method: 'GET',
    query: { q: 'financial proof' },
  };
  const res = createMockResponse();

  await searchHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.equal(res.headers['cache-control'], 'private, no-store');
  assert.equal(res.body.success, true);
  assert.equal(res.body.query, 'financial proof');
  assert.ok(res.body.results.length >= 1);

  const claimIds = res.body.results.filter((result) => result.type === 'claim').map((result) => result.id);
  assert.ok(
    claimIds.includes('proof-gated-financial-motion') ||
      claimIds.includes('financial-organisms-real-markets'),
    'financial proof search should return a qualifying public claim',
  );

  for (const result of res.body.results) {
    assert.equal(result.review_status, 'public_safe');
    assert.ok(result.source_files.length >= 1, `${result.id} should include source files`);
    assert.ok(result.citations.length >= 1, `${result.id} should include citations`);

    if (result.risk_level === 'high') {
      assert.ok(
        result.claim_status || result.claim_references?.length >= 1,
        `${result.id} should preserve claim status or claim references for high-risk retrieval`,
      );
    }
  }
});

test('returns ranked snippets for retrieval-ready search results', async () => {
  const req = {
    method: 'GET',
    query: { q: 'financial proof' },
  };
  const res = createMockResponse();

  await searchHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ranking.mode, 'lexical_public_registry');
  assert.equal(res.body.ranking.max_results, 20);
  assert.equal(res.body.answer_generation, 'disabled');
  assert.equal(res.body.synthesis_requires_grounding, true);
  assert.equal(res.body.answer_policy.synthesis_allowed, false);
  assert.equal(res.body.answer_policy.decision, 'grounding_required_before_synthesis');
  assert.ok(res.body.answer_policy.required_before_synthesis.includes('request_grounding_packet'));
  assert.ok(res.body.answer_policy.required_before_synthesis.includes('render_citations'));
  assert.ok(res.body.answer_policy.required_before_synthesis.includes('review_claim_qualifications'));
  assert.equal(res.body.boundaries.retrieval_only, true);
  assert.equal(res.body.boundaries.snippets_are_not_answers, true);
  assert.equal(res.body.boundaries.answer_synthesis_excluded, true);

  const first = res.body.results[0];
  assert.equal(first.rank, 1);
  assert.ok(Number.isInteger(first.match_score), 'result should include an integer match score');
  assert.ok(first.match_score > 0, 'result should have a positive match score');
  assert.deepEqual(first.matched_terms, ['financial', 'proof']);
  assert.equal(typeof first.snippet, 'string');
  assert.ok(first.snippet.length > 0, 'result should include a public-safe snippet');
  assert.ok(first.snippet.length <= 220, 'snippet should stay compact for RAG display');
  assert.ok(first.snippet.toLowerCase().includes('financial') || first.snippet.toLowerCase().includes('proof'));
  assert.equal(first.answer_generation, 'disabled');
  assert.equal(first.snippet_policy, 'not_an_answer');
  assert.equal(first.retrieval_semantics, 'evidence_excerpt_requires_grounding');
});

test('renders claim context summaries for high-risk or claim-referenced results', async () => {
  const req = {
    method: 'GET',
    query: { q: 'financial' },
  };
  const res = createMockResponse();

  await searchHandler(req, res);

  assert.equal(res.statusCode, 200);

  const financialOrganism = res.body.results.find((result) => result.id === 'financial-organisms');
  assert.ok(financialOrganism, 'financial organism should be returned for financial search');
  assert.deepEqual(financialOrganism.claim_context.referenced_claim_ids.sort(), [
    'financial-organisms-real-markets',
    'hero-live-blockchains-stat',
    'proof-gated-financial-motion',
  ]);
  assert.ok(financialOrganism.claim_context.claim_statuses.includes('needs_context'));
  assert.ok(financialOrganism.claim_context.claim_statuses.includes('safety_qualified'));
  assert.ok(financialOrganism.claim_context.risk_levels.includes('high'));
  assert.equal(financialOrganism.claim_context.requires_qualification, true);

  const directClaim = res.body.results.find((result) => result.id === 'financial-organisms-real-markets');
  assert.ok(directClaim, 'direct financial claim should be returned for financial search');
  assert.deepEqual(directClaim.claim_context.referenced_claim_ids, ['financial-organisms-real-markets']);
  assert.equal(directClaim.claim_context.interpretation_boundary, directClaim.interpretation_boundary);
  assert.equal(directClaim.claim_context.requires_qualification, true);
});

test('filters claim search results by claim status', async () => {
  const req = {
    method: 'GET',
    query: { type: 'claim', claim_status: 'needs_context' },
  };
  const res = createMockResponse();

  await searchHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.filters.type, 'claim');
  assert.equal(res.body.filters.claim_status, 'needs_context');
  assert.ok(res.body.results.length >= 1);
  assert.ok(
    res.body.results.every(
      (result) => result.type === 'claim' && result.claim_status === 'needs_context',
    ),
    'claim status filter should only return matching claim records when type=claim',
  );
});

test('searches one public registry type without dropping claim references', async () => {
  const req = {
    method: 'GET',
    query: { type: 'organism', q: 'financial' },
  };
  const res = createMockResponse();

  await searchHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.filters.type, 'organism');
  assert.ok(res.body.results.length >= 1);
  assert.ok(res.body.results.every((result) => result.type === 'organism'));
  assert.ok(
    res.body.results.every((result) => result.claim_references.length >= 1),
    'organism search results should preserve claim references',
  );
});

test('search preserves memory layers for organism and architecture results', async () => {
  const organismReq = {
    method: 'GET',
    query: { type: 'organism', q: 'financial' },
  };
  const organismRes = createMockResponse();

  await searchHandler(organismReq, organismRes);

  assert.equal(organismRes.statusCode, 200);
  const financialOrganism = organismRes.body.results.find(
    (result) => result.id === 'financial-organisms',
  );
  assert.ok(financialOrganism, 'financial organism should be returned');
  assert.deepEqual([...financialOrganism.memory_layers].sort(), [
    'episodic',
    'procedural',
    'semantic',
  ]);
  assert.deepEqual(financialOrganism.memory_context, {
    layers: ['semantic', 'episodic', 'procedural'],
    source: 'public_organism_registry',
    private_memory_excluded: true,
    runtime_memory_excluded: true,
  });

  const architectureReq = {
    method: 'GET',
    query: { type: 'architecture', q: 'memory' },
  };
  const architectureRes = createMockResponse();

  await searchHandler(architectureReq, architectureRes);

  assert.equal(architectureRes.statusCode, 200);
  const memoryArchitecture = architectureRes.body.results.find(
    (result) => result.id === 'four-tier-memory-architecture',
  );
  assert.ok(memoryArchitecture, 'memory architecture should be returned');
  assert.deepEqual([...memoryArchitecture.memory_layers].sort(), [
    'episodic',
    'procedural',
    'semantic',
    'working',
  ]);
  assert.deepEqual(memoryArchitecture.memory_context, {
    layers: ['working', 'procedural', 'semantic', 'episodic'],
    source: 'public_architecture_registry',
    private_memory_excluded: true,
    runtime_memory_excluded: true,
  });
});

test('filters public search results by memory layer without enabling synthesis', async () => {
  const req = {
    method: 'GET',
    query: { memory_layer: 'episodic' },
  };
  const res = createMockResponse();

  await searchHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.filters.memory_layer, 'episodic');
  assert.equal(res.body.answer_generation, 'disabled');
  assert.ok(res.body.results.length >= 1);
  assert.ok(
    res.body.results.every((result) => result.memory_layers?.includes('episodic')),
    'memory layer filter should only return entries with the requested memory layer',
  );
});

test('search memory context layers are not mutated by memory layer consumers', async () => {
  const req = {
    method: 'GET',
    query: { type: 'organism', q: 'financial' },
  };
  const res = createMockResponse();

  await searchHandler(req, res);

  assert.equal(res.statusCode, 200);
  const financialOrganism = res.body.results.find(
    (result) => result.id === 'financial-organisms',
  );
  assert.ok(financialOrganism, 'financial organism should be returned');

  financialOrganism.memory_layers.sort();

  assert.deepEqual(financialOrganism.memory_context.layers, [
    'semantic',
    'episodic',
    'procedural',
  ]);
});

test('transmission-only financial search preserves claim context', async () => {
  const req = {
    method: 'GET',
    query: { type: 'transmission', q: 'Monad approval' },
  };
  const res = createMockResponse();

  await searchHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.filters.type, 'transmission');
  assert.ok(res.body.results.length >= 1);
  assert.ok(res.body.results.every((result) => result.type === 'transmission'));

  const monadTransmission = res.body.results.find(
    (result) => result.id === '22-the-monad-hand-clarity-before-motion',
  );
  assert.ok(monadTransmission, 'Monad transmission should be returned for Monad approval search');

  const referencedClaimIds = monadTransmission.claim_context.referenced_claim_ids;
  assert.ok(referencedClaimIds.includes('financial-organisms-real-markets'));
  assert.ok(referencedClaimIds.includes('proof-gated-financial-motion'));
  assert.ok(monadTransmission.claim_context.claim_statuses.includes('safety_qualified'));
  assert.ok(monadTransmission.claim_context.claim_statuses.includes('public_safe'));
  assert.ok(monadTransmission.claim_context.risk_levels.includes('high'));
  assert.equal(monadTransmission.claim_context.requires_qualification, true);
});

test('transmission search claim context matches direct transmission decoration', async () => {
  const directReq = {
    method: 'GET',
    query: { id: '22-the-monad-hand-clarity-before-motion' },
  };
  const directRes = createMockResponse();

  await transmissionsHandler(directReq, directRes);

  const searchReq = {
    method: 'GET',
    query: { type: 'transmission', q: 'Monad approval' },
  };
  const searchRes = createMockResponse();

  await searchHandler(searchReq, searchRes);

  assert.equal(directRes.statusCode, 200);
  assert.equal(searchRes.statusCode, 200);

  const monadSearchResult = searchRes.body.results.find(
    (result) => result.id === '22-the-monad-hand-clarity-before-motion',
  );
  assert.ok(monadSearchResult, 'Monad transmission should be returned by search');
  assert.deepEqual(monadSearchResult.claim_context, directRes.body.transmission.claim_context);
  assert.deepEqual(monadSearchResult.claim_qualifications, directRes.body.transmission.claim_qualifications);
});

test('sensitive transmission topics require grounding review without explicit claims', async () => {
  const req = {
    method: 'GET',
    query: { type: 'transmission', q: 'on-chain agents' },
  };
  const res = createMockResponse();

  await searchHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);

  const onChainTransmission = res.body.results.find(
    (result) => result.id === '02-deploying-agents-on-chain',
  );
  assert.ok(onChainTransmission, 'on-chain transmission should be returned for on-chain agents search');
  assert.deepEqual(onChainTransmission.claim_context.sensitive_topic_tags, ['web3-safety']);
  assert.equal(onChainTransmission.claim_context.requires_qualification, true);
  assert.ok(
    onChainTransmission.claim_context.review_flags.includes('sensitive_topic_requires_grounding'),
    'sensitive transmission topic should survive shared search claim context',
  );
});

test('asset search flags approval-required packages before RAG use', async () => {
  const req = {
    method: 'GET',
    query: { type: 'asset', q: 'mirror carousel' },
  };
  const res = createMockResponse();

  await searchHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.filters.type, 'asset');

  const assetPackage = res.body.results.find(
    (result) => result.id === 'transmission-24-mirror-carousel',
  );
  assert.ok(assetPackage, 'mirror carousel asset package should be returned by asset search');
  assert.match(assetPackage.asset_package_sha256, /^[a-f0-9]{64}$/);
  assert.equal(assetPackage.manual_approval_required, true);
  assert.equal(assetPackage.publication_status, 'prepared_not_posted');
  assert.equal(assetPackage.public_safe, false);
  assert.equal(assetPackage.requires_human_review, true);
  assert.equal(
    typeof assetPackage.authority_boundary,
    'object',
    'search results should expose asset authority boundaries',
  );
  assert.equal(assetPackage.authority_boundary.posting_authority, false);
  assert.equal(assetPackage.authority_boundary.wallet_authority, false);
  assert.equal(assetPackage.authority_boundary.paid_media_authority, false);
  assert.equal(assetPackage.authority_boundary.on_chain_attestation_authority, false);
  assert.equal(assetPackage.authority_boundary.approval_state, 'creator_approval_required');
  assert.ok(assetPackage.authority_boundary.allowed_uses.includes('manual_review'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('automated_public_posting'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('wallet_signing'));
  assert.equal(
    typeof assetPackage.approval_record_schema,
    'object',
    'search results should expose asset approval record schema',
  );
  assert.equal(
    assetPackage.approval_record_schema.schema_version,
    '2026-06-06.public-asset-approval-record.v1',
  );
  assert.ok(assetPackage.approval_record_schema.required_fields.includes('asset_package_sha256'));
  assert.ok(assetPackage.approval_record_schema.required_fields.includes('approved_by_role'));
  assert.equal(assetPackage.approval_records.length, 0);
  assert.ok(assetPackage.review_flags.includes('asset_manual_approval_required'));
  assert.ok(assetPackage.review_flags.includes('asset_publication_not_posted'));
  assert.ok(assetPackage.review_flags.includes('asset_review_not_public_safe'));
  assert.equal(assetPackage.claim_context.requires_qualification, true);
  assert.ok(
    assetPackage.claim_context.review_flags.includes('asset_manual_approval_required'),
    'manual approval requirement should be machine-readable in search claim context',
  );
  assert.ok(
    assetPackage.claim_context.review_flags.includes('asset_publication_not_posted'),
    'prepared-but-unposted assets should be flagged before RAG use',
  );
  assert.ok(
    assetPackage.claim_context.review_flags.includes('asset_review_not_public_safe'),
    'non-public-safe asset review status should be flagged before RAG use',
  );
});

test('rejects unsafe search inputs and write methods', async () => {
  const overlongQuery = {
    method: 'GET',
    query: { q: 'financial '.repeat(40) },
  };
  const overlongRes = createMockResponse();

  await searchHandler(overlongQuery, overlongRes);

  assert.equal(overlongRes.statusCode, 400);
  assert.equal(overlongRes.headers['cache-control'], 'no-store');
  assert.deepEqual(overlongRes.body, { success: false, error: 'Invalid search query' });

  const postReq = {
    method: 'POST',
    query: { q: 'financial' },
  };
  const postRes = createMockResponse();

  await searchHandler(postReq, postRes);

  assert.equal(postRes.statusCode, 405);
  assert.equal(postRes.headers.allow, 'GET, HEAD, OPTIONS');
  assert.equal(postRes.headers['cache-control'], 'no-store');
  assert.deepEqual(postRes.body, { success: false, error: 'Method not allowed' });
});

test('returns 429 when durable search rate limit denies the request', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';
  process.env.SEARCH_RATE_LIMIT_MAX = '7';
  process.env.SEARCH_RATE_LIMIT_WINDOW_SECONDS = '30';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        allowed: false,
        retry_after: 30,
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  };

  const req = {
    method: 'GET',
    headers: {
      'x-forwarded-for': '203.0.113.9, 10.0.0.1',
    },
    query: { q: 'financial proof' },
  };
  const res = createMockResponse();

  await searchHandler(req, res);

  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '30');
  assert.deepEqual(res.body, { success: false, error: 'Too many requests' });
  assert.equal(calls.length, 1);

  const limitBody = JSON.parse(calls[0].options.body);
  assert.equal(limitBody.route, '/api/search');
  assert.equal(limitBody.limit, 7);
  assert.equal(limitBody.window_seconds, 30);
  assert.match(limitBody.key, /^sha256:/);
  assert.equal(calls[0].options.body.includes('financial proof'), false);
  assert.equal(calls[0].options.body.includes('203.0.113.9'), false);
});

test('fails closed in production when search rate limiting is not configured', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.VERCEL_ENV = 'production';
  delete process.env.RATE_LIMIT_REST_URL;
  delete process.env.RATE_LIMIT_REST_TOKEN;
  delete process.env.RATE_LIMIT_SALT;

  let loaded = false;
  const handler = searchApi.createSearchHandler({
    buildPublicSearchPayload: async () => {
      loaded = true;
      return { payload: { query: 'financial', filters: {}, ranking: {}, results: [] } };
    },
  });
  const req = {
    method: 'GET',
    query: { q: 'financial' },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '60');
  assert.deepEqual(res.body, { success: false, error: 'Request limit unavailable' });
  assert.equal(loaded, false);
});

test('search registry loader failures are non-cacheable and generic', async (t) => {
  assert.equal(typeof searchApi.createSearchHandler, 'function');

  const failingHandler = searchApi.createSearchHandler({
    buildPublicSearchPayload: async () => {
      throw new Error('/private/path/claims.json parse failed for financial query');
    },
  });
  const req = {
    method: 'GET',
    query: { q: 'financial' },
  };
  const res = createMockResponse();

  await failingHandler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load public search registries' });
  assert.equal(JSON.stringify(res.body).includes('/private/path'), false);
});

test('search output avoids secrets and private runtime material', async () => {
  const req = {
    method: 'GET',
    query: { q: 'brain' },
  };
  const res = createMockResponse();

  await searchHandler(req, res);

  const raw = JSON.stringify(res.body);

  assert.equal(/SUPABASE_SERVICE_ROLE_KEY|PRIVATE_KEY|BEGIN RSA PRIVATE KEY/i.test(raw), false);
  assert.equal(/\brnd_[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/\bsk-[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/wallet_private_key|service-role|raw prompt|hidden repo/i.test(raw), false);
  assert.equal(raw.includes('owner-filled-redacted-manifest'), false);
});
