import type { RuntimeHandoffLane } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  lanes: readonly RuntimeHandoffLane[];
};

export function RuntimeHandoffMatrix({ lanes }: Props) {
  return (
    <section
      id="mirror-runtime-handoff"
      aria-labelledby="mirror-runtime-handoff-title"
      className="mt-14 rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="max-w-3xl space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Runtime handoff matrix
        </p>
        <h3 id="mirror-runtime-handoff-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          Each runtime gets one job, one fallback, and one stop condition.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          CSS, Framer, GSAP, and Three/WebGL stay in separate lanes so cinematic depth never takes ownership of public meaning or human authority.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_0.9fr_1.1fr]">
        {lanes.map((lane) => (
          <li key={lane.id} data-runtime-lane={lane.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {lane.label}
            </span>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Owner
                </dt>
                <dd className="mt-1 leading-6">{lane.owner}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Job
                </dt>
                <dd className="mt-1 leading-6">{lane.job}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Fallback
                </dt>
                <dd className="mt-1 leading-6">{lane.fallback}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Stop condition
                </dt>
                <dd className="mt-1 leading-6">{lane.stopCondition}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
