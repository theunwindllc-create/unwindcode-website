import type { OrganismVisualizerNode } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  organisms: readonly OrganismVisualizerNode[];
};

export function LivingOrganismVisualizer({ organisms }: Props) {
  return (
    <section
      id="mirror-living-organism-visualizer"
      aria-labelledby="mirror-living-organism-visualizer-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-20 md:px-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.34fr_0.66fr]">
        <div className="space-y-3">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Living organism visualizer
          </p>
          <h3 id="mirror-living-organism-visualizer-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-4xl">
            The ecosystem shares one spine, then diverges into proof paths.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            The organism orbit is not a product menu. It is a route map for signal, memory, authority, and proof across the Unwind ecosystem.
          </p>
          <div className="rounded-mirror border border-mirror-reflection/25 bg-zinc-950/60 p-5 shadow-mirror-inner">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-reflection">
              Shared spine
            </span>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Signal enters, memory is bounded, cells specialize, immune gates pause risk, and proof returns before authority grows.
            </p>
            <b className="mt-5 block text-5xl font-black text-mirror-reflection" aria-hidden="true">
              &infin;
            </b>
          </div>
        </div>

        <nav aria-label="Unwind organism proof paths" className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {organisms.map((organism) => (
            <a
              key={organism.id}
              href={organism.href}
              data-organism={organism.id}
              className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4 transition hover:-translate-y-0.5 hover:border-mirror-reflection/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mirror-boundary"
            >
              <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                {organism.label}
              </span>
              <strong className="mt-3 block text-base text-zinc-100">{organism.title}</strong>
              <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Signal
                  </dt>
                  <dd className="mt-1 leading-6">{organism.signal}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Memory
                  </dt>
                  <dd className="mt-1 leading-6">{organism.memory}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Authority
                  </dt>
                  <dd className="mt-1 leading-6">{organism.authority}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Proof
                  </dt>
                  <dd className="mt-1 leading-6">{organism.proof}</dd>
                </div>
              </dl>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
