import assert from 'node:assert/strict';
import test from 'node:test';

import groundingHandler from '../api/grounding.js';
import * as groundingApi from '../api/grounding.js';

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

test('returns a public-safe grounding packet with citations and claim qualifications', async () => {
  const req = {
    method: 'GET',
    query: { q: 'financial proof' },
  };
  const res = createMockResponse();

  await groundingHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.equal(res.headers['cache-control'], 'private, no-store');
  assert.equal(res.body.success, true);
  assert.equal(res.body.query, 'financial proof');
  assert.equal(res.body.packet.schema_version, '2026-06-06.public-grounding-packet.v1');
  assert.equal(res.body.packet.mode, 'public_registry_grounding');
  assert.equal(res.body.packet.answer_generation, 'disabled');
  assert.ok(res.body.packet.sources.length >= 1);
  assert.ok(res.body.packet.sources.length <= 5);
  assert.ok(res.body.packet.citations.length >= 1);
  assert.ok(res.body.packet.required_qualifications.length >= 1);
  assert.ok(res.body.packet.refusal_rules.includes('do_not_claim_wallet_authority'));
  assert.ok(res.body.packet.refusal_rules.includes('do_not_infer_current_deployment'));
  assert.equal(res.body.packet.requires_human_review, true);
  assert.equal(res.body.packet.answer_policy.synthesis_allowed, false);
  assert.equal(res.body.packet.answer_policy.decision, 'review_required_before_synthesis');
  assert.ok(res.body.packet.answer_policy.blocked_reasons.includes('high_risk_claim_requires_review'));
  assert.ok(res.body.packet.answer_policy.required_before_synthesis.includes('render_citations'));
  assert.ok(res.body.packet.answer_policy.required_before_synthesis.includes('render_claim_qualifications'));
  assert.ok(res.body.packet.review_flags.includes('high_risk_claim'));
  assert.ok(res.body.packet.review_flags.includes('claim_needs_context'));
  assert.equal(res.body.packet.citation_display.mode, 'numbered_public_citations');
  assert.equal(res.body.packet.citation_display.answer_generation, 'disabled');
  assert.ok(res.body.packet.citation_display.instructions.includes('render_citations_before_answer'));
  assert.equal(res.body.packet.citation_display.items.length, res.body.packet.citations.length);

  const firstSource = res.body.packet.sources[0];
  assert.equal(firstSource.rank, 1);
  assert.ok(Number.isInteger(firstSource.match_score));
  assert.ok(firstSource.snippet.length > 0);
  assert.ok(firstSource.citation_indexes.length >= 1);
  assert.deepEqual(
    firstSource.citation_display_refs,
    firstSource.citation_indexes.map((index) => `[${index}]`),
  );
  assert.equal(firstSource.public_safe, true);
  assert.equal(firstSource.answer_generation, 'disabled');
  assert.equal(firstSource.source_policy, 'grounding_source_not_an_answer');
  assert.equal(firstSource.retrieval_semantics, 'citation_source_requires_answer_policy_review');
  assert.equal(firstSource.answer_safety.synthesis_allowed, false);
  assert.equal(firstSource.answer_safety.citation_required, true);
  assert.equal(
    firstSource.answer_safety.claim_qualification_review_required,
    Boolean(firstSource.claim_context?.requires_qualification),
  );
  assert.equal(firstSource.answer_safety.public_metadata_safe, true);
  assert.equal(firstSource.answer_safety.answer_safe, false);
  assert.equal(firstSource.answer_safety.packet_review_required, true);
  assert.equal(firstSource.answer_safety.packet_answer_policy_decision, 'review_required_before_synthesis');
  assert.equal(firstSource.answer_safety.human_review_required, true);

  const firstCitationDisplay = res.body.packet.citation_display.items[0];
  const firstCitation = res.body.packet.citations[0];
  assert.equal(firstCitationDisplay.citation_index, firstCitation.index);
  assert.equal(firstCitationDisplay.label, firstCitation.label);
  assert.equal(firstCitationDisplay.route, firstCitation.route);
  assert.equal(firstCitationDisplay.source_file, firstCitation.source_file);
  assert.match(firstCitationDisplay.display_text, /^\[1\] .+ - \//);
  assert.equal(firstCitationDisplay.render_required, true);
  assert.equal(firstCitationDisplay.public_safe, true);
  assert.equal(firstCitationDisplay.answer_safe, false);
  assert.equal(firstCitationDisplay.private_data_excluded, true);

  const qualificationSource = res.body.packet.sources.find(
    (source) => source.claim_context?.requires_qualification,
  );
  assert.ok(qualificationSource, 'at least one grounding source should require claim review');
  assert.equal(qualificationSource.answer_safety.claim_qualification_review_required, true);
  assert.equal(qualificationSource.answer_safety.human_review_required, true);

  const qualificationIds = res.body.packet.required_qualifications.map((entry) => entry.claim_id);
  assert.ok(
    qualificationIds.includes('financial-organisms-real-markets') ||
      qualificationIds.includes('proof-gated-financial-motion'),
    'grounding packet should carry financial/proof claim qualifications',
  );
});

test('supports type filters while preserving grounding policy', async () => {
  const req = {
    method: 'GET',
    query: { q: 'financial', type: 'organism' },
  };
  const res = createMockResponse();

  await groundingHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.filters.type, 'organism');
  assert.ok(res.body.packet.sources.length >= 1);
  assert.ok(res.body.packet.sources.every((source) => source.type === 'organism'));
  assert.equal(res.body.packet.answer_generation, 'disabled');
  assert.equal(res.body.packet.boundaries.public_registries_only, true);
  assert.equal(res.body.packet.answer_policy.synthesis_allowed, false);
  assert.ok(res.body.packet.answer_policy.blocked_reasons.includes('policy_requires_answer_endpoint_review'));
});

