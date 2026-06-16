import type { DesireTranslationRoute } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  routes: readonly DesireTranslationRoute[];
};

export function DesireTranslationWall({ routes }: Props) {
  return (
    <section
      id="mirror-desire-translation"
      aria-labelledby="mirror-desire-translation-title"
      className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 border-t border-zinc-800 px-5 py-20 md:grid-cols-[0.36fr_0.64fr] md:px-8"
    >
      <div className="space-y-4">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Research Translation
        </p>
        <h2 id="mirror-desire-translation-title" className="text-3xl font-black leading-tight md:text-5xl">
          Human desire becomes product routes, not vague aspiration.
        </h2>
        <p className="text-base leading-8 text-zinc-400">
          Anthropic's 81K desire categories are translated into organism paths, proof gates, and authority stops so the mirror can clarify what to build without claiming identity authority.
        </p>
        <a
          className="inline-flex rounded-mirror border border-mirror-reflection/30 px-4 py-3 text-sm font-bold text-mirror-reflection"
          href="https://www.anthropic.com/research/values-wild"
        >
          Source pattern
        </a>
      </div>

      <ol className="grid grid-cols-1 gap-3 lg:grid-cols-2" aria-label="81K desire categories translated into organism routes">
        {routes.map((route) => (
          <li key={route.id} className="rounded-mirror border border-zinc-800 bg-zinc-950/70 p-5">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {route.label}
            </span>
            <strong className="mt-3 block text-lg text-zinc-100">{route.title}</strong>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{route.description}</p>
            <dl className="mt-5 grid grid-cols-1 gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Organism route
                </dt>
                <dd className="mt-1">{route.organismRoute}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Proof gate
                </dt>
                <dd className="mt-1">{route.proofGate}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Authority stop
                </dt>
                <dd className="mt-1">{route.authorityStop}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
