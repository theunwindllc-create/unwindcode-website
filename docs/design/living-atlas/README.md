# Living Atlas — shared website design

Production release approved by the owner on 2026-09-19: “deploy it make this the new design . love it”. Working branch: `codex/living-atlas`. This approval covers the Living Atlas design and artwork on the existing website; it does not change runtime, financial, or wallet authority. Deployment completion must be verified separately.

## Open and review

The preview for this session is http://localhost:52498. Open the HTTP preview, not `file://...`: the site uses root-relative URLs.

If the preview process has stopped, run `npm run build`, then `npm run preview:atlas` from the website repository. The local-only server binds to `127.0.0.1:52498` (override with `ATLAS_PORT`). It serves built files and the existing chat, grounding, search, and status handlers. A plain static server cannot support Public Sources. The build promotes `public/lab/index.html` to the root homepage. The legacy console remains at `/home`.

## What changed

- Complete landing-page composition, typography, navigation, section rhythm, and responsive layouts.
- Infinity Core hero and four original organism studies share the Living Core material reference. The asset-direction approach uses one reference family rather than unrelated illustrations.
- Original native-WebGL infinity geometry with six manually selectable explanations. Pointer tilt and a slow signal flow are decorative, not telemetry. The underlying geometry is three-dimensional, not video.
- Anatomy, four memory layers, doctrine, real transmission records, evidence links, visitor paths, FAQ, and final invitation.
- English/Spanish text, accessible labels, image descriptions, language persistence, keyboard tab navigation, mobile dialog focus, reduced motion, manual pause, and static fallbacks.
- Explicit prototype/research/experimental labels. Existing organism, architecture, philosophy, vision, proof, chat, and subscription destinations remain intact.

## Source map

| Purpose                        | Source                                              |
| ------------------------------ | --------------------------------------------------- |
| Homepage                       | `public/lab/index.html`                             |
| Layout and typography          | `public/lab/styles.css`                             |
| Language, controls, navigation | `public/lab/main.js`                                |
| Parametric 3D scene            | `public/lab/infinity.js`                            |
| Final source PNGs              | `assets/source/living-atlas/`                       |
| Responsive web exports         | `public/lab/media/atlas/`                           |
| Local fonts and licenses       | `public/lab/fonts/`                                 |
| Reusable generation prompts    | `docs/design/living-atlas/ASSET_CREATIVE_BRIEFS.md` |
| Source-based design reasoning  | `docs/design/living-atlas/KNOWLEDGE_TO_DESIGN.md`   |
| Asset inventory                | `docs/design/living-atlas/asset-inventory.json`     |
| Browser QA                     | `scripts/qa-living-atlas.mjs`                       |
| Screenshots and run report     | `artifacts/living-atlas-qa/` (local, git-ignored)   |

The required pre-build nine-file research package is at `../../agents/website-development-team/research/2026-09-19-unwind-living-atlas/`.

## Media budget

Final hero: 174,834 bytes at 1536px; 46,880 bytes at 800px. Each 960px organism study is 54–89 KB; each 480px study is 14–23 KB. Social poster: 1200 × 630 JPEG. Source masters are 1536 × 1024 PNGs. Images below the hero load lazily. Old videos are preserved but not requested by the redesigned landing page. No 3D library, external font request, or video download is needed.

## Phase 1 verification and boundaries (historical)

- Production build succeeds. It retains pre-existing warnings for a non-module script in transmission 31 and the older shared bundle size; this isolated landing page does not load that bundle.
- Existing suite: 315 tests passed. Local public-parity checks passed.
- Browser checks cover all 22 distinct homepage destinations/fragments, responsive images, all four tab groups, keyboard controls, mobile menu focus, translations and persistence, 320/390/768/1440px EN/ES layouts, reduced motion, WebGL loss, and JavaScript-disabled content.
- Browser verification uses headless Chrome, including software-rendered WebGL. Physical-device Safari, production network conditions, live email submission, and live chat completion are not claimed as tested.
- No new public asset-registry approval is asserted. Generated artwork is conceptual; local creative review is not public publication approval.

To repeat the browser check, set `ATLAS_PREVIEW_URL` to the active local server and `ATLAS_PUPPETEER_PATH` to an installed `puppeteer-core` module, then run `node scripts/qa-living-atlas.mjs`. `ATLAS_CHROME_PATH` can override the browser executable. The test does not submit forms or send chat messages.

## Continue with Astra

Read this handoff, the source-based design note, and the asset briefs before editing. The homepage lives in `public/lab/`; the site-wide integration lives in the Phase 2 files below. Do not mistake the older root console source for the homepage or edit generated `dist/` files directly. Preserve the generated source masters, source-backed claims, bilingual controls, proof links, and human authority boundary. Rebuild and visually inspect the final HTTP preview after changes. The owner approved this release; future material publication changes still need their own approval.

## Phase 2 — cells, shared pages, motion, and Brain

The owner's subsequent direction extends the design across the public site and gives each cell a distinct color **and form**. `CELL_VARIANTS.md` records the exact built-in image-generation prompts. Source PNGs and all v1 masters remain together in `assets/source/living-atlas/`. V2 delivery is responsive WebP at 480/960/1536px. These cell studies are animated raster artwork, not manipulable 3D models; the landing infinity scene is actual parametric WebGL geometry.

