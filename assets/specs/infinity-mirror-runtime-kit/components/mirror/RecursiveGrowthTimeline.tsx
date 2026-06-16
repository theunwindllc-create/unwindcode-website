import type { RecursiveGrowthGate } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  gates: readonly RecursiveGrowthGate[];
};

export function RecursiveGrowthTimeline({ gates }: Props) {
  return (
    <section
      id="mirror-recursive-growth-timeline"
      aria-labelledby="mirror-recursive-growth-timeline-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-20 md:px-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.32fr_0.68fr]">
        <div className="space-y-3">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Recursive growth timeline
          </p>
          <h3 id="mirror-recursive-growth-timeline-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-4xl">
            Self-evolution earns density one verified gate at a time.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            The organism may notice a repeated need, but capability only grows after research, sandbox, approval, integration, and public proof.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {gates.map((gate) => (
            <li key={gate.id} data-growth-gate={gate.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
              <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                {gate.index}
              </span>
              <strong className="mt-3 block text-base text-zinc-100">{gate.title}</strong>
              <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Signal
                  </dt>
                  <dd className="mt-1 leading-6">{gate.signal}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Verification
                  </dt>
                  <dd className="mt-1 leading-6">{gate.verification}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Authority stop
                  </dt>
                  <dd className="mt-1 leading-6">{gate.authorityStop}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
