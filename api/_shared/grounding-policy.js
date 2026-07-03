export const GROUNDING_SOURCE_LIMIT = 5;

export const REFUSAL_RULES = [
  'do_not_generate_uncited_answers',
  'do_not_claim_wallet_authority',
  'do_not_infer_current_deployment',
  'do_not_expand_future_vision_into_current_capability',
  'do_not_use_private_or_runtime_evidence',
];

export const REQUIRED_BEFORE_SYNTHESIS = [
  'render_citations',
  'render_claim_qualifications',
  'enforce_refusal_rules',
  'review_answer_endpoint_behavior',
];

function citationKey(citation) {
  return [citation.route, citation.source_file || '', citation.label || ''].join('|');
}

function buildCitations(results) {
  const citationMap = new Map();

  for (const result of results) {
    for (const citation of result.citations || []) {
      const key = citationKey(citation);
      if (!citationMap.has(key)) {
        citationMap.set(key, {
          index: citationMap.size + 1,
          label: citation.label,
          route: citation.route,
          source_file: citation.source_file,
        });
      }
    }
  }

  return [...citationMap.values()];
}

function citationIndexes(result, citations) {
  const indexByKey = new Map(citations.map((citation) => [citationKey(citation), citation.index]));

  return (result.citations || [])
    .map((citation) => indexByKey.get(citationKey(citation)))
    .filter(Boolean);
}

function sourceTypeForCitation(citation) {
  const sourceFile = citation.source_file || '';

  if (sourceFile.startsWith('public/data/assets')) {
    return 'asset';
  }

  if (sourceFile.startsWith('public/data/architecture')) {
    return 'architecture';
  }

  if (sourceFile.startsWith('public/data/claims')) {
    return 'claim';
  }

  if (sourceFile.startsWith('public/data/organisms')) {
    return 'organism';
  }

  if (sourceFile.startsWith('public/data/transmissions') || sourceFile.startsWith('transmissions/')) {
    return 'transmission';
  }

  return 'public_source';
}

function buildCitationDisplay(citations) {
  return {
    mode: 'numbered_public_citations',
    answer_generation: 'disabled',
    instructions: [
      'render_citations_before_answer',
      'render_claim_qualifications_near_citations',
      'do_not_treat_citations_as_execution_authority',
      'do_not_infer_current_deployment_from_public_citations',
    ],
    items: citations.map((citation) => ({
      citation_index: citation.index,
      label: citation.label,
      route: citation.route,
      source_file: citation.source_file,
      source_type: sourceTypeForCitation(citation),
      display_text: `[${citation.index}] ${citation.label} - ${citation.route}`,
      render_required: true,
      public_safe: true,
      answer_safe: false,
      private_data_excluded: true,
    })),
  };
}

function buildClaimMap(claimsRegistry) {
  return new Map(claimsRegistry.claims.map((claim) => [claim.id, claim]));
}

function isQualificationRequired(claim) {
  return (
    claim.risk_level === 'high' ||
    ['needs_context', 'safety_qualified', 'future_vision'].includes(claim.claim_status) ||
    claim.evidence_status !== 'source_backed'
  );
}

