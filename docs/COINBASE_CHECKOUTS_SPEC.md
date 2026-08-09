# Coinbase Business Checkouts API — verified spec (recon 2026-08-09)

Source: docs.cdp.coinbase.com, fetched and verified 2026-08-09 by the Unwind recon agent.
This is the SELF-SERVE lane. Coinbase Commerce is DEAD (shut down 2026-03-31, docs 404).
The enterprise "Payment Acceptance" product (`POST /v2/payment-sessions`) requires ~1 month
due-diligence onboarding via coinbase.payments@coinbase.com — different lane, do not mix.

## Auth
- CDP Secret API Key (ECDSA EC private key, PEM) created at portal.cdp.coinbase.com/api-keys/secret.
- Key name format: `organizations/{org_id}/apiKeys/{key_id}`.
- Per-request JWT (ES256), expires 120s, fresh JWT per request:
  - claims: `iss:"cdp"`, `sub:<key name>`, `nbf:now`, `exp:now+120`, `uri:"{METHOD} {HOST}{PATH}"`
  - header: `kid:<key name>`, `nonce:<random hex>`, `typ:"JWT"`
- Header: `Authorization: Bearer <JWT>`

## Create checkout
- `POST https://business.coinbase.com/api/v1/checkouts` (optional `X-Idempotency-Key`: UUID v4)
- Required: `amount` (string, `^\d+(\.\d{1,2})?$`, 0.01–100,000,000), `currency` (USDC, USD, EUR, SGD, GBP…)
- Optional: `description` (≤500), `metadata` (≤20 keys, ≤100 chars/value), `successRedirectUrl`,
  `failRedirectUrl` (HTTPS ≤2048), `expiresAt` (RFC 3339, default 24h)
- 201 response: `id` (24-hex), `url` (hosted payment page), `x402_url` (agent-payable, gasless USDC
  on Base), `status`, `network` (default `base`), `address`, `tokenAddress`, `expiresAt`,
  `settlement{totalAmount,feeAmount,netAmount,currency}`, `transactionHash` (when COMPLETED),
  `refunds[]`, `createdAt`, `updatedAt`
- Errors: 400 invalid_request, 401, 403, 429 rate_limit_exceeded, 500 (body: errorType,
  errorMessage, correlationId)

## Lifecycle
- `GET /api/v1/checkouts` (paginated) · `GET /api/v1/checkouts/{id}`
- `POST /api/v1/checkouts/{id}/deactivate` · `POST /api/v1/checkouts/{id}/refund`  ← MONEY-OUT, gated
- Status enum: ACTIVE, PROCESSING, DEACTIVATED, EXPIRED, COMPLETED, FAILED, REFUNDED,
  PARTIALLY_REFUNDED. Refund status: PENDING, COMPLETED, FAILED.

## Webhooks
- Registered via CDP CLI: `cdp data webhooks subscriptions create` (secret returned in the
  subscription response `metadata`).
- Events: `checkout.payment.success`, `checkout.payment.failed`, `checkout.payment.expired`,
  `checkout.refund.success`, `checkout.refund.failed`
- Signature header `X-Hook0-Signature`: components `t=` (timestamp), `h=` (space-separated header
  names), `v0`/`v1`.
  - `v0` = HMAC-SHA256 over `{t}.{body}` (raw body)
  - `v1` = HMAC-SHA256 over `{t}.{h}.{headerValues}.{body}`
  - Compare with `crypto.timingSafeEqual`; reject `t` older than ~5 min.
- Payload: `id`, `url`, `amount`, `currency`, `network`, `address`, `description`, `eventType`,
  `status`, `createdAt`, `updatedAt`, `metadata`, conditional `settlement`/`transactionHash`/`refunds`.

## Constraints
- NO sandbox for the self-serve lane (sandbox exists only for enterprise Payment Acceptance).
  Test path: small real USDC checkout on Base.
- Rate limits exist (429) but numbers undocumented; no documented self-serve increase path —
  increased access = the enterprise onboarding email.
- Payment Links API exists (JWT Bearer, USDC-only) but exact endpoint path unverified — build on
  Checkouts only.
