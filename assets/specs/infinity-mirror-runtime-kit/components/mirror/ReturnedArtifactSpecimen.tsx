import type { ArtifactRepairStep, ReturnedArtifactField } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  fields: readonly ReturnedArtifactField[];
  repairSteps: readonly ArtifactRepairStep[];
};

const artifactRoute = ['Capture signal', 'Choose lens', 'Map recurrence', 'Lock boundary', 'Return proof'] as const;

export function ReturnedArtifactSpecimen({ fields, repairSteps }: Props) {
  return (
    <section
      id="mirror-returned-artifact"
      aria-labelledby="mirror-returned-artifact-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
      data-runtime-owner="bounded-artifact-return"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.46fr_0.54fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Returned artifact specimen
          </p>
          <h3 id="mirror-returned-artifact-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            The mirror gives back a reviewable object, not a mood.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            A reflection run should leave a packet that names the signal, lens, memory map, authority boundary, proof path, and the choices a person still owns.
          </p>
          <ol className="grid grid-cols-1 gap-2 text-sm text-zinc-300">
            {artifactRoute.map((step, index) => (
              <li key={step} className="flex items-center gap-3 border-t border-zinc-800 py-3">
                <span className="font-mono text-xs font-black text-mirror-proof">{String(index + 1).padStart(2, '0')}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7">
          <dl className="grid grid-cols-1 gap-3 text-sm text-zinc-300">
            {fields.map((field) => (
              <div key={field.id} data-artifact-field={field.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  {field.label}
                </dt>
                <dd className="mt-1 leading-6">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-6 rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-5 md:p-7">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Repair ledger
        </p>
        <h4 className="mt-3 text-lg font-black text-zinc-100">
          A crack becomes a question before it becomes memory.
        </h4>
        <ol className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {repairSteps.map((step) => (
            <li key={step.id} data-repair-step={step.id} className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                {step.index}
              </span>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
