# Brand Discovery — public ledger truth repair

## Scope and evidence status

This is research for a narrow accuracy repair on `/proof/ledger` and the public pages that repeat its attestation claim. It is not an authorization to edit, commit, deploy, or change the canister. Checked 2026-09-30 at about 14:47 UTC.

**Checkout fact:** `proof/ledger/index.html` reads `rt6ds-eqaaa-aaaad-agv7q-cai.raw.icp0.io`, calls the page a “Live Attestation Ledger,” and says the browser sees data that cannot be rewritten. `proof/index.html` calls the head “attested.” `public/lab/witness.js` and Transmission 35 also read the raw hostname. The source page and deployed page are different byte streams: local 24,491 bytes, SHA-256 `ee9ca3fda8632a6bcc19e1aa45d7356da8b4a056f362488d86db8f8ea6443cb0`; live 25,476 bytes, SHA-256 `7e8c01f39f2740213e2481f08a448cfffd9f68f0bb21b70ac90af395a3777c61`. The claims and raw URL were confirmed in both. Source lines may not map exactly to deployed lines.

**Live observation:** `https://www.unwindcode.ai/proof/ledger` returned HTTP 200 with the raw URL and irrewriteability language. The raw canister hostname returned HTTP 200 but no `IC-Certificate` or `IC-CertificateExpression` response headers. The matching verifying hostname `https://rt6ds-eqaaa-aaaad-agv7q-cai.icp0.io/` returned HTTP 503, `backend_response_verification`, “Certification values not found.” This is a point-in-time read, not an audit of the canister's storage or controllers.

**Platform fact:** ICP says the raw hostname does not verify response certificates. A verifying hostname checks a certified HTTP response and rejects failure. For a custom dynamic HTTP canister, certification must be implemented in the canister; a URL substitution is insufficient. [ICP response certification](https://docs.internetcomputer.org/guides/frontends/certification/).

## Brand fit

Unwind Code's public promise is “No claim without a trail” and the proof page opens “Trust comes from artifacts, not adjectives” (`proof/index.html`, `proof/ledger/index.html`). The present claim of verified attestation outstrips the observable delivery path. A visible correction serves the brand better than a green status badge on unverified bytes.

The design language is dark, architectural, and compact: `#06060c` theme, monospace source labels, status pills, public proof cards, and clear “does / does not prove” panels. Keep that language and the real liveness data while changing the asserted epistemic status.

## Inferences and unknowns

- **Inference:** A visitor can reproduce the raw HTTP payload, but reproduction is not cryptographic verification. A gateway or replica can still affect an unverified query response.
- **Unknown:** The canister source, control/upgrade authority, storage implementation, and independently verified append-only history are not in this site checkout. Do not infer “irrewriteable” from a canister URL or a reported hash.
- **Unknown:** The human and technical path to add response certification to this canister. The later build needs canister-owner review and evidence before public copy upgrades.

## Position

Until a verified response is demonstrable, name this a **public heartbeat read** with **verification unavailable**. Preserve the distinction among (1) a reported beat/head, (2) authentic certified delivery of that report, and (3) correctness or immutability of the underlying ledger.