test('grounding sources preserve memory layers while synthesis stays disabled', async () => {
  const req = {
    method: 'GET',
    query: { q: 'financial', type: 'organism', memory_layer: 'episodic' },
  };
  const res = createMockResponse();

  await groundingHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.filters.memory_layer, 'episodic');
  assert.equal(res.body.packet.answer_generation, 'disabled');
  assert.equal(res.body.packet.answer_policy.synthesis_allowed, false);

  const source = res.body.packet.sources.find((entry) => entry.id === 'financial-organisms');
  assert.ok(source, 'financial organism should be a memory-aware grounding source');
  assert.deepEqual([...source.memory_layers].sort(), ['episodic', 'procedural', 'semantic']);
  assert.deepEqual(source.memory_context, {
    layers: ['semantic', 'episodic', 'procedural'],
    source: 'public_organism_registry',
    private_memory_excluded: true,
    runtime_memory_excluded: true,
  });
  assert.equal(source.answer_generation, 'disabled');
  assert.equal(source.answer_safety.synthesis_allowed, false);
});

test('grounding source memory context layers are defensively copied', async () => {
  const req = {
    method: 'GET',
    query: { q: 'financial', type: 'organism', memory_layer: 'episodic' },
  };
  const res = createMockResponse();

  await groundingHandler(req, res);

  assert.equal(res.statusCode, 200);
  const source = res.body.packet.sources.find((entry) => entry.id === 'financial-organisms');
  assert.ok(source, 'financial organism should be a grounding source');

  source.memory_layers.sort();

  assert.deepEqual(source.memory_context.layers, ['semantic', 'episodic', 'procedural']);
});

test('requires review when public grounding has no matching citations', async () => {
  const req = {
    method: 'GET',
    query: { q: 'zzzz-unmatched-grounding-query' },
  };
  const res = createMockResponse();

  await groundingHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.packet.answer_generation, 'disabled');
  assert.deepEqual(res.body.packet.citations, []);
  assert.deepEqual(res.body.packet.sources, []);
  assert.ok(res.body.packet.review_flags.includes('missing_citations'));
  assert.equal(res.body.packet.answer_policy.synthesis_allowed, false);
  assert.equal(res.body.packet.answer_policy.decision, 'review_required_before_synthesis');
  assert.ok(res.body.packet.answer_policy.blocked_reasons.includes('missing_citations'));
  assert.equal(res.body.packet.requires_human_review, true);
});

