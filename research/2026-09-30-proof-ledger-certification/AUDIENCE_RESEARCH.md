# Audience Research — questions a proof visitor needs answered

No interviews or analytics were supplied. These are **inferred audience tasks** from the site's existing `/proof`, `/proof/ledger`, and Transmission 35 surfaces, not measured personas.

| Visitor | Question | Required answer |
|---|---|---|
| Skeptical builder or auditor | Did these bytes actually come from certified canister state? | Show verification status and the path/mechanism. Today: no verified response, even though raw HTTP returns data. |
| Operator | Which organs reported a beat, and when? | Present reported age/sequence, source, read time, and unknown/error state without equating a beat with correctness. |
| Collaborator or customer | What does the gate head prove? | A reported sequence/hash at the last beat; not ledger contents, correct work, full history, or continuous coverage. |
| Researcher | Can I reproduce the result without Unwind's rendering? | Give a command for the same raw read, explicitly labelled an unverified reproduction. Give the verifying endpoint and current failing state as the future verification check. |

The existing page addresses some of these questions but labels the answer as attestation and irrewriteability. Because the source page is Vercel-served, even a later gateway-verified data fetch will not make the site's rendering code independent of Unwind. The page already notes that distinction; retain it.

Accessibility needs: status in text alongside color, descriptive failure language, keyboard-readable verification details, an announcement when state changes, and reduced-motion parity. The current UI already has text pills, tables, and a reduced-motion rule; any new verification status should follow those patterns. These are design recommendations based on the checkout, not usability-test findings.
