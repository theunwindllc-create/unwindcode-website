# Competitor Research — proof and status patterns

## Direct observations

| Reference | Observed pattern | Applicable lesson | Boundary |
|---|---|---|---|
| [GitHub Status](https://www.githubstatus.com/) | Separates components, operational/degraded/outage states, historical uptime, and dated incidents. | Make state and history legible; show failure rather than smoothing it over. | A status page is an operator report, not cryptographic attestation. Do not borrow its labels as proof of certification. |
| [ICP response-certification guide](https://docs.internetcomputer.org/guides/frontends/certification/) | Explicit verified/raw hostname distinction, verification table, common mistakes, and failure semantics. | Disclose *who* verifies each response and use the verifying path for a certified claim. | Documentation specifies the mechanism; it does not attest this particular canister. |
| [ICP data-integrity guidance](https://docs.internetcomputer.org/guides/security/data-integrity-and-authenticity/) | Warns against serving on `raw` hosts for trustworthy data. | Treat raw as a debugging/observation route, not a user-facing proof route. | Changing a URL cannot create certification in a canister. |

The Unwind proof surface has a useful existing strength: “what this proves / does not prove” appears beside the readings. It can make a sharper distinction than a conventional status page by adding a visible delivery-verification state and an independent test path. That is a recommendation, not an observed competitor feature.

## Anti-pattern to avoid

Do not keep “Live Attestation Ledger” in title and social metadata while quietly qualifying only the body. Do not present a raw `curl` response as third-party verification. Do not fall back from a failed verifying endpoint to raw and retain a verified-looking green state.
