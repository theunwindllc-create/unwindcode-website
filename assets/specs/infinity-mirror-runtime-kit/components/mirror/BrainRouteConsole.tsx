import type { BrainRouteStage, BrainSignalHandoffPacket } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  handoff: BrainSignalHandoffPacket;
  stages: readonly BrainRouteStage[];
};

export function BrainRouteConsole({ handoff, stages }: Props) {
  return (
    <section
      id="mirror-brain-route-console"
      aria-labelledby="mirror-brain-route-console-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
      data-runtime-owner="bounded-brain-route"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.36fr_0.64fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Live route specimen
          </p>
          <h3 id="mirror-brain-route-console-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            A reflection request crosses cells before it becomes advice.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            The route is semantic first: selected signal, cells, authority lock, proof return, and state grid are inspectable before any animation runs.
          </p>
        </div>

        <div className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7">
          <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                Signal handoff
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300" data-brain-handoff="signal">
                {handoff.signal}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                Cells
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300" data-brain-handoff="cells">
                {handoff.cells}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                Authority lock
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300" data-brain-handoff="authority">
                {handoff.authority}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                Proof return
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300" data-brain-handoff="proof">
                {handoff.proof}
              </dd>
            </div>
          </dl>

          <ol className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
            {stages.map((stage) => (
              <li key={stage.id} data-route-stage={stage.id} className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
                <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                  {stage.index}
                </span>
                <strong className="mt-3 block text-sm text-zinc-100">{stage.title}</strong>
                <p className="mt-3 text-sm leading-6 text-zinc-400" data-brain-route-copy={stage.id}>
                  {handoff[stage.id]}
                </p>
              </li>
            ))}
          </ol>

          <dl className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
            {stages.map((stage) => (
              <div key={stage.id} data-state-cell={stage.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  {stage.stateLabel}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-zinc-300" data-brain-state-copy={stage.id}>
                  {handoff[stage.id]}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4 text-sm leading-7 text-zinc-400">
            The Brain can route a useful answer. It cannot quietly become the authority.
          </p>
        </div>
      </div>
    </section>
  );
}
