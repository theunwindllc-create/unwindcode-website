# Implementation brief — research handoff

Revision 1 research completed before implementation by Codex strategy researcher `/root/premium_research`, 2026-10-22. Revision 2 updates all nine documents for the user's animated-video and mobile-optimization request. The nine Markdown documents in this directory are the scoped package required by repository `AGENTS.md`.

## Highest-value change

Add a restrained, unmistakable scroll response to the hero and existing specimen artwork. Retain native scrolling and stationary readable copy. The existing depth implementation remains the fallback; revision 2 adds a cinematic hero sequence derived from the current infinity artwork without an animation library or continuous video autoplay.

Include the anatomy image's small depth response beneath its fixed reticle if its existing composition permits it. Integrate the independent motion review's two polish fixes: user input settles transient reveals, and CTA hover/focus receives a short intentional transition instead of an abrupt snap. These are bounded interaction refinements, with pause and reduced-motion behavior preserved.

## Source touchpoints

- `public/lab/alive.js`: shared input frame, visibility, motion permission, light state, sheets and lifecycle brakes.
- `public/lab/alive.css`: layered art response, edge masks, desktop/mobile limits and accessible off states.
- `public/lab/living-words.js`: existing entrance and text response; preserve its finite, skippable behavior.
- `public/lab/index.html`: only if a wrapper is needed to isolate composed transforms. Keep all static semantics and responsive images.

The hero wrapper already receives a breathing transform; its image receives entrance transforms. A separate nested depth layer or another carefully verified composition is needed to prevent these effects overwriting each other. The refraction/seed overlays should stay registered with the artwork, while labels remain stationary.

## Cinematic delivery and adaptive loader

Use the art brief's shallow dolly/filament passage, not a rotating infinity or large zoom. Review actual generated frames before integrating. Preserve the static image as the initial rendering and accessible source. Build a bounded frame renderer: viewport-select rendition, wait for visible user intent, request/decode the nearest frame, then show canvas only when ready. Coalesce scroll updates so the latest target wins; hold the last decoded frame on a miss. Do not await media before enabling navigation or revealing copy.

Mobile budget: up to 24 frames at 640×426; entire compressed sequence at most 1 MiB; at most 4 decoded frames (~4.2 MiB pixel payload); one decode at a time. Desktop: up to 36 frames at 960×640, at most 2 MiB, 6 decoded frames (~14.1 MiB), two decodes maximum. No unrestricted DPR allocation or full-sequence preload. Zero cinematic frame requests before eligible visible user intent. Save-Data, slow-2g/2g, reduced motion and manual pause retain the static artwork. Unknown network capability gets the conservative lazy policy. Close evicted bitmaps, discard stale results and stop work while hidden/offscreen.

The Genesis source standard informs calm composition, a single core, meaningful triggers and beautiful frozen states. The prior Ambient Genesis instrument-panel implementation constraints are not imported as new website architecture or runtime obligations. Keep current approved site typography and all evidence/publication boundaries.

## Required behavioral checks

1. Capture desktop and mobile screenshots at rest and multiple scroll positions. Confirm meaningful visible motion without cropping, exposed image rectangles, text overlap or layout shift.
2. Confirm the original action still occurs when a user scrolls, presses a key or clicks during the entrance.
3. Verify reduced motion and manual pause immediately remove the new movement; hidden/pagehide states stop work; resume/resize recalculate correct progress.
4. Verify pointer light, specimen and loop sheets, Escape/focus return, keyboard activation and English/Spanish remain intact.
5. Verify no-JavaScript presentation and the existing WebGL fallback retain usable content.
6. Inspect scheduling: no extra idle animation frame loop; update only visible artwork from coalesced input. Check new transform ownership against the motion arbiter.
7. Run appropriate motion/browser checks, `npm test`, `npm run check:public-parity`, `npm run build`, and `git diff --check`. Use the repository's preview path for clean URLs.
8. Independent review must describe observed differences and remaining limitations. Record the local candidate and evidence before user handoff.
9. For cinematic media, record encoded sizes and decoded-cache high-water count. Verify cold-cache mobile at 360/390/430 px portrait and a short landscape viewport, slow network and CPU throttling, fast scroll forward/back, resize, visibility changes, pause/resume, denied media and decode failure. Check zero pre-intent/reduced-motion/data-saving frame requests, no blank frame, no repeated fetch/decode loop, no added idle requestAnimationFrame loop and no cinematic long task over 50 ms in the captured run. Measure LCP/CLS/INP where the tool supports them; target LCP ≤2.5 s, CLS ≤0.1 and INP ≤200 ms, clearly labeling laboratory conditions and any unmet target. These are acceptance targets, not current results or field certification.

## Explicit limits

No publication, push, deployment, private telemetry, API change, claim-registry rewrite or unrelated worktree change. Generation is newly permitted by the user; actual connector/resource authority is coordinated by the director and is not delegated to this research role. No performance or accessibility certification is implied by successful unit tests. Real-device and production network behavior remain unverified unless separately measured.

