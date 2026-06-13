const SENSITIVE_TOPIC_TAGS = new Set(['approval-gates', 'financial-safety', 'web3-safety']);
const QUALIFICATION_CLAIM_STATUSES = new Set([
  'needs_context',
  'safety_qualified',
  'future_vision',
]);

export function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function claimMatchesTransmission(claim, transmission) {
  return (
    (claim.source_routes || []).includes(transmission.route) ||
    (claim.source_files || []).includes(transmission.source_file) ||
    (claim.citations || []).some(
      (citation) =>
        citation.route === transmission.route || citation.source_file === transmission.source_file,
    )
  );
}

function claimReferenceFromClaim(claim) {
  return {
    claim_id: claim.id,
    claim_status: claim.claim_status,
    evidence_status: claim.evidence_status,
    risk_level: claim.risk_level,
  };
}

export function matchedClaimsForTransmission(transmission, claimsRegistry) {
  return claimsRegistry.claims
    .filter((claim) => claimMatchesTransmission(claim, transmission))
    .sort((first, second) => first.id.localeCompare(second.id));
}

export function claimReferencesForTransmission(transmission, matchedClaims) {
  if (transmission.claim_references?.length) {
    return transmission.claim_references;
  }

  return matchedClaims.map(claimReferenceFromClaim);
}

function claimQualificationFromClaim(claim) {
  return {
    claim_id: claim.id,
    public_label: claim.public_label,
    claim_status: claim.claim_status,
    evidence_status: claim.evidence_status,
    risk_level: claim.risk_level,
    interpretation_boundary: claim.interpretation_boundary,
    citations: claim.citations || [],
  };
}

export function claimQualificationsFromClaims(claims) {
  return claims.map(claimQualificationFromClaim);
}

export function buildClaimContext(claimReferences = [], topicTags = []) {
  const claimStatuses = unique(claimReferences.map((reference) => reference.claim_status));
  const evidenceStatuses = unique(claimReferences.map((reference) => reference.evidence_status));
  const riskLevels = unique(claimReferences.map((reference) => reference.risk_level));
  const sensitiveTopicTags = topicTags.filter((tag) => SENSITIVE_TOPIC_TAGS.has(tag));
  const reviewFlags = sensitiveTopicTags.length > 0 ? ['sensitive_topic_requires_grounding'] : [];

  return {
    referenced_claim_ids: unique(claimReferences.map((reference) => reference.claim_id)),
    claim_statuses: claimStatuses,
    evidence_statuses: evidenceStatuses,
    risk_levels: riskLevels,
    sensitive_topic_tags: sensitiveTopicTags,
    review_flags: reviewFlags,
    requires_qualification:
      sensitiveTopicTags.length > 0 ||
      riskLevels.includes('high') ||
      claimStatuses.some((status) => QUALIFICATION_CLAIM_STATUSES.has(status)) ||
      evidenceStatuses.some((status) => status !== 'source_backed'),
  };
}

export function decorateTransmissionWithClaimContext(transmission, claimsRegistry) {
  const matchedClaims = matchedClaimsForTransmission(transmission, claimsRegistry);
  const claimReferences = claimReferencesForTransmission(transmission, matchedClaims);

  return {
    ...transmission,
    claim_references: claimReferences,
    claim_qualifications: claimQualificationsFromClaims(matchedClaims),
    claim_context: buildClaimContext(claimReferences, transmission.topic_tags || []),
  };
}
