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
const APPROVAL_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,119}$/;
const APPROVAL_ROLE_PATTERN = /^[a-z0-9][a-z0-9_-]{0,79}$/;
const PUBLIC_APPROVAL_RECORD_SCHEMA_VERSION = '2026-06-06.public-asset-approval-record.v1';
const PUBLIC_APPROVAL_RECORD_FIELDS = [
  'approval_id',
  'asset_package_id',
  'asset_package_sha256',
  'approved_by_role',
  'approved_at',
  'approved_scope',
  'source_file_hashes_verified',
  'generated_file_hashes_verified',
];
const PUBLIC_APPROVAL_RECORD_FIELD_SET = new Set(PUBLIC_APPROVAL_RECORD_FIELDS);
const PUBLIC_APPROVAL_STORAGE_BOUNDARY = {
  public_record_only: true,
  secrets_excluded: true,
  raw_prompts_excluded: true,
  private_notes_excluded: true,
  on_chain_sensitive_data_excluded: true,
};
const PUBLIC_APPROVAL_SCOPES = new Set([
  'manual_social_publication',
  'site_asset_publication',
  'provenance_attestation',
]);
const REQUIRED_DENIED_AUTHORITY_FIELDS = [
  'posting_authority',
  'wallet_authority',
  'paid_media_authority',
  'on_chain_attestation_authority',
];
const OPTIONAL_DENIED_AUTHORITY_FIELDS = [
  'deployment_authority',
  'answer_generation_authority',
  'memory_mutation_authority',
  'file_mutation_authority',
  'outreach_authority',
  'lead_import_authority',
  'external_sync_authority',
];
const PUBLIC_ALLOWED_ASSET_USES = new Set([
  'manual_review',
  'provenance_lookup',
  'local_asset_inspection',
  'manual_social_post_after_creator_approval',
]);
const PUBLIC_PROHIBITED_ASSET_USES = new Set([
  'automated_public_posting',
  'wallet_signing',
  'paid_media_activation',
  'on_chain_publication',
  'unreviewed_rag_answer_evidence',
  'lead_scraping',
  'outreach_activation',
  'provider_activation',
  'unreviewed_deployment',
  'unreviewed_memory_mutation',
  'unreviewed_file_mutation',
  'unreviewed_external_sync',
]);
const REQUIRED_PROHIBITED_ASSET_USES = [
  'automated_public_posting',
  'wallet_signing',
  'paid_media_activation',
  'on_chain_publication',
  'unreviewed_rag_answer_evidence',
];
const PUBLIC_ASSET_PUBLICATION_STATUSES = new Set(['public', 'published']);
const SUCCESS_CACHE_CONTROL = 'public, max-age=60, must-revalidate';
const ERROR_CACHE_CONTROL = 'no-store';
const DEFAULT_ASSETS_RATE_LIMIT = 60;
const DEFAULT_ASSETS_RATE_LIMIT_WINDOW_SECONDS = 60;
const ASSET_REGISTRY_SCHEMA_VERSION = '2026-06-06.public-asset-registry.v1';

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

function sendHeadError(res, status) {
  res.setHeader('Cache-Control', ERROR_CACHE_CONTROL);
  res.status(status);
  res.end();
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

function assertCanonicalString(value, message) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(message);
  }

  return value;
}

function requireCanonicalStringArray(value, message) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(message);
  }

  for (const entry of value) {
    if (typeof entry !== 'string' || entry.trim() === '') {
      throw new Error(message);
    }
  }

  return value;
}

function requireCanonicalObject(value, message) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(message);
  }

  return value;
}

function requireCanonicalBoolean(value, message) {
  if (typeof value !== 'boolean') {
    throw new Error(message);
  }

  return value;
}

