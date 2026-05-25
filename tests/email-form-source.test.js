import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('homepage signup posts to the same-origin subscribe API first', async () => {
  const source = await readFile(new URL('../main.js', import.meta.url), 'utf8');

  assert.match(source, /fetch\('\/api\/subscribe'/);
  assert.ok(
    source.indexOf("fetch('/api/subscribe'") < source.indexOf('/functions/v1/subscribe'),
    'same-origin storage API should be attempted before the Supabase Edge Function fallback',
  );
});
