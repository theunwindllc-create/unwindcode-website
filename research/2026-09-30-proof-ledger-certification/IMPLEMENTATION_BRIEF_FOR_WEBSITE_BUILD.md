# Implementation Brief — proof-ledger accuracy repair

**This is a handoff for a later build, not a deployed change.** The site AGENTS.md requires the nine research files in this directory before material website work. Its referenced `../../agents/website-development-team/agents/website-strategy-research-agent.md` was not present in the local workspace and home-directory searches; this package follows the site AGENTS.md contract and the existing `research/2026-08-09-transmission-33` example. The missing procedure should be supplied or reconciled before relying on workflow-specific requirements beyond the visible nine-file contract.

## Current proof and limit

- **Deployed route:** `https://www.unwindcode.ai/proof/ledger` returned 200 at approximately 2026-09-30 14:47 UTC, with a raw ICP URL and claims of attestation/irrewriteability. Its bytes differ from the checkout (`BRAND_DISCOVERY.md` hashes); verify both in each release review.
- **Canister read:** `https://rt6ds-eqaaa-aaaad-agv7q-cai.raw.icp0.io/` returned 200 with no `IC-Certificate` or `IC-CertificateExpression` headers observed. This is an unverified HTTP read.
- **Verifying path:** `https://rt6ds-eqaaa-aaaad-agv7q-cai.icp0.io/` returned 503 `backend_response_verification`, “Certification values not found.” Do not substitute that URL in a production fetch and call the repair done.
- **Platform rule:** raw hostnames skip gateway verification; custom dynamic HTTP needs canister-side response certification. [ICP response certification](https://docs.internetcomputer.org/guides/frontends/certification/).

## Build phase A — accurate current product

1. Update `proof/ledger/index.html` title, meta, Open Graph, Twitter, JSON-LD, hero, proof cards, command captions, field labels, and success/error states using `WEBSITE_COPY_DECK.md`. Keep canonical `/proof/ledger` and existing clean-URL rules.
2. Update `proof/index.html` teaser, `public/lab/witness.js` and its visible label, and Transmission 35's live widget/link. Review bilingual strings and any discovery surfaces that repeat “attested” or “immutable.” Preserve historical article context with a dated correction rather than a silent stronger claim.
3. Preserve reported data as reported data; no cached good value should masquerade as a fresh response. Network failure and verification failure render unknown authenticity, not “organism down.”
4. Add focused tests asserting the raw success state says unverified, that no raw response earns a verified/attested badge, and that the proof route/social/schema copy is aligned. Adjust the existing endpoint-parity tests without making them a proof of certification.
5. Run `npm test`, `npm run check:public-parity`, `npm run build`, a local clean-URL smoke using `npx serve dist` (the site AGENTS.md says `vite preview` does not emulate clean URLs), browser checks, and `git diff --check`. Recheck live after an authorized publication. Do not treat local tests as live canister proof.

## Build phase B — earn a certified claim

1. Obtain the canister source and authority map from its owner. Review `http_request` shape, dynamic fields, CORS/header needs, upgrade behavior, certified-data tree, recent history, and controller permissions. The canister implementation is absent from this site checkout.
2. Choose either certified HTTP on the verifying hostname or a certified-data Candid query with explicit client verification. Follow the official ICP implementation guide; do not fetch a mainnet root key dynamically or skip certificate freshness checks. [ICP response certification](https://docs.internetcomputer.org/guides/frontends/certification/).
3. In a controlled fixture, prove a correct response passes and missing/invalid/stale certification fails closed. Then prove the live verifying hostname returns 200 and the raw hostname is no longer presented as proof. Measure CORS and refresh behavior from the Vercel origin.
4. Switch site reads only after live proof; remove any automatic raw fallback from verified UI. Keep the head labelled self-reported and the thirty-minute gap visible. Claim historical immutability only after a separate canister-code/control/history audit.

## Release boundaries

This handoff does not edit/deploy the site or canister, handle credentials, push, or grant publication authority. A Vercel deploy and a canister deployment are distinct actions. A live 200 from the raw hostname is not release evidence for certification. The immediate accuracy repair can proceed independently of the canister work.
