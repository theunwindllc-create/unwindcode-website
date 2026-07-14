import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import assetsHandler from '../api/assets.js';
import * as assetsApi from '../api/assets.js';

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

function safeAuthorityBoundary(overrides = {}) {
  return {
    posting_authority: false,
    wallet_authority: false,
    paid_media_authority: false,
    on_chain_attestation_authority: false,
    approval_state: 'creator_approval_required',
    allowed_uses: [
      'manual_review',
      'provenance_lookup',
      'local_asset_inspection',
      'manual_social_post_after_creator_approval',
    ],
    prohibited_uses: [
      'automated_public_posting',
      'wallet_signing',
      'paid_media_activation',
      'on_chain_publication',
      'unreviewed_rag_answer_evidence',
    ],
    ...overrides,
  };
}

function publicApprovalRecordSchema(overrides = {}) {
  return {
    schema_version: '2026-06-06.public-asset-approval-record.v1',
    storage_boundary: {
      public_record_only: true,
      secrets_excluded: true,
      raw_prompts_excluded: true,
      private_notes_excluded: true,
      on_chain_sensitive_data_excluded: true,
    },
    required_fields: [
      'approval_id',
      'asset_package_id',
      'asset_package_sha256',
      'approved_by_role',
      'approved_at',
      'approved_scope',
      'source_file_hashes_verified',
      'generated_file_hashes_verified',
    ],
    allowed_approval_scopes: ['manual_social_publication'],
    prohibited_record_content: ['private_approver_identity', 'raw_prompts', 'private_notes'],
    ...overrides,
  };
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

function canonicalPayloadDigest(canonicalPayload) {
  return createHash('sha256').update(stableStringify(canonicalPayload)).digest('hex');
}

function canonicalAssetPackageDigest(assetPackage) {
  const canonicalPayload = {
    id: assetPackage.id,
    type: assetPackage.type,
    title: assetPackage.title,
    summary: assetPackage.summary,
    source_route: assetPackage.source_route,
    source_files: assetPackage.source_files,
    alt_text: assetPackage.alt_text,
    provenance: {
      created_from: assetPackage.provenance.created_from,
      source_files: assetPackage.provenance.source_files,
      source_file_hashes: assetPackage.provenance.source_file_hashes,
      generated_files: assetPackage.provenance.generated_files,
    },
    rights: assetPackage.rights,
    approval_gates: assetPackage.approval_gates,
    authority_boundary: assetPackage.authority_boundary,
    approval_record_schema: assetPackage.approval_record_schema,
    review_status: assetPackage.review_status,
    publication_status: assetPackage.publication_status,
    manual_approval_required: assetPackage.manual_approval_required,
    confidence: assetPackage.confidence,
  };

  return canonicalPayloadDigest(canonicalPayload);
}

function approvalCapableAssetPackage(overrides = {}) {
  const assetPackage = {
    id: 'approval-bearing-package',
    type: 'social-carousel',
    title: 'Approval Bearing Package',
    summary: 'Synthetic approval-bearing package used for asset API contract tests.',
    source_route: '/transmissions/24-the-mirror-found-its-form',
    source_files: ['social/approval-bearing-package/README.md'],
    alt_text: 'Synthetic approval-bearing package for public asset provenance API tests.',
    authority_boundary: safeAuthorityBoundary(),
    approval_record_schema: publicApprovalRecordSchema(),
    provenance: {
      created_from: 'test-renderer',
      source_files: ['social/approval-bearing-package/README.md'],
      source_file_hashes: [
        {
          path: 'social/approval-bearing-package/README.md',
          sha256: 'b'.repeat(64),
          bytes: 10,
        },
      ],
      generated_files: [
        {
          path: 'social/approval-bearing-package/exports/slide-01.png',
          sha256: 'c'.repeat(64),
          bytes: 20,
        },
      ],
    },
    rights: {
      usage_scope: 'Prepared for manual review only.',
      license_notes: 'Owner-created test package.',
    },
    approval_gates: ['Creator approval is required before publication.'],
    approval_records: [],
    review_status: 'creator_approval_required',
    publication_status: 'prepared_not_posted',
    manual_approval_required: true,
    confidence: 'high',
    ...overrides,
  };

  return {
    ...assetPackage,
    asset_package_sha256:
      overrides.asset_package_sha256 || canonicalAssetPackageDigest(assetPackage),
  };
}

test('returns the public asset provenance registry with cache headers', async () => {
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  assert.equal(res.headers['cache-control'], 'public, max-age=60, must-revalidate');
  assert.match(res.headers.etag, /^"sha256-[a-f0-9]{64}"$/);
  assert.match(res.headers['last-modified'], /^[A-Z][a-z]{2}, /);
  assert.equal(res.body.success, true);
  assert.equal(res.body.registry.review_status, 'public_safe_draft');
  assert.equal(res.body.registry.packages.length, 8);
  assert.ok(
    res.body.registry.packages.some(
      (assetPackage) => assetPackage.id === 'transmission-26-property-sales-intelligence-cell-carousel',
    ),
  );
});

test('returns 304 for matching public asset registry validators', async () => {
  const firstReq = {
    method: 'GET',
    query: {},
    headers: {},
  };
  const firstRes = createMockResponse();

  await assetsHandler(firstReq, firstRes);

  const secondReq = {
    method: 'GET',
    query: {},
    headers: { 'if-none-match': firstRes.headers.etag },
  };
  const secondRes = createMockResponse();

  await assetsHandler(secondReq, secondRes);

  assert.equal(secondRes.statusCode, 304);
  assert.equal(secondRes.headers['cache-control'], 'public, max-age=60, must-revalidate');
  assert.equal(secondRes.headers.etag, firstRes.headers.etag);
  assert.equal(secondRes.headers['last-modified'], firstRes.headers['last-modified']);
  assert.equal(secondRes.body, '');
});

test('returns one public asset package by id', async () => {
  const req = {
    method: 'GET',
    query: { id: 'transmission-24-mirror-carousel' },
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(Object.keys(res.body).sort(), ['asset_package', 'success']);
  assert.equal(res.body.asset_package.id, 'transmission-24-mirror-carousel');
  assert.match(res.body.asset_package.asset_package_sha256, /^[a-f0-9]{64}$/);
  assert.equal(res.body.asset_package.review_status, 'creator_approval_required');
});

test('filters public asset packages by publication status', async () => {
  const req = {
    method: 'GET',
    query: { publication_status: 'prepared_not_posted' },
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.packages.length, 8);
  assert.ok(
    res.body.packages.every((assetPackage) => assetPackage.publication_status === 'prepared_not_posted'),
    'publication status filter should only return matching asset packages',
  );
});

test('rejects malformed asset lookup values', async () => {
  const req = {
    method: 'GET',
    query: { id: '../private' },
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Invalid asset package id' });
});

test('returns non-cacheable errors for unknown asset packages', async () => {
  const req = {
    method: 'GET',
    query: { id: 'unknown-asset-package' },
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(Object.hasOwn(res.headers, 'etag'), false);
  assert.equal(Object.hasOwn(res.headers, 'last-modified'), false);
  assert.deepEqual(res.body, { success: false, error: 'Asset package not found' });
});

test('returns non-cacheable empty HEAD errors for unknown asset packages', async () => {
  const req = {
    method: 'HEAD',
    query: { id: 'unknown-asset-package' },
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(Object.hasOwn(res.headers, 'etag'), false);
  assert.equal(Object.hasOwn(res.headers, 'last-modified'), false);
  assert.equal(res.body, '');
});

test('rejects write methods on the public asset provenance endpoint', async () => {
  const req = {
    method: 'POST',
    query: {},
  };
  const res = createMockResponse();

  await assetsHandler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'GET, HEAD, OPTIONS');
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Method not allowed' });
});

test('returns a non-cacheable generic error when the asset registry cannot load', async () => {
  const assetsModule = await import('../api/assets.js');

  assert.equal(typeof assetsModule.createAssetsHandler, 'function');

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => {
      throw new Error('parser leaked filesystem/path/details');
    },
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when approval records reference a mismatched package digest', async () => {
  const assetsModule = await import('../api/assets.js');
  const assetPackage = approvalCapableAssetPackage({ id: 'unsafe-package' });

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [
        {
          ...assetPackage,
          approval_records: [
            {
              approval_id: 'approval-1',
              asset_package_id: 'unsafe-package',
              asset_package_sha256: 'b'.repeat(64),
            },
          ],
        },
      ],
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when an asset package digest is not canonical', async () => {
  const assetsModule = await import('../api/assets.js');

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [
        approvalCapableAssetPackage({
          asset_package_sha256: 'd'.repeat(64),
        }),
      ],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when trust-bearing package metadata changes without a new digest', async () => {
  const assetsModule = await import('../api/assets.js');
  const originalPackage = approvalCapableAssetPackage({
    title: 'Original Asset Package',
    summary: 'Original reviewed summary.',
    source_files: ['social/approval-bearing-package/README.md'],
    alt_text: 'Original reviewed alt text for the approval-bearing package.',
    provenance: {
      created_from: 'test-renderer',
      source_files: ['social/approval-bearing-package/README.md'],
      source_file_hashes: [
        {
          path: 'social/approval-bearing-package/README.md',
          sha256: 'b'.repeat(64),
          bytes: 10,
        },
      ],
      generated_files: [
        {
          path: 'social/approval-bearing-package/exports/slide-01.png',
          sha256: 'c'.repeat(64),
          bytes: 20,
        },
      ],
    },
    rights: {
      usage_scope: 'Prepared for manual review only.',
      license_notes: 'Owner-created test package.',
    },
    approval_gates: ['Creator approval is required before publication.'],
    review_status: 'creator_approval_required',
    publication_status: 'prepared_not_posted',
    manual_approval_required: true,
    confidence: 'high',
  });
  const staleDigest = originalPackage.asset_package_sha256;
  const mutatedPackage = {
    ...originalPackage,
    review_status: 'public_safe',
    publication_status: 'published',
    manual_approval_required: false,
    approval_gates: ['Publication has already been approved.'],
    rights: {
      usage_scope: 'Prepared for automated distribution.',
      license_notes: 'Changed after digest calculation.',
    },
    asset_package_sha256: staleDigest,
  };

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [mutatedPackage],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when the public approval schema changes without a new digest', async () => {
  const assetsModule = await import('../api/assets.js');
  const originalPackage = approvalCapableAssetPackage({
    approval_record_schema: publicApprovalRecordSchema({
      allowed_approval_scopes: ['manual_social_publication'],
    }),
  });
  const mutatedPackage = {
    ...originalPackage,
    approval_record_schema: {
      ...originalPackage.approval_record_schema,
      allowed_approval_scopes: ['manual_social_publication', 'site_asset_publication'],
    },
    asset_package_sha256: originalPackage.asset_package_sha256,
  };

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [mutatedPackage],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when canonical digest inputs are missing even if the digest matches the incomplete payload', async () => {
  const assetsModule = await import('../api/assets.js');
  const incompleteAssetPackage = {
    id: 'incomplete-package',
    type: 'social-carousel',
    source_route: '/transmissions/24-the-mirror-found-its-form',
    authority_boundary: safeAuthorityBoundary(),
    approval_records: [],
  };

  incompleteAssetPackage.asset_package_sha256 = canonicalPayloadDigest({
    id: incompleteAssetPackage.id,
    type: incompleteAssetPackage.type,
    source_route: incompleteAssetPackage.source_route,
    source_file_hashes: undefined,
    generated_files: undefined,
    approval_record_schema_version: undefined,
    authority_boundary: incompleteAssetPackage.authority_boundary,
  });

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [incompleteAssetPackage],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when source file hash coverage does not match listed source files', async () => {
  const assetsModule = await import('../api/assets.js');
  const assetPackage = approvalCapableAssetPackage({
    id: 'underhashed-source-package',
    source_files: [
      'social/approval-bearing-package/README.md',
      'social/approval-bearing-package/caption.md',
    ],
    provenance: {
      created_from: 'test-renderer',
      source_files: [
        'social/approval-bearing-package/README.md',
        'social/approval-bearing-package/caption.md',
      ],
      source_file_hashes: [
        {
          path: 'social/approval-bearing-package/README.md',
          sha256: 'b'.repeat(64),
          bytes: 10,
        },
      ],
      generated_files: [
        {
          path: 'social/approval-bearing-package/exports/slide-01.png',
          sha256: 'c'.repeat(64),
          bytes: 20,
        },
      ],
    },
  });

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [assetPackage],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when registry packages are missing or not an array', async () => {
  const assetsModule = await import('../api/assets.js');
  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('does not return 304 for matching validators when asset registry digest validation fails', async () => {
  const assetsModule = await import('../api/assets.js');
  const etag = '"sha256-invalid"';
  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [
        approvalCapableAssetPackage({
          asset_package_sha256: 'e'.repeat(64),
        }),
      ],
    }),
    loadRegistryMetadata: async () => ({
      etag,
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
    headers: { 'if-none-match': etag },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(Object.hasOwn(res.headers, 'etag'), false);
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('returns empty non-cacheable HEAD response when canonical digest validation fails', async () => {
  const assetsModule = await import('../api/assets.js');
  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [
        approvalCapableAssetPackage({
          id: 'invalid-head-package',
          asset_package_sha256: 'f'.repeat(64),
        }),
      ],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'HEAD',
    query: { id: 'invalid-head-package' },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(Object.hasOwn(res.headers, 'etag'), false);
  assert.equal(res.body, '');
});

test('fails closed when asset authority boundaries grant high-risk authority', async () => {
  const assetsModule = await import('../api/assets.js');

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [
        approvalCapableAssetPackage({
          id: 'unsafe-authority-package',
          authority_boundary: {
            posting_authority: false,
            wallet_authority: true,
            paid_media_authority: false,
            on_chain_attestation_authority: true,
            approval_state: 'creator_approval_required',
          },
        }),
      ],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when asset allowed uses grant prohibited authority', async () => {
  const assetsModule = await import('../api/assets.js');

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [
        approvalCapableAssetPackage({
          id: 'unsafe-allowed-uses-package',
          authority_boundary: safeAuthorityBoundary({
            allowed_uses: ['manual_review', 'automated_public_posting', 'wallet_signing'],
            prohibited_uses: ['paid_media_activation'],
          }),
        }),
      ],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when a public or published asset lacks a matching approval record', async () => {
  const assetsModule = await import('../api/assets.js');

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [
        approvalCapableAssetPackage({
          id: 'unapproved-public-package',
          review_status: 'public_safe',
          publication_status: 'published',
          manual_approval_required: false,
          approval_records: [],
        }),
      ],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when approval records include non-public fields', async () => {
  const assetsModule = await import('../api/assets.js');
  const assetPackage = approvalCapableAssetPackage();

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [
        {
          ...assetPackage,
          approval_records: [
            {
              approval_id: 'approval-1',
              asset_package_id: 'approval-bearing-package',
              asset_package_sha256: assetPackage.asset_package_sha256,
              approved_by_role: 'creator',
              approved_at: '2026-06-30T00:00:00.000Z',
              approved_scope: 'manual_social_publication',
              source_file_hashes_verified: true,
              generated_file_hashes_verified: true,
              raw_prompts: 'private generation prompt must not become public provenance',
              private_notes: 'creator-only review note',
            },
          ],
        },
      ],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when approval record schemas include prohibited fields', async () => {
  const assetsModule = await import('../api/assets.js');
  const assetPackage = approvalCapableAssetPackage({
    approval_record_schema: publicApprovalRecordSchema({
      required_fields: [
        'approval_id',
        'asset_package_id',
        'asset_package_sha256',
        'approved_by_role',
        'approved_at',
        'approved_scope',
        'source_file_hashes_verified',
        'generated_file_hashes_verified',
        'raw_prompts',
      ],
    }),
  });

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [
        {
          ...assetPackage,
          approval_records: [
            {
              approval_id: 'approval-1',
              asset_package_id: 'approval-bearing-package',
              asset_package_sha256: assetPackage.asset_package_sha256,
              approved_by_role: 'creator',
              approved_at: '2026-06-30T00:00:00.000Z',
              approved_scope: 'manual_social_publication',
              source_file_hashes_verified: true,
              generated_file_hashes_verified: true,
              raw_prompts: 'schema tried to make a private prompt public',
            },
          ],
        },
      ],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('fails closed when approval records omit required public fields', async () => {
  const assetsModule = await import('../api/assets.js');
  const assetPackage = approvalCapableAssetPackage();

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [
        {
          ...assetPackage,
          approval_records: [
            {
              approval_id: 'approval-1',
              asset_package_id: 'approval-bearing-package',
              asset_package_sha256: assetPackage.asset_package_sha256,
              approved_by_role: 'creator',
              approved_at: '2026-06-30T00:00:00.000Z',
              approved_scope: 'manual_social_publication',
              source_file_hashes_verified: true,
            },
          ],
        },
      ],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: {},
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.deepEqual(res.body, { success: false, error: 'Unable to load asset registry' });
});

test('returns public approval records that match the schema allowlist', async () => {
  const assetsModule = await import('../api/assets.js');
  const assetPackage = approvalCapableAssetPackage();

  const handler = assetsModule.createAssetsHandler({
    loadRegistry: async () => ({
      schema_version: '2026-06-06.public-asset-registry.v1',
      review_status: 'public_safe_draft',
      packages: [
        {
          ...assetPackage,
          approval_records: [
            {
              approval_id: 'approval-1',
              asset_package_id: 'approval-bearing-package',
              asset_package_sha256: assetPackage.asset_package_sha256,
              approved_by_role: 'creator',
              approved_at: '2026-06-30T00:00:00.000Z',
              approved_scope: 'manual_social_publication',
              source_file_hashes_verified: true,
              generated_file_hashes_verified: true,
            },
          ],
        },
      ],
    }),
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Tue, 30 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: { id: 'approval-bearing-package' },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.asset_package.approval_records.length, 1);
  assert.deepEqual(Object.keys(res.body.asset_package.approval_records[0]).sort(), [
    'approval_id',
    'approved_at',
    'approved_by_role',
    'approved_scope',
    'asset_package_id',
    'asset_package_sha256',
    'generated_file_hashes_verified',
    'source_file_hashes_verified',
  ]);
});

test('returns 429 when durable asset registry rate limit denies the request', async (t) => {
  const previousEnv = { ...process.env };
  const previousFetch = globalThis.fetch;

  t.after(() => {
    process.env = previousEnv;
    globalThis.fetch = previousFetch;
  });

  process.env.RATE_LIMIT_REST_URL = 'https://limits.example.test/check';
  process.env.RATE_LIMIT_REST_TOKEN = 'limit-token';
  process.env.RATE_LIMIT_SALT = 'test-salt';
  process.env.ASSETS_RATE_LIMIT_MAX = '11';
  process.env.ASSETS_RATE_LIMIT_WINDOW_SECONDS = '75';

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        allowed: false,
        retry_after: 75,
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  };

  let loaded = false;
  const handler = assetsApi.createAssetsHandler({
    loadRegistry: async () => {
      loaded = true;
      return { review_status: 'public_safe_draft', packages: [] };
    },
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Sat, 06 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    headers: {
      'x-forwarded-for': '203.0.113.42, 10.0.0.1',
    },
    query: { id: 'transmission-24-mirror-carousel' },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '75');
  assert.deepEqual(res.body, { success: false, error: 'Too many requests' });
  assert.equal(loaded, false);
  assert.equal(calls.length, 1);

  const limitBody = JSON.parse(calls[0].options.body);
  assert.equal(limitBody.route, '/api/assets');
  assert.equal(limitBody.limit, 11);
  assert.equal(limitBody.window_seconds, 75);
  assert.match(limitBody.key, /^sha256:/);
  assert.equal(calls[0].options.body.includes('transmission-24-mirror-carousel'), false);
  assert.equal(calls[0].options.body.includes('203.0.113.42'), false);
});

test('fails closed in production when asset registry rate limiting is not configured', async (t) => {
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
  const handler = assetsApi.createAssetsHandler({
    loadRegistry: async () => {
      loaded = true;
      return { review_status: 'public_safe_draft', packages: [] };
    },
    loadRegistryMetadata: async () => ({
      etag: '"sha256-a"',
      lastModified: 'Sat, 06 Jun 2026 00:00:00 GMT',
    }),
  });
  const req = {
    method: 'GET',
    query: { publication_status: 'prepared_not_posted' },
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['cache-control'], 'no-store');
  assert.equal(res.headers['retry-after'], '60');
  assert.deepEqual(res.body, { success: false, error: 'Request limit unavailable' });
  assert.equal(loaded, false);
});