function requireCanonicalHashEntries(assetPackage, fieldName) {
  const entries = assetPackage.provenance?.[fieldName];

  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error('Asset package hash provenance is required');
  }

  for (const entry of entries) {
    if (
      !entry ||
      typeof entry !== 'object' ||
      typeof entry.path !== 'string' ||
      entry.path.trim() === '' ||
      !SHA256_PATTERN.test(entry.sha256 || '') ||
      !Number.isInteger(entry.bytes) ||
      entry.bytes <= 0
    ) {
      throw new Error('Asset package hash provenance is invalid');
    }
  }

  return entries;
}

function sortedUniqueStrings(values, message) {
  const seen = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(message);
    }
    seen.add(value);
  }

  return [...seen].sort();
}

function requireMatchingPathSets(first, second, message) {
  const firstPaths = sortedUniqueStrings(first, message);
  const secondPaths = sortedUniqueStrings(second, message);

  if (stableStringify(firstPaths) !== stableStringify(secondPaths)) {
    throw new Error(message);
  }
}

function canonicalPayloadForAssetPackage(assetPackage) {
  if (!assetPackage || typeof assetPackage !== 'object') {
    throw new Error('Asset package is required');
  }

  const id = assertCanonicalString(assetPackage.id, 'Asset package id is required');
  if (!ASSET_ID_PATTERN.test(id)) {
    throw new Error('Invalid asset package id');
  }

  if (!assetPackage.provenance || typeof assetPackage.provenance !== 'object') {
    throw new Error('Asset package provenance is required');
  }

  if (!assetPackage.approval_record_schema || typeof assetPackage.approval_record_schema !== 'object') {
    throw new Error('Approval record schema is required');
  }

  const sourceFiles = requireCanonicalStringArray(
    assetPackage.source_files,
    'Asset package source files are required',
  );
  const provenanceSourceFiles = requireCanonicalStringArray(
    assetPackage.provenance.source_files,
    'Asset package provenance source files are required',
  );

  requireMatchingPathSets(sourceFiles, provenanceSourceFiles, 'Asset package source file lists must match');
  const sourceFileHashes = requireCanonicalHashEntries(assetPackage, 'source_file_hashes');
  requireMatchingPathSets(
    provenanceSourceFiles,
    sourceFileHashes.map((entry) => entry.path),
    'Asset package source hash coverage must match source files',
  );

  return {
    id,
    type: assertCanonicalString(assetPackage.type, 'Asset package type is required'),
    title: assertCanonicalString(assetPackage.title, 'Asset package title is required'),
    summary: assertCanonicalString(assetPackage.summary, 'Asset package summary is required'),
    source_route: assertCanonicalString(
      assetPackage.source_route,
      'Asset package source route is required',
    ),
    source_files: sourceFiles,
    alt_text: assertCanonicalString(assetPackage.alt_text, 'Asset package alt text is required'),
    provenance: {
      created_from: assertCanonicalString(
        assetPackage.provenance.created_from,
        'Asset package provenance creator is required',
      ),
      source_files: provenanceSourceFiles,
      source_file_hashes: sourceFileHashes,
      generated_files: requireCanonicalHashEntries(assetPackage, 'generated_files'),
    },
    rights: requireCanonicalObject(assetPackage.rights, 'Asset package rights are required'),
    approval_gates: requireCanonicalStringArray(
      assetPackage.approval_gates,
      'Asset package approval gates are required',
    ),
    authority_boundary: assetPackage.authority_boundary,
    approval_record_schema: assetPackage.approval_record_schema,
    review_status: assertCanonicalString(
      assetPackage.review_status,
      'Asset package review status is required',
    ),
    publication_status: assertCanonicalString(
      assetPackage.publication_status,
      'Asset package publication status is required',
    ),
    manual_approval_required: requireCanonicalBoolean(
      assetPackage.manual_approval_required,
      'Asset package manual approval flag is required',
    ),
    confidence: assertCanonicalString(assetPackage.confidence, 'Asset package confidence is required'),
  };
}

export function canonicalAssetPackageDigest(assetPackage) {
  const canonicalPayload = {
    ...canonicalPayloadForAssetPackage(assetPackage),
  };

  return createHash('sha256').update(stableStringify(canonicalPayload)).digest('hex');
}

