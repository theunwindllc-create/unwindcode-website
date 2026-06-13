import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('homepage signup posts to the same-origin subscribe API first', async () => {
  const source = await readFile(new URL('../main.js', import.meta.url), 'utf8');

  assert.match(source, /fetch\('\/api\/subscribe'/);
  assert.equal(source.includes('/functions/v1/subscribe'), false);
});

test('homepage signup does not ship direct provider fallback coordinates', async () => {
  const source = await readFile(new URL('../main.js', import.meta.url), 'utf8');

  assert.equal(source.includes('supabase.co'), false);
  assert.equal(source.includes('/functions/v1/subscribe'), false);
  assert.equal(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/.test(source), false);
  assert.equal(/SUPABASE_ANON|SUPABASE_URL|VITE_SUPABASE/i.test(source), false);
});