## Research limitations

The referenced strategy-agent file was unavailable, as documented in `BRAND_DISCOVERY.md`; the repo's explicit research procedure was followed. Audience segments are inferences. External comparator analysis was page-content based. The local premium-site study materials were used as conceptual guidance; their provider, model and pricing claims were not accepted as current facts. Raw private source text was not copied into this package.

## Revision 3: Transmission 36 integration addendum

The user subsequently requested publication of the visual update, a current Genesis assessment, and a new transmission. This addendum is completed before implementing the article. All nine research Markdown files in this directory were previously created and recorded in commit `30f8098`. Their brand, audience, visual system and performance findings remain applicable to the established transmission surface; this is a content-and-interaction extension, not a redesign or new positioning exercise.

The previously missing strategy profile has now been located in the separate brain source repository at `agents/website-development-team/agents/website-strategy-research-agent.md` and read. The original search was limited to the then-known roots. Existing content sources also identify Scribe, Critic, Webmaster and Broadcaster roles; this run uses the established drafting, independent review and integration roles, with no social distribution or autonomous pipeline invocation.

The selected article is **Transmission 36: Movement Needs a Source**, route `/transmissions/36-movement-needs-a-source`. It serves builders and technically curious readers by explaining input-driven motion, bounded mobile loading and the evidence boundary between a visual release and Genesis operational readiness. The public-safe draft has 981 words and five sections; independent Critic review accepted SHA-256 `68002b31d095db5828f77527ba0926f5c483f20cafa22fe1f7a7169b36e65fd0`. Private editorial working records remain outside publication assets.

Apply the existing dark `tx-page` / `tx-hero` / `tx-section` template and Atlas shell. Build three useful interactions: a gesture-to-response explorer, a mobile/desktop asset-budget switch, and expandable evidence-boundary cards. Use native details for short supplementary explanations. Preserve semantic content without JavaScript, visible keyboard focus, reduced-motion behavior, readable mobile line lengths, and fixed-width numeric values that wrap safely. Do not add video, fonts, chart dependencies or external requests merely to illustrate the article.

Use exact verified media dimensions/counts/encoded bytes from the public sequence manifest; label decoded-pixel estimates as estimates excluding browser overhead. Operational facts remain a dated snapshot: monitoring and selected services running, autonomous building deliberately held, recovery incomplete, evaluation RED and judge calibration not yet trusted. No internal service topology, private paths, recovery actions, identity details, raw records or unsupported whole-system success claims enter the article. The separate website retrieval issue is not evidence about Genesis's local gate.

Integrate article, archive, active homepage, transmission registry, both sitemap/llms discovery surfaces and service metadata. Validate the new clean URL, metadata, discovery parity, numeric-budget switch, keyboard/no-JavaScript states and desktop/mobile rendering; run repository tests, local parity and the complete production build. Root owns commit, publication and live verification under the user's explicit request. No new generation or provider call is part of this article scope.

## Revision 4: 2026-11-08 publication into the gap

Revision 3 was written on 2026-10-22 and was never committed; Transmission 37 was published on 2026-11-02 while number 36 stayed reserved. On 2026-11-08 the user required website pushes to stay coherent with every transmission live, so the article was built against current `main`.

- **Text.** The 981-word draft reviewed under Revision 3 was not available to this build and was not ported. The published page is a fresh text written on 2026-11-08 from this directory, the shipped scroll-cinema and Alive code and tests, and the dated 2026-10-22 journal records. The Revision 3 Critic acceptance does not cover it; it awaits its own review before publication.
- **Order.** Transmission 37 remains the latest pointer everywhere (archive featured card, first archive card, `ai-services.json` latest, status and parity). Transmission 36 fills the gap in number order: second archive card and ItemList position, second card on the legacy homepage, and the live homepage strip becomes 37/36/35. Counts measure article pages (38). The status and parity snapshots now report no numbering gap.
- **Dates.** `datePublished` is 2026-11-08; the page states the 2026-10-22 assessment date beside it and carries `temporalCoverage: 2026-10-22`. Nothing is backdated.
- **Operational facts used.** Only what the 2026-10-22 records state: a guard service healthy, the build loop parked behind the operator's stop instruction, the heartbeat refusing to beat while the ledger head was unreadable and then paused, the human-only recovery procedure prepared but not executed by agents, recovery pending and unproven. "Evaluation RED and judge calibration not yet trusted" from Revision 3 is omitted: those records do not state it. The registry summary says "a guard service reported healthy" where the Revision 3 draft said "monitoring continued", for the same reason.
- **Interactions.** All three Revision 3 interactions shipped, plus the animated workflow and a scroll simulator computed in the page. No frames are loaded by the article, no chart dependency, no external request, and every explanation is readable without JavaScript.
- **Generation.** None. The homepage card reuses the existing `infinity-core-800.webp` hero rendition.
