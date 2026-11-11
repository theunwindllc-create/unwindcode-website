import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

// Permanent pre-publish scan for every transmission page (TRANSMISSION_STANDARD "Public safety").
// A flagged page is fixed, never exempted: tighten a pattern only to remove a false positive.

const dir = new URL('../transmissions/', import.meta.url);

// The standard asks for no network calls. These four pages still load chart.js from a CDN.
// They are known debt, listed explicitly so no new page can add an external script. Fonts are exempt.
const EXTERNAL_SCRIPT_ALLOWLIST = new Set([
  '23-the-sec-gate-an-organism-that-locks-its-own-hands.html',
  '24-the-mirror-found-its-form.html',
  '27-the-site-became-a-public-index.html',
  '28-the-memory-control-plane.html',
]);

const FORBIDDEN_NAMES = ['nemotron', 'qwen', 'gemma', 'openrouter', 'retell', 'elevenlabs', 'higgsfield', 'codex', 'opencode', 'paperclip', 'supabase', 'open webui', 'railway'];

const RAW_RULES = [
  ['a Windows path (drive letter and backslash)', /\b[A-Za-z]:\\/],
  ['a /c/ style path', /(?<![\w/.:-])\/[a-z]\/(?:Users|unwind|home|tmp|mnt)\b/i],
  ['the operator username or name', /theun|jesus/i],
  ['localhost', /localhost/i],
  ['a loopback address', /127\.0\.0/],
  ['an IP address', /(?<![\d.])(?:\d{1,3}\.){3}\d{1,3}(?!\d|\.\d)/],
  ['an email address', /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/],
  ['a job id', /\bJ-0\d\d\b/],
  ['a private tool or vendor name', new RegExp(`(?<![A-Za-z])(?:${FORBIDDEN_NAMES.join('|')})(?![A-Za-z])`, 'i')],
];

const visibleText = html => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ');

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

async function pages() {
  return (await readdir(dir)).filter(file => /^\d{2}-.+\.html$/.test(file)).sort();
}

test('there is a page to scan for every transmission', async () => {
  assert.ok((await pages()).length >= 56);
});

for (const [label, pattern] of RAW_RULES) {
  test(`no transmission page contains ${label}`, async () => {
    const hits = [];
    for (const file of await pages()) {
      const html = await readFile(new URL(file, dir), 'utf8');
      const match = pattern.exec(html);
      if (match) hits.push(`${file}:${lineOf(html, match.index)} -> ${match[0].slice(0, 60)}`);
    }
    assert.deepEqual(hits, []);
  });
}

test('no transmission page shows a port number in visible text', async () => {
  const hits = [];
  for (const file of await pages()) {
    const html = await readFile(new URL(file, dir), 'utf8');
    const match = /:\d{4}\b/.exec(visibleText(html));
    if (match) hits.push(`${file} -> ${match[0]}`);
  }
  assert.deepEqual(hits, []);
});

test('only the four known chart.js pages load an external script', async () => {
  const offenders = [];
  const seen = new Set();
  for (const file of await pages()) {
    const html = await readFile(new URL(file, dir), 'utf8');
    if (/<script[^>]+src=["']?(?:https?:)?\/\//i.test(html)) {
      seen.add(file);
      if (!EXTERNAL_SCRIPT_ALLOWLIST.has(file)) offenders.push(file);
    }
  }
  assert.deepEqual(offenders, [], 'new external scripts are not allowed');
  assert.deepEqual([...seen].sort(), [...EXTERNAL_SCRIPT_ALLOWLIST].sort(), 'the allowlist holds exactly the pages that still load a script from a CDN; remove an entry when its page is fixed');
});

test('transmission pages carry no byte order mark', async () => {
  const bad = [];
  for (const file of await pages()) {
    const bytes = await readFile(new URL(file, dir));
    if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) bad.push(file);
  }
  assert.deepEqual(bad, []);
});
