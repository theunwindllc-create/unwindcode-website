import type { RecursiveBrainTunnelStep } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  steps: readonly RecursiveBrainTunnelStep[];
};

export function RecursiveBrainTunnel({ steps }: Props) {
  return (
    <section
      id="mirror-recursive-brain-tunnel"
      aria-labelledby="mirror-recursive-brain-tunnel-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
      data-runtime-owner="semantic-brain-tunnel"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Recursive brain tunnel
          </p>
          <h3 id="mirror-recursive-brain-tunnel-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            Move through the route a signal takes.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            The tunnel turns scroll into organism grammar: signal dives inward, cells wake, boundaries hold, and proof returns outward.
          </p>
        </div>

        <div className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[0.38fr_0.62fr]">
            <div className="grid min-h-72 place-items-center rounded-mirror border border-zinc-800 bg-mirror-void/80 p-5 text-center">
              <div>
                <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                  Semantic tunnel
                </span>
                <b className="mt-5 block text-7xl font-black text-mirror-reflection" aria-hidden="true">
                  &infin;
                </b>
                <p className="mt-5 text-sm leading-6 text-zinc-400">
                  Signal, cells, boundary, proof.
                </p>
              </div>
            </div>

            <ol className="grid grid-cols-1 gap-3">
              {steps.map((step) => (
                <li key={step.id} data-tunnel-step={step.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
                  <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                    {step.index} / {step.cell}
                  </span>
                  <strong className="mt-3 block text-base text-zinc-100">{step.title}</strong>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
