import type { EngineTranslationLedgerEntry } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  entries: readonly EngineTranslationLedgerEntry[];
};

const decisionLabels = {
  adopt_now: 'Adopt now',
  prototype_next: 'Prototype next',
  block_until_proof: 'Block until proof',
} satisfies Record<EngineTranslationLedgerEntry['decision'], string>;

export function EngineTranslationLedger({ entries }: Props) {
  return (
    <section
      id="mirror-engine-translation"
      aria-labelledby="mirror-engine-translation-title"
      className="mt-14 rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="max-w-3xl space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Engine translation ledger
        </p>
        <h3 id="mirror-engine-translation-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          The local engine concept becomes progress, lens, artifact, and approval states.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          Imported ideas earn their place only when each one names a product role, a proof surface, and an authority guard.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.1fr_0.9fr]">
        {entries.map((entry) => (
          <li key={entry.id} data-engine-translation={entry.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {entry.label}
            </span>
            <strong className="mt-3 block text-base text-zinc-100">{entry.concept}</strong>
            <p className="mt-3 font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
              {decisionLabels[entry.decision]}
            </p>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Translation
                </dt>
                <dd className="mt-1 leading-6">{entry.translation}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Guard
                </dt>
                <dd className="mt-1 leading-6">{entry.guard}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
