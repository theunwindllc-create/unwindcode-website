'use client';

import { useMemo, useState } from 'react';
import type { MirrorSignalPacket } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  packets: readonly MirrorSignalPacket[];
  initialPacketId?: string;
};

export function SignalComposer({ packets, initialPacketId }: Props) {
  const firstPacketId = packets[0]?.id ?? '';
  const [activeId, setActiveId] = useState(initialPacketId ?? firstPacketId);
  const activePacket = useMemo(
    () => packets.find((packet) => packet.id === activeId) ?? packets[0],
    [activeId, packets],
  );

  if (!activePacket) {
    return null;
  }

  return (
    <section
      id="mirror-signal-composer"
      aria-labelledby="mirror-signal-composer-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
      data-runtime-owner="bounded-signal-composer"
      data-runtime-boundary="no-storage-network-files-deploy-posting-or-identity-authority"
      data-active-signal={activePacket.id}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.38fr_0.62fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Signal composer
          </p>
          <h3 id="mirror-signal-composer-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            Choose the signal and watch the mirror return a bounded packet.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            The visitor does not need to trust an invisible model. A selected signal changes the lens, returned artifact, proof path, and authority lock in view.
          </p>
        </div>

        <div className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7">
          <fieldset className="grid grid-cols-1 gap-3 md:grid-cols-2" aria-describedby="mirror-signal-composer-boundary">
            <legend className="sr-only">Choose a human signal</legend>
            {packets.map((packet) => (
              <button
                key={packet.id}
                type="button"
                aria-pressed={activePacket.id === packet.id}
                className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4 text-left transition hover:-translate-y-0.5 hover:border-mirror-reflection/40 aria-pressed:border-mirror-proof/60 aria-pressed:bg-mirror-proof/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mirror-boundary"
                onClick={() => setActiveId(packet.id)}
              >
                <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  {packet.tab}
                </span>
                <span className="mt-2 block text-sm leading-6 text-zinc-400">{packet.tabDescription}</span>
              </button>
            ))}
          </fieldset>

          <dl className="mt-6 grid grid-cols-1 gap-3 text-sm text-zinc-300 md:grid-cols-2" aria-live="polite">
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Selected signal
              </dt>
              <dd className="mt-2 leading-6">{activePacket.signal}</dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Lens returned
              </dt>
              <dd className="mt-2 leading-6">{activePacket.lens}</dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Artifact promise
              </dt>
              <dd className="mt-2 leading-6">{activePacket.artifact}</dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Boundary
              </dt>
              <dd className="mt-2 leading-6">{activePacket.boundary}</dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Proof path
              </dt>
              <dd className="mt-2 leading-6">{activePacket.proofPath}</dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Brain cells
              </dt>
              <dd className="mt-2 leading-6">{activePacket.brainCells}</dd>
            </div>
          </dl>

          <p id="mirror-signal-composer-boundary" className="mt-5 text-sm leading-7 text-zinc-500">
            {activePacket.authorityLock}
          </p>
        </div>
      </div>
    </section>
  );
}
