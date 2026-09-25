/* One public witness. No internal state, cached readings, or inferred health. */
export const ENDPOINT = "https://rt6ds-eqaaa-aaaad-agv7q-cai.raw.icp0.io/";
export const REFRESH_MS = 60_000;
const TIMEOUT_MS = 8_000;
const nonnegative = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0;
const counter = (value) => Number.isSafeInteger(value) && value >= 0 ? value : null;

export function parseWitness(data) {
  if (!data || !Array.isArray(data.organs)) throw new Error("Unverifiable witness response");
  const body = data.organs.find((item) => item && item.organ === "first-body");
  // Deliberately project only public beat metadata; never retain notes or ledger heads.
  return {
    found: Boolean(body),
    age: body && nonnegative(body.age_seconds) ? body.age_seconds : null,
    seq: body ? counter(body.seq) : null,
    total: counter(data.total_beats),
  };
}

// Same thresholds as /proof/ledger. Unknown never becomes zero or a liveness claim.
export function humanAge(seconds, lang = "en") {
  if (!nonnegative(seconds)) return lang === "es" ? "edad desconocida" : "age unknown";
  let value;
  if (seconds < 90) value = `${Math.round(seconds)} s`;
  else if (seconds < 5400) value = `${Math.round(seconds / 60)} min`;
  else if (seconds < 129600) value = `${(seconds / 3600).toFixed(1)} h`;
  else value = `${(seconds / 86400).toFixed(1)} ${lang === "es" ? "días" : "days"}`;
  return lang === "es" ? `hace ${value}` : `${value} ago`;
}

export function formatWitness(sample, lang = "en", state = "ready") {
  const es = lang === "es";
  const source = "Internet Computer";
  if (state === "loading") return es ? `${source} · leyendo testigo…` : `${source} · reading witness…`;
  if (state === "unreachable" || !sample) {
    return es ? `${source} · testigo inaccesible · no se puede verificar` : `${source} · witness unreachable · cannot verify`;
  }
  const beat = sample.found
    ? (es ? `latido de first-body ${humanAge(sample.age, lang)}` : `first-body beat ${humanAge(sample.age, lang)}`)
    : (es ? "sin latido de first-body registrado" : "no first-body beat recorded");
  const total = sample.total === null
    ? (es ? "total no disponible" : "total unavailable")
    : `${sample.total.toLocaleString(es ? "es-ES" : "en-US")} ${es ? "latidos en total" : "total beats"}`;
  return `${source} · ${beat} · ${total}`;
}

export function isNewBeat(previous, next) {
  if (!previous?.found || !next?.found) return false;
  if (previous.seq !== null && next.seq !== null) return next.seq > previous.seq;
  // If a sequence is absent, require a clear age reset, beyond timestamp rounding.
  if (previous.total !== null && next.total !== null && next.total < previous.total) return false;
  return previous.age !== null && next.age !== null && next.age < previous.age - 2;
}

export function initWitness(element = document.querySelector("[data-witness]"), options = {}) {
  if (!element) return { refresh: async () => {}, destroy() {} };
  const doc = options.document || document;
  const win = options.window || window;
  const request = options.fetch || win.fetch.bind(win);
  const setTimer = options.setTimeout || win.setTimeout.bind(win);
  const clearTimer = options.clearTimeout || win.clearTimeout.bind(win);
  let sample = null;
  let previous = null;
  let state = "loading";
  let pollTimer;
  let timeoutTimer;
  let controller;
  let generation = 0;
  let destroyed = false;

  function render() {
    // The adjacent persistent label names the source once, in either language.
    element.dataset.en = formatWitness(sample, "en", state).replace(/^Internet Computer · /, '');
    element.dataset.es = formatWitness(sample, "es", state).replace(/^Internet Computer · /, '');
    element.dataset.witnessState = state;
    element.textContent = doc.documentElement.lang === "es" ? element.dataset.es : element.dataset.en;
    win.dispatchEvent(new win.CustomEvent("atlas:witness-reading", { detail: { state } }));
  }

  function cancel() {
    generation++;
    clearTimer(pollTimer);
    clearTimer(timeoutTimer);
    controller?.abort();
    controller = null;
  }

  async function refresh() {
    if (destroyed || doc.hidden) return;
    cancel();
    const ownGeneration = generation;
    controller = new AbortController();
    const ownController = controller;
    timeoutTimer = setTimer(() => ownController.abort(), TIMEOUT_MS);
    try {
      const response = await request(ENDPOINT, {
        cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer", signal: ownController.signal,
      });
      if (!response.ok) throw new Error("Witness unreachable");
      const next = parseWitness(await response.json());
      if (destroyed || doc.hidden || ownGeneration !== generation) return;
      const newBeat = isNewBeat(previous, next);
      sample = next;
      previous = next;
      state = "ready";
      render();
      if (newBeat) win.dispatchEvent(new win.CustomEvent("atlas:witness-beat"));
    } catch {
      if (destroyed || doc.hidden || ownGeneration !== generation) return;
      // C7: unreachable is unknown, not zero, stale data, or evidence of an outage.
      sample = null;
      previous = null;
      state = "unreachable";
      render();
    } finally {
      if (ownGeneration === generation) {
        clearTimer(timeoutTimer);
        controller = null;
        if (!destroyed && !doc.hidden) pollTimer = setTimer(refresh, REFRESH_MS);
      }
    }
  }

  function visibility() {
    cancel();
    // A suspended tab cannot claim a current observation when it returns.
    sample = null;
    previous = null;
    state = "loading";
    render();
    if (!doc.hidden) refresh();
  }
  doc.addEventListener("visibilitychange", visibility);
  doc.addEventListener("uc:languagechange", render);
  render();
  refresh();
  return {
    refresh,
    destroy() {
      destroyed = true;
      cancel();
      doc.removeEventListener("visibilitychange", visibility);
      doc.removeEventListener("uc:languagechange", render);
    },
  };
}
