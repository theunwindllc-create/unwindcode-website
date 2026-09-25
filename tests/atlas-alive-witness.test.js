import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ENDPOINT, REFRESH_MS, parseWitness, humanAge, formatWitness, isNewBeat, initWitness } from "../public/lab/witness.js";

const payload = (seq = 40, age = 180, total = 4074) => ({
  total_beats: total,
  organs: [{ organ: "first-body", age_seconds: age, seq, note: "DO NOT EXPOSE", stale: false }],
});
const settle = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

function harness(fetcher) {
  const doc = new EventTarget();
  doc.hidden = false;
  doc.documentElement = { lang: "en" };
  const win = new EventTarget();
  win.CustomEvent = class extends Event {};
  const element = { dataset: {}, textContent: "" };
  const timers = new Map();
  let timerId = 0;
  let calls = 0;
  let beats = 0;
  win.addEventListener("atlas:witness-beat", () => beats++);
  const options = {
    document: doc, window: win,
    fetch: async (...args) => { calls++; return fetcher(...args); },
    setTimeout: (fn, delay) => { timers.set(++timerId, { fn, delay }); return timerId; },
    clearTimeout: (id) => timers.delete(id),
  };
  const controller = initWitness(element, options);
  return { doc, win, element, timers, controller, calls: () => calls, beats: () => beats };
}

test("witness uses exactly the existing ledger source and projects no notes or ledger data", () => {
  const ledger = readFileSync(new URL("../proof/ledger/index.html", import.meta.url), "utf8");
  assert.ok(ledger.includes(`var ENDPOINT = '${ENDPOINT}'`));
  assert.deepEqual(parseWitness(payload()), { found: true, age: 180, seq: 40, total: 4074 });
  assert.doesNotMatch(JSON.stringify(parseWitness(payload())), /note|stale|DO NOT EXPOSE/);
});

test("witness malformed and missing values never fabricate zero or a beat", () => {
  for (const input of [null, {}, { organs: null }, { organs: "bad" }]) assert.throws(() => parseWitness(input));
  const missing = parseWitness({ organs: [] });
  assert.deepEqual(missing, { found: false, age: null, seq: null, total: null });
  assert.match(formatWitness(missing), /no first-body beat recorded.*total unavailable/);
  for (const value of [undefined, null, "0", -1, NaN, Infinity]) {
    const result = parseWitness({ total_beats: value, organs: [{ organ: "first-body", age_seconds: value, seq: value }] });
    assert.equal(result.age, null);
    assert.equal(result.seq, null);
    assert.equal(result.total, null);
    assert.match(formatWitness(result), /age unknown.*total unavailable/);
  }
  assert.equal(parseWitness(payload(0, 0, 0)).total, 0, "An actual reported zero is preserved");
});

test("witness age thresholds and bilingual source attribution match ledger semantics", () => {
  assert.equal(humanAge(26), "26 s ago");
  assert.equal(humanAge(90), "2 min ago");
  assert.equal(humanAge(5400), "1.5 h ago");
  assert.equal(humanAge(129600), "1.5 days ago");
  assert.match(formatWitness(parseWitness(payload()), "en"), /^Internet Computer.*4,074 total beats$/);
  assert.match(formatWitness(parseWitness(payload()), "es"), /^Internet Computer.*hace 3 min.*latidos en total$/);
  for (const lang of ["en", "es"]) {
    const value = formatWitness(parseWitness(payload()), lang, "unreachable");
    assert.doesNotMatch(value, /4074|4,074|\b0\b/);
    assert.match(value, /Internet Computer/);
  }
});