function buildRequiredQualifications(results, claimsRegistry) {
  const claimMap = buildClaimMap(claimsRegistry);
  const claimIds = [
    ...new Set(
      results.flatMap((result) => result.claim_context?.referenced_claim_ids || []),
    ),
  ];

  return claimIds
    .map((claimId) => claimMap.get(claimId))
    .filter(Boolean)
    .filter(isQualificationRequired)
    .map((claim) => ({
      claim_id: claim.id,
      claim_status: claim.claim_status,
      evidence_status: claim.evidence_status,
      risk_level: claim.risk_level,
      interpretation_boundary: claim.interpretation_boundary,
      citations: claim.citations,
    }));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildReviewFlags({ results, requiredQualifications, citations }) {
  return unique([
    citations.length === 0 ? 'missing_citations' : '',
    results.some((result) => result.public_safe === false || result.review_status !== 'public_safe')
      ? 'non_public_safe_source'
      : '',
    ...requiredQualifications.flatMap((qualification) => [
      qualification.risk_level === 'high' ? 'high_risk_claim' : '',
      qualification.claim_status === 'needs_context' ? 'claim_needs_context' : '',
      qualification.claim_status === 'safety_qualified' ? 'claim_safety_qualified' : '',
      qualification.claim_status === 'future_vision' ? 'future_vision_claim' : '',
      qualification.evidence_status !== 'source_backed' ? 'evidence_not_source_backed' : '',
    ]),
    ...results.flatMap((result) => result.claim_context?.review_flags || []),
  ]);
}

function buildAnswerPolicy({ reviewFlags, requiredQualifications, citations, extraBlockedReasons = [] }) {
  const blockedReasons = unique([
    'policy_requires_answer_endpoint_review',
    citations.length === 0 ? 'missing_citations' : '',
    reviewFlags.includes('high_risk_claim') ? 'high_risk_claim_requires_review' : '',
    reviewFlags.includes('claim_needs_context') ? 'claim_context_required' : '',
    reviewFlags.includes('claim_safety_qualified') ? 'safety_qualification_required' : '',
    reviewFlags.includes('future_vision_claim') ? 'future_vision_label_required' : '',
    reviewFlags.includes('non_public_safe_source') ? 'non_public_safe_source' : '',
    reviewFlags.includes('sensitive_topic_requires_grounding') ? 'sensitive_topic_requires_grounding' : '',
    reviewFlags.includes('asset_manual_approval_required') ? 'asset_manual_approval_required' : '',
    reviewFlags.includes('asset_publication_not_posted') ? 'asset_publication_not_posted' : '',
    reviewFlags.includes('asset_review_not_public_safe') ? 'asset_review_not_public_safe' : '',
    requiredQualifications.length > 0 ? 'claim_qualifications_required' : '',
    ...extraBlockedReasons,
  ]);

  return {
    synthesis_allowed: false,
    decision: blockedReasons.some((reason) => reason !== 'policy_requires_answer_endpoint_review')
      ? 'review_required_before_synthesis'
      : 'answer_endpoint_not_enabled',
    blocked_reasons: blockedReasons,
    required_before_synthesis: REQUIRED_BEFORE_SYNTHESIS,
  };
}

function buildSources(results, citations) {
  return results.map((result) => {
    const indexes = citationIndexes(result, citations);
    const publicSafe = result.review_status === 'public_safe';
    const claimQualificationReviewRequired = Boolean(result.claim_context?.requires_qualification);

    return {
      rank: result.rank,
      id: result.id,
      type: result.type,
      title: result.title,
      route: result.route,
      alt_text: result.alt_text,
      snippet: result.snippet,
      match_score: result.match_score,
      matched_terms: result.matched_terms,
      review_status: result.review_status,
      asset_package_sha256: result.asset_package_sha256,
      publication_status: result.publication_status,
      manual_approval_required: result.manual_approval_required,
      approval_context: result.approval_context,
      approval_record_count: result.approval_record_count,
      approval_record_available: result.approval_record_available,
      authority_boundary: result.authority_boundary,
      memory_layers: result.memory_layers ? [...result.memory_layers] : undefined,
      memory_context: result.memory_context
        ? {
            ...result.memory_context,
            layers: [...result.memory_context.layers],
          }
        : undefined,
      claim_context: result.claim_context,
      citation_indexes: indexes,
      citation_display_refs: indexes.map((index) => `[${index}]`),
      public_safe: publicSafe,
      answer_generation: 'disabled',
      source_policy: 'grounding_source_not_an_answer',
      retrieval_semantics: 'citation_source_requires_answer_policy_review',
      answer_safety: {
        synthesis_allowed: false,
        citation_required: true,
        claim_qualification_review_required: claimQualificationReviewRequired,
        public_metadata_safe: publicSafe,
        answer_safe: false,
        human_review_required:
          !publicSafe ||
          Boolean(result.requires_human_review) ||
          claimQualificationReviewRequired,
      },
    };
  });
}

function attachPacketAnswerSafety(sources, answerPolicy) {
  const packetReviewRequired = answerPolicy.decision === 'review_required_before_synthesis';

  return sources.map((source) => ({
    ...source,
    answer_safety: {
      ...source.answer_safety,
      packet_review_required: packetReviewRequired,
      packet_answer_policy_decision: answerPolicy.decision,
      human_review_required: source.answer_safety.human_review_required || packetReviewRequired,
    },
  }));
}

function baseBoundaries(extraBoundaries = {}) {
  return {
    public_registries_only: true,
    secrets_excluded: true,
    private_prompts_excluded: true,
    runtime_evidence_excluded: true,
    answer_synthesis_excluded: true,
    write_methods_rejected: true,
    ...extraBoundaries,
  };
}

export function buildGroundingPacket({
  results,
  registries,
  extraBoundaries = {},
  extraBlockedReasons = [],
}) {
  const citations = buildCitations(results);
  const citationDisplay = buildCitationDisplay(citations);
  const requiredQualifications = buildRequiredQualifications(results, registries.claims);
  const baseSources = buildSources(results, citations);
  const reviewFlags = buildReviewFlags({
    results: baseSources,
    requiredQualifications,
    citations,
  });
  const answerPolicy = buildAnswerPolicy({
    reviewFlags,
    requiredQualifications,
    citations,
    extraBlockedReasons,
  });
  const sources = attachPacketAnswerSafety(baseSources, answerPolicy);

  return {
    schema_version: '2026-06-06.public-grounding-packet.v1',
    mode: 'public_registry_grounding',
    answer_generation: 'disabled',
    answer_policy: answerPolicy,
    review_flags: reviewFlags,
    sources,
    citations,
    citation_display: citationDisplay,
    required_qualifications: requiredQualifications,
    refusal_rules: REFUSAL_RULES,
    requires_human_review: answerPolicy.decision === 'review_required_before_synthesis',
    boundaries: baseBoundaries(extraBoundaries),
  };
}

export function buildUngroundedRiskPacket({ reviewFlags, blockedReasons, extraBoundaries = {} }) {
  const citations = [];
  const citationDisplay = buildCitationDisplay(citations);
  const requiredQualifications = [];

  return {
    schema_version: '2026-06-06.public-grounding-packet.v1',
    mode: 'public_registry_grounding',
    answer_generation: 'disabled',
    answer_policy: buildAnswerPolicy({
      reviewFlags,
      requiredQualifications,
      citations,
      extraBlockedReasons: blockedReasons,
    }),
    review_flags: unique(reviewFlags),
    sources: [],
    citations,
    citation_display: citationDisplay,
    required_qualifications: requiredQualifications,
    refusal_rules: REFUSAL_RULES,
    requires_human_review: true,
    boundaries: baseBoundaries(extraBoundaries),
  };
}
