# Unwind Code Website — Agent Instructions

## Repository
`~/unwind-brain/unwind-website/unwindcode-website/`

## Deployment
- **Platform:** Vercel (connected to GitHub)
- **Domain:** unwindcode.ai
- **Auto-deploy:** Push to `main` → Vercel builds and deploys automatically
- **Build:** `npx vite build` (multi-page via `vite.config.js`)
- **Local parity check:** `npm run check:public-parity` compares the latest reviewed transmission across `/api/status`, sitemap, `llms.txt`, `ai-services.json`, homepage, and archive, and runs fixed public-safe `/api/search` plus `/api/grounding` contract smoke checks using local public sources only.
- **Live parity check:** `npm run check:public-parity:live` runs the same read-only checks against `https://www.unwindcode.ai`; use it only when network/live production verification is intended.

## Pre-Build Research Requirement

Before creating, redesigning, or materially analyzing a website surface, run the Website Development Team's Website Strategy Research Agent from `../../agents/website-development-team/agents/website-strategy-research-agent.md`.

The research phase must happen before implementation and must produce the nine-file package in an approved research directory: `BRAND_DISCOVERY.md`, `MARKET_RESEARCH.md`, `COMPETITOR_RESEARCH.md`, `AUDIENCE_RESEARCH.md`, `WEBSITE_STRATEGY.md`, `DESIGN_RESEARCH_SPEC.md`, `WEBSITE_COPY_DECK.md`, `ASSET_CREATIVE_BRIEFS.md`, and `IMPLEMENTATION_BRIEF_FOR_WEBSITE_BUILD.md`.

Rules:
- Do not build during the research phase.
- Inspect repository evidence first: pages, components, copy, assets, metadata, README files, config, style tokens, and deployment instructions.
- If internet access is available and allowed, research competitors, industry expectations, visual standards, SEO/content opportunities, and cite important sources.
- If internet access is unavailable, clearly label assumptions and use repository evidence.
- Do not invent fake testimonials, fake client logos, fake case studies, fake awards, fake statistics, or fake proof.
- Separate facts, inferences, and assumptions.
- Use the implementation brief as the input for the later build phase.

## Site Architecture

```
index.html                          ← Homepage (single-page scroll)
api/architecture.js                 ← Read-only public architecture registry endpoint
api/assets.js                       ← Read-only public asset provenance endpoint
api/claims.js                       ← Read-only public claim/evidence registry endpoint
api/subscribe.js                    ← Vercel email signup storage endpoint
api/chat.js                         ← Vercel same-origin chat governance proxy
api/grounding.js                    ← Read-only public grounding packet endpoint
api/organisms.js                    ← Read-only public organism registry endpoint
api/search.js                       ← Read-only public registry search endpoint
api/status.js                       ← Read-only public backend status endpoint
api/transmissions.js                ← Read-only public transmission registry endpoint
public/ai-services.json             ← Public-safe active API/service metadata
public/data/assets.json             ← Source-backed public asset provenance registry
public/data/architecture.json       ← Source-backed public architecture registry
public/data/claims.json             ← Source-backed public claim/evidence registry
public/data/organisms.json          ← Source-backed public organism registry
public/data/transmissions.json      ← Source-backed public transmission registry
transmissions/index.html            ← Blog listing (all posts)
transmissions/01-*.html             ← Individual post pages
transmissions/15-*.html             ← Latest: interactive flagship
style.css                           ← Global design system
main.js                             ← Homepage interactivity
vite.config.js                      ← Auto-discovers transmissions/*.html
vercel.json                         ← Clean URL routing
```

## Email Signup Storage

- Homepage form posts to same-origin `POST /api/subscribe` first.
- `api/subscribe.js` validates and normalizes the email, then upserts into Supabase `website_subscribers` using `SUPABASE_SERVICE_ROLE_KEY`.
- Production upstream env vars: `SUPABASE_URL` plus either `SUPABASE_SERVICE_ROLE_KEY` for REST storage or `SUPABASE_ANON_KEY` for the Edge Function fallback.
- Optional env vars: `SUBSCRIBERS_TABLE` defaults to `website_subscribers`; optional `RATE_LIMIT_REST_URL`, `RATE_LIMIT_REST_TOKEN`, `RATE_LIMIT_SALT` enable durable abuse checks.
- In production, missing upstream env returns a generic `503` after the durable limiter check and before any Supabase request.
- When durable subscribe rate limiting is configured, send only salted hash keys and route/window metadata to the limiter; never send submitted email addresses, raw client addresses, service keys, or upstream bodies.
- Keep upstream coordinates and service-role keys server-side only. Browser code must call `/api/subscribe` and must not ship direct provider fallback paths, provider tokens, or baked-in upstream configuration in `main.js`.

