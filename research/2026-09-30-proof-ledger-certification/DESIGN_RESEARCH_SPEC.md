# Design Research Spec — verification state in the proof interface

## Existing surface

The checkout's `/proof/ledger` uses a dark `#06060c` field, an iris accent, mono labels, a reported gate-head card, status pills, an organ table, side-by-side “can verify / does not claim” cards, and reproducibility commands (`proof/ledger/index.html`). The homepage has a small public-witness reading (`public/lab/witness.js`, `public/lab/index.html`). These are already legible enough for a copy-led correction; a visual redesign would obscure the trust issue.

## Design direction

- Put a concise **“Response verification unavailable”** label in the hero, above the numbers. Pair it with one sentence identifying the raw gateway and the limit of the reading.
- Separate two axes visually: **delivery verification** (unverified / verified / unavailable) and **reported beat age** (recent / stale / unknown). Green belongs to a current report only when the label states exactly that; it must never imply certified delivery by itself.
- Keep the reported head in a neutral card, using “reported sequence” and “reported truncated hash.” A field may be unavailable even when another is present.
- In the “How to check” card, label the current `curl` example “reproduce the same unverified raw read.” A later verified command belongs behind a tested certification upgrade, not in the current proof claim.
- Preserve the current C7 distinction: network/canister failure is “cannot read,” never “verified down.” Verification failure is similarly an **unknown authenticity** state, not a negative finding about an organism.
- Do not use a lock, check seal, chain badge, or “immutable” motif for the current raw result. Avoid adding imagery; text and restrained state treatment make the boundary clearer.

## Interaction and accessibility

Keep 60-second refresh and the table. If a verified path is later added, do not flash stale verified data after a failed refresh; expose last successful read time separately. Announce state changes in text, keep keyboard focus stable, maintain contrast and reduced-motion behavior, and test English and Spanish labels where the shared witness is bilingual. A status icon must be accompanied by text.

## Proof required before design approval

A reviewer should be able to view (1) raw HTTP success with explicit unverified labeling, (2) verifying-host HTTP 503 without a green “attested” state, (3) network timeout, (4) malformed payload, and (5) a genuinely verified response only after the canister has been fixed. Test browser rendering and metadata, not just component logic. This is a proposed acceptance matrix, not evidence that the states have been implemented.
