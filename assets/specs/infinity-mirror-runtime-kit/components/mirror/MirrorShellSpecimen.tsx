import type { MirrorShellRule } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  rules: readonly MirrorShellRule[];
};

export function MirrorShellSpecimen({ rules }: Props) {
  return (
    <section
      id="mirror-shell-specimen"
      aria-labelledby="mirror-shell-specimen-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Persistent shell specimen
          </p>
          <h3 id="mirror-shell-specimen-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            The mirror should feel like one instrument that keeps returning proof.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            The mobile shell language becomes an Unwind-native specimen: stable mirror core, growth meter, prompt chamber, returned artifact, route shell, and authority lock.
          </p>
        </div>

        <div className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[0.38fr_0.62fr]">
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/80 p-5 text-center">
              <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                Local proof shell
              </span>
              <b className="mt-5 block text-6xl font-black text-mirror-reflection" aria-hidden="true">
                &infin;
              </b>
              <p className="mt-5 text-sm leading-6 text-zinc-400">
                Continuity without hidden memory.
              </p>
            </div>
            <dl className="grid grid-cols-1 gap-3 text-sm text-zinc-300">
              <div className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                  Growth stage
                </dt>
                <dd className="mt-1 leading-6">Seed, reflection, pattern, proof.</dd>
              </div>
              <div className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                  Prompt chamber
                </dt>
                <dd className="mt-1 leading-6">A gentle prompt can reduce pressure without forcing a claim.</dd>
              </div>
              <div className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                  Returned artifact
                </dt>
                <dd className="mt-1 leading-6">Signal, boundary, and choice stay visible before memory.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <ol className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {rules.map((rule) => (
          <li key={rule.id} data-shell-rule={rule.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {rule.index} / {rule.label}
            </span>
            <strong className="mt-3 block text-base text-zinc-100">{rule.title}</strong>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{rule.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