test('transmission-only grounding preserves high-risk financial claim qualifications', async () => {
  const req = {
    method: 'GET',
    query: { q: 'Monad approval', type: 'transmission' },
  };
  const res = createMockResponse();

  await groundingHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.filters.type, 'transmission');
  assert.ok(res.body.packet.sources.length >= 1);
  assert.ok(res.body.packet.sources.every((source) => source.type === 'transmission'));

  const source = res.body.packet.sources.find(
    (entry) => entry.id === '22-the-monad-hand-clarity-before-motion',
  );
  assert.ok(source, 'Monad transmission should be a grounding source');
  assert.ok(source.claim_context.referenced_claim_ids.includes('financial-organisms-real-markets'));
  assert.ok(source.claim_context.referenced_claim_ids.includes('proof-gated-financial-motion'));
  assert.equal(source.claim_context.requires_qualification, true);

  const qualificationIds = res.body.packet.required_qualifications.map((entry) => entry.claim_id);
  assert.ok(qualificationIds.includes('financial-organisms-real-markets'));
  assert.ok(source.claim_context.referenced_claim_ids.includes('proof-gated-financial-motion'));
  assert.equal(res.body.packet.requires_human_review, true);
  assert.ok(res.body.packet.review_flags.includes('high_risk_claim'));
  assert.ok(res.body.packet.answer_policy.blocked_reasons.includes('high_risk_claim_requires_review'));
  assert.ok(res.body.packet.answer_policy.blocked_reasons.includes('claim_qualifications_required'));
});

test('transmission-only grounding preserves sensitive topic review flags without explicit claims', async () => {
  const req = {
    method: 'GET',
    query: { q: 'on-chain agents', type: 'transmission' },
  };
  const res = createMockResponse();

  await groundingHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);

  const source = res.body.packet.sources.find(
    (entry) => entry.id === '02-deploying-agents-on-chain',
  );
  assert.ok(source, 'on-chain transmission should be a grounding source');
  assert.deepEqual(source.claim_context.sensitive_topic_tags, ['web3-safety']);
  assert.equal(source.claim_context.requires_qualification, true);
  assert.ok(source.claim_context.review_flags.includes('sensitive_topic_requires_grounding'));
  assert.ok(res.body.packet.review_flags.includes('sensitive_topic_requires_grounding'));
  assert.equal(res.body.packet.answer_policy.decision, 'review_required_before_synthesis');
  assert.ok(
    res.body.packet.answer_policy.blocked_reasons.includes('sensitive_topic_requires_grounding'),
  );
  assert.equal(res.body.packet.requires_human_review, true);
});

test('asset grounding preserves approval-required review flags', async () => {
  const req = {
    method: 'GET',
    query: { q: 'mirror carousel', type: 'asset' },
  };
  const res = createMockResponse();

  await groundingHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.filters.type, 'asset');

  const source = res.body.packet.sources.find(
    (entry) => entry.id === 'transmission-24-mirror-carousel',
  );
  assert.ok(source, 'mirror carousel asset should be returned as a grounding source');
  assert.match(source.asset_package_sha256, /^[a-f0-9]{64}$/);
  assert.equal(source.public_safe, false);
  assert.equal(source.answer_generation, 'disabled');
  assert.equal(source.answer_safety.public_metadata_safe, false);
  assert.equal(source.answer_safety.answer_safe, false);
  assert.equal(source.answer_safety.packet_review_required, true);
  assert.equal(source.answer_safety.packet_answer_policy_decision, 'review_required_before_synthesis');
  assert.equal(source.answer_safety.human_review_required, true);
  assert.equal(source.claim_context.requires_qualification, true);
  assert.ok(source.claim_context.review_flags.includes('asset_manual_approval_required'));
  assert.ok(source.claim_context.review_flags.includes('asset_publication_not_posted'));
  assert.ok(source.claim_context.review_flags.includes('asset_review_not_public_safe'));
  assert.ok(res.body.packet.review_flags.includes('asset_manual_approval_required'));
  assert.ok(res.body.packet.review_flags.includes('asset_publication_not_posted'));
  assert.ok(res.body.packet.review_flags.includes('asset_review_not_public_safe'));
  assert.ok(res.body.packet.review_flags.includes('non_public_safe_source'));
  assert.equal(res.body.packet.answer_policy.decision, 'review_required_before_synthesis');
  assert.ok(res.body.packet.answer_policy.blocked_reasons.includes('non_public_safe_source'));
  assert.ok(res.body.packet.answer_policy.blocked_reasons.includes('asset_manual_approval_required'));
  assert.ok(res.body.packet.answer_policy.blocked_reasons.includes('asset_publication_not_posted'));
  assert.equal(res.body.packet.requires_human_review, true);
});

