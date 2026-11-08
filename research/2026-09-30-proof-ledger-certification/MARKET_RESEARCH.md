# Market Research — trust contract for a public witness

## Observed expectation, not a market-size claim

ICP's current developer guidance treats response certification as the trust mechanism for HTTP query results. It says a query can be answered by one replica; raw hostnames forward responses without verifying their certificate; a verifying hostname rejects failed certification; and sharing raw URLs is a common mistake. [ICP response certification](https://docs.internetcomputer.org/guides/frontends/certification/); [ICP data integrity guidance](https://docs.internetcomputer.org/guides/security/data-integrity-and-authenticity/).

That standard applies directly to the site's claim that strangers can verify an independent canister record. A browser `fetch()` from a raw hostname plus an ordinary `curl` command only reproduces a public answer. Neither step authenticates that answer against ICP certified state. The live verifying URL's HTTP 503 currently confirms the page cannot switch hosts without work on the canister response.

## Content and discoverability implications

The current route's `<title>`, description, Open Graph, Twitter metadata, JSON-LD name, hero, proof panel, and linked `/proof` teaser use attestation or irrewriteability language (`proof/ledger/index.html`, `proof/index.html`). Search snippets may repeat those claims without the page's lower qualifications. A repair must cover metadata as well as visible copy. The canonical route should remain `/proof/ledger`; no route change is needed.

The site already shows an honest unknown state when the HTTP read fails, but its successful state lacks a *verification* dimension. Distinguish “response received” from “certificate verified” and “beat fresh” from “system healthy.” A green pulse should not stand in for cryptographic provenance. ICP also cautions that certified delivery does not prove a canister's chosen response is the only valid historical response; storage/upgrade and append-only claims need separate proof. [ICP response certification](https://docs.internetcomputer.org/guides/frontends/certification/).

## Opportunity and limits

The useful near-term artifact is a precise, inspectable correction that says what the public can observe today and what remains unverified. Later, a certified dynamic HTTP response or a certified-data Candid interface with client verification could support a stronger claim if implemented and demonstrated. ICP documents both approaches; this research has not selected a canister architecture. [ICP response certification](https://docs.internetcomputer.org/guides/frontends/certification/).

No market size, customer demand percentage, SEO ranking gain, or conversion effect was measured. Those would be assumptions, not findings.
