import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CANONICAL = 'https://www.unwindcode.ai';
const TRANSMISSION_NUMBER = 27;
const TRANSMISSION_SLUG = 'the-quotation-cell';
const TRANSMISSION_TITLE = 'The Quotation Cell';
const TRANSMISSION_TOPIC = 'Quotation Cell';
const TRANSMISSION_SUMMARY =
  'A public-safe whitepaper build record for the Quotation Cell: manual Brain protocol, quote-package architecture, supplier memory, correction loops, transaction readiness, proof metadata, and human approval before commitment.';
const OUTPUTS = [
  'transmissions/27-the-quotation-cell.html',
  'transmissions/index.html',
  'index.html',
  'sitemap.xml',
  'llms.txt',
  'ai-services.json',
  'assets/asset-manifest.json',
  'social/transmission-27-quotation-cell/carousel.html',
  'social/transmission-27-quotation-cell/caption.md',
  'social/transmission-27-quotation-cell/README.md',
  'social/transmission-27-quotation-cell/ready-to-upload/01-quotation-cell.png',
  'social/transmission-27-quotation-cell/downloads/transmission-27-quotation-cell.zip',
];
const BLOCKED_PHRASES = [
  'Lizard Solutions',
  'guaranteed price',
  'guaranteed availability',
  'automatic purchasing',
  'legally binding quote',
  'final price',
  'guaranteed fulfillment',
  'purchase for you',
  'fulfill automatically',
  'no human review',
];

function assertPublicSafe(text) {
  const lowered = text.toLowerCase();
  const hit = BLOCKED_PHRASES.find((phrase) => lowered.includes(phrase.toLowerCase()));
  if (hit) {
    throw new Error(`Blocked phrase found in transmission decision: ${hit}`);
  }
}

function decide() {
  const route = `/transmissions/${String(TRANSMISSION_NUMBER).padStart(2, '0')}-${TRANSMISSION_SLUG}.html`;
  const decision = {
    generated_at: new Date('2026-06-07T09:30:00-04:00').toISOString(),
    next: {
      number: TRANSMISSION_NUMBER,
      slug: TRANSMISSION_SLUG,
      route,
      topic: TRANSMISSION_TOPIC,
      title: TRANSMISSION_TITLE,
      summary: TRANSMISSION_SUMMARY,
      reason:
        'The quoting stack is becoming agentic: CPQ, quote-to-cash, approvals, supplier memory, and buyer-facing handoff are moving toward conversational command surfaces. Unwind should answer with a bounded Quotation Cell, not a private business case study.',
      matched_signals: [
        'agentic CPQ',
        'quote-to-cash workflow agents',
        'supplier memory',
        'quote package state',
        'transaction readiness',
        'human approval before commitment',
      ],
      score: 11,
    },
    review: {
      status: 'public_safe_draft',
      execution_mode: 'manual_brain_protocol',
      synthesis_boundary: 'human_approval_before_commitment',
      private_business_names_allowed: false,
      blocked_phrases: BLOCKED_PHRASES,
      required_boundaries: [
        'manual Brain protocol',
        'whitepaper build record',
        'quote package state',
        'supplier memory',
        'correction history',
        'transaction readiness',
        'human approval before commitment',
        'no private business names',
      ],
    },
    outputs: OUTPUTS,
  };
  decision.preview = [
    `Transmission ${decision.next.number}: ${TRANSMISSION_TITLE}`,
    TRANSMISSION_SUMMARY,
    'Until the Brain can run this loop directly, Unwind runs the Brain protocol manually against real signals and records the public build trail.',
    'The cell can prepare, revise, compare, recommend, and route review. It cannot own price, availability, purchase, fulfillment, legal status, or final commercial consequence.',
  ].join('\n');
  assertPublicSafe([decision.next.reason, decision.preview].join('\n'));
  return decision;
}

async function outputExists(relativePath) {
  try {
    await access(path.join(ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

const decision = decide();

if (process.argv.includes('--dry-run')) {
  process.stdout.write(`${JSON.stringify(decision, null, 2)}\n`);
} else {
  const missing = [];
  for (const output of OUTPUTS) {
    if (!(await outputExists(output))) missing.push(output);
  }
  if (missing.length > 0) {
    throw new Error(`Transmission ${TRANSMISSION_NUMBER} is not publication-complete. Missing: ${missing.join(', ')}`);
  }
  process.stdout.write(`${JSON.stringify({ ok: true, route: `${CANONICAL}${decision.next.route}`, outputs: OUTPUTS }, null, 2)}\n`);
}
