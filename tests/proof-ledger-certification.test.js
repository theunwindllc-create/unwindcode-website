import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function page(path) {
  return readFile(new URL(path, import.meta.url), 'utf8');
}

test('the raw ICP proof page labels both successful and failed reads without an attestation badge', async () => {
  const html = await page('../proof/ledger/index.html');
  const script = html.slice(html.indexOf('var ENDPOINT ='));

  assert.match(html, /raw HTTP response is not certificate-verified/i);
  assert.match(script, /reports recent · unverified/);
  assert.match(script, /reports stale · unverified/);
  assert.match(script, /cannot read report/);
  assert.doesNotMatch(script, /setPill\(pill,\s*['"](?:live|stale)['"]/);
  assert.doesNotMatch(script, /<span class="lg-pill (?:live|stale)">/);
});

test('the transmission widget and site entry points do not promote a raw read into proof', async () => {
  const [transmission, proof, home] = await Promise.all([
    page('../transmissions/35-the-ledger-learned-to-be-witnessed.html'),
    page('../proof/index.html'),
    page('../index.html'),
  ]);
  const widget = transmission.slice(transmission.indexOf("fetch('https://rt6ds-"));

  assert.match(transmission, /September 30, 2026 correction:/);
  assert.match(widget, /reports recent · unverified/);
  assert.match(widget, /reports stale · unverified/);
  assert.doesNotMatch(widget, /pill\.className\s*=\s*['"]w-pill ['"]\s*\+/);
  assert.match(proof, /not certificate-verified/);
  assert.match(home, /still needs certificate verification and history/);
});
