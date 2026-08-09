# Implementation Brief — Transmission 33

## Build Target

Create `transmissions/33-the-organization-found-its-hands.html` as a self-contained interactive Brain guide matching the house language of Transmission 32.

## Required Public Updates

1. Transmission page with clean canonical/OG/JSON-LD URLs and date `2026-08-09`.
2. Featured and first archive cards plus archive count/JSON-LD.
3. First homepage transmission card.
4. Root and public sitemaps.
5. Root and public LLMS files.
6. Root and public AI service metadata.
7. `public/data/transmissions.json` newest entry.
8. Tests for route, metadata, whitepaper sections, approved terminology, privacy, forbidden infrastructure details, and no social exposure.

## Content Contract

Use the full spine: thesis, why now, definitions, theory, organism pattern, protocol, threat model, build recipe, approval boundary, proof ledger, next-cell memory.

## Interaction Contract

Ship at least three accessible interactive patterns. Recommended: charter audit console, identity explorer, WAIT LAW timeline, expandable threat cards, and proof tabs.

## Privacy Contract

- Refer only to `a second, pre-public persona`.
- Omit all identity, appearance, references, and identifying detail.
- Omit Canonical Sheet V2.
- Add a test that scans every published/public surface for both forbidden identity spellings.
- Keep forbidden spellings confined to test policy data, never public output.

## Safety Contract

- Omit infrastructure project identifiers, messaging-platform identifiers, auth/token mechanics, and credit balances.
- Do not claim unattended publication or unlimited recursive delegation.
- Present `sessions_spawn`, OpenClaw, PUBLICA, Invicta, and Genesis only within the approved boundaries.

## Test-First Plan

1. Add focused failing assertions for the new route and content.
2. Add public-surface privacy scanning and no-social assertions.
3. Implement the page and registries.
4. Update latest-pointer expectations in status/parity tests.
5. Run focused tests, full `npm test`, `npm run check:public-parity`, `npm run build`, clean-URL HTTP smoke, and `git diff --check`.

## Risks and Countersign Items

- Root `ai-services.json` contains legacy social-packet rules that conflict with the current opt-in internal-asset rule. Modify only what is needed for Transmission 33 and its latest pointer unless the owner separately approves a full legacy cleanup.
- The archive JSON-LD count is physical entries, not latest transmission number; duplicate Transmission 27 means adding 33 raises `numberOfItems` from 33 to 34.
- The local registry review status remains draft-safe until publication approval.

## Explicit Boundary

This brief authorizes a verified local release package only. No social packet, commit, push, Vercel command, or production verification.
