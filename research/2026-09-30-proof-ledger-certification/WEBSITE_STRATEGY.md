# Website Strategy — restore a truthful public proof path

## Objective

Make `/proof/ledger` accurate today, then earn stronger copy only after independently observable certification. Keep the route, navigation, organism visual language, and useful public readings.

## Two release gates

1. **Accuracy repair now.** Rename the current surface a public heartbeat/ledger-head read. Mark the raw response “not cryptographically verified.” Keep beat and head as *reported* values. Remove or qualify claims that the browser verifies canister state, that the canister attests received time and non-alteration, and that the data cannot be rewritten. Update `/proof`, Transmission 35's live read, homepage witness label where it implies proof, and visible/social/schema copy. The same raw read may remain only if its status is explicit.
2. **Verification upgrade later.** Canister owner implements response certification or a documented certified-data query. Prove the verifying hostname returns HTTP 200 and a deliberately malformed/uncertified response fails closed. Then switch client reads to the verifying path, remove raw fallback for verified UI, test freshness/CORS and mobile browsers, and cautiously upgrade copy to “gateway-verified response.” Continue to call the ledger head self-reported and the thirty-minute witness gap real. Do not claim immutable history without an independent history/control audit.

## Claim ladder

| Claim | Present evidence | Permitted public wording now | Needed for stronger wording |
|---|---|---|---|
| HTTP payload available | Raw endpoint 200, no certificate headers observed | “Public canister endpoint returned this reported data.” | None for observation. |
| Authentic ICP response | Verifying endpoint 503, certification values absent | “Response verification unavailable.” | Verified gateway 200 or sound client-side certificate verification, with regression tests. |
| Liveness | Payload contains recent-looking beat fields | “The endpoint reports a beat at X.” | Verified data plus freshness checks for “verified report of a beat”; still not proof of successful work. |
| Gate ledger head | First Body places a head in note field | “First Body reported sequence/hash at its last beat.” | Verified delivery authenticates the report, not the gate's underlying ledger. |
| Irrewriteable history | Canister source/control not examined | No immutability claim. | Canister history, upgrade/controller, and append-only behavior reviewed independently. |

## Measurement

Release checks should count unsupported attest/immutable assertions (target zero), demonstrate raw/verified failure distinctions, preserve unknown on network failure, and verify public metadata parity. Future certification completion requires a live verifying-host response and negative-path proof, not a passing mocked test alone.

## Dependencies and authority

The site checkout does not contain the canister source. The verified-host 503 is a technical blocker to the second gate, not a reason to keep overstated copy. Site publication and canister mutation remain separate, human-controlled actions. No deployment is part of this research package.
