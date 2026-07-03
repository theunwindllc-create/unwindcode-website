import type { CognitiveEvolutionTraceStep } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  steps: readonly CognitiveEvolutionTraceStep[];
};

export function CognitiveEvolutionTrace({ steps }: Props) {
  return (
    <section
      id="mirror-cognitive-evolution-trace"
      aria-labelledby="mirror-cognitive-trace-title"
      className="mx-auto mt-14 grid w-full max-w-7xl gap-6 rounded-mirror border border-mirror-reflection/20 bg-zinc-950/60 p-5 shadow-mirror-inner md:grid-cols-[0.34fr_0.66fr] md:p-7"
    >
      <div className="self-center space-y-4">
        <p className="font-mono text-xs font-black uppercase text-mirror-proof">
          05B / Cognitive evolution trace
        </p>
        <h3 id="mirror-cognitive-trace-title" className="max-w-xs text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          A living intelligence is a loop you can inspect.
        </h3>
        <p className="max-w-md text-sm leading-7 text-zinc-400">
          The mirror should show the metabolism: signal becomes memory, cells take roles, proof returns,
          and the next loop opens only when the boundary is clear.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[0.38fr_0.62fr]">
        <div
          className="relative grid min-h-72 place-items-center overflow-hidden rounded-mirror border border-zinc-800 bg-mirror-graphite/70"
          aria-hidden="true"
        >
          <span className="absolute h-40 w-64 rounded-[50%] border border-mirror-reflection/20" />
          <span className="absolute h-28 w-48 rounded-[50%] border border-mirror-boundary/20" />
          <span className="text-7xl leading-none text-zinc-100">&infin;</span>
        </div>

        <ol aria-label="Inspectable cognitive evolution steps" className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {steps.map((step) => (
            <li key={step.id} data-cognitive-step={step.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
              <span className="font-mono text-xs font-black uppercase text-mirror-proof">
                {step.index}
              </span>
              <strong className="mt-3 block text-base leading-tight text-zinc-100">{step.title}</strong>
              <dl className="mt-4 grid gap-3 text-sm text-zinc-300">
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                    Evolves
                  </dt>
                  <dd className="mt-1 leading-6">{step.evolves}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                    Proof lock
                  </dt>
                  <dd className="mt-1 leading-6">{step.proofLock}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
