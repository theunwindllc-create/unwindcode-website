# Website Copy Deck — public heartbeat read

All text below is **proposed**, not deployed. The current evidence supports an unverified public read. Avoid `attested`, `certified`, `immutable`, `irrewriteable`, `non-repudiation`, and “a stranger can verify” for the raw response.

## `/proof/ledger` primary copy

| Surface | Proposed copy |
|---|---|
| `<title>`, OG/Twitter/JSON-LD name | `Public Heartbeat Ledger | Unwind Code` |
| Meta description | `Read the public Internet Computer heartbeat endpoint and the Genesis gate head as First Body reported it. Response certification is not yet available for this read.` |
| Eyebrow | `Public proof · response verification unavailable` |
| Heading | `A public heartbeat report, with its limits in view.` |
| Lead | `This page reads a public Internet Computer canister endpoint. It reports organism beats and the gate ledger head. The current raw HTTP path does not verify the response certificate, so treat these values as reported data, not independently authenticated canister state.` |
| Verification banner | `Delivery status: unverified. The raw gateway returned data, but it does not check an ICP response certificate. We will mark this verified only after a certified response passes a verifying gateway.` |
| Head card | `Genesis gate — reported head` / `Reported sequence` / `Reported truncated hash` / `Last reported beat` |
| Successful raw read | `Report received · response unverified` |
| Raw read fails | `Cannot read the public endpoint. No conclusion about organism liveness follows from this error.` |
| Verification failure | `Cannot verify the canister response. Reported data is not shown as attested.` |
| “What this shows” | `The endpoint's current report of beats and the ledger head First Body included in its last beat. A recent beat is a liveness signal, not evidence that the work succeeded.` |
| “What this does not show” | `The full gate ledger, continuous witnessing, the truth of First Body's report, an authenticated HTTP response, or an immutable history.` |
| Command lead | `This command reproduces the same raw public read. It does not cryptographically verify the result.` |

## Linked surfaces

- `/proof` teaser: `The live ledger shows reported organism heartbeats and the Genesis gate head from a public canister endpoint. The current HTTP read is not certificate-verified; the ledger page explains that limit.`
- Homepage witness slot: `Internet Computer · public report · unverified response` when a raw response succeeds; keep the existing “unreachable · cannot verify” wording on failure.
- Transmission 35: leave historical explanation of the custody/credential design only where factually sourced, but annotate its live widget and link: `Current browser read uses the raw HTTP gateway and is not certificate-verified. The independent witness design and the authenticity of this displayed query are separate questions.` Avoid silently rewriting dated history; a visible correction is clearer.

## Future wording gate

After live verified-host success and negative-path proof, a careful upgrade is `Gateway-verified canister response reporting a beat/head as of [time].` Continue: `This authenticates delivery of the canister's response; it does not prove the gate report was true, the work succeeded, or historical records are irreversible.` No stronger language should ship from a URL change alone.

## Editorial checks

Search route, social, schema, homepage, translations, transmission widget, public metadata, and tests for old claim fragments. The wording should remain consistent at first load, refresh success, error, and share-preview time. No fabricated case study or third-party endorsement is needed.
