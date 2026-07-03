import { readFile } from 'node:fs/promises';
import { stat } from 'node:fs/promises';
import {
  buildClaimContext,
  claimQualificationsFromClaims,
  claimReferencesForTransmission,
  matchedClaimsForTransmission,
  unique,
} from './claim-context.js';
import { validateAssetRegistry } from '../assets.js';

const REGISTRY_URLS = {
  architecture: new URL('../../public/data/architecture.json', import.meta.url),
  assets: new URL('../../public/data/assets.json', import.meta.url),
  claims: new URL('../../public/data/claims.json', import.meta.url),
  organisms: new URL('../../public/data/organisms.json', import.meta.url),
  transmissions: new URL('../../public/data/transmissions.json', import.meta.url),
};

export const MAX_PUBLIC_SEARCH_RESULTS = 20;

const ALLOWED_TYPES = new Set(['architecture', 'asset', 'claim', 'organism', 'transmission']);
const FILTER_PATTERN = /^[a-z0-9_-]{1,80}$/;
const MEMORY_LAYER_PATTERN = /^(working|procedural|semantic|episodic)$/;
const MAX_QUERY_LENGTH = 160;
const TYPE_ORDER = ['claim', 'organism', 'architecture', 'transmission', 'asset'];
const PUBLIC_ASSET_PUBLICATION_STATUSES = new Set(['public', 'published']);
const PUBLIC_ASSET_REGISTRY_SOURCE_FILE = 'public/data/assets.json';
const INTERNAL_ASSET_SOURCE_FILE_PATTERNS = [
  /^social\//iu,
  /(?:^|\/)exports\//iu,
  /(?:^|\/)ready-to-upload(?:\/|$)/iu,
  /(?:^|\/)downloads\//iu,
  /(?:^|\/)caption(?:\.[a-z0-9_-]+)?$/iu,
  /(?:^|\/)carousel\.html$/iu,
];

async function readJson(url) {
  return JSON.parse(await readFile(url, 'utf8'));
}

function deepFreeze(value, seen = new WeakSet()) {
  if (!value || typeof value !== 'object' || seen.has(value)) {
    return value;
  }

  seen.add(value);

  for (const child of Object.values(value)) {
    deepFreeze(child, seen);
  }

  return Object.freeze(value);
}

async function registrySignature(registryUrls) {
  const parts = await Promise.all(
    Object.entries(registryUrls).map(async ([key, url]) => {
      const stats = await stat(url);
      return `${key}:${stats.size}:${stats.mtimeMs}`;
    }),
  );

  return parts.join('|');
}

async function readPublicRegistries(registryUrls) {
  const [architecture, assets, claims, organisms, transmissions] = await Promise.all([
    readJson(registryUrls.architecture),
    readJson(registryUrls.assets),
    readJson(registryUrls.claims),
    readJson(registryUrls.organisms),
    readJson(registryUrls.transmissions),
  ]);

  validateAssetRegistry(assets);

  return deepFreeze({ architecture, assets, claims, organisms, transmissions });
}

export function createPublicRegistriesLoader({ registryUrls = REGISTRY_URLS } = {}) {
  let cached = null;

  function clearPublicRegistriesCache() {
    cached = null;
  }

  async function loadPublicRegistries() {
    const signature = await registrySignature(registryUrls);

    if (cached?.signature === signature) {
      return cached.promise;
    }

    const promise = readPublicRegistries(registryUrls).catch((error) => {
      if (cached?.promise === promise) {
        clearPublicRegistriesCache();
      }
      throw error;
    });

    cached = { signature, promise };
    return promise;
  }

  return {
    clearPublicRegistriesCache,
    loadPublicRegistries,
  };
}

const defaultPublicRegistriesLoader = createPublicRegistriesLoader();

export function clearPublicRegistriesCache() {
  defaultPublicRegistriesLoader.clearPublicRegistriesCache();
}

export async function loadPublicRegistries() {
  return defaultPublicRegistriesLoader.loadPublicRegistries();
}

function getQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

export function readQueryValue(query, key) {
  return String(getQueryValue(query?.[key]) || '').trim();
}

