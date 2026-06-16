import type { SourceTranslationLedgerEntry } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  entries: readonly SourceTranslationLedgerEntry[];
};

export function SourceTranslationLedger({ entries }: Props) {
  return (
    <section
      id="mirror-source-ledger"
      aria-labelledby="mirror-source-ledger-title"
      className="mt-14 rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="max-w-3xl space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Source translation ledger
        </p>
        <h3 id="mirror-source-ledger-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          The source teaches structure, not skin.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          The 81K experience gives the design law: human signal first, method visible, emotion and proof held together. Infinity Mirror converts those laws into architecture and approval gates.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {entries.map((entry) => (
          <li key={entry.id} data-source-translation={entry.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {entry.label}
            </span>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Source pattern
                </dt>
                <dd className="mt-1 leading-6">{entry.sourcePattern}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Unwind translation
                </dt>
                <dd className="mt-1 leading-6">{entry.unwindTranslation}</dd>
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
