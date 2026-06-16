import type { ExperienceAuditLens } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  lenses: readonly ExperienceAuditLens[];
};

export function ExperienceAuditConsole({ lenses }: Props) {
  return (
    <section
      id="mirror-experience-audit"
      aria-labelledby="mirror-experience-audit-title"
      className="mt-14 rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.38fr_0.62fr]">
        <div className="space-y-3">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Experience audit console
          </p>
          <h3 id="mirror-experience-audit-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            Reverse engineering becomes a public design instrument.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            Phase 1 stays inspectable: every lens names purpose, why the reference works, and how Unwind reinterprets the pattern without cloning the surface.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-3">
          {lenses.map((lens) => (
            <li key={lens.id} data-audit-lens={lens.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
              <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                {lens.index}
              </span>
              <strong className="mt-3 block text-base text-zinc-100">{lens.title}</strong>
              <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300 md:grid-cols-3">
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Purpose
                  </dt>
                  <dd className="mt-1 leading-6">{lens.purpose}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Why it works
                  </dt>
                  <dd className="mt-1 leading-6">{lens.works}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Unwind reinterpretation
                  </dt>
                  <dd className="mt-1 leading-6">{lens.reinterpret}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
