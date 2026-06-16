import type { MirrorProductLoopStep } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  decisions: readonly string[];
  steps: readonly MirrorProductLoopStep[];
};

export function MirrorProductLoop({ decisions, steps }: Props) {
  return (
    <section
      id="mirror-product-loop"
      aria-labelledby="mirror-product-loop-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.34fr_0.66fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Engine distillation
          </p>
          <h3 id="mirror-product-loop-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            The mirror keeps one shell while the output becomes proof.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            Reflection becomes a loop: listen, translate, map, return an artifact, then let the person keep, refuse, deepen, or turn it into one grounded action.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {steps.map((step) => (
            <li key={step.id} data-product-step={step.id} className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner">
              <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                {step.index}
              </span>
              <strong className="mt-3 block text-lg text-zinc-100">{step.title}</strong>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-5 md:p-7">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-reflection">
          Pressure-release valve
        </p>
        <p className="mt-3 max-w-[72ch] text-sm leading-7 text-zinc-400">
          Some sessions should only listen. No tagging, no artifact, no growth claim. Refusal is part of the interface because consent is part of the architecture.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Mirror artifact decisions">
          {decisions.map((decision) => (
            <li key={decision} className="rounded-mirror border border-zinc-800 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {decision}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
