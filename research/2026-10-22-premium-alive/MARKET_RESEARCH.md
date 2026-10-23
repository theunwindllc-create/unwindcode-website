# Market and quality research — 2026-10-22

Scope: a small comparator and standards review for experiential technology websites, not market sizing or a measured claim about conversion.

## Observed references

- [Apple AirPods Pro](https://www.apple.com/airpods-pro/) organizes its product page into highlights, a closer-look exploration, and discrete feature explanations. The retrieved page pairs imagery with specific claims and qualifications. Transferable principle: each visual episode earns a clear explanatory purpose.
- [Linear](https://linear.app/) leads with a concise product purpose and follows with concrete workflow examples and routes into feature detail. Transferable principle: visual sophistication should lead visitors toward understandable evidence.

These were current page-text observations on 2026-10-22. Neither competitor animation timing nor frame rate was measured; no claim is made about their conversion performance.

## Standards and implications

- [W3C Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) explains when automatically moving and updating content needs user control. Keep the site's existing pause control and inspect it after changes.
- [MDN reduced-motion guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) describes honoring the user's preference to reduce nonessential motion. Large panning and scaling should disappear in this mode.
- [web.dev animation guidance](https://web.dev/articles/animations-guide) favors transform and opacity and warns against unnecessary layout/paint work. Use input-coalesced updates, measure the result, and avoid asserting that all effects are compositor-only.

## Opportunity — inference

The site already owns distinctive conceptual imagery and useful explanations. Its best next gain is stronger linkage between scrolling and visual depth, while retaining calm reading surfaces. Revision 2 allows a single generated cinematic sequence rooted in the existing sculpture. The relevant comparison is perceived clarity and response per transferred byte, not the amount of media delivered. There is no evidence that a bigger or longer video would improve this site.

## Mobile design hypothesis

A short image-to-video master, converted into a small adaptive frame sequence, can provide the desired cinematic response without continuous video autoplay. This is a testable design choice, not a measured performance claim. Proposed budgets and stop conditions are in the design specification; if those cannot be met, ship the existing static artwork plus lightweight depth rather than exceeding them silently.