function validateQuery(query) {
  if (!query) {
    return '';
  }

  if (query.length > MAX_QUERY_LENGTH || /[\u0000-\u001F\u007F]/u.test(query)) {
    return null;
  }

  return query;
}

export function parsePublicSearchParams(query, options = {}) {
  const invalidQueryError = options.invalidQueryError || 'Invalid search query';
  const missingInputError = options.missingInputError || 'Search query or filter required';
  const rawQuery = readQueryValue(query, 'q');
  const queryValue = validateQuery(rawQuery);
  const filters = {
    type: readQueryValue(query, 'type'),
    claim_status: readQueryValue(query, 'claim_status'),
    evidence_status: readQueryValue(query, 'evidence_status'),
    risk_level: readQueryValue(query, 'risk_level'),
    memory_layer: readQueryValue(query, 'memory_layer'),
  };

  if (queryValue === null) {
    return { ok: false, status: 400, error: invalidQueryError };
  }

  if (!queryValue && Object.values(filters).every((value) => !value)) {
    return { ok: false, status: 400, error: missingInputError };
  }

  if (filters.type && !ALLOWED_TYPES.has(filters.type)) {
    return { ok: false, status: 400, error: 'Invalid search type' };
  }

  for (const [key, value] of Object.entries(filters)) {
    if (key === 'memory_layer') {
      if (value && !MEMORY_LAYER_PATTERN.test(value)) {
        return { ok: false, status: 400, error: 'Invalid memory layer' };
      }
      continue;
    }

    if (key !== 'type' && value && !FILTER_PATTERN.test(value)) {
      return { ok: false, status: 400, error: `Invalid ${key.replace('_', ' ')}` };
    }
  }

  return {
    ok: true,
    query: queryValue,
    filters: Object.fromEntries(Object.entries(filters).filter(([, value]) => value)),
    tokens: tokenizeQuery(queryValue),
  };
}

function citationsFromRoutes(routes, sourceFiles) {
  return routes.map((route, index) => ({
    label: index === 0 ? 'Primary public source' : `Public source ${index + 1}`,
    route,
    source_file: sourceFiles[index] || sourceFiles[0],
  }));
}

function flattenSearchText(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenSearchText);
  }

  if (typeof value === 'object') {
    return [];
  }

  return [value];
}

function toSearchText(parts) {
  return flattenSearchText(parts).join(' ').toLowerCase();
}

function claimReferenceSearchParts(claimReferences = []) {
  return claimReferences.flatMap((reference) => [
    reference.claim_id,
    reference.claim_status,
    reference.evidence_status,
    reference.risk_level,
    reference.purpose,
  ]);
}

function claimReferenceSnippetCandidates(claimReferences = []) {
  return claimReferences.flatMap((reference) => [
    reference.purpose,
    reference.claim_id,
  ]).filter(Boolean);
}

function tokenizeQuery(query) {
  return query.toLowerCase().split(/\s+/u).filter(Boolean);
}

function claimReferenceMatches(entry, key, value) {
  if (!value) {
    return true;
  }

  if (entry[key] === value) {
    return true;
  }

  return (entry.claim_references || []).some((reference) => reference[key] === value);
}

function normalizeMemoryLayers(layers) {
  return unique((layers || []).filter((layer) => MEMORY_LAYER_PATTERN.test(layer)));
}

function buildMemoryContext(layers, source) {
  return {
    layers: [...layers],
    source,
    private_memory_excluded: true,
    runtime_memory_excluded: true,
  };
}

function normalizeArchitecture(concept) {
  const sourceRoutes = concept.source_routes || [];
  const memoryLayers = normalizeMemoryLayers(concept.memory_layers);
  const claimReferences = concept.claim_references || [];

  return {
    type: 'architecture',
    id: concept.id,
    title: concept.title,
    summary: concept.summary,
    route: sourceRoutes[0] || '/',
    source_files: concept.source_files || [],
    citations: concept.citations || citationsFromRoutes(sourceRoutes, concept.source_files || []),
    review_status: concept.review_status,
    confidence: concept.confidence,
    memory_layers: memoryLayers,
    memory_context: buildMemoryContext(memoryLayers, 'public_architecture_registry'),
    claim_references: claimReferences,
    snippet_candidates: claimReferenceSnippetCandidates(claimReferences),
    search_text: toSearchText([
      concept.id,
      concept.category,
      concept.title,
      concept.summary,
      concept.claims,
      concept.memory_layers,
      concept.safety_boundaries,
      claimReferenceSearchParts(claimReferences),
    ]),
  };
}

