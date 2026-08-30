// api/retell-inbound.js - Retell inbound-call webhook for the Genesis line (+1 808 444-9386). Runs on Vercel beside the
// unwindcode.ai site (inherits its Upstash KV binding). It is the phone FRONT DOOR: a greeter that hands the call to the
// agent and injects the passphrase for the agent's in-call check. It gives Genesis ZERO capability - no tools, no
// authority, no bridge to First Body. The call-to-Genesis's-brain ingress (Tier A read/coach) is a SEPARATE, gated 1.2
// build that does NOT exist here.
//
// Model (signed ruling docs/rulings/2026-08-30-genesis-voice-organ.md, ab578315):
//   * ANY number connects and reaches the passphrase gate - there is NO pre-connect caller-allowlist rejection, because
//     Jesus must be able to call from any phone in an emergency ("if i lose mine"). The PASSPHRASE (checked in-call by
//     the agent) is the only access control; caller-ID is spoofable, so the number is never a substitute for the phrase.
//   * The recognized number (RETELL_ALLOWED_NUMBERS) only sets THROTTLE + GREETING: it is uncapped and greeted as known;
//     every OTHER number is capped (RETELL_UNKNOWN_DAILY_CAP, default 8, per number per day) and counted toward a global
//     soft-cap that raises an ALERT (a receipt, never a hard block that would also block his emergency call).
//   * Cost/abuse is bounded by the fast wrong-phrase hang-up + the per-number cap + the global alert - never a
//     pre-connect number block.
//
// The endpoint's OWN auth (token / trusted-IP / HMAC) authenticates RETELL, not the caller, and still fail-closes forged
// POSTs. A successful connect response necessarily carries the passphrase to Retell, so treat this endpoint's auth
// confidentiality as the passphrase's confidentiality (rotate the phrase once the line works).
//
// Env (set by Jesus in the Vercel dashboard, never in this file or the repo):
//   RETELL_PASSPHRASE       the passphrase (falls back to RETELL_SECURITY_CODE); injected for the agent's in-call check
//   RETELL_INBOUND_TOKEN    long random token for the URL (?t=)
//   RETELL_AGENT_ID, RETELL_AGENT_VERSION
//   RETELL_ALLOWED_NUMBERS  OPTIONAL, comma-separated E.164 - recognized (uncapped + greeted) numbers only, NOT a gate
//   RETELL_UNKNOWN_DAILY_CAP  optional int, default 8 (per unrecognized number per day)
//   RETELL_GLOBAL_SOFT_CAP    optional int, default 200 (unrecognized calls/day before an anomaly alert is logged)
//   RETELL_ALLOWED_IPS      optional, comma-separated; default 100.20.5.228 (Retell's published IP)
//   RETELL_API_KEY          optional; enables HMAC mode
//   KV_REST_API_URL / KV_REST_API_TOKEN  inherited from the site's Upstash binding (for the caps)
// Fail-closed on: missing required env, bad token, bad signature, stale timestamp, bad JSON, wrong event. The caps FAIL
// OPEN (connect) if KV is unreachable - the ruling forbids a KV outage from blocking an emergency call; the phrase still
// gates access and the fast hang-up still bounds cost.
import crypto from "node:crypto";

export const config = { api: { bodyParser: false } };

function readRaw(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > 65536) reject(new Error("body too large")); });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function trustedClientIp(req) {
  // x-vercel-forwarded-for is set by Vercel from the connecting socket; raw x-forwarded-for is client-settable and unused.
  const h = req.headers;
  return String(h["x-vercel-forwarded-for"] || h["x-real-ip"] || "").split(",")[0].trim();
}

function e164(s) {
  const d = String(s || "").replace(/\D/g, "");
  return d ? "+" + d : "";
}

function verifyHmac(raw, header, key, windowSec = 300) {
  if (!header || !key) return false;
  const parts = Object.fromEntries(String(header).split(",").map((kv) => kv.split("=")));
  if (!parts.v || !parts.d) return false;
  const ts = Number(parts.v);
  const now = Math.floor(Date.now() / 1000);
  const tsSec = ts > 1e12 ? Math.floor(ts / 1000) : ts;
  if (!Number.isFinite(tsSec) || Math.abs(now - tsSec) > windowSec) return false;   // replay window
  const expected = crypto.createHmac("sha256", key).update(raw).digest("hex");
  try { return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(parts.d))); } catch { return false; }
}