test('rejects unsafe grounding inputs and write methods', async () => {
  const invalidReq = {
    method: 'GET',
    query: { q: 'proof '.repeat(40) },
  };
  const invalidRes = createMockResponse();

  await groundingHandler(invalidReq, invalidRes);

  assert.equal(invalidRes.statusCode, 400);
  assert.equal(invalidRes.headers['cache-control'], 'no-store');
  assert.deepEqual(invalidRes.body, { success: false, error: 'Invalid grounding query' });

  const postReq = {
    method: 'POST',
    query: { q: 'financial' },
  };
  const postRes = createMockResponse();

  await groundingHandler(postReq, postRes);

  assert.equal(postRes.statusCode, 405);
  assert.equal(postRes.headers.allow, 'GET, HEAD, OPTIONS');
  assert.equal(postRes.headers['cache-control'], 'no-store');
  assert.deepEqual(postRes.body, { success: false, error: 'Method not allowed' });
});

test('returns 429 when durable grounding rate limit denies the request', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';
  process.env.GROUNDING_RATE_LIMIT_MAX = '5';
  process.env.GROUNDING_RATE_LIMIT_WINDOW_SECONDS = '45';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        allowed: false,
        retry_after: 45,
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
      'x-forwarded-for': '203.0.113.21, 10.0.0.1',
    },
    query: { q: 'financial proof' },
  };
  const res = createMockResponse();

  await groundingHandler(req, res);

  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '45');
  assert.deepEqual(res.body, { success: false, error: 'Too many requests' });
  assert.equal(calls.length, 1);

  const limitBody = JSON.parse(calls[0].options.body);
  assert.equal(limitBody.route, '/api/grounding');
  assert.equal(limitBody.limit, 5);
  assert.equal(limitBody.window_seconds, 45);
  assert.match(limitBody.key, /^sha256:/);
  assert.equal(calls[0].options.body.includes('financial proof'), false);
  assert.equal(calls[0].options.body.includes('203.0.113.21'), false);
});

test('fails closed in production when grounding rate limiting is not configured', async (t) => {
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
  const handler = groundingApi.createGroundingHandler({
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

test('grounding registry loader failures are non-cacheable and generic', async (t) => {
  assert.equal(typeof groundingApi.createGroundingHandler, 'function');

  const failingHandler = groundingApi.createGroundingHandler({
    buildPublicSearchPayload: async () => {
      throw new Error('/private/path/transmissions.json parse failed for grounding query');
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
  assert.deepEqual(res.body, { success: false, error: 'Unable to build public grounding packet' });
  assert.equal(JSON.stringify(res.body).includes('/private/path'), false);
});

test('grounding packet avoids secrets and private runtime material', async () => {
  const req = {
    method: 'GET',
    query: { q: 'brain' },
  };
  const res = createMockResponse();

  await groundingHandler(req, res);

  const raw = JSON.stringify(res.body);

  assert.equal(/SUPABASE_SERVICE_ROLE_KEY|PRIVATE_KEY|BEGIN RSA PRIVATE KEY/i.test(raw), false);
  assert.equal(/\brnd_[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/\bsk-[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/wallet_private_key|service-role|raw prompt|hidden repo/i.test(raw), false);
  assert.equal(raw.includes('owner-filled-redacted-manifest'), false);
});