function normalizeAsset(assetPackage) {
  const approvalContext = buildAssetApprovalContext(assetPackage);
  const sourceFiles = publicAssetSearchSourceFiles(assetPackage);
  const citationSourceFiles = sourceFiles.length > 0
    ? sourceFiles
    : [PUBLIC_ASSET_REGISTRY_SOURCE_FILE];
  const routes = assetPackage.source_route ? [assetPackage.source_route] : [];
  const approvalRecords = Array.isArray(assetPackage.approval_records)
    ? assetPackage.approval_records
    : [];

  return {
    type: 'asset',
    id: assetPackage.id,
    title: assetPackage.title,
    summary: assetPackage.summary,
    alt_text: assetPackage.alt_text,
    route: assetPackage.source_route || '/',
    source_files: sourceFiles,
    citations: citationsFromRoutes(routes, citationSourceFiles),
    review_status: assetPackage.review_status,
    asset_package_sha256: assetPackage.asset_package_sha256,
    publication_status: assetPackage.publication_status,
    manual_approval_required: Boolean(assetPackage.manual_approval_required),
    approval_context: approvalContext,
    authority_boundary: assetPackage.authority_boundary,
    approval_record_schema_version: assetPackage.approval_record_schema?.schema_version,
    approval_record_count: approvalRecords.length,
    approval_record_available: approvalRecords.length > 0,
    public_safe: !approvalContext.requires_review,
    requires_human_review: approvalContext.requires_review,
    review_flags: approvalContext.review_flags,
    claim_references: assetPackage.claim_references || [],
    search_text: toSearchText([
      assetPackage.id,
      assetPackage.type,
      assetPackage.title,
      assetPackage.summary,
      assetPackage.alt_text,
      assetPackage.approval_gates,
      assetPackage.publication_status,
      assetPackage.review_status,
    ]),
  };
}

function publicAssetSearchSourceFiles(assetPackage) {
  const sourceFiles = assetPackage.source_files || assetPackage.provenance?.source_files || [];

  return sourceFiles.filter((sourceFile) => {
    const normalized = String(sourceFile || '');

    if (!normalized) {
      return false;
    }

    return !isInternalAssetSourceFile(normalized);
  });
}

function isInternalAssetSourceFile(sourceFile) {
  return INTERNAL_ASSET_SOURCE_FILE_PATTERNS.some((pattern) => pattern.test(sourceFile));
}

function buildAssetApprovalContext(assetPackage) {
  const reviewFlags = unique([
    assetPackage.manual_approval_required ? 'asset_manual_approval_required' : '',
    assetPackage.publication_status &&
    !PUBLIC_ASSET_PUBLICATION_STATUSES.has(assetPackage.publication_status)
      ? 'asset_publication_not_posted'
      : '',
    assetPackage.review_status && assetPackage.review_status !== 'public_safe'
      ? 'asset_review_not_public_safe'
      : '',
  ]);

  return {
    manual_approval_required: Boolean(assetPackage.manual_approval_required),
    publication_status: assetPackage.publication_status,
    review_status: assetPackage.review_status,
    review_flags: reviewFlags,
    requires_review: reviewFlags.length > 0,
  };
}

function normalizeClaim(claim) {
  const sourceRoutes = claim.source_routes || [];

  return {
    type: 'claim',
    id: claim.id,
    title: claim.public_label,
    summary: claim.text,
    route: sourceRoutes[0] || '/',
    source_files: claim.source_files || [],
    citations: claim.citations || citationsFromRoutes(sourceRoutes, claim.source_files || []),
    review_status: claim.review_status,
    claim_status: claim.claim_status,
    evidence_status: claim.evidence_status,
    risk_level: claim.risk_level,
    interpretation_boundary: claim.interpretation_boundary,
    claim_references: [],
    search_text: toSearchText([
      claim.id,
      claim.category,
      claim.text,
      claim.public_label,
      claim.claim_status,
      claim.evidence_status,
      claim.risk_level,
      claim.interpretation_boundary,
    ]),
  };
}

