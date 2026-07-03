import type { AuthorityGradientRung } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  rungs: readonly AuthorityGradientRung[];
};

export function AuthorityGradient({ rungs }: Props) {
  return (
    <section
      id="mirror-authority-gradient"
      aria-labelledby="mirror-authority-gradient-title"
      className="mt-8 rounded-mirror border border-mirror-proof/20 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="grid gap-5 md:grid-cols-[0.34fr_0.66fr] md:items-end">
        <div className="space-y-3">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Authority gradient
          </p>
          <h3 id="mirror-authority-gradient-title" className="max-w-sm text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            The mirror earns permission one gate at a time.
          </h3>
        </div>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400">
          Each rung names what the system may do, what proof must exist, and what remains human-owned before any public or high-risk motion.
        </p>
      </div>

      <ol aria-label="Authority gradient rungs" className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        {rungs.map((rung) => (
          <li key={rung.id} data-authority-rung={rung.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase text-mirror-proof">
              {rung.label}
            </span>
            <strong className="mt-3 block text-base leading-tight text-zinc-100">{rung.title}</strong>
            <dl className="mt-4 grid gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                  Can do
                </dt>
                <dd className="mt-1 leading-6">{rung.canDo}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                  Proof required
                </dt>
                <dd className="mt-1 leading-6">{rung.proofRequired}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      <p className="mt-5 rounded-mirror border border-mirror-proof/20 bg-mirror-proof/10 p-4 text-sm leading-7 text-zinc-300">
        No rung grants hidden memory, identity authority, wallet control, public posting, deployment, or status changes by itself.
      </p>
    </section>
  );
}
