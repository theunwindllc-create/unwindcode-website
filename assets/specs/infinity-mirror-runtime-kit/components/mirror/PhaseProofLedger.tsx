import type { PhaseProofLedgerEntry } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  entries: readonly PhaseProofLedgerEntry[];
};

export function PhaseProofLedger({ entries }: Props) {
  return (
    <section
      id="mirror-phase-proof-ledger"
      aria-labelledby="mirror-phase-proof-ledger-title"
      className="mt-14 rounded-mirror border border-mirror-boundary/20 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="max-w-3xl space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Phase proof ledger
        </p>
        <h3 id="mirror-phase-proof-ledger-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          Seven phases now resolve into evidence, surface, and boundary.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          This server-rendered ledger maps each experience phase to a proof artifact, a visible surface, and an authority stop before future runtime work can claim more.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {entries.map((entry) => (
          <li key={entry.id} data-phase-proof={entry.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {entry.label}
            </span>
            <strong className="mt-3 block text-base leading-tight text-zinc-100">{entry.title}</strong>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Evidence
                </dt>
                <dd className="mt-1 leading-6">{entry.evidence}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Surface
                </dt>
                <dd className="mt-1 leading-6">
                  <a className="font-bold text-mirror-reflection" href={entry.surfaceHref}>
                    {entry.surfaceLabel}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Boundary
                </dt>
                <dd className="mt-1 leading-6">{entry.boundary}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
