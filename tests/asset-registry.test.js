import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const ROOT = new URL('../', import.meta.url);
const REGISTRY_URL = new URL('../public/data/assets.json', import.meta.url);

async function loadRegistry() {
  try {
    return JSON.parse(await readFile(REGISTRY_URL, 'utf8'));
  } catch (error) {
    assert.fail(`asset registry should exist and parse as JSON: ${error.message}`);
  }
}

async function assertSourceFileExists(sourceFile) {
  assert.equal(sourceFile.startsWith('.'), false, `source file must not be hidden: ${sourceFile}`);
  assert.equal(sourceFile.includes('..'), false, `source file must not escape root: ${sourceFile}`);
  assert.equal(/(^|\/)(\.env|\.worktrees|dist|node_modules|DEPLOYMENTS)(\/|$)/.test(sourceFile), false);
  await access(new URL(sourceFile, ROOT));
}

async function sha256File(sourceFile) {
  const bytes = await readFile(new URL(sourceFile, ROOT));
  return {
    bytes,
    sha256: createHash('sha256').update(bytes).digest('hex'),
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

function canonicalAssetPackageDigest(assetPackage) {
  const canonicalPayload = {
    id: assetPackage.id,
    type: assetPackage.type,
    source_route: assetPackage.source_route,
    source_file_hashes: assetPackage.provenance.source_file_hashes,
    generated_files: assetPackage.provenance.generated_files,
    approval_record_schema_version: assetPackage.approval_record_schema.schema_version,
    authority_boundary: assetPackage.authority_boundary,
  };

  return createHash('sha256').update(stableStringify(canonicalPayload)).digest('hex');
}

test('asset registry records public-safe provenance for reviewed asset packages', async () => {
  const registry = await loadRegistry();

  assert.equal(registry.schema_version, '2026-06-06.public-asset-registry.v1');
  assert.equal(registry.review_status, 'public_safe_draft');
  assert.ok(registry.packages.length >= 2);

  const assetPackage = registry.packages.find(
    (candidate) => candidate.id === 'transmission-24-mirror-carousel',
  );
  assert.ok(assetPackage, 'Transmission 24 carousel should remain registered');
  assert.equal(assetPackage.id, 'transmission-24-mirror-carousel');
  assert.equal(assetPackage.type, 'social-carousel');
  assert.equal(assetPackage.review_status, 'creator_approval_required');
  assert.equal(assetPackage.publication_status, 'prepared_not_posted');
  assert.equal(assetPackage.manual_approval_required, true);
  assert.match(assetPackage.asset_package_sha256, /^[a-f0-9]{64}$/);
  assert.equal(
    assetPackage.asset_package_sha256,
    canonicalAssetPackageDigest(assetPackage),
    'asset package digest should bind source hashes, generated hashes, approval schema, and authority boundary',
  );
  assert.equal(
    typeof assetPackage.authority_boundary,
    'object',
    'asset packages should expose machine-readable authority boundaries',
  );
  assert.equal(assetPackage.authority_boundary.posting_authority, false);
  assert.equal(assetPackage.authority_boundary.wallet_authority, false);
  assert.equal(assetPackage.authority_boundary.paid_media_authority, false);
  assert.equal(assetPackage.authority_boundary.on_chain_attestation_authority, false);
  assert.equal(assetPackage.authority_boundary.approval_state, 'creator_approval_required');
  assert.ok(assetPackage.authority_boundary.allowed_uses.includes('manual_review'));
  assert.ok(assetPackage.authority_boundary.allowed_uses.includes('provenance_lookup'));
  assert.ok(
    assetPackage.authority_boundary.allowed_uses.includes('manual_social_post_after_creator_approval'),
  );
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('automated_public_posting'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('wallet_signing'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('paid_media_activation'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('on_chain_publication'));
  assert.equal(
    typeof assetPackage.approval_record_schema,
    'object',
    'asset packages should expose a public-safe approval record schema',
  );
  assert.equal(
    assetPackage.approval_record_schema.schema_version,
    '2026-06-06.public-asset-approval-record.v1',
  );
  assert.deepEqual(assetPackage.approval_record_schema.storage_boundary, {
    public_record_only: true,
    secrets_excluded: true,
    raw_prompts_excluded: true,
    private_notes_excluded: true,
    on_chain_sensitive_data_excluded: true,
  });
  assert.deepEqual(assetPackage.approval_record_schema.required_fields.sort(), [
    'approval_id',
    'approved_at',
    'approved_by_role',
    'approved_scope',
    'asset_package_id',
    'asset_package_sha256',
    'generated_file_hashes_verified',
    'source_file_hashes_verified',
  ]);
  assert.ok(
    assetPackage.approval_record_schema.allowed_approval_scopes.includes('manual_social_publication'),
  );
  assert.ok(
    assetPackage.approval_record_schema.prohibited_record_content.includes('private_approver_identity'),
  );
  assert.ok(assetPackage.approval_record_schema.prohibited_record_content.includes('raw_prompts'));
  assert.ok(assetPackage.approval_record_schema.prohibited_record_content.includes('wallet_secret_material'));
  assert.deepEqual(assetPackage.approval_records, []);
  assert.equal(assetPackage.source_route, '/transmissions/24-the-mirror-found-its-form.html');
  assert.ok(assetPackage.alt_text.length >= 80);
  assert.ok(assetPackage.provenance.source_files.length >= 3);
  assert.equal(
    Array.isArray(assetPackage.provenance.source_file_hashes),
    true,
    'asset source file hash provenance should be recorded',
  );
  assert.equal(
    assetPackage.provenance.source_file_hashes.length,
    assetPackage.provenance.source_files.length,
    'every asset source file should have byte and hash provenance',
  );
  assert.ok(assetPackage.provenance.generated_files.length >= 12);
  assert.ok(assetPackage.rights.usage_scope.includes('manual approval'));

  for (const sourceFile of assetPackage.provenance.source_files) {
    await assertSourceFileExists(sourceFile);
  }

  for (const sourceFileHash of assetPackage.provenance.source_file_hashes) {
    assert.ok(
      assetPackage.provenance.source_files.includes(sourceFileHash.path),
      `${sourceFileHash.path} should match a listed source file`,
    );
    assert.match(sourceFileHash.path, /^social\/transmission-24-mirror-carousel\/(README|caption|carousel)\.(md|html)$/);
    assert.match(sourceFileHash.sha256, /^[a-f0-9]{64}$/);
    assert.equal(Number.isInteger(sourceFileHash.bytes), true);
    assert.ok(sourceFileHash.bytes > 0);
    await assertSourceFileExists(sourceFileHash.path);

    const actual = await sha256File(sourceFileHash.path);
    assert.equal(sourceFileHash.bytes, actual.bytes.length, `${sourceFileHash.path} byte count must match`);
    assert.equal(sourceFileHash.sha256, actual.sha256, `${sourceFileHash.path} hash must match`);
  }

  for (const generatedFile of assetPackage.provenance.generated_files) {
    assert.match(generatedFile.path, /^social\/transmission-24-mirror-carousel\/exports\/slide-[0-9]{2}\.png$/);
    assert.match(generatedFile.sha256, /^[a-f0-9]{64}$/);
    assert.equal(Number.isInteger(generatedFile.bytes), true);
    assert.ok(generatedFile.bytes > 0);
    await assertSourceFileExists(generatedFile.path);

    const actual = await sha256File(generatedFile.path);
    assert.equal(generatedFile.bytes, actual.bytes.length, `${generatedFile.path} byte count must match`);
    assert.equal(generatedFile.sha256, actual.sha256, `${generatedFile.path} hash must match`);
  }
});

test('property sales intelligence carousel is registered as a prepared-only package', async () => {
  const registry = await loadRegistry();
  const assetPackage = registry.packages.find(
    (candidate) => candidate.id === 'transmission-26-property-sales-intelligence-cell-carousel',
  );

  assert.ok(assetPackage, 'Transmission 26 carousel should be registered');
  assert.equal(assetPackage.type, 'social-carousel');
  assert.equal(assetPackage.source_route, '/transmissions/26-property-sales-intelligence-cell.html');
  assert.equal(assetPackage.review_status, 'creator_approval_required');
  assert.equal(assetPackage.publication_status, 'prepared_not_posted');
  assert.equal(assetPackage.manual_approval_required, true);
  assert.equal(assetPackage.authority_boundary.posting_authority, false);
  assert.equal(assetPackage.authority_boundary.paid_media_authority, false);
  assert.equal(assetPackage.authority_boundary.outreach_authority, false);
  assert.equal(assetPackage.authority_boundary.lead_import_authority, false);
  assert.ok(assetPackage.authority_boundary.allowed_uses.includes('manual_review'));
  assert.ok(assetPackage.authority_boundary.allowed_uses.includes('manual_social_post_after_creator_approval'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('automated_public_posting'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('paid_media_activation'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('lead_scraping'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('outreach_activation'));
  assert.match(assetPackage.asset_package_sha256, /^[a-f0-9]{64}$/);
  assert.equal(
    assetPackage.asset_package_sha256,
    canonicalAssetPackageDigest(assetPackage),
    'asset package digest should bind Transmission 26 provenance and authority boundary',
  );
  assert.ok(assetPackage.alt_text.includes('consent'));
  assert.equal(assetPackage.provenance.source_files.length, 3);
  assert.equal(assetPackage.provenance.source_file_hashes.length, 3);
  assert.ok(assetPackage.provenance.generated_files.length >= 8);

  for (const sourceFileHash of assetPackage.provenance.source_file_hashes) {
    assert.match(sourceFileHash.path, /^social\/transmission-26-property-sales-intelligence-cell-carousel\/(README|caption|carousel)\.(md|html)$/);
    const actual = await sha256File(sourceFileHash.path);
    assert.equal(sourceFileHash.bytes, actual.bytes.length, `${sourceFileHash.path} byte count must match`);
    assert.equal(sourceFileHash.sha256, actual.sha256, `${sourceFileHash.path} hash must match`);
  }

  for (const generatedFile of assetPackage.provenance.generated_files) {
    assert.match(generatedFile.path, /^social\/transmission-26-property-sales-intelligence-cell-carousel\/exports\/slide-[0-9]{2}\.png$/);
    const actual = await sha256File(generatedFile.path);
    assert.equal(generatedFile.bytes, actual.bytes.length, `${generatedFile.path} byte count must match`);
    assert.equal(generatedFile.sha256, actual.sha256, `${generatedFile.path} hash must match`);
  }
});

test('agent-readable organism carousel is registered as a prepared-only package', async () => {
  const registry = await loadRegistry();
  const assetPackage = registry.packages.find(
    (candidate) => candidate.id === 'transmission-29-agent-readable-organism-carousel',
  );

  assert.ok(assetPackage, 'Transmission 29 carousel should be registered');
  assert.equal(assetPackage.type, 'social-carousel');
  assert.equal(assetPackage.source_route, '/transmissions/29-the-agent-readable-organism.html');
  assert.equal(assetPackage.review_status, 'creator_approval_required');
  assert.equal(assetPackage.publication_status, 'prepared_not_posted');
  assert.equal(assetPackage.manual_approval_required, true);
  assert.equal(assetPackage.authority_boundary.posting_authority, false);
  assert.equal(assetPackage.authority_boundary.deployment_authority, false);
  assert.equal(assetPackage.authority_boundary.answer_generation_authority, false);
  assert.equal(assetPackage.authority_boundary.memory_mutation_authority, false);
  assert.equal(assetPackage.authority_boundary.file_mutation_authority, false);
  assert.equal(assetPackage.authority_boundary.outreach_authority, false);
  assert.ok(assetPackage.authority_boundary.allowed_uses.includes('manual_review'));
  assert.ok(assetPackage.authority_boundary.allowed_uses.includes('manual_social_post_after_creator_approval'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('automated_public_posting'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('unreviewed_deployment'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('unreviewed_memory_mutation'));
  assert.ok(assetPackage.authority_boundary.prohibited_uses.includes('unreviewed_file_mutation'));
  assert.match(assetPackage.asset_package_sha256, /^[a-f0-9]{64}$/);
  assert.equal(
    assetPackage.asset_package_sha256,
    canonicalAssetPackageDigest(assetPackage),
    'asset package digest should bind Transmission 29 provenance and authority boundary',
  );
  assert.ok(assetPackage.alt_text.includes('Agent Readiness Cell'));
  assert.equal(assetPackage.provenance.source_files.length, 3);
  assert.equal(assetPackage.provenance.source_file_hashes.length, 3);
  assert.equal(assetPackage.provenance.generated_files.length, 6);

  for (const sourceFileHash of assetPackage.provenance.source_file_hashes) {
    assert.match(sourceFileHash.path, /^social\/transmission-29-agent-readable-organism-carousel\/(README|caption|carousel)\.(md|html)$/);
    const actual = await sha256File(sourceFileHash.path);
    assert.equal(sourceFileHash.bytes, actual.bytes.length, `${sourceFileHash.path} byte count must match`);
    assert.equal(sourceFileHash.sha256, actual.sha256, `${sourceFileHash.path} hash must match`);
  }

  for (const generatedFile of assetPackage.provenance.generated_files) {
    assert.match(generatedFile.path, /^social\/transmission-29-agent-readable-organism-carousel\/exports\/slide-[0-9]{2}\.png$/);
    const actual = await sha256File(generatedFile.path);
    assert.equal(generatedFile.bytes, actual.bytes.length, `${generatedFile.path} byte count must match`);
    assert.equal(generatedFile.sha256, actual.sha256, `${generatedFile.path} hash must match`);
  }
});

test('asset registry does not expose secrets, drafts, or unreviewed posting authority', async () => {
  const raw = await readFile(REGISTRY_URL, 'utf8');

  assert.equal(/SUPABASE_SERVICE_ROLE_KEY|PRIVATE_KEY|BEGIN RSA PRIVATE KEY/i.test(raw), false);
  assert.equal(/\brnd_[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/\bsk-[A-Za-z0-9]+\b/.test(raw), false);
  assert.equal(/wallet_private_key|service-role|raw prompt|hidden repo/i.test(raw), false);
  assert.equal(raw.includes('.DS_Store'), false);
  assert.equal(raw.includes('auto-post'), false);
  assert.equal(raw.includes('posted_publicly'), false);
  assert.equal(raw.includes('25-the-homepage-learned-to-pulse'), false);
});
