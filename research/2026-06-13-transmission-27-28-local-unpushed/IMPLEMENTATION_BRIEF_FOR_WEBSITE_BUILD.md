# Implementation Brief For Website Build

## Build Scope

Create two interactive transmissions:

- `transmissions/27-the-site-became-a-public-index.html`
- `transmissions/28-the-memory-control-plane.html`

Update:

- `transmissions/index.html`
- `index.html`
- `public/data/transmissions.json`
- `public/sitemap.xml`
- optionally `public/llms.txt` with public-safe routes

## Verification

- Run `npm run build`.
- Run `npm test` or at minimum focused public metadata and transmission registry tests.
- Browser-check desktop and mobile render if practical.

## Risks

- Website repo already has many unpushed public API and registry changes.
- Root repo has many unpushed memory changes.
- Do not push without explicit approval.

## Open Questions

- Should Transmission 25 be backfilled later?
- Should these posts get social carousels in a separate pass?