test("only a confirmed new first-body beat can signal, never initial state or another organism", () => {
  const before = parseWitness(payload());
  assert.equal(isNewBeat(null, before), false);
  assert.equal(isNewBeat(before, parseWitness(payload(40, 240, 4075))), false);
  assert.equal(isNewBeat(before, parseWitness(payload(40, 1, 4075))), false, "same known seq overrides clock jitter");
  assert.equal(isNewBeat(before, parseWitness(payload(39, 1))), false, "rollback is not new");
  assert.equal(isNewBeat(before, parseWitness(payload(41, 1))), true);
  assert.equal(isNewBeat(parseWitness(payload(null, 180)), parseWitness(payload(null, 179))), false);
  assert.equal(isNewBeat(parseWitness(payload(null, 180)), parseWitness(payload(null, 10))), true);
  assert.equal(isNewBeat(parseWitness(payload(null, 180)), parseWitness(payload(null, 10, 1))), false);
});

test("successful browser reads refresh every 60s; language changes do not refetch or lose reading", async () => {
  let next = payload();
  const h = harness(async (url, options) => {
    assert.equal(url, ENDPOINT);
    assert.equal(options.cache, "no-store");
    assert.equal(options.credentials, "omit");
    assert.equal(options.referrerPolicy, "no-referrer");
    return { ok: true, json: async () => next };
  });
  await settle();
  assert.equal(h.beats(), 0);
  assert.deepEqual([...h.timers.values()].map((v) => v.delay), [REFRESH_MS]);
  h.doc.documentElement.lang = "es";
  h.doc.dispatchEvent(new Event("uc:languagechange"));
  assert.match(h.element.textContent, /latido de first-body hace 3 min/);
  assert.equal(h.calls(), 1);
  next = payload(41, 5, 4075);
  await h.controller.refresh();
  assert.equal(h.beats(), 1);
  await h.controller.refresh();
  assert.equal(h.beats(), 1);
  h.controller.destroy();
  assert.equal(h.timers.size, 0);
});

test("unreachable, HTTP errors, invalid JSON and invalid schema erase all old numbers", async () => {
  let mode = "ok";
  const h = harness(async () => {
    if (mode === "network") throw new Error("offline");
    return { ok: mode !== "http", json: async () => {
      if (mode === "json") throw new Error("bad JSON");
      return mode === "schema" ? {} : payload();
    } };
  });
  await settle();
  assert.match(h.element.textContent, /4,074/);
  for (mode of ["network", "http", "json", "schema"]) {
    await h.controller.refresh();
    assert.match(h.element.textContent, /witness unreachable · cannot verify/);
    assert.doesNotMatch(h.element.textContent, /4,074|first-body beat|\b0\b/);
    assert.equal(h.element.dataset.witnessState, "unreachable");
  }
  mode = "ok";
  await h.controller.refresh();
  assert.equal(h.beats(), 0, "recovery establishes a fresh observation baseline");
  h.controller.destroy();
});

test("hidden tabs cancel timers and requests, then refresh from unknown on return", async () => {
  let release;
  let signal;
  const h = harness(async (_url, options) => {
    signal = options.signal;
    return new Promise((resolve) => { release = resolve; });
  });
  assert.equal(h.timers.size, 1);
  h.doc.hidden = true;
  h.doc.dispatchEvent(new Event("visibilitychange"));
  assert.equal(signal.aborted, true);
  assert.equal(h.timers.size, 0);
  release({ ok: true, json: async () => payload() });
  await settle();
  assert.match(h.element.textContent, /reading witness/);
  await h.controller.refresh();
  assert.equal(h.calls(), 1);
  h.doc.hidden = false;
  h.doc.dispatchEvent(new Event("visibilitychange"));
  assert.equal(h.calls(), 2);
  release({ ok: true, json: async () => payload() });
  await settle();
  assert.equal(h.beats(), 0);
  h.controller.destroy();
  assert.equal(h.timers.size, 0);
});

test("timeout aborts a stalled witness and renders unreachable without a fake reading", async () => {
  const h = harness(async (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => reject(new Error("aborted")));
  }));
  const timeout = [...h.timers.values()].find((timer) => timer.delay === 8000);
  assert.ok(timeout);
  timeout.fn();
  await settle();
  assert.match(h.element.textContent, /witness unreachable/);
  assert.deepEqual([...h.timers.values()].map((timer) => timer.delay), [REFRESH_MS]);
  h.controller.destroy();
});
