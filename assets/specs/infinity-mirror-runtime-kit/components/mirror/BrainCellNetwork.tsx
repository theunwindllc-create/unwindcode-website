import type { BrainCellNode } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  cells: readonly BrainCellNode[];
};

export function BrainCellNetwork({ cells }: Props) {
  return (
    <section
      id="mirror-brain-cell-network"
      aria-labelledby="mirror-brain-cell-network-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-20 md:px-8"
    >
      <div className="max-w-3xl space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Brain cell network
        </p>
        <h3 id="mirror-brain-cell-network-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-4xl">
          The Brain routes signal through cells before action.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          The network is readable before it is cinematic: each cell names the signal it accepts, the path it takes, the proof it returns, and the authority it refuses.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[0.32fr_0.68fr]">
        <aside className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner">
          <p className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-reflection">
            Network rule
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            A living route can feel intelligent only when it can be inspected. The visual network is decorative; the ordered cell ledger is the contract.
          </p>
          <ol className="mt-5 space-y-2 text-sm text-zinc-300">
            {cells.map((cell) => (
              <li key={cell.id} className="flex gap-3">
                <span className="font-mono text-xs font-black text-mirror-proof">{cell.label.slice(0, 2)}</span>
                <span>{cell.title}</span>
              </li>
            ))}
          </ol>
        </aside>

        <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {cells.map((cell) => (
            <li key={cell.id} data-cell-id={cell.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
              <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                {cell.label}
              </span>
              <strong className="mt-3 block text-base text-zinc-100">{cell.title}</strong>
              <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Signal
                  </dt>
                  <dd className="mt-1 leading-6">{cell.signal}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Path
                  </dt>
                  <dd className="mt-1 leading-6">{cell.path}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Proof
                  </dt>
                  <dd className="mt-1 leading-6">{cell.proof}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                    Authority stop
                  </dt>
                  <dd className="mt-1 leading-6">{cell.authorityStop}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
