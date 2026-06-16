import type { MirrorRouteCompassEntry } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  entries: readonly MirrorRouteCompassEntry[];
};

export function MirrorRouteCompass({ entries }: Props) {
  return (
    <section
      id="mirror-route-compass"
      aria-labelledby="mirror-route-compass-title"
      data-runtime-owner="semantic-route-compass"
      className="rounded-mirror border border-zinc-800/80 bg-zinc-950/80 p-5"
    >
      <div className="grid gap-4 lg:grid-cols-[0.62fr_0.38fr]">
        <div className="grid content-end gap-3">
          <p className="font-mono text-xs font-black uppercase tracking-[0.08em] text-proof-gold">Mirror route compass</p>
          <h2 id="mirror-route-compass-title" className="max-w-3xl text-3xl font-black leading-tight text-zinc-100 md:text-4xl">
            The mirror chooses a chapter only after the signal earns a route.
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-zinc-300">
            The 81K signal becomes useful when a visitor can see where their desire enters the story, what proof comes back, and which authority boundary stays closed.
          </p>
        </div>
        <div className="relative min-h-60 overflow-hidden rounded-mirror border border-zinc-800/80 bg-zinc-950" aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 h-px w-3/4 -translate-x-1/2 -translate-y-1/2 -rotate-12 bg-gradient-to-r from-transparent via-proof-cyan/50 to-transparent" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl leading-none text-zinc-100">&infin;</span>
        </div>
      </div>

      <ol aria-label="Human signal routes through the mirror chapters" className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {entries.map(entry => (
          <li key={entry.id} className="rounded-mirror border border-zinc-800/80 bg-zinc-950/70 p-4">
            <span className="font-mono text-[0.68rem] font-black uppercase tracking-[0.08em] text-proof-gold">{entry.label}</span>
            <h3 className="mt-2 text-base font-black leading-snug text-zinc-100">{entry.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{entry.description}</p>
            <dl className="mt-4 grid gap-2 border-t border-zinc-800/80 pt-3 text-sm">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.08em] text-proof-gold">Chapter</dt>
                <dd className="mt-1 text-zinc-300">{entry.chapter}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.08em] text-proof-gold">Proof return</dt>
                <dd className="mt-1 text-zinc-300">{entry.proofReturn}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.08em] text-proof-gold">Authority stop</dt>
                <dd className="mt-1 text-zinc-300">{entry.authorityStop}</dd>
              </div>
            </dl>
            <a href={entry.href} className="mt-4 inline-flex font-mono text-xs font-black uppercase tracking-[0.06em] text-proof-cyan">
              {entry.cta}
            </a>
          </li>
        ))}
      </ol>

      <p className="mx-auto mt-5 max-w-4xl text-center text-sm leading-6 text-zinc-400">
        The compass is a semantic routing map. It does not infer identity, store a preference, submit data, call a model, start a build, move money, deploy, post, or grant autonomy.
      </p>
    </section>
  );
}
