import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const VERCEL_CONFIG_URL = new URL('../vercel.json', import.meta.url);

async function loadConfig() {
  return JSON.parse(await readFile(VERCEL_CONFIG_URL, 'utf8'));
}

function headerMap(headers) {
  return new Map(headers.map((header) => [header.key.toLowerCase(), header.value]));
}

test('global Vercel headers include low-risk browser security boundaries', async () => {
  const config = await loadConfig();
  const globalRule = config.headers.find((rule) => rule.source === '/(.*)');

  assert.ok(globalRule, 'global header rule should exist');

  const headers = headerMap(globalRule.headers);
  assert.equal(headers.get('x-content-type-options'), 'nosniff');
  assert.equal(headers.get('x-frame-options'), 'DENY');
  assert.equal(headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.equal(headers.get('strict-transport-security'), 'max-age=63072000; includeSubDomains; preload');

  const permissions = headers.get('permissions-policy') || '';
  assert.match(permissions, /camera=\(\)/);
  assert.match(permissions, /microphone=\(\)/);
  assert.match(permissions, /geolocation=\(\)/);
  assert.match(permissions, /payment=\(\)/);
});

test('asset cache rule remains immutable and scoped to built assets only', async () => {
  const config = await loadConfig();
  const assetRule = config.headers.find((rule) => rule.source === '/assets/(.*)');

  assert.ok(assetRule, 'built asset cache rule should exist');
  const headers = headerMap(assetRule.headers);
  assert.equal(headers.get('cache-control'), 'public, max-age=31536000, immutable');
});
