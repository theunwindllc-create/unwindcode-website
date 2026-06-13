# UnwindCode.ai Website Enhancement Plan

Last updated: 2026-06-06

## Backend Priorities

1. Render chat grounding details in the frontend using `citation_display` so `409` responses show safe refusal text, citations, and claim qualifications instead of a generic failure.
2. Continue broadening claim-aware chat grounding beyond phrase maps so site/claim questions are evaluated by registry claim context rather than hardcoded wording.
3. Tune deployed retrieval rate-limit ceilings after reviewing production traffic for `/api/search`, `/api/grounding`, `/api/assets`, `/api/claims`, `/api/organisms`, and `/api/transmissions`; continue reviewing durable limits for the remaining public registry endpoints.
4. Extend public grounding into answer/RAG synthesis only after citation display UI, refusal enforcement, and claim-context rendering are reviewed.
5. Review CSP requirements for external fonts, CDN scripts, inline styles, and generated transmission pages before adding a production CSP.

## Recently Completed Backend Hardening

- `api/subscribe.js` now validates browser origins, optional same-site `page_path` metadata, and generic upstream error handling before storage.
- Chat and subscribe origin validation no longer trusts reconstructed `Host` / `X-Forwarded-Proto` origins; missing-origin requests with unreviewed hosts are rejected, localhost origins are development-only unless explicitly configured, and chat origins no longer inherit subscribe-only allowlist config.
- `api/subscribe.js` now supports optional durable pre-storage rate limiting through `RATE_LIMIT_REST_URL`, `RATE_LIMIT_REST_TOKEN`, and `RATE_LIMIT_SALT`, sending only salted hash keys and route/window metadata.
- Durable rate-limit identity now ignores forwarded client IP headers by default, validates proxy header IP shape when `RATE_LIMIT_TRUST_PROXY_HEADERS=true`, and omits `User-Agent` from the primary quota key so spoofed headers or browser-string rotation cannot split limiter buckets.
- `api/subscribe.js` now fails closed in production with a generic `503` when durable rate-limit configuration is missing, unavailable, or returning non-2xx HTTP errors.
- `api/subscribe.js` now avoids echoing normalized subscriber email addresses in successful public responses for both Supabase REST and Edge Function storage paths.
- Homepage signup now uses only same-origin `/api/subscribe`; direct provider fallback coordinates and function paths are no longer shipped in browser code.
- `SUBSCRIBE_LOG_EVENTS=true` now enables non-sensitive subscribe event logs without printing submitted email addresses, Supabase service keys, or upstream response bodies.
- `api/chat.js` now proxies homepage chat through same-origin origin/payload validation, generic upstream error handling, and optional metadata-only logs; production browser traffic no longer directly calls the Supabase chat function.
- `api/chat.js` now supports optional durable pre-forward rate limiting through `RATE_LIMIT_REST_URL`, `RATE_LIMIT_REST_TOKEN`, and `RATE_LIMIT_SALT`, sending only salted hash keys and route/window metadata.
- `api/chat.js` now fails closed in production with a generic `503` when durable rate-limit configuration is missing, unavailable, or returning non-2xx HTTP errors.
- `api/chat.js` now fails closed in production with a generic `503` when explicit Supabase URL or anon-key upstream config is missing after the durable limiter check, preventing chat traffic from falling back to baked-in upstream defaults.
- `api/chat.js` now rejects control-character message payloads before forwarding and applies a server-side grounding gate for financial/Web3/live-deployment/autonomous-authority/wallet-signing prompts, transaction-action prompts such as swaps/fund transfers/transaction signing, plus selected future-vision site-claim prompts.
- Risky-domain chat prompts now return `409` with `answer_generation: disabled` instead of requesting upstream answers when public grounding requires review or cannot produce reviewed claim qualifications.
- `api/_shared/grounding-policy.js` now provides the shared grounding packet schema for `/api/grounding` and risky-domain `/api/chat` blocks, including answer policy, citations, citation indexes, refusal rules, review flags, and human-review decisions.
- Chat grounding `409` responses now embed the shared packet shape while preserving `POST /api/chat` origin checks, rate limits, `no-store`, and blocked-answer status semantics.
- Homepage chat now uses only same-origin `/api/chat`, so grounding `409`, validation, and upstream failures cannot fall through to direct provider calls from browser code.
- The shared durable rate-limit helper now treats configured limiter non-2xx HTTP responses as unavailable and fails closed in production before chat forwarding or subscriber storage.
- `api/subscribe.js` now fails closed in production with a generic `503` when explicit Supabase URL plus a reviewed REST or Edge Function credential path is missing after the durable limiter check, preventing subscriber storage from falling back to baked-in upstream defaults.
- `public/llms.txt`, `public/robots.txt`, and `public/sitemap.xml` now publish live-route-only AI/crawler metadata.
- `public/data/organisms.json` and `api/organisms.js` now provide a public-safe, source-backed, read-only organism registry.
- `public/ai-services.json` now publishes live-route-only AI-service metadata for `/api/architecture`, `/api/assets`, `/api/chat`, `/api/claims`, `/api/organisms`, `/api/status`, `/api/subscribe`, and `/api/transmissions` with bounded claim scopes, citations, source files, and safety boundaries.
- `public/data/transmissions.json` and `api/transmissions.js` now provide public-safe transmission retrieval seeds with citations, confidence, memory layers, topic filtering, and read-only access.
- Direct `/api/transmissions` responses now decorate public transmission entries with inferred claim references, compact claim context, and public-safe claim qualifications from the public claim registry, including interpretation boundaries and citations for high-risk financial/Web3 transmissions.
- Direct `/api/transmissions` claim context now conservatively marks `web3-safety`, `financial-safety`, and `approval-gates` topic tags as qualification-required with a sensitive-topic review flag, even when no explicit claim row matches the transmission.
- `/api/transmissions` now returns stable generic JSON failures with `Cache-Control: no-store` for invalid lookup values, unknown ids, write methods, and registry/claim-loader failures.
- `public/data/architecture.json` and `api/architecture.js` now provide public-safe architecture retrieval seeds with citations, confidence, categories, memory layers, and read-only access.
- `/api/architecture` now returns non-cacheable generic JSON errors for malformed lookup values, unknown ids, write methods, and registry-loader failures while preserving public cache headers for successful public registry reads.
- `public/data/assets.json` and `api/assets.js` now provide public-safe asset provenance records with source-file hashes, generated file hashes, byte counts, alt text, rights notes, publication status, manual approval gates, machine-readable authority boundaries, public-safe approval record schemas, and read-only access.
- Asset packages now expose canonical `asset_package_sha256` values for future approval/provenance binding, `/api/assets` fails closed when approval records mismatch package ids or digests, and search/grounding preserve the digest before downstream RAG use.
- `public/data/assets.json` now keeps `approval_records` empty until a reviewed publication/provenance approval exists, while defining role-based public approval fields that exclude private identities, raw prompts, credentials, private notes, and sensitive on-chain data.
- `/api/assets` now uses a shorter `public, max-age=60, must-revalidate` success cache policy with `ETag`, `Last-Modified`, and full-registry conditional `304` support for approval-bearing public asset metadata.
- `/api/assets` now returns non-cacheable generic JSON errors for malformed lookup values, unknown ids, write methods, and registry-loader failures while preserving public cache headers for successful public registry reads.
- `/api/assets` now uses the shared durable rate-limit hook for valid public asset registry reads, with `ASSETS_RATE_LIMIT_MAX` and `ASSETS_RATE_LIMIT_WINDOW_SECONDS` overrides and production fail-closed behavior when limiter configuration is missing or unavailable.
- `public/data/claims.json` and `api/claims.js` now provide public-safe claim/evidence labels for homepage and financial/Web3 claims before broad retrieval or RAG amplification.
- `/api/claims` now returns non-cacheable generic JSON errors for malformed lookup values, unknown ids, write methods, and registry-loader failures while preserving public cache headers for successful public registry reads.
- `/api/claims` now uses the shared durable rate-limit hook for valid public claim registry reads, with `CLAIMS_RATE_LIMIT_MAX` and `CLAIMS_RATE_LIMIT_WINDOW_SECONDS` overrides and production fail-closed behavior when limiter configuration is missing or unavailable.
- `public/data/architecture.json` and `public/data/organisms.json` now carry claim references that match `public/data/claims.json`, preserving claim status, evidence status, and risk labels during retrieval.
- `/api/organisms` now returns non-cacheable generic JSON errors for malformed lookup values, unknown ids, write methods, and registry-loader failures while preserving public cache headers for successful public registry reads.
- `/api/organisms` now uses the shared durable rate-limit hook for valid public organism registry reads, with `ORGANISMS_RATE_LIMIT_MAX` and `ORGANISMS_RATE_LIMIT_WINDOW_SECONDS` overrides and production fail-closed behavior when limiter configuration is missing or unavailable.
- `api/status.js` now provides a public-safe read-only backend status endpoint that aggregates public service ids, endpoints, registry counts, review status, asset approval counts, claim-status counts, public operational controls, and explicit metadata boundaries without exposing secrets, prompts, runtime evidence, user submissions, raw asset payloads, env configuration, or deployment details.
- `public/ai-services.json` now carries public `operational_controls` for chat, subscribe, assets, claims, organisms, transmissions, search, and grounding so `/api/status` can list durable-rate-limited, production-fail-closed, same-origin guarded, and answer-disabled endpoints from metadata instead of live configuration.
- `/api/status` now returns non-cacheable generic errors for write methods and public metadata loader failures, while refreshing its in-process status cache when public metadata source file signatures change.
- `api/search.js` now provides a read-only lexical search endpoint over public architecture, asset, claim, organism, and transmission registries with type, claim-status, evidence-status, and risk-level filters.
- `api/search.js` now returns deterministic lexical ranking, match scores, matched terms, compact public-safe snippets, and claim-context summaries for retrieval-ready search results.
- `api/search.js` now preserves public memory layers and memory context for architecture, organism, and transmission results, supports a bounded `memory_layer` filter, and keeps private/runtime/user memory plus embeddings out of public retrieval.
- `api/search.js` now explicitly returns answer generation disabled, a grounding-required answer policy, and retrieval-only boundaries so search snippets are not consumed as synthesized answers.
- Individual `/api/search` results now carry disabled-answer snippet semantics so downstream agents treat snippets as evidence excerpts that require grounding, not final answers.
- Asset search results now carry approval context, `public_safe: false`, `requires_human_review: true`, and explicit review flags when asset packages require manual approval, are not posted, or are not public-safe.
- Asset search results now preserve `authority_boundary` metadata so direct retrieval consumers can see that provenance records grant no automated posting, wallet, paid-media, on-chain publication, or unreviewed RAG authority.
- `api/search.js` now returns query-bearing success responses with `Cache-Control: private, no-store` and validation/method/registry-loader errors with `Cache-Control: no-store`, preventing accidental private query text and transient errors from entering shared caches.
- `api/search.js` now uses the shared durable rate-limit hook for public retrieval queries, with `SEARCH_RATE_LIMIT_MAX` and `SEARCH_RATE_LIMIT_WINDOW_SECONDS` overrides and production fail-closed behavior when limiter configuration is missing or unavailable.
- `api/_shared/public-search.js` now centralizes public-registry retrieval so search and grounding packets use the same safety boundary.
- `api/_shared/public-search.js` now memoizes public registry JSON in process with file size/mtime invalidation and deep-freezes the cached registry object, reducing repeated file reads after query responses became non-cacheable while preventing stale or mutated shared retrieval state.
- `api/grounding.js` now provides a read-only public grounding packet endpoint with source snippets, citation indexes, required claim qualifications, refusal rules, review flags, machine-readable answer policy, and answer generation disabled.
- Grounding packets now include frontend-ready `citation_display` metadata and source-level `citation_display_refs` so chat and future RAG UI code can render numbered public citations without deriving display rules from prose.
- Grounding packet sources now carry source-level disabled-answer safety fields, including packet-level review inheritance, so public metadata safety is not mistaken for standalone answer permission when a source is consumed outside the packet envelope.
- Grounding packet sources now preserve public memory layers and defensively copied memory context so source consumers cannot mutate the packet's memory contract.
- `api/grounding.js` now returns query-bearing success responses with `Cache-Control: private, no-store` and validation/method/registry-loader errors with `Cache-Control: no-store`, preventing grounding query context and transient failures from entering shared caches.
- `api/grounding.js` now uses the shared durable rate-limit hook for public grounding packets, with `GROUNDING_RATE_LIMIT_MAX` and `GROUNDING_RATE_LIMIT_WINDOW_SECONDS` overrides and production fail-closed behavior when limiter configuration is missing or unavailable.
- Asset grounding packets now preserve approval-required asset review flags and block synthesis with explicit manual-approval and not-posted reasons.
- `api/_shared/public-search.js` now infers transmission claim references from the public claim registry when source routes/files overlap, preserving high-risk financial/Web3 claim context for transmission-only search and grounding packets.
- `api/_shared/claim-context.js` now centralizes transmission claim-context decoration for direct transmissions, search, and grounding. Sensitive transmission topics (`web3-safety`, `financial-safety`, `approval-gates`) now preserve `sensitive_topic_requires_grounding` review flags through `/api/search` and `/api/grounding`, even when a transmission has no explicit matching claim row.
- `/api/transmissions` now uses the shared durable rate-limit hook for valid public transmission registry reads, with `TRANSMISSIONS_RATE_LIMIT_MAX` and `TRANSMISSIONS_RATE_LIMIT_WINDOW_SECONDS` overrides and production fail-closed behavior when limiter configuration is missing or unavailable.
- `public/ai-services.json` now includes `/api/search` as a public-safe service surface with source files, citations, and claim-context boundaries.
- `public/ai-services.json` now includes `/api/grounding` as a public-safe service surface for citation packets before RAG answer synthesis.
- `vercel.json` now adds low-risk global security headers for referrers, sensitive browser permissions, HSTS, frame denial, and content-type sniffing while deferring CSP until external asset/script requirements are reviewed.

## Guardrails

- Preserve existing homepage, transmission routes, Vite build behavior, and same-origin email signup/chat behavior.
- Avoid new dependencies unless a backend capability cannot be implemented safely with the current runtime.
- Keep Web3 usage limited to provenance, attestations, approval proofs, audit hashes, and future identity verification.
