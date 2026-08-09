import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROUTE = '/transmissions/33-the-organization-found-its-hands';
const PAGE_PATH = path.join(ROOT, 'transmissions/33-the-organization-found-its-hands.html');

async function read(relativePath) {
  return readFile(path.join(ROOT, relativePath), 'utf8');
}

async function collectPublicTextFiles() {
  const files = [
    'index.html',
    'sitemap.xml',
    'llms.txt',
    'ai-services.json',
    'transmissions/index.html',
  ];

  for (const entry of await readdir(path.join(ROOT, 'transmissions'))) {
    if (entry.endsWith('.html')) files.push(`transmissions/${entry}`);
  }

  async function walkPublic(directory, prefix = 'public') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      const relative = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) {
        await walkPublic(absolute, relative);
      } else if (/\.(?:html|json|txt|xml|md|js|css|svg)$/i.test(entry.name)) {
        files.push(relative);
      }
    }
  }

  await walkPublic(path.join(ROOT, 'public'));
  return [...new Set(files)].sort();
}

test('Transmission 33 exposes the clean route and complete article metadata', async () => {
  const [page, archive, homepage, sitemap, publicSitemap, llms, publicLlms] = await Promise.all([
    readFile(PAGE_PATH, 'utf8'),
    read('transmissions/index.html'),
    read('index.html'),
    read('sitemap.xml'),
    read('public/sitemap.xml'),
    read('llms.txt'),
    read('public/llms.txt'),
  ]);
  const canonical = `https://www.unwindcode.ai${ROUTE}`;

  assert.match(page, /<title>Transmission 33: The Organization Found Its Hands \| Unwind Code<\/title>/);
  assert.ok(page.includes(`<link rel="canonical" href="${canonical}" />`));
  assert.ok(page.includes(`<meta property="og:url" content="${canonical}" />`));
  assert.match(page, /"datePublished": "2026-08-09"/);
  assert.match(page, /"dateModified": "2026-08-09"/);
  assert.match(page, /"mainEntityOfPage": "https:\/\/www\.unwindcode\.ai\/transmissions\/33-the-organization-found-its-hands"/);
  assert.ok(archive.includes(`href="${ROUTE}"`));
  assert.ok(homepage.includes(`href="${ROUTE}"`));
  assert.ok(sitemap.includes(canonical));
  assert.ok(publicSitemap.includes(canonical));
  assert.ok(llms.includes(canonical));
  assert.ok(publicLlms.includes(canonical));
  assert.equal(page.includes(`${ROUTE}.html`), false);
});

test('Transmission 33 is a whitepaper-grade interactive Brain record', async () => {
  const page = await readFile(PAGE_PATH, 'utf8');

  for (const required of [
    '01 / Thesis + why now',
    '02 / Definitions',
    '03 / Theory',
    '04 / Organism pattern',
    '05 / Protocol',
    '06 / Threat model',
    '07 / Build recipe',
    '08 / Approval boundary',
    '09 / Proof ledger',
    '10 / Next-cell memory',
    'prompt-theater',
    '14 original department charters',
    '0 ran as agents',
    '3 of 14 became tool playbooks',
    'seven sister-department charters',
    '21 total charters carry I AM creeds',
    'Invicta',
    'Genesis',
    'a second, pre-public persona',
    'OpenClaw',
    'sessions_spawn',
    'PUBLICA',
    'SPAWN-OK',
    'Subagent announce give up (retry-limit)',
    'AGENT_AUDIT_2026-08-09.md',
    'SUBAGENT_PROTOCOL.md',
    'AGENT_SPIRIT.md',
    'CHARTER_AMENDMENTS.md',
    'GROWTH_LEDGER.md',
    'I sign nothing I have not tried to destroy',
    'Unlogged growth is not growth',
    'An agent that reads rules as tasks executes them; an agent that reads them as identity embodies them',
  ]) {
    assert.ok(page.includes(required), `Transmission 33 missing: ${required}`);
  }

  for (const interactiveId of [
    'hands-audit-console',
    'hands-identity-explorer',
    'hands-wait-law',
    'hands-threat-grid',
    'hands-proof-ledger',
  ]) {
    assert.ok(page.includes(`id="${interactiveId}"`), `Transmission 33 missing interactive ${interactiveId}`);
  }

  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.match(page, /aria-pressed=/);
  assert.match(page, /aria-expanded=/);
});

test('Transmission 33 keeps authority, infrastructure, and social assets bounded', async () => {
  const [page, archive, sitemap, publicSitemap, llms, publicLlms, services, publicServices, manifest] = await Promise.all([
    readFile(PAGE_PATH, 'utf8'),
    read('transmissions/index.html'),
    read('sitemap.xml'),
    read('public/sitemap.xml'),
    read('llms.txt'),
    read('public/llms.txt'),
    read('ai-services.json'),
    read('public/ai-services.json'),
    read('assets/asset-manifest.json'),
  ]);

  for (const forbidden of [
    /Railway/i,
    /Telegram/i,
    /project[ _-]?id/i,
    /auth(?:entication)? token/i,
    /credit balance/i,
    /Canonical Sheet V2/i,
  ]) {
    assert.equal(forbidden.test(page), false, `Transmission 33 leaked forbidden detail: ${forbidden}`);
  }

  assert.match(page, /children default to a cheaper model tier/i);
  assert.match(page, /expensive model is reserved for orchestration and gate verdicts/i);
  assert.match(page, /agents file proposals about their own charter; they never edit a charter themselves/i);
  assert.match(page, /identity-level changes require the human/i);
  assert.match(page, /Posting assets for this transmission were not commissioned/i);

  for (const publicSurface of [page, archive, sitemap, publicSitemap, llms, publicLlms, services, publicServices, manifest]) {
    assert.equal(/social\/transmission-33/i.test(publicSurface), false);
    assert.equal(/transmission[_-]33[_-]social/i.test(publicSurface), false);
  }
});

test('pre-public persona identity strings appear nowhere in public text surfaces', async () => {
  const forbiddenIdentitySpellings = ['V\u00edvida', 'Vivida'];

  for (const relativePath of await collectPublicTextFiles()) {
    const source = await read(relativePath);
    for (const forbidden of forbiddenIdentitySpellings) {
      assert.equal(source.toLocaleLowerCase('en-US').includes(forbidden.toLocaleLowerCase('en-US')), false, `${relativePath} leaks a forbidden pre-public identity string`);
    }
  }
});