`scripts/apply-atlas-shell.mjs` applies the shared visual layer to an explicit allowlist of 52 routes, followed by root promotion (53 URL surfaces including `/` and `/lab`). It preserves authored article bodies, metadata, evidence statuses, original diagrams, and interactions. Creator/social/internal HTML is excluded. Four organism pages receive new hero art; the ecosystem index gets a four-cell shelf. The old light articles receive a dark editorial adapter. Transmission 31's missing module type is repaired; the archive count is derived from the 36-record registry.

| Purpose | Source |
| --- | --- |
| Public route allowlist and post-build integration | `scripts/apply-atlas-shell.mjs` |
| Shared tokens, route-specific color, editorial adapters | `public/atlas/site.css` |
| Presentation/localization adapter | `public/atlas/site.js` |
| Offscreen-aware art float, pointer depth, progressive reveal, shared pause | `public/atlas/motion.js`, `motion.css` |
| Single accessible Brain dialog, source retrieval and existing chat contract | `public/atlas/brain.js`, `brain.css` |
| Loopback-only development handler adapter | `scripts/preview-atlas.mjs` |
| Browser checks | `scripts/qa-atlas-brain.mjs`, `scripts/qa-atlas-routes.mjs` |

Motion verification is in `scripts/qa-atlas-motion.mjs`. Existing external SVG image animations use build-generated still copies under `dist/atlas/static-svg/` (28 bindings across the current routes). The original SVG assets remain unchanged. Legacy console and Mirror canvas/relay loops now follow the shared pause and dynamic reduced-motion preference. The homepage's existing pause control is moved to the lower-left corner so it cannot be covered by the Brain launcher; compact screens retain its accessible name with an icon-only presentation.

Conversation uses only the existing same-origin `/api/chat`; Public Sources uses actual `/api/grounding` output and **never generates an answer**. Localhost defaults to Public Sources. Queries and messages are sent only on explicit submission; suggested questions are editable drafts. No transcripts are persisted in browser storage. Language uses `uc-lang`; motion uses `uc-atlas-motion`. Both follow the existing landing controls. The shared dialog intercepts the old console's chat controls to avoid a duplicate chat experience.

### Pre-release findings (historical)

- Local configuration has no chat URL/public key or durable limiter. Actual local public-source retrieval works; live conversational-provider completion is not verified. No credentials were added or exposed, no production API policies were changed, and no provider bypass was added.
- A pre-existing **Spanish risk-routing gap** was confirmed with an isolated server stub, not a real provider: English “Can you transfer money?” returned a 409 review without forwarding; Spanish “Puedes transferir dinero?” reached the stub. The interface is bilingual, but server policy parity is **not** established. Review that existing policy separately before enabling or publishing a bilingual conversational service. The widget does not grant execution authority in either language.
- Generated media is conceptual, not evidence of deployed capabilities. Publication was subsequently approved on 2026-09-19; no unrelated public asset-registry approval records are asserted or modified.
- Browser checks use desktop headless Chromium and software WebGL. Physical-device Safari, real mobile keyboards, and production field performance are not certified.

Phase 1 verification above records the earlier baseline. Phase 2 test reports and screenshots are generated under `artifacts/living-atlas-qa/`; consult the latest report rather than treating the earlier landing-only check as site-wide coverage.

Current Phase 2 checks: production build succeeds; 325 automated tests pass; local public-parity checks pass; 11 Brain browser scenarios and 6 shared-motion scenarios pass. The landing-specific browser suite also passes after integration. Conversation success/error/review browser cases use isolated fixtures; public-source retrieval exercises the real local handler. Preview checks reject source masters, environment files, repository scripts, traversal paths, and untrusted browser origins. Shared compiled files were checked against their source versions. The pre-existing large translation-bundle warning remains; no Lighthouse or field-performance score is asserted.

Whole-site review covered all 53 URL surfaces in 124 viewport cases, with 38 representative screenshots. Actual pointer activation and cross-route EN/ES and motion persistence passed. The two remaining issue classes (Research Organisms' narrow ledger and Escape behavior in 15 older article menus) were fixed and passed all 17 targeted rechecks. No script errors, HTTP errors, or broken images remained in those rechecks. See `phase2-routes-final-report.json` for the full run and `phase2-routes-fix-report.json` for the closure evidence; earlier findings are retained rather than overwritten.

## Approved release preparation

The Spanish risk-routing finding was repaired with accent-insensitive lexical checks and aliases to existing public evidence. The original transfer-money example now requires a 409 review without forwarding. The 57 focused chat tests pass, including 44 Spanish fixtures; this is bounded lexical coverage, not a guarantee of semantic detection in every language. No real provider was called by those tests.

Fresh production checks **before this release** returned 200 for `/api/status`, but 503 `Request limit unavailable` for both `/api/search` and `/api/grounding`. This existing backend configuration/service issue is separate from design publication. The release does not weaken request protection, introduce provider fallbacks, or claim live conversational completion.

The release packaging now excludes creator-only `social/` packets from HTML discovery and static copying, and removes the unintended `/public/lab/index.html` duplicate. Two explicitly production-marked legacy packets (25 and the Quotation Cell 27) remain served because their published articles embed them. All other source creator packets remain intact in the repository. Discovery files now use the active `public/` copies, matching the API registries instead of overwriting them with stale root copies. Publicly linked proof images and the existing Infinity Mirror code/specification downloads under `/assets/specs/` remain available; they are not secret environment or deployment configuration. See `RELEASE.md` for the production target and rollback baseline.
