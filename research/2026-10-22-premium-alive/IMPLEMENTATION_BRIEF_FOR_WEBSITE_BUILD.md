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