## Brain Chat Proxy

- Homepage chat posts to same-origin `POST /api/chat` in production.
- `api/chat.js` validates browser origin, message length, and conversation id shape before forwarding to the Supabase `chat` Edge Function.
- Production upstream env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`; optional `CHAT_ALLOWED_ORIGINS`, optional `CHAT_LOG_EVENTS=false`, optional `RATE_LIMIT_REST_URL`, optional `RATE_LIMIT_REST_TOKEN`, optional `RATE_LIMIT_SALT`.
- In production, missing upstream env returns a generic `503` after the durable limiter check and before any Supabase request.
- When durable chat rate limiting is configured, send only salted hash keys and route/window metadata to the limiter; never send prompt text, raw client addresses, anon keys, or upstream bodies.
- Financial/Web3/live-deployment/autonomous-authority/wallet-signing prompts, transaction-action prompts such as swaps/fund transfers/transaction signing, and selected future-vision site-claim prompts must pass server-side grounding review before upstream chat answers.
- Browser code must call `/api/chat` only. Do not add direct browser calls to third-party chat functions, localhost-only provider fallbacks, provider tokens, or baked-in upstream configuration.

## Public Organism Registry

- `public/data/organisms.json` is the active public-safe registry for organisms described by this site package.
- `api/organisms.js` exposes read-only `GET /api/organisms` and `GET /api/organisms?id=<organism-id>` responses for future chat/search/RAG use.
- Keep the registry limited to public copy, active public routes, public source files, claim references, and review status. Do not include prompts, credentials, runtime logs, customer data, deployment evidence, owner manifests, or provider configuration.
- Valid `/api/organisms` reads must pass the shared durable rate-limit hook before registry loading. Limiter payloads must contain only salted route/client hashes plus limit/window metadata, never organism ids, capability text, memory labels, claim references, source routes, registry contents, or raw client addresses.
- Keep `/api/organisms` errors generic and `Cache-Control: no-store`; successful public registry reads may use public cache headers.

## Public Architecture Registry

- `public/data/architecture.json` is the active public-safe registry for architecture concepts described by the homepage and published transmissions.
- `api/architecture.js` exposes read-only `GET /api/architecture`, `GET /api/architecture?id=<concept-id>`, and `GET /api/architecture?category=<category>` responses for future chat/search/RAG use.
- Keep architecture metadata limited to public concepts, source-backed claims, claim references, memory layers, citations, confidence, and review status. Do not include exact approval mechanics, private notes, raw prompts, runtime logs, deployment procedures, or operational commands.
- Keep `/api/architecture` errors generic and `Cache-Control: no-store`; successful public registry reads may use public cache headers.

## Public Transmission Registry

- `public/data/transmissions.json` is the active public-safe registry for every published transmission HTML file in this package.
- `api/transmissions.js` exposes read-only `GET /api/transmissions`, `GET /api/transmissions?id=<transmission-id>`, and `GET /api/transmissions?topic=<topic-tag>` responses for future chat/search/RAG use.
- Keep transmission metadata limited to public summaries, topic tags, memory layers, citations, source files, confidence, and review status. Do not include drafts, prompts, private notes, runtime logs, deployment evidence, or inactive routes.
- `api/_shared/claim-context.js` is the shared transmission claim-context decorator used by direct transmissions, search, and grounding. Keep inferred claim references, claim qualifications, and sensitive-topic review flags centralized there.
- Valid `/api/transmissions` reads must pass the shared durable rate-limit hook before registry and claim-context loading. Limiter payloads must contain only salted route/client hashes plus limit/window metadata, never transmission ids, topic filters, source routes, claim context, registry contents, or raw client addresses.

## Public AI Service Metadata

- `public/ai-services.json` lists only active public API surfaces in this package: `/api/architecture`, `/api/assets`, `/api/chat`, `/api/claims`, `/api/grounding`, `/api/organisms`, `/api/search`, `/api/status`, `/api/transmissions`, and `/api/subscribe`.
- Keep service descriptions bounded to current behavior, source-backed public routes, source files, and safety boundaries.
- Keep `public/ai-services.json` source files limited to public controllers, registries, tests, and docs. Do not advertise creator-only social packet paths, captions, ready-to-upload folders, downloads, or exports in public service discovery.
- Do not copy route-rich worktree metadata into this package unless those routes exist here and the claims have matching public proof.

## Public Registry Search

- `api/search.js` exposes read-only `GET /api/search?q=<query>` over `public/data/architecture.json`, `public/data/assets.json`, `public/data/claims.json`, `public/data/organisms.json`, and `public/data/transmissions.json`.
- Supported filters are `type`, `claim_status`, `evidence_status`, `risk_level`, and `memory_layer`; filters must preserve claim status, evidence status, risk labels, citations, source files, claim references, and public memory labels when available.
- Search results include deterministic lexical rank, match score, matched terms, compact public-safe snippets, and claim-context summaries for downstream RAG or chat grounding.
- Search indexing may include explicit public claim-reference fields (`claim_id`, statuses, `risk_level`, and `purpose`) so organism, architecture, and transmission retrieval can find safety qualifications and show matched architecture/organism support snippets without indexing arbitrary nested objects.
- Architecture, organism, and transmission search results must preserve public `memory_layers` and `memory_context` while excluding private memory, runtime memory, user memory, and unstated embeddings.
- Keep search lexical and public-registry scoped until a reviewed RAG/answering layer is added. Do not search private repository files, private prompts, user submissions, runtime evidence, credentials, hidden procedures, or provider configuration.
- `/api/search` responses must keep `answer_generation: disabled`, `synthesis_requires_grounding: true`, and retrieval-only boundaries. Search snippets are not generated answers; downstream answer work must request `/api/grounding`, render citations, and review claim qualifications first.
- Every `/api/search` result must also keep disabled-answer snippet semantics (`answer_generation`, `snippet_policy`, and `retrieval_semantics`) so individual snippets cannot be separated from their retrieval-only contract.
- `api/_shared/public-search.js` memoizes public JSON registries in process with file size/mtime invalidation and freezes the cached object. Do not add runtime/private evidence to that loader.
- High-risk Web3, approval-gated, and financial search results must retain claim context or sensitive-topic review flags before any downstream chat or answer generation.
- Approval-required asset search results must retain approval context, asset review flags, `public_safe: false`, and `requires_human_review: true` before any downstream grounding or answer generation.
- Asset search results are a minimized retrieval projection, not the full asset ledger: omit raw `approval_records`, full approval schemas, and internal creator packet paths such as `social/`, `exports/`, `ready-to-upload`, `downloads/`, caption files, and carousel HTML. Keep only public review flags, authority boundaries, approval-record counts, schema version, and public route/registry citations. Use `/api/assets` for the detailed public provenance contract.
- Query-bearing `/api/search` responses must stay `private, no-store`; validation, method, and loader failures must stay `no-store`.
- Valid `/api/search` retrieval requests, including `HEAD`, must pass query/filter validation, the shared durable rate-limit hook, public registry loading, and asset provenance validation before success. Limiter payloads must contain only salted route/client hashes plus limit/window metadata, never raw query text, snippets, source files, or registry results. `HEAD` success and error responses must remain bodyless.

## Public Grounding Packet

- `api/grounding.js` exposes read-only `GET /api/grounding?q=<query>` for top-five public search grounding packets.
- Grounding packets include sources, citation indexes, `citation_display`, required claim qualifications, refusal rules, review flags, machine-readable answer policy, and explicit `answer_generation: disabled`.
- `citation_display` and per-source `citation_display_refs` are frontend rendering contracts only; they do not grant synthesis, execution authority, wallet authority, or deployment proof.
- Every grounding source must keep disabled-answer source semantics (`answer_generation`, `source_policy`, `retrieval_semantics`, and `answer_safety`) so individual sources remain citation scaffolds and preserve packet-level review requirements when separated from the packet.
- Grounding sources must preserve public `memory_layers` and `memory_context` from search results while excluding private memory, runtime memory, user memory, and unstated embeddings.
- Keep grounding packets as retrieval scaffolding only. Do not generate final answers, infer live deployment state, claim wallet authority, use private/runtime evidence, or bypass claim qualifications.
- Treat `answer_safety.public_metadata_safe` separately from `answer_safety.answer_safe`; public source metadata is never standalone answer permission.
- `api/_shared/public-search.js` is the shared public-registry search helper used by both `/api/search` and `/api/grounding`; keep it limited to public JSON registries.
- Approval-required asset grounding sources must preserve asset review flags and blocked answer-policy reasons until a human has reviewed publication and usage permissions.
- Asset grounding citations must inherit the minimized asset retrieval projection: cite public routes or `public/data/assets.json`, never creator-only packet files. Grounding sources may carry safe alt text, approval context, approval-record counts, and authority boundaries, but not raw approval records or internal packet paths.
- Query-bearing `/api/grounding` responses must stay `private, no-store`; validation, method, and loader failures must stay `no-store`.
- Valid `/api/grounding` retrieval requests, including `HEAD`, must pass query/filter validation, the shared durable rate-limit hook, public registry loading, asset provenance validation, and grounding packet assembly before success. Limiter payloads must contain only salted route/client hashes plus limit/window metadata, never raw query text, citations, snippets, qualifications, or packet contents. `HEAD` success and error responses must remain bodyless.

## Public Claim Registry

- `public/data/claims.json` is the active public-safe registry for source-backed claim/evidence labels.
- `api/claims.js` exposes read-only `GET /api/claims`, `GET /api/claims?id=<claim-id>`, `GET /api/claims?claim_status=<status>`, `GET /api/claims?evidence_status=<status>`, and `GET /api/claims?category=<category>` responses for future search/RAG, trust records, and public audit use.
- Keep high-risk Web3, autonomy, and financial claims qualified with evidence status, risk level, public citations, interpretation boundaries, and matching references from organism/architecture registries. Do not convert public copy into wallet authority, deployment proof, unreviewed runtime evidence, or unqualified automation claims.
- Valid `/api/claims` reads must pass the shared durable rate-limit hook before registry loading. Limiter payloads must contain only salted route/client hashes plus limit/window metadata, never claim ids, filters, claim labels, citations, source files, registry contents, or raw client addresses.
- Keep `/api/claims` errors generic and `Cache-Control: no-store`; successful public registry reads may use public cache headers.

## Public Asset Provenance

- `public/data/assets.json` is the active public-safe registry for reviewed asset packages in this package.
- `api/assets.js` exposes read-only `GET /api/assets`, `GET /api/assets?id=<asset-package-id>`, `GET /api/assets?review_status=<status>`, and `GET /api/assets?publication_status=<status>` responses for future asset workflow, provenance, and review use.
- Keep asset metadata limited to source files, source-file hashes, generated artifact paths, generated-file hashes, byte counts, alt text, review status, publication status, approval gates, authority boundaries, and public-safe approval record schemas. Do not include private prompts, credentials, provider configuration, user data, unpublished drafts, or public posting authority.
- Asset packages must carry a canonical `asset_package_sha256` that binds package identity, public display metadata, source-file lists, source hashes, generated hashes, rights, approval gates, the full public approval schema, review/publication state, confidence, and authority boundaries before future approval records or attestations reference the package.
- Canonical asset package inputs are mandatory: `packages` must be an array, each package must include non-empty public metadata, non-empty source/generated hash records, a public approval-record schema, rights, approval gates, review/publication state, confidence, and a deny-by-default authority boundary before a digest can be accepted.
- `/api/assets` must recompute `asset_package_sha256` from the canonical package fields before responding; a syntactically valid but noncanonical or incomplete digest must fail closed before public API or retrieval output.
- `/api/search` and `/api/grounding` must load assets through the shared public registry loader, which runs the same asset registry validator before indexing provenance for retrieval or grounding packets.
- Asset registry tests and runtime validation must verify every listed source file has exactly one matching source-file hash entry, and every listed generated file carries byte/hash provenance, so public provenance cannot drift silently.
- Valid `/api/assets` reads must pass the shared durable rate-limit hook before registry or metadata loading. Limiter payloads must contain only salted route/client hashes plus limit/window metadata, never asset ids, filters, source files, generated asset paths, registry contents, or raw client addresses.
- Asset authority boundaries must deny automated posting, wallet signing, paid media activation, on-chain publication, and unreviewed RAG answer authority unless a future reviewed non-public approval lane explicitly changes the state. The public `/api/assets` validator must fail closed if core high-risk authority booleans are missing or true, if optional authority booleans are present and true, if `allowed_uses` includes unsupported/prohibited actions, or if baseline prohibited-use labels are missing.
- Approval record schemas must remain public-safe and role-based only. Exclude private approver identities, raw prompts, private notes, credentials, sensitive user data, wallet secret material, and sensitive on-chain data; keep `approval_records` empty unless a reviewed approval actually exists.
- Future asset approval records must match both `asset_package_id` and canonical `asset_package_sha256`; mismatches must fail closed before public API or retrieval output.
- Future asset approval records must contain exactly the code-owned public approval-record fields, use an allowed approval scope, carry a valid role/timestamp, and set source/generated hash verification booleans to `true`. The embedded registry schema is descriptive, not self-authorizing; any schema version drift, storage-boundary drift, extra/private field, missing required field, unsupported scope, invalid role/timestamp, or unverified hash state must fail closed before `/api/assets` responds.
- Keep `/api/assets` success responses public-cacheable only for public registry metadata, with short revalidation plus `ETag`/`Last-Modified` validators while approval or publication state is present; validation, method, not-found, and loader failures must stay generic and `no-store`.

## Public Backend Status

- `api/status.js` exposes read-only `GET /api/status` status metadata aggregated from `public/ai-services.json`, `public/data/assets.json`, `public/data/architecture.json`, `public/data/claims.json`, `public/data/organisms.json`, and `public/data/transmissions.json`.
- Keep the status endpoint public-safe and aggregate-only. Do not include environment values, provider keys, user submissions, runtime evidence, private prompts, owner manifests, deployment details, or secret configured state.
- `/api/status` must validate `public/data/assets.json` through the shared asset registry validator before reporting asset counts or overall public-safe status; an invalid asset digest or unsafe authority boundary must fail closed with a generic no-store error.
- Status may expose the latest reviewed public transmission pointer from the transmission registry. Treat it as local registry observability, not production deployment proof.
- Status may expose public transmission numbering gaps to support parity checks. Treat gaps as descriptive registry metadata, not proof of missing hidden routes or failed deployment.
- Status may expose public operational-control booleans and endpoint lists from `public/ai-services.json`, such as durable rate limiting, production fail-closed behavior, same-origin guards, and answer-generation-disabled surfaces. Do not expose live env configuration, limiter tokens, salts, raw client addresses, raw query text, provider health, or deployment proof.
- `/api/status` `HEAD` must call the same public status reader as `GET` before success, including asset provenance validation, and must return bodyless `no-store` failures if status loading or validation fails.
- `/api/status` success responses may be public-cacheable, but method errors and public metadata loader failures must be generic and `no-store`; cached status must refresh when public metadata source file signatures change.
- `scripts/check-public-parity.mjs` is the public-proof parity checker. Local mode must stay local-file scoped plus local read-only status/search/grounding handler checks; live mode must stay read-only and clearly separate live production verification from local registry proof. Keep internal `/social/` assets out of sitemap, `llms.txt`, homepage, archive discovery, and minimized RAG retrieval outputs.
- Live parity must classify `/api/search` and `/api/grounding` `429`/`503` responses as endpoint-specific fail-closed RAG contract states with safe `HTTP_<status>` codes, not as generic deployment reachability failures.
- Parity RAG smoke must use fixed public-safe queries only and never accept credentials, private prompts, sensitive notes, arbitrary user queries, POST bodies, or provider/chat prompts.
- Future parity checks may add a reviewed `/api/chat` grounding-gate smoke path, but ordinary chat/provider forwarding must stay out of default parity.

## Design System Tokens (style.css)

```css
--bg-void: #06060c;
--bg-surface: rgba(15, 15, 30, 0.6);
--bg-surface-solid: #0f0f1e;
--accent: #6e2dbe;
--accent-light: #9b59f5;
--accent-hot: #c084fc;
--accent-border: rgba(110, 45, 190, 0.12);
--text-primary: #f0eef6;
--text-secondary: rgba(240, 238, 246, 0.7);
--text-muted: rgba(240, 238, 246, 0.35);
--font: 'Inter', -apple-system, sans-serif;
```

## CRITICAL: Transmission Format Spec

**Every new transmission MUST be interactive.** Static text walls are rejected.

### Required Interactive Elements (minimum 3 per post)

| Element | Technology | Use When |
|:---|:---|:---|
| **Animated Workflow** | CSS timeline with colored step dots | Explaining processes, sequences, build phases |
| **Clickable Module Explorer** | JS grid + detail panel | Showing system components, agent roles, architecture |
| **Chart.js Visualizations** | `<canvas>` + Chart.js CDN | Metrics, comparisons, evolution over time |
| **Expandable Cards** | Click-to-reveal with hidden detail | Memory layers, feature breakdowns, glossaries |
| **Interactive Diagrams** | CSS grid with hover/click states | Network topologies, data flows, hierarchies |

### Chart.js CDN (include in `<head>`)
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

### Reference Implementation
Use `transmissions/15-how-we-give-machines-a-mind.html` as the canonical template. It contains all five interactive patterns.

### Page Structure (mandatory)

```html
<body class="tx-page">
  <nav id="nav" class="scrolled">...</nav>
  <main>
    <section class="tx-hero">           <!-- Hero with transmission number -->
    <div class="container">
      <section class="tx-section">      <!-- Repeat per content section -->
        <div class="tx-section-head">   <!-- Number + Title -->
        <div class="tx-section-label">  <!-- Subtitle -->
        <div class="tx-prose">          <!-- Body text -->
        <!-- INTERACTIVE ELEMENT -->    <!-- Required per section -->
      </section>
      <div class="tx-cta">             <!-- Closing CTA -->
    </div>
  </main>
  <footer id="footer">...</footer>
