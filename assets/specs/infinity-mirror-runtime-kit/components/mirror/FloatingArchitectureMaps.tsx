import type { ArchitectureMapPane } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  panes: readonly ArchitectureMapPane[];
};

export function FloatingArchitectureMaps({ panes }: Props) {
  return (
    <section
      id="mirror-floating-architecture-maps"
      aria-labelledby="mirror-floating-architecture-maps-title"
      className="mt-14 rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="max-w-3xl space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Floating architecture maps
        </p>
        <h3 id="mirror-floating-architecture-maps-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          A living interface earns trust by showing the route a signal takes.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          These panes can drift or stack visually, but their job is stable: show route, proof, and boundary before the visitor trusts the mirror.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.1fr_0.9fr]">
        {panes.map((pane) => (
          <li key={pane.id} data-architecture-pane={pane.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {pane.index}
            </span>
            <strong className="mt-3 block text-base text-zinc-100">{pane.title}</strong>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Route
                </dt>
                <dd className="mt-1 leading-6">{pane.route}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Proves
                </dt>
                <dd className="mt-1 leading-6">{pane.proves}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Boundary
                </dt>
                <dd className="mt-1 leading-6">{pane.boundary}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
