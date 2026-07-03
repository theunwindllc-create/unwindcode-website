import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

import {
  clearPublicRegistriesCache,
  createPublicRegistriesLoader,
  loadPublicRegistries,
} from '../api/_shared/public-search.js';

test('memoizes public registry loads within the same process', async (t) => {
  assert.equal(typeof clearPublicRegistriesCache, 'function');

  t.after(() => {
    clearPublicRegistriesCache();
  });

  clearPublicRegistriesCache();

  const first = await loadPublicRegistries();
  const second = await loadPublicRegistries();

  assert.strictEqual(second, first);
  assert.ok(first.claims.claims.length >= 1);
  assert.ok(first.transmissions.transmissions.length >= 1);
});

test('freezes memoized public registries so callers cannot mutate shared retrieval state', async (t) => {
  t.after(() => {
    clearPublicRegistriesCache();
  });

  clearPublicRegistriesCache();

  const registries = await loadPublicRegistries();

  assert.equal(Object.isFrozen(registries), true);
  assert.equal(Object.isFrozen(registries.claims), true);
  assert.equal(Object.isFrozen(registries.claims.claims), true);
  assert.equal(Object.isFrozen(registries.claims.claims[0]), true);
  assert.throws(() => {
    registries.claims.claims.push({ id: 'mutated-claim' });
  }, TypeError);
});

test('reloads memoized registries when public JSON file signatures change', async () => {
  assert.equal(typeof createPublicRegistriesLoader, 'function');

  const dir = await mkdtemp(join(tmpdir(), 'unwind-public-registries-'));
  const files = {
    architecture: join(dir, 'architecture.json'),
    assets: join(dir, 'assets.json'),
    claims: join(dir, 'claims.json'),
    organisms: join(dir, 'organisms.json'),
    transmissions: join(dir, 'transmissions.json'),
  };
  const registryUrls = Object.fromEntries(
    Object.entries(files).map(([key, file]) => [key, pathToFileURL(file)]),
  );

  await Promise.all([
    writeFile(files.architecture, JSON.stringify({ version: 1, concepts: [] })),
    writeFile(
      files.assets,
      JSON.stringify({
        schema_version: '2026-06-06.public-asset-registry.v1',
        review_status: 'public_safe_draft',
        packages: [],
      }),
    ),
    writeFile(files.claims, JSON.stringify({ version: 1, claims: [] })),
    writeFile(files.organisms, JSON.stringify({ version: 1, organisms: [] })),
    writeFile(files.transmissions, JSON.stringify({ version: 1, transmissions: [] })),
  ]);

  const loader = createPublicRegistriesLoader({ registryUrls });
  const first = await loader.loadPublicRegistries();
  const second = await loader.loadPublicRegistries();

  assert.strictEqual(second, first);
  assert.equal(first.claims.version, 1);

  await writeFile(files.claims, JSON.stringify({ version: 2, claims: [] }));

  const third = await loader.loadPublicRegistries();

  assert.notStrictEqual(third, first);
  assert.equal(third.claims.version, 2);
});
