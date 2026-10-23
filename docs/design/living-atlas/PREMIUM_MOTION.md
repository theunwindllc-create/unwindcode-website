# Premium motion candidate — 2026-10-22

This local candidate applies the Genesis visual-identity brief and the vault's cinematic website lessons to the existing Living Atlas. Its language remains calm, violet, sculptural and readable. No new public operational claims are introduced. Production publication remains pending review.

## Visual behavior

- The original responsive infinity image remains the semantic, eager hero. After visible user scrolling, a generated five-second orbit is sampled by scroll position. Reverse scrolling reverses the selected image; there is no autoplay video or clock-driven sequence.
- Scene depth composes with the existing artwork transforms. Foreground sheets and accessibility brakes take priority. Section arrivals yield while the hero cinema owns the visitor's attention.
- Mobile presents the hero immediately with a 280 ms text fade. It skips text blur and section arrival animation, removes drawer backdrop blur, preserves touch targets, and keeps captions clear of the fixed controls.
- The parametric infinity diagram responds to input and finite witness events rather than rotating continuously at idle.

## Loading and memory budgets

| Rendition | Dimensions | Frames | Total compressed bytes | Decoded cache limit |
| --- | --- | --- | --- | --- |
| Mobile | 640 × 426 | 24 | 614,186 | 4 images |
| Desktop | 960 × 640 | 36 | 1,814,132 | 6 images |

Frames load individually on demand, with one fetch/decode operation at a time. Intermediate requests coalesce to the latest scroll target. Cache eviction closes bitmaps. A frame miss retains the last valid image; a failed request returns to the poster and stops retrying.

Mobile decoded pixels plus the canvas are approximately 5.2 MiB; desktop approximately 16.4 MiB, excluding browser overhead. The source video is 13.5 MB and is kept outside public assets. It is never downloaded by a visitor.

Reduced motion, the motion pause control, Save-Data, and slow-2g/2g connections keep the original still. Missing Network Information support or reported memory at or below 4 GB selects the mobile rendition. Hidden/offscreen state releases bitmaps and shrinks the canvas. Resize, focus restoration and programmatic scroll alone do not arm loading.

The versioned `infinity-v1` media directory has an immutable one-year cache rule. Future asset changes must use a new versioned directory; do not replace immutable files under the same URL.

## Provenance and review

The user authorized animated generation. One silent Kling 3.0 Pro generation was submitted at the quoted 8.75-credit price, using the existing public infinity hero as its start-image reference. No additional generation was submitted.

- Job: `ea7d8798-dbb0-437e-9ce6-91fbb18731af`.
- Requested: 5 seconds, silent, 16:9; returned: 1764 × 1176, 24 fps, 5.041667 seconds, no audio. The returned 3:2 aspect follows the reference; derived images preserve that composition.
- Contact-sheet review confirmed the recognizable two-lobed silhouette, central crossing, violet glass, black background and consistent object placement across the clip. This is generated conceptual artwork.
- `research/2026-10-22-premium-alive/ASSET_PROVENANCE.json` binds the reference, master, contact sheet and every public frame by SHA-256.
- Local browser and controller checks cover forward/reverse sampling, accessibility/network exclusions, failure handling, stale async work, decoded-cache limits, and pause/offscreen behavior.

Browser viewport/network emulation does not establish physical iPhone/Android battery use, Safari GPU behavior or field Core Web Vitals. Those remain rollout checks. The existing build also reports its pre-existing large i18n chunk warning.

## Validation and handoff

The receipt in `artifacts/living-atlas-qa/premium-20261022/receipt.json` records the exact final artifacts and checks, including any failed attempts and their resolution. Full generator media and test evidence remain outside the vault; the vault receives a compact event and receipt pointer only. The candidate is local until publication is authorized.
