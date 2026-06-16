import type { EvolutionEntryProtocolStep } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  steps: readonly EvolutionEntryProtocolStep[];
};

export function EvolutionEntryProtocol({ steps }: Props) {
  return (
    <section
      id="mirror-evolution-entry-protocol"
      aria-labelledby="mirror-evolution-entry-protocol-title"
      className="mt-10 grid gap-5 rounded-mirror border border-mirror-reflection/20 bg-zinc-950/60 p-5 shadow-mirror-inner md:grid-cols-[0.34fr_0.66fr] md:p-7"
    >
      <div className="self-center space-y-3">
        <p className="font-mono text-xs font-black uppercase text-mirror-proof">
          Entry protocol
        </p>
        <h3 id="mirror-evolution-entry-protocol-title" className="max-w-sm text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          Joining is a proof loop, not a form.
        </h3>
        <p className="max-w-md text-sm leading-7 text-zinc-400">
          The first move is small, inspectable, and bounded before the organism earns more authority.
        </p>
      </div>

      <ol aria-label="Evolution entry protocol steps" className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => (
          <li key={step.id} data-entry-step={step.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase text-mirror-proof">
              {step.label}
            </span>
            <strong className="mt-3 block text-base leading-tight text-zinc-100">{step.title}</strong>
            <dl className="mt-4 grid gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                  Input
                </dt>
                <dd className="mt-1 leading-6">{step.input}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                  Proof output
                </dt>
                <dd className="mt-1 leading-6">{step.proofOutput}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