function posInt(v, fallback) {
  const n = Number.parseInt(v, 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

// A KV key that never contains the raw phone number: salted sha256, matching the site's api/limit.js discipline.
function kvKey(salt, ...parts) {
  return "sha256:" + crypto.createHash("sha256").update(String(salt) + "|" + parts.join("|")).digest("hex");
}

// Upstash Redis REST: INCR key + (EXPIRE key ttl NX) in one pipeline. Returns the post-incr count, or null if KV is not
// configured or unreachable (caller fails OPEN on null so a KV outage never blocks an emergency call).
async function kvIncr(env, key, ttlSec) {
  const url = String(env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL || "").trim().replace(/\/$/, "");
  const token = String(env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN || "").trim();
  if (!url || !token) return null;
  try {
    const r = await fetch(url + "/pipeline", {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", key], ["EXPIRE", key, String(ttlSec), "NX"]]),
    });
    if (!r.ok) return null;
    const j = await r.json();
    return Array.isArray(j) && j[0] && typeof j[0].result === "number" ? j[0].result : null;
  } catch { return null; }
}

export default async function handler(req, res) {
  const reject = () => res.status(200).json({ call_inbound: { reject: true } });   // Retell hangs up; no call object
  const deny = () => res.status(404).end();   // every auth failure looks identical: a prober never learns which check failed
  if (req.method !== "POST") return res.status(404).end();
  const env = process.env;
  const passphrase = env.RETELL_PASSPHRASE || env.RETELL_SECURITY_CODE;
  if (!passphrase || !env.RETELL_INBOUND_TOKEN || !env.RETELL_AGENT_ID) return reject();   // required env; ALLOWED_NUMBERS is optional

  const token = new URL(req.url, "http://x").searchParams.get("t");
  if (!token || token.length !== env.RETELL_INBOUND_TOKEN.length ||
      !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(env.RETELL_INBOUND_TOKEN))) return deny();

  let raw = "";
  try { raw = await readRaw(req); } catch { return deny(); }

  if (env.RETELL_API_KEY) {
    if (!verifyHmac(raw, req.headers["x-retell-signature"], env.RETELL_API_KEY)) return deny();
  } else {
    const allowedIps = (env.RETELL_ALLOWED_IPS || "100.20.5.228").split(",").map((s) => s.trim()).filter(Boolean);
    if (!allowedIps.includes(trustedClientIp(req))) return deny();
  }

  let body;
  try { body = JSON.parse(raw); } catch { return reject(); }
  if (!body || body.event !== "call_inbound" || !body.call_inbound) return reject();

  const from = e164(body.call_inbound.from_number);
  const allowed = (env.RETELL_ALLOWED_NUMBERS || "").split(",").map(e164).filter(Boolean);
  const recognized = !!from && allowed.includes(from);
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");   // yyyymmdd, UTC
  const salt = env.RETELL_INBOUND_TOKEN;                                  // secret already present; keeps KV keys unguessable
  const stamp = { from_suffix: from.slice(-4), to: String(body.call_inbound.to_number || ""), ts: new Date().toISOString() };

  // Recognized number = uncapped fast lane. Any OTHER number connects too (the phrase is the gate), but is throttled
  // per-number and counted toward the global soft-cap. NEVER a pre-connect block for being unknown - only for exceeding
  // its own daily cap. Caps fail OPEN if KV is unavailable (emergency access must not depend on Redis being up).
  if (!recognized) {
    const cap = posInt(env.RETELL_UNKNOWN_DAILY_CAP, 8);
    const globalCap = posInt(env.RETELL_GLOBAL_SOFT_CAP, 200);
    const perNum = await kvIncr(env, kvKey(salt, "cap", from || "unknown", day), 86400);
    const global = await kvIncr(env, kvKey(salt, "global-unknown", day), 86400);
    if (perNum !== null && perNum > cap) {
      console.log(JSON.stringify({ decision: "reject", why: "per-number-daily-cap", n: perNum, cap, ...stamp }));
      return reject();
    }
    if (global !== null && global > globalCap) {
      // soft cap: an ALERT, never a hard block (a flood must not block Jesus's own emergency call). A receipt for a human.
      console.log(JSON.stringify({ alert: "global-unknown-soft-cap-crossed", n: global, cap: globalCap, ...stamp }));
    }
    console.log(JSON.stringify({ decision: "allow", caller: "unknown", per_num: perNum, ...stamp }));
  } else {
    console.log(JSON.stringify({ decision: "allow", caller: "recognized", ...stamp }));
  }

  // Connect: name the agent and inject the passphrase for the agent's in-call check (up to 3 joyful tries, then goodbye).
  // caller_recognized lets the prompt greet a known caller warmly vs. a neutral greeting - it is NOT an auth signal.
  return res.status(200).json({
    call_inbound: {
      override_agent_id: env.RETELL_AGENT_ID,
      ...(env.RETELL_AGENT_VERSION ? { override_agent_version: Number(env.RETELL_AGENT_VERSION) } : {}),
      dynamic_variables: { security_code: String(passphrase), passphrase: String(passphrase), caller_recognized: recognized ? "true" : "false" },
      metadata: { recognized: recognized ? "true" : "false", policy: "genesis-line-v2-ab578315" },
      agent_override: { agent: { max_call_duration_ms: 300000 } },
    },
  });
}
