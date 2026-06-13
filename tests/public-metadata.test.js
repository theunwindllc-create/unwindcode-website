import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const CANONICAL_ORIGIN = 'https://www.unwindcode.ai';
const PROPERTY_SALES_ROUTE = '/transmissions/26-property-sales-intelligence-cell.html';
const LEGACY_PROPERTY_SALES_ROUTE = '/transmissions/26-the-property-sales-intelligence-cell.html';

async function activeRoutePaths() {
  const transmissionFiles = (await readdir(new URL('../transmissions/', import.meta.url)))
    .filter((file) => file.endsWith('.html') && file !== 'index.html')
    .sort();

  return [
    '/',
    '/transmissions/',
    ...transmissionFiles.map((file) => `/transmissions/${file}`),
  ];
}

function publicFile(path) {
  return readFile(new URL(`../public/${path}`, import.meta.url), 'utf8');
}

function extractHttpsUrls(source) {
  return [...source.matchAll(/https:\/\/www\.unwindcode\.ai\/[^\s<)"']*/g)].map((match) => match[0]);
}

test('public sitemap lists only active source routes', async () => {
  const sitemap = await publicFile('sitemap.xml');
  const expectedUrls = (await activeRoutePaths()).map((path) => `${CANONICAL_ORIGIN}${path}`);
  const actualUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  assert.deepEqual(actualUrls, expectedUrls);
  assert.equal(actualUrls.some((url) => url.includes('25-the-homepage-learned-to-pulse')), false);
  assert.equal(actualUrls.some((url) => url.includes('/organisms/')), false);
  assert.equal(actualUrls.some((url) => url.includes('/architecture/')), false);
  assert.equal(actualUrls.some((url) => url.includes('/proof/')), false);
});

test('robots file exposes sitemap and keeps crawlers on public routes', async () => {
  const robots = await publicFile('robots.txt');

  assert.match(robots, /^User-agent: \*/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Disallow: \/api\/$/m);
  assert.match(robots, new RegExp(`^Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml$`, 'm'));
});

test('llms file is public-safe and anchored to live routes', async () => {
  const llms = await publicFile('llms.txt');
  const allowedUrls = new Set((await activeRoutePaths()).map((path) => `${CANONICAL_ORIGIN}${path}`));

  assert.match(llms, /UnwindCode\.ai/);
  assert.match(llms, /Public RAG Seed Routes/);
  assert.match(llms, /human approval/i);
  assert.match(llms, /Web3/i);

  for (const url of extractHttpsUrls(llms)) {
    assert.ok(allowedUrls.has(url), `unexpected inactive URL in llms.txt: ${url}`);
  }

  assert.equal(llms.includes('25-the-homepage-learned-to-pulse'), false);
  assert.equal(llms.includes('/organisms/'), false);
  assert.equal(llms.includes('/architecture/'), false);
  assert.equal(llms.includes('/proof/'), false);
  assert.equal(/SUPABASE_SERVICE_ROLE_KEY|PRIVATE_KEY|BEGIN RSA PRIVATE KEY/i.test(llms), false);
});

test('property sales intelligence public metadata follows the live canonical route', async () => {
  const sitemap = await publicFile('sitemap.xml');
  const llms = await publicFile('llms.txt');
  const publicMetadata = `${sitemap}\n${llms}`;

  assert.match(publicMetadata, new RegExp(`${CANONICAL_ORIGIN}${PROPERTY_SALES_ROUTE}`));
  assert.equal(publicMetadata.includes(`${CANONICAL_ORIGIN}/social/`), false);
  assert.equal(publicMetadata.includes(`${CANONICAL_ORIGIN}${LEGACY_PROPERTY_SALES_ROUTE}`), false);
});
