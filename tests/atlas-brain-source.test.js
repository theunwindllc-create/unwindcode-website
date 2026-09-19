import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { safePublicUrl, validGroundingPacket, validGroundingReview, validChatReply, retrySeconds } from '../public/atlas/brain.js';
import { buildUngroundedRiskPacket } from '../api/_shared/grounding-policy.js';
import groundingHandler from '../api/grounding.js';

const source = readFileSync(new URL('../public/atlas/brain.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../public/atlas/brain.css', import.meta.url), 'utf8');
const packet = () => buildUngroundedRiskPacket({ reviewFlags: ['missing_citations'], blockedReasons: ['missing_grounding_citations'] });
const display = () => ({ mode: 'grounding_review_required', component: 'citation_review_card', answer_generation: 'disabled', allow_freeform_answer: false, render_required: true, render_citations: true, render_claim_qualifications: true, render_refusal_rules: true });

test('Brain accepts only same-origin or official public citation routes', () => {
  assert.equal(safePublicUrl('/architecture', 'http://localhost:52498'), '/architecture');
  assert.equal(safePublicUrl('https://www.unwindcode.ai/organisms/infinity-mirror', 'http://localhost:52498'), 'https://www.unwindcode.ai/organisms/infinity-mirror');
  assert.equal(safePublicUrl('/transmissions/28-the-memory-control-plane#memory'), '/transmissions/28-the-memory-control-plane#memory');
  for (const value of ['javascript:alert(1)', '//evil.example/a', 'https://evil.example/architecture', 'https://www.unwindcode.ai.evil.example/architecture', 'https://user@www.unwindcode.ai/', 'http://www.unwindcode.ai/', '/social/private.html', '/assets/source/master.png', '/api/chat', '/.env', '/architecture?token=private', '/public/data/assets.json', '/organisms/%2e%2e/private', '/organisms/%2fprivate', '/organisms/\\evil', '/architecture\n']) {
    assert.equal(safePublicUrl(value), null, value);
  }
});

test('Brain rejects synthesis-enabled or incomplete grounding contracts', () => {
  assert.equal(validGroundingPacket(packet()), true);
  for (const field of ['sources', 'citation_display', 'required_qualifications', 'refusal_rules', 'answer_policy', 'review_flags']) {
    const value = packet(); delete value[field];
    assert.equal(validGroundingPacket(value), false, field);
  }
  assert.equal(validGroundingPacket({ ...packet(), answer_generation: 'enabled' }), false);
  const value = packet(); value.answer_policy.synthesis_allowed = true;
  assert.equal(validGroundingPacket(value), false);
  assert.equal(validGroundingPacket({ ...packet(), refusal_rules: [] }), false);
  assert.equal(validGroundingPacket({ ...packet(), required_qualifications: [{}] }), false);
  const missingCitation = packet(); missingCitation.citation_display.items = [{}];
  assert.equal(validGroundingPacket(missingCitation), false);
});

test('Brain validates the actual local public grounding packet', async () => {
  let status;
  let body;
  await groundingHandler({ method: 'GET', query: { q: 'brain memory' }, headers: { host: 'localhost' } }, {
    setHeader() {}, status(value) { status = value; return this; }, json(value) { body = value; },
  });
  assert.equal(status, 200);
  assert.equal(validGroundingPacket(body.packet), true);
  assert.ok(body.packet.required_qualifications.length);
  assert.ok(body.packet.sources.length);
});

test('Brain requires every 409 display safeguard and never accepts a freeform substitute', () => {
  const payload = { success: false, display: display(), grounding: packet(), reply: 'Must not render this' };
  assert.equal(validGroundingReview(payload), true);
  for (const field of Object.keys(payload.display)) {
    const value = structuredClone(payload); delete value.display[field];
    assert.equal(validGroundingReview(value), false, field);
  }
  assert.equal(validGroundingReview({ ...payload, display: { ...display(), allow_freeform_answer: true } }), false);
});

test('Brain requires a real nonempty reply and a safe next conversation id', () => {
  assert.equal(validChatReply({ success: true, reply: 'A real reply.', conversation_id: 'conversation:123' }), true);
  assert.equal(validChatReply({ success: true, reply: 'A real reply.', conversation_id: null }), true);
  for (const payload of [null, {}, { success: true, reply: ' ', conversation_id: null }, { success: false, reply: 'no', conversation_id: null }, { success: true, reply: 'reply', conversation_id: 'bad id' }, { success: true, reply: 'reply' }]) assert.equal(validChatReply(payload), false);
});

test('Brain retry advice accepts bounded seconds or a future HTTP date', () => {
  assert.equal(retrySeconds('30'), 30);
  assert.equal(retrySeconds('Thu, 01 Jan 1970 00:01:00 GMT', 0), 60);
  for (const value of ['', 'garbage', '-2', '0', '999999999']) assert.equal(retrySeconds(value), null);
});

test('Brain uses only protected same-origin APIs, safe text, and no prompt persistence', () => {
  assert.match(source, /fetch\(mode === 'sources' \? `\/api\/grounding\?q=/);
  assert.match(source, /: '\/api\/chat'/);
  assert.match(source, /conversation_id: conversationId/);
  assert.match(source, /credentials: 'same-origin', cache: 'no-store', redirect: 'error'/);
  assert.doesNotMatch(source, /innerHTML|outerHTML|insertAdjacentHTML|console\.|localStorage\.setItem|sessionStorage|supabase|api\.openai/i);
  assert.match(source, /if \(busy\) return/);
  assert.match(source, /controller\.abort\(\)/);
  assert.match(source, /event\.stopImmediatePropagation\(\)/);
  assert.match(source, /dialog\.showModal\(\)/);
  assert.match(source, /uc:languagechange/);
  assert.match(source, /attributeFilter: \['lang'\]/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /safe-area-inset-bottom/);
});
