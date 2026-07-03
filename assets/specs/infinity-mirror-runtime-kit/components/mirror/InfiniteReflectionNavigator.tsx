import type { MirrorStoryAnchor, ReflectionNavigatorLens } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  anchors: readonly MirrorStoryAnchor[];
  lenses: readonly ReflectionNavigatorLens[];
};

export function InfiniteReflectionNavigator({ anchors, lenses }: Props) {
  return (
    <section
      id="mirror-reflection-navigation"
      aria-labelledby="mirror-reflection-navigation-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Infinite reflection navigator
          </p>
          <h2 id="mirror-reflection-navigation-title" className="text-3xl font-black leading-tight text-zinc-100 md:text-5xl">
            The infinity mark becomes the map, not decoration.
          </h2>
          <p className="max-w-[58ch] text-sm leading-7 text-zinc-400">
            Each reflected route names focus, proof, and boundary before the visitor enters the next layer.
          </p>
        </div>

        <div className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7">
          <b className="block text-center text-5xl font-black text-mirror-reflection md:text-7xl" aria-hidden="true">
            &infin;
          </b>
          <nav aria-label="Infinity Mirror story anchors" className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
            {anchors.map((anchor) => (
              <a
                key={anchor.id}
                href={anchor.href}
                className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4 transition hover:-translate-y-0.5 hover:border-mirror-reflection/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mirror-boundary"
              >
                <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                  {anchor.index}
                </span>
                <strong className="mt-2 block text-base text-zinc-100">{anchor.title}</strong>
                <span className="mt-2 block text-sm leading-6 text-zinc-400">{anchor.focus}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <ol className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {lenses.map((lens) => (
          <li key={lens.id} data-reflection-lens={lens.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <strong className="text-base text-zinc-100">{lens.title}</strong>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Route
                </dt>
                <dd className="mt-1 leading-6">{lens.route}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Proof
                </dt>
                <dd className="mt-1 leading-6">{lens.proof}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Boundary
                </dt>
                <dd className="mt-1 leading-6">{lens.boundary}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
