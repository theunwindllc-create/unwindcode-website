# Living Atlas release — 2026-09-19

The owner explicitly approved making this the new public website design. The release uses the existing GitHub-to-Vercel production pipeline, not a new hosting project.

## Release target and preserved baseline

- Repository: `theunwindllc-create/unwindcode-website` (public).
- Production branch: `main`.
- Vercel project: `dist`, scope `jesus-casares-s-projects`.
- Domain: `https://www.unwindcode.ai`.
- Previous production commit: `a3270976b2f1837111f22df41c8416da563e40c3`.
- Previous successful deployment: `dpl_Ae5ZN2jMs1s6o5LjvkXbyqNNdvSs`.
- Previous deployment URL: `https://dist-c02g2cuj6-jesus-casares-s-projects.vercel.app`.
- The newer Genesis phone-line handler and its commits are preserved in this release.

## Build and release requirements

Use **`npm run build`**, not plain `vite build`: the two post-build steps apply the shared shell to 52 allowlisted routes, then promote the lab homepage to `/` (53 URL surfaces). The original console remains at `/home`.

The linked Git pipeline is the release path because the current direct Vercel CLI session is expired. Commit the tested package, fast-forward the production branch without overwriting remote changes, then require successful completion for **Production – dist**. A separate historically failing Vercel project named `unwindcode` is not the production target.

Verify the live domain independently: check fresh HTML and shared asset hashes against the local production build, critical routes, artwork, public API contracts, the mobile layout, and the Brain launcher. A successful Git push alone is not proof of publication. Do not claim conversational-provider availability from public status metadata; it intentionally does not disclose provider configuration or health.

No credentials, local environment files, QA artifacts, or source PNG masters belong in the served `dist/` website. Source artwork and reusable creative briefs remain in the repository for future design work. Existing public provenance registries and authority boundaries remain unchanged.

The release also excludes creator-only `social/` packets from the served build and removes the accidental `/public/lab` duplicate. The two production-marked packets embedded by articles 25 and Quotation Cell 27 are explicitly allowlisted; local source packets remain untouched. Existing publicly linked `/assets/specs/` proof/specification downloads and `/assets/social/` preview art remain available. Active `public/` discovery files are preserved instead of being overwritten with stale root copies.

Pre-release production API baseline: `/api/status` returned 200; fixed public-safe reads of `/api/search` and `/api/grounding` returned 503 `Request limit unavailable`. This is a pre-existing backend service/configuration limitation, not a successful Brain availability check. Do not disable request protection to conceal it. Spanish lexical chat guards were strengthened and tested with isolated provider fixtures; their coverage is bounded, not universal multilingual understanding.

## Recovery

Final local release validation: **331 automated tests passed**, `npm run build` passed, `git diff --check` passed, and local public-parity checks passed. The served-output audit confirms 53 enhanced URL surfaces, exactly two intentionally public legacy packet directories, active discovery-file parity, and no Atlas source masters, environment files, QA output, or design handoff documents in `dist/`. The pre-existing large translation-bundle warning remains.

If production verification fails materially, inspect the deployment before changing anything else. The previous successful deployment above is the rollback target; do not rewrite repository history or revert the unrelated Genesis phone-line changes. Keep the previous release identity available until this release is verified.