export function validateAssetRegistry(registry) {
  if (!registry || typeof registry !== 'object') {
    throw new Error('Asset registry is required');
  }

  if (registry.schema_version !== ASSET_REGISTRY_SCHEMA_VERSION) {
    throw new Error('Invalid asset registry schema version');
  }

  if (!Array.isArray(registry.packages)) {
    throw new Error('Asset registry packages are required');
  }

  for (const assetPackage of registry.packages) {
    if (!SHA256_PATTERN.test(assetPackage.asset_package_sha256 || '')) {
      throw new Error('Invalid asset package digest');
    }

    validateAuthorityBoundary(assetPackage.authority_boundary);
    validateApprovalRecordSchema(assetPackage.approval_record_schema);

    if (assetPackage.asset_package_sha256 !== canonicalAssetPackageDigest(assetPackage)) {
      throw new Error('Asset package digest is not canonical');
    }

    if (!Array.isArray(assetPackage.approval_records)) {
      throw new Error('Approval records must be an array');
    }

    if (requiresApprovalRecord(assetPackage) && assetPackage.approval_records.length === 0) {
      throw new Error('Public asset package approval record is required');
    }

    for (const approvalRecord of assetPackage.approval_records) {
      validateApprovalRecord(assetPackage, approvalRecord);
    }
  }
}

function requiresApprovalRecord(assetPackage) {
  return (
    assetPackage.review_status === 'public_safe' ||
    PUBLIC_ASSET_PUBLICATION_STATUSES.has(assetPackage.publication_status) ||
    assetPackage.manual_approval_required === false
  );
}

function validateAuthorityBoundary(authorityBoundary) {
  if (!authorityBoundary || typeof authorityBoundary !== 'object') {
    throw new Error('Asset authority boundary is required');
  }

  for (const field of REQUIRED_DENIED_AUTHORITY_FIELDS) {
    if (authorityBoundary[field] !== false) {
      throw new Error('Asset authority boundary grants high-risk authority');
    }
  }

  for (const field of OPTIONAL_DENIED_AUTHORITY_FIELDS) {
    if (Object.hasOwn(authorityBoundary, field) && authorityBoundary[field] !== false) {
      throw new Error('Asset authority boundary grants high-risk authority');
    }
  }

  validateAuthorityUses(authorityBoundary);
}

function validateAuthorityUses(authorityBoundary) {
  const allowedUses = authorityBoundary.allowed_uses;
  const prohibitedUses = authorityBoundary.prohibited_uses;

  if (!Array.isArray(allowedUses) || allowedUses.length === 0) {
    throw new Error('Asset authority allowed uses are required');
  }

  if (!Array.isArray(prohibitedUses) || prohibitedUses.length === 0) {
    throw new Error('Asset authority prohibited uses are required');
  }

  const prohibitedUseSet = new Set(prohibitedUses);

  for (const allowedUse of allowedUses) {
    if (!PUBLIC_ALLOWED_ASSET_USES.has(allowedUse) || PUBLIC_PROHIBITED_ASSET_USES.has(allowedUse)) {
      throw new Error('Asset authority allowed uses grant prohibited authority');
    }
  }

  for (const prohibitedUse of prohibitedUses) {
    if (!PUBLIC_PROHIBITED_ASSET_USES.has(prohibitedUse)) {
      throw new Error('Asset authority prohibited uses include an unsupported value');
    }
  }

  for (const requiredProhibition of REQUIRED_PROHIBITED_ASSET_USES) {
    if (!prohibitedUseSet.has(requiredProhibition)) {
      throw new Error('Asset authority boundary is missing required prohibitions');
    }
  }

  if (allowedUses.some((allowedUse) => prohibitedUseSet.has(allowedUse))) {
    throw new Error('Asset authority uses conflict');
  }
}

