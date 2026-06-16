import type { ScrollChoreographyAct } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  acts: readonly ScrollChoreographyAct[];
};

export function ScrollChoreographyMap({ acts }: Props) {
  return (
    <section
      id="mirror-scroll-choreography"
      aria-labelledby="mirror-scroll-choreography-title"
      className="mt-14 rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="max-w-3xl space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Scroll choreography map
        </p>
        <h3 id="mirror-scroll-choreography-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          The visitor descends through seven proof-bearing acts.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          Each scroll beat changes focus, reveals a motion layer, and returns the visitor to an inspectable proof surface.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-[1.1fr_0.9fr_1fr]">
        {acts.map((act) => (
          <li key={act.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {act.label}
            </span>
            <strong className="mt-3 block text-base text-zinc-100">{act.title}</strong>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Focus
                </dt>
                <dd className="mt-1 leading-6">{act.focus}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Motion
                </dt>
                <dd className="mt-1 leading-6">{act.motion}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Proof return
                </dt>
                <dd className="mt-1 leading-6">{act.proofReturn}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
