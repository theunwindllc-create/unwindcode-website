// Recompute asset-package provenance after registered source or generated
// files change: refresh file sha256 entries, the canonical package digest,
// and the digest reference inside each approval record.
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalAssetPackageDigest } from '../api/assets.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY = path.join(ROOT, 'public/data/assets.json');

async function sha256File(relativePath) {
  const bytes = await readFile(path.join(ROOT, relativePath));
  return createHash('sha256').update(bytes).digest('hex');
}

const registry = JSON.parse(await readFile(REGISTRY, 'utf8'));
let touched = 0;

for (const pkg of registry.packages) {
  let fileHashChanged = false;
  for (const listName of ['source_file_hashes', 'generated_files']) {
    for (const entry of pkg.provenance?.[listName] ?? []) {
      const actual = await sha256File(entry.path);
      if (entry.sha256 !== actual) {
        entry.sha256 = actual;
        fileHashChanged = true;
      }
    }
  }

  const digest = canonicalAssetPackageDigest(pkg);
  if (pkg.asset_package_sha256 !== digest || fileHashChanged) {
    pkg.asset_package_sha256 = digest;
    for (const record of pkg.approval_records ?? []) {
      record.asset_package_sha256 = digest;
    }
    touched += 1;
    process.stdout.write(`rehashed ${pkg.id}\n`);
  }
}

await writeFile(REGISTRY, `${JSON.stringify(registry, null, 2)}\n`);
process.stdout.write(`${touched} package(s) updated\n`);