function normalizeOrganism(organism) {
  const routes = organism.site_routes || [];
  const memoryLayers = normalizeMemoryLayers(organism.memory_model);
  const claimReferences = organism.claim_references || [];

  return {
    type: 'organism',
    id: organism.id,
    title: organism.name,
    summary: organism.summary,
    route: routes[0] || '/',
    source_files: organism.source_files || [],
    citations: citationsFromRoutes(routes, organism.source_files || []),
    review_status: organism.review_status,
    memory_layers: memoryLayers,
    memory_context: buildMemoryContext(memoryLayers, 'public_organism_registry'),
    claim_references: claimReferences,
    snippet_candidates: claimReferenceSnippetCandidates(claimReferences),
    search_text: toSearchText([
      organism.id,
      organism.name,
      organism.status,
      organism.summary,
      organism.capabilities,
      organism.safety_boundaries,
      organism.memory_model,
      claimReferenceSearchParts(claimReferences),
    ]),
  };
}

function normalizeTransmission(transmission, claimsRegistry) {
  const matchedClaims = matchedClaimsForTransmission(transmission, claimsRegistry);
  const claimReferences = claimReferencesForTransmission(transmission, matchedClaims);
  const memoryLayers = normalizeMemoryLayers(transmission.memory_layers);

  return {
    type: 'transmission',
    id: transmission.id,
    title: transmission.title,
    summary: transmission.summary,
    route: transmission.route,
    source_files: [transmission.source_file],
    citations: transmission.citations || citationsFromRoutes([transmission.route], [transmission.source_file]),
    review_status: transmission.review_status,
    confidence: transmission.confidence,
    topic_tags: transmission.topic_tags || [],
    memory_layers: memoryLayers,
    memory_context: buildMemoryContext(memoryLayers, 'public_transmission_registry'),
    claim_references: claimReferences,
    claim_qualifications: claimQualificationsFromClaims(matchedClaims),
    claim_context: buildClaimContext(claimReferences, transmission.topic_tags || []),
    search_text: toSearchText([
      transmission.id,
      transmission.title,
      transmission.summary,
      transmission.topic_tags,
      transmission.memory_layers,
      claimReferenceSearchParts(claimReferences),
    ]),
  };
}

function buildSearchEntries(registries) {
  return [
    ...registries.architecture.concepts.map(normalizeArchitecture),
    ...registries.assets.packages.map(normalizeAsset),
    ...registries.claims.claims.map(normalizeClaim),
    ...registries.organisms.organisms.map(normalizeOrganism),
    ...registries.transmissions.transmissions.map((transmission) =>
      normalizeTransmission(transmission, registries.claims),
    ),
  ];
}

function stripSearchText(entry) {
  const { search_text: _searchText, snippet_candidates: _snippetCandidates, ...publicEntry } = entry;
  return publicEntry;
}

function matchesQuery(entry, tokens) {
  if (tokens.length === 0) {
    return true;
  }

  return tokens.every((token) => entry.search_text.includes(token));
}

function matchedTerms(entry, tokens) {
  return tokens.filter((token) => entry.search_text.includes(token));
}

function compactSnippet(text, tokens) {
  const normalized = String(text || '').replace(/\s+/gu, ' ').trim();

  if (normalized.length <= 220) {
    return normalized;
  }

  const lower = normalized.toLowerCase();
  const matchIndex = tokens
    .map((token) => lower.indexOf(token))
    .filter((index) => index >= 0)
    .sort((first, second) => first - second)[0];
  const start = Math.max(0, (matchIndex || 0) - 70);
  const end = Math.min(normalized.length, start + 214);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < normalized.length ? '...' : '';

  return `${prefix}${normalized.slice(start, end)}${suffix}`;
}