function validateApprovalRecordSchema(schema) {
  if (!schema || typeof schema !== 'object') {
    throw new Error('Approval record schema is required');
  }

  if (schema.schema_version !== PUBLIC_APPROVAL_RECORD_SCHEMA_VERSION) {
    throw new Error('Invalid approval record schema version');
  }

  for (const [key, value] of Object.entries(PUBLIC_APPROVAL_STORAGE_BOUNDARY)) {
    if (schema.storage_boundary?.[key] !== value) {
      throw new Error('Invalid approval record storage boundary');
    }
  }

  if (!Array.isArray(schema.required_fields)) {
    throw new Error('Approval record schema required fields are required');
  }

  const requiredFields = new Set(schema.required_fields);
  if (
    requiredFields.size !== PUBLIC_APPROVAL_RECORD_FIELD_SET.size ||
    !PUBLIC_APPROVAL_RECORD_FIELDS.every((field) => requiredFields.has(field))
  ) {
    throw new Error('Approval record schema required fields must match public allowlist');
  }

  for (const field of schema.prohibited_record_content || []) {
    if (requiredFields.has(field)) {
      throw new Error('Approval record schema marks prohibited fields as public');
    }
  }

  if (
    !Array.isArray(schema.allowed_approval_scopes) ||
    schema.allowed_approval_scopes.some((scope) => !PUBLIC_APPROVAL_SCOPES.has(scope))
  ) {
    throw new Error('Approval record schema includes unsupported approval scopes');
  }

  return schema;
}

function validateApprovalRecord(assetPackage, approvalRecord) {
  const schema = validateApprovalRecordSchema(assetPackage.approval_record_schema);

  const recordFields = Object.keys(approvalRecord || {});

  for (const field of PUBLIC_APPROVAL_RECORD_FIELDS) {
    if (!Object.hasOwn(approvalRecord, field)) {
      throw new Error('Approval record is missing a required public field');
    }
  }

  for (const field of recordFields) {
    if (!PUBLIC_APPROVAL_RECORD_FIELD_SET.has(field)) {
      throw new Error('Approval record includes a non-public field');
    }
  }

  if (
    approvalRecord.asset_package_id !== assetPackage.id ||
    approvalRecord.asset_package_sha256 !== assetPackage.asset_package_sha256
  ) {
    throw new Error('Approval record does not match asset package digest');
  }

  if (!APPROVAL_ID_PATTERN.test(approvalRecord.approval_id || '')) {
    throw new Error('Invalid approval record id');
  }

  if (!APPROVAL_ROLE_PATTERN.test(approvalRecord.approved_by_role || '')) {
    throw new Error('Invalid approval record role');
  }

  if (
    typeof approvalRecord.approved_at !== 'string' ||
    Number.isNaN(Date.parse(approvalRecord.approved_at))
  ) {
    throw new Error('Invalid approval timestamp');
  }

  if (!schema.allowed_approval_scopes?.includes(approvalRecord.approved_scope)) {
    throw new Error('Approval scope is not allowed');
  }

  if (
    approvalRecord.source_file_hashes_verified !== true ||
    approvalRecord.generated_file_hashes_verified !== true
  ) {
    throw new Error('Approval record must verify package hashes');
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

      let requestedAssetPackage;
      if (id) {
        requestedAssetPackage = registry.packages.find((entry) => entry.id === id);
        if (!requestedAssetPackage) {
          if (req.method === 'HEAD') {
            sendHeadError(res, 404);
            return;
          }

          sendError(res, 404, { success: false, error: 'Asset package not found' });
          return;
        }
      }

      if (!id && !reviewStatus && !publicationStatus && requestValidatorsMatch(req, metadata)) {
        setSuccessCacheHeaders(res, metadata);
        res.status(304);
        res.end();
        return;
      }

      setSuccessCacheHeaders(res, metadata);

      if (req.method === 'HEAD') {
        res.status(200);
        res.end();
        return;
      }

      if (id) {
        sendJson(res, 200, { success: true, asset_package: requestedAssetPackage });
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
      if (req.method === 'HEAD') {
        sendHeadError(res, 500);
        return;
      }

      sendError(res, 500, {
        success: false,
        error: 'Unable to load asset registry',
      });
    }
  };
}

export default createAssetsHandler();
