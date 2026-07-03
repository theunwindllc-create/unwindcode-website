import type { MirrorDescentStage } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  stages: readonly MirrorDescentStage[];
};

export function MirrorDescentProtocol({ stages }: Props) {
  return (
    <section
      id="mirror-descent-protocol"
      aria-labelledby="mirror-descent-protocol-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
    >
      <div className="max-w-3xl space-y-4">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Descent protocol
        </p>
        <h3 id="mirror-descent-protocol-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          Immersion earns trust only when the descent returns proof.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          The engine concept's scroll journey becomes a governed route: self, memory, split, lattice, current, evolution, and return. Each stage has a product job and an authority boundary.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1.1fr_0.9fr]">
        {stages.map((stage) => (
          <li key={stage.id} data-descent-stage={stage.id} className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {stage.index}
            </span>
            <strong className="mt-3 block text-lg text-zinc-100">{stage.title}</strong>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{stage.description}</p>
            <p className="mt-4 border-t border-zinc-800 pt-3 text-sm leading-6 text-mirror-reflection">{stage.boundary}</p>
          </li>
        ))}
      </ol>

      <aside className="mt-6 rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-5 md:p-7">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Facing moment
        </p>
        <strong className="mt-3 block text-lg text-zinc-100">
          The mirror may show possibility. It may not claim destiny.
        </strong>
        <p className="mt-3 max-w-[72ch] text-sm leading-7 text-zinc-400">
          Future-facing visuals stay framed as reflection, not identity authority. The person decides what to keep, correct, deepen, or close.
        </p>
      </aside>
    </section>
  );
}