</body>
```

### CSS Classes (self-contained in `<style>` tag per transmission)

All interactive transmissions embed their CSS in a `<style>` tag in `<head>`. They import `/style.css` for global tokens and nav/footer chrome, then define page-specific interactive styles inline.

### Dark Theme Only

Transmissions use the site's dark void aesthetic. No light-mode `transmission-body` class. Use `tx-page` class on `<body>`.

### Color Palette for Charts

```javascript
const chartColors = {
  accent: 'rgba(155,89,245,1)',        // --accent-light
  accentFill: 'rgba(155,89,245,0.15)',
  hot: 'rgba(192,132,252,1)',          // --accent-hot
  teal: 'rgba(13,148,136,0.7)',
  grid: 'rgba(240,238,246,0.08)',
  text: 'rgba(240,238,246,0.35)'       // --text-muted
};
```

## Adding a New Transmission

1. Create `transmissions/NN-your-slug.html` using Transmission 15 as template
2. Include at least 3 interactive elements from the table above
3. Update `transmissions/index.html` — add new card at top of archive grid, update featured card
4. Update `index.html` — swap first blog card to the new post
5. Run `npm run build` to verify (Vite auto-discovers new HTML files)
6. `git add -A && git commit && git push origin main`
7. Vercel deploys automatically

## SEO Checklist (per transmission)

- [ ] `<title>` with transmission number and `| Unwind Code`
- [ ] `<meta name="description">` — compelling 1-liner
- [ ] `<link rel="canonical">` — full URL
- [ ] Open Graph: `og:type`, `og:title`, `og:description`
- [ ] JSON-LD `Article` schema with author, publisher, dates

## Voice & Tone

- **Architectural, sharp, minimal.** Zero filler language.
- Write like an engineer explaining to a peer, not marketing copy.
- Use the organism metaphor consistently (cells, cortex, memory, synaptic).
- Every section earns its existence with either insight or interactivity.