function buildSnippet(entry, tokens) {
  const candidates = [
    ...(entry.snippet_candidates || []),
    entry.summary,
    entry.title,
    entry.interpretation_boundary,
  ].filter(Boolean);
  const match = candidates.find((candidate) =>
    tokens.some((token) => String(candidate).toLowerCase().includes(token)),
  );

  return compactSnippet(match || candidates[0] || entry.id, tokens);
}

function scoreEntry(entry, tokens) {
  if (tokens.length === 0) {
    return 1;
  }

  return tokens.reduce((score, token) => {
    const inTitle = String(entry.title || '').toLowerCase().includes(token);
    const inSummary = String(entry.summary || '').toLowerCase().includes(token);
    const inId = String(entry.id || '').toLowerCase().includes(token);
    const inType = String(entry.type || '').toLowerCase().includes(token);
    const inSearch = entry.search_text.includes(token);

    return score + (inTitle ? 24 : 0) + (inSummary ? 12 : 0) + (inId ? 8 : 0) + (inType ? 4 : 0) + (inSearch ? 2 : 0);
  }, 0);
}

function buildSearchClaimContext(entry) {
  if (entry.type === 'claim') {
    return {
      referenced_claim_ids: [entry.id],
      claim_statuses: unique([entry.claim_status]),
      evidence_statuses: unique([entry.evidence_status]),
      risk_levels: unique([entry.risk_level]),
      requires_qualification:
        entry.risk_level === 'high' ||
        !['public_safe', 'source_backed'].includes(entry.claim_status) ||
        !['source_backed'].includes(entry.evidence_status),
      interpretation_boundary: entry.interpretation_boundary,
    };
  }

  if (entry.type === 'asset') {
    return {
      referenced_claim_ids: [],
      claim_statuses: [],
      evidence_statuses: [],
      risk_levels: [],
      sensitive_topic_tags: [],
      review_flags: entry.approval_context?.review_flags || [],
      requires_qualification: Boolean(entry.approval_context?.requires_review),
      approval_context: entry.approval_context,
    };
  }

  return entry.claim_context || buildClaimContext(entry.claim_references || [], entry.topic_tags || []);
}

function decorateResult(entry, tokens) {
  return {
    ...entry,
    match_score: scoreEntry(entry, tokens),
    matched_terms: matchedTerms(entry, tokens),
    snippet: buildSnippet(entry, tokens),
    answer_generation: 'disabled',
    snippet_policy: 'not_an_answer',
    retrieval_semantics: 'evidence_excerpt_requires_grounding',
    claim_context: buildSearchClaimContext(entry),
  };
}

function matchesFilters(entry, filters) {
  if (filters.type && entry.type !== filters.type) {
    return false;
  }

  if (!claimReferenceMatches(entry, 'claim_status', filters.claim_status)) {
    return false;
  }

  if (!claimReferenceMatches(entry, 'evidence_status', filters.evidence_status)) {
    return false;
  }

  if (!claimReferenceMatches(entry, 'risk_level', filters.risk_level)) {
    return false;
  }

  if (filters.memory_layer && !(entry.memory_layers || []).includes(filters.memory_layer)) {
    return false;
  }

  return true;
}

function sortResults(first, second) {
  const scoreDelta = second.match_score - first.match_score;

  if (scoreDelta !== 0) {
    return scoreDelta;
  }

  const typeDelta = TYPE_ORDER.indexOf(first.type) - TYPE_ORDER.indexOf(second.type);

  if (typeDelta !== 0) {
    return typeDelta;
  }

  return first.id.localeCompare(second.id);
}

export async function buildPublicSearchPayload({ query, filters, tokens, limit = MAX_PUBLIC_SEARCH_RESULTS }) {
  const registries = await loadPublicRegistries();
  const results = buildSearchEntries(registries)
    .filter((entry) => matchesQuery(entry, tokens))
    .filter((entry) => matchesFilters(entry, filters))
    .map((entry) => decorateResult(entry, tokens))
    .sort(sortResults)
    .slice(0, limit)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
    .map(stripSearchText);

  return {
    registries,
    payload: {
      query,
      filters,
      count: results.length,
      ranking: {
        mode: 'lexical_public_registry',
        max_results: limit,
        terms: tokens,
      },
      results,
    },
  };
}
