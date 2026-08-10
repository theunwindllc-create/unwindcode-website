# Banker Rail — Key Provisioning Runbook

**No secret value appears in this file, in chat, or in any repo file. Ever.**
Coinbase issues API keys as a downloadable JSON file; you load it with a tool or
paste it into an encrypted field. You never retype it.

Status as of 2026-08-09: the rail is LIVE and gated on www.unwindcode.ai.
`BANKER_PAY_SECRET` is provisioned on both ends (Vercel Sensitive + the Mac's
gitignored `~/unwind-brain/.env`) and the auth chain is verified end-to-end.
**Only the Coinbase-issued values are missing.**

## Where each value lives (and why)

| Variable | Home | Why there |
|---|---|---|
| `CDP_API_KEY_ID` (canonical; `CDP_API_KEY_NAME` is the legacy alias) | **Vercel only** | the website signs the Coinbase JWT |
| `CDP_API_KEY_SECRET` | **Vercel only** | the private key — the Mac never holds it |
| `BANKER_WEBHOOK_SECRET` | **Vercel only** | verifies inbound Coinbase webhooks |
| `BANKER_PAY_SECRET` | Vercel **+** Mac `.env` | shared internal secret — DONE ✅ |
| `BANKER_PAY_URL` | Mac `.env` | DONE ✅ |
| `BANKER_PAY_MAX_USD` | optional, both | per-checkout ceiling (default 500) |
| `CDP_CHECKOUT_SANDBOX` | optional, Vercel | `true` routes to the Base Sepolia sandbox |

The Coinbase private key touches exactly one system: Vercel. If the laptop is
lost, no Coinbase credential is on it.

## Steps

1. **Coinbase Business account + KYB** (self-serve; US/Singapore). Business
   account is required before checkout keys exist.
2. **Create a CDP Secret API Key** at <https://portal.cdp.coinbase.com/api-keys/secret>.
   Download `cdp_api_key.json` when offered — this is the only time the secret is
   shown. Keep the file out of any git repo (`~/Downloads` is fine temporarily;
   delete it after step 3).
   - **Either signature algorithm works.** Ed25519 is the Portal default (since
     Feb 2025); ECDSA is selectable. `api/pay.js` detects the key type and signs
     `EdDSA` or `ES256` accordingly, so you don't have to pick carefully.
   - The key file may use `{"id","secret"}` or `{"name","privateKey"}` — both are
     valid; `id`/`name` → `CDP_API_KEY_ID`, `secret`/`privateKey` → `CDP_API_KEY_SECRET`.
   - **Scope:** the **View (read-only)** scope is the one that covers creating and
     managing Checkouts. Counterintuitive, but a wrong scope is a common 401/403.
3. **Load the values into Vercel** — either route, never both:
   - **Dashboard (best for pasting a PEM):** Vercel → project `dist` → Settings →
     Environment Variables → add each for **Production**, mark **Sensitive**.
   - **Terminal (never echoes):** `vercel env add CDP_API_KEY_SECRET production`
     — it prompts and reads the value invisibly.
4. **Register the webhook** and capture the returned secret into
   `BANKER_WEBHOOK_SECRET` (same method as step 3). Target URL:
   `https://www.unwindcode.ai/api/pay-webhook`
5. **Redeploy** — env changes only take effect on a new deployment:
   `npx vercel deploy --prod --yes`
6. **Delete the key file:** `rm ~/Downloads/cdp_api_key.json`

## Test with fake money first (strongly recommended)

Business Checkouts has a **sandbox on the same host, using the same keys** —
payments settle in Base Sepolia USDC, nothing real moves.

1. Set `CDP_CHECKOUT_SANDBOX=true` in Vercel Production, redeploy.
2. Fund a test wallet from the CDP Portal Faucet (Base Sepolia / USDC).
3. Run the verify command below and pay the returned checkout URL with test USDC.
4. When satisfied: **remove `CDP_CHECKOUT_SANDBOX`** (or set it to `false`) and
   redeploy to go live.

Sandbox notes: data auto-purges after 30 days, refunds cap at $2.00, and webhook
subscriptions need a `sandbox: true` label. `api/pay.js` routes both the request
*and* the signed JWT `uri` claim to the sandbox path automatically — they must
match or Coinbase returns a bare 401.

## Verify (no real money)

```bash
cd ~/unwind-brain && set -a && . ./.env && set +a
.venv/bin/python scripts/banker_checkout.py --agent banker --amount 1.00 --memo "first live check" --live
```

Exit codes: `0` created (prints id + url + x402_url) · `2` rail reachable but CDP
keys still missing · `3` local config problem · `1` other failure.

Before keys, exit 2 is the correct, verified result.

## Standing safety facts

- Money-OUT (refund/void/disburse) is **hard-closed in code** — no key can make
  this rail send money. Reopening requires authenticated-principal identity.
- Agent identity is currently caller-declared; that is the gate on money-OUT and
  the item to fix before any outbound capability.
- The FSO wallet receives and never pays (x402 doctrine §3).
- $UNCuba stays diaspora-first (OFAC); no "bank"/"remittance" labeling in public
  before licensing.

## If a key is ever exposed

Rotate immediately: delete the key in the CDP portal (it dies instantly), create
a new one, update Vercel, redeploy. For `BANKER_PAY_SECRET`, regenerate and
update both Vercel and `~/unwind-brain/.env`, then redeploy.
