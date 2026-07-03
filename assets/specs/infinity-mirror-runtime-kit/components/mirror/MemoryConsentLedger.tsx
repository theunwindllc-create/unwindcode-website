import type { MemoryConsentState } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  states: readonly MemoryConsentState[];
};

export function MemoryConsentLedger({ states }: Props) {
  return (
    <section
      id="mirror-memory-consent"
      aria-labelledby="mirror-memory-consent-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
      data-runtime-owner="semantic-memory-consent-ledger"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[0.34fr_0.66fr]">
        <div className="space-y-3">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Memory consent ledger
          </p>
          <h3 id="mirror-memory-consent-title" className="max-w-lg text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            The mirror can remember only what the person can inspect.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            Reflection becomes safe when memory is treated as a consent state, not a magical feature.
          </p>
        </div>

        <ol aria-label="Memory consent states" className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {states.map((state) => (
            <li key={state.id} data-memory-consent={state.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
              <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                {state.label}
              </span>
              <strong className="mt-3 block text-base leading-tight text-zinc-100">{state.title}</strong>
              <dl className="mt-4 grid gap-3 text-sm text-zinc-300">
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                    Can hold
                  </dt>
                  <dd className="mt-1 leading-6">{state.canHold}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                    Proof required
                  </dt>
                  <dd className="mt-1 leading-6">{state.proofRequired}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                    Human control
                  </dt>
                  <dd className="mt-1 leading-6">{state.humanControl}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-5 rounded-mirror border border-mirror-proof/20 bg-mirror-proof/10 p-4 text-sm leading-7 text-zinc-300">
        Memory consent does not grant diagnosis, identity authority, hidden profiling, wallet control, public posting, deployment, or autonomous action.
      </p>
    </section>
  );
}
