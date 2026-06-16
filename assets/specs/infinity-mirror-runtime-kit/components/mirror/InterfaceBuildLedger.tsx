import type { InterfaceBuildStage } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  stages: readonly InterfaceBuildStage[];
};

export function InterfaceBuildLedger({ stages }: Props) {
  return (
    <section
      id="mirror-build-ledger"
      aria-labelledby="mirror-build-ledger-title"
      className="mt-14 rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="max-w-3xl space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Interface build ledger
        </p>
        <h3 id="mirror-build-ledger-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          Phase 6 and Phase 7 become build gates a team can inspect.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          The premium interface stays credible because semantic shell, motion islands, optional 3D, evidence sync, and release approval move as separate gates.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {stages.map((stage) => (
          <li key={stage.id} data-build-stage={stage.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {stage.label}
            </span>
            <strong className="mt-3 block text-base text-zinc-100">{stage.title}</strong>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{stage.description}</p>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300 md:grid-cols-2">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Artifact
                </dt>
                <dd className="mt-1 leading-6">{stage.artifact}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Boundary
                </dt>
                <dd className="mt-1 leading-6">{stage.boundary}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
