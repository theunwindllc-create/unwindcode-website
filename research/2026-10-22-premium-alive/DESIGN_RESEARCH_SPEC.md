# Design research specification

## Preserve

Retain the dark void, violet glass material, Manrope/IBM Plex Mono hierarchy, conceptual artwork, bilingual strings and current content order. Image masks must continue blending near-black edges into `#06060c`. The foreground motion arbiter remains the source of timing authority.

## Recommended motion composition

Design values below are starting points for visual QA, not claimed optimal measurements.

| Surface | Visitor response | Initial bound |
| --- | --- | --- |
| Hero art | Gently moves through depth as it exits the viewport | Desktop total drift 32–48 px; scale change no more than 3.5%. |
| Specimen art | Shallower movement across each visible specimen | Desktop displacement limited to approximately ±12–18 px. |
| Anatomy image | Slight depth under its fixed reticle | Keep the reticle and explanatory text stationary; use a smaller bounded image displacement. |
| Small screens | Subtler depth, protecting image framing and touch controls | At most half desktop displacement; allow complete removal if clipping is visible. |
| Copy, links and figure labels | Stay in the reading plane | No scroll-linked translation or scale. |

Current source baseline: `scrollLight()` already coalesces pointer/scroll updates, moves one light across the closest visible artwork, and passes only ±5 px to specimen depth. The hero has a separate decorative breath. A stronger composed depth response is a targeted enhancement, not a new animation system.

## State rules

- Native scroll position supplies progress; do not intercept wheel/touch or add forced scroll sections.
- Compose depth separately from the existing hero entrance and breath. Avoid assigning competing `transform` values to the same element.
- Pause, reduced motion, hidden/pagehide and foreground work must stop or reset the response consistently. Recompute on resume and resize without a sudden jump.
- Open sheets retain a stable spatial anchor; background scroll must not move the selected artwork underneath a sheet.
- Do not add continuous requestAnimationFrame work. Reuse bounded input sampling and visibility knowledge.
- Default CSS and no-JavaScript states remain complete and readable.
- User intent must settle transient reveals immediately; input must not leave opacity or blur in an unfinished state.
- Restore restrained CTA hover/focus interpolation where the blanket transition reset currently causes a visual snap, while retaining instant states for reduced motion and pause. Keep keyboard focus clearly visible.

## Revision 2: cinematic hero and mobile budgets

Direct a 4–6 second source shot of the exact existing glass infinity sculpture. Begin near the approved still; a shallow dolly (approximately 3%) and tiny lateral orbit (approximately 3–5 degrees) reveal the crossing's depth while one restrained violet filament travels through the existing form. End with a settled, still-legible sculpture. No morphing, spinning, new appendages, camera tunnel, particles, text or fake telemetry. These are art-direction bounds, subject to frame-by-frame review rather than promises of model accuracy.

Render the source into self-hosted frames and scrub with native scroll progress. Do not ship continuous video autoplay. Keep the original responsive still as the initial image and permanent fallback; the canvas becomes visible only when its first appropriate frame has decoded. A frame-sequence canvas is a finite media renderer, not evidence or a new ambient loop.

Proposed hard budgets for this candidate, to be measured rather than assumed:

| Budget | Mobile, viewport up to 700 px | Desktop |
| --- | --- | --- |
| Frame rendition | At most 640×426, 24 frames | At most 960×640, 36 frames |
| Complete compressed sequence | At most 1 MiB | At most 2 MiB |
| Frame requests before visible user intent | Zero | Zero |
| Decoded cache | At most 4 frames, ~4.2 MiB RGBA | At most 6 frames, ~14.1 MiB RGBA |
| Decode concurrency | 1 | At most 2 |
| Target updates during scrolling | At most 24 frame selections/second, last request wins | Same bounded scheduling |

RGBA estimates describe decoded pixel payload only, not total renderer memory. Keep canvas intrinsic size within its rendition; do not multiply sequence dimensions by unrestricted devicePixelRatio. Encoded blobs/cache, canvas backing store and decoder overhead require separate measurement. Prefer a tiny look-ahead window (nearest requested frame plus one in the current direction), not eager full-sequence fetching. Release evicted ImageBitmaps, clear pending work offscreen, and avoid retaining both all encoded blobs and decoded frames.

Do not request the sequence under reduced motion, manual pause, Save-Data or observed slow-2g/2g. An absent network-information API is unknown, not a fast-network signal: default to the conservative mobile rendition and lazy loading. Stop pending work when hidden; discard outdated decode results. Loading/decode failures retain the nearest valid frame or original still. No spinner, blank phase or scroll lock.

Technical references: [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), [web.dev animation performance](https://web.dev/articles/animations-guide), [W3C pause controls](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). These references guide the implementation; browser verification is still required.
