'use client';

import { useMemo, useState } from 'react';
import type { MirrorStateSequencerPacket } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  packets: readonly MirrorStateSequencerPacket[];
  initialPacketId?: string;
};

export function MirrorStateSequencer({ packets, initialPacketId }: Props) {
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
      id="mirror-state-sequencer"
      aria-labelledby="mirror-state-sequencer-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
      data-runtime-owner="bounded-state-sequencer"
      data-runtime-boundary="no-storage-network-files-execution-deploy-posting-identity-inference-status-change-or-autonomy"
      data-active-state={activePacket.id}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.38fr_0.62fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Mirror state sequencer
          </p>
          <h3 id="mirror-state-sequencer-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            The whole story is a bounded organism loop.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            This client leaf owns local selected-state only. It cannot store memory, call a network, execute code, write files, deploy, post publicly, infer identity, change production status, or grant autonomy.
          </p>
        </div>

        <div className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7">
          <fieldset className="grid grid-cols-1 gap-2 md:grid-cols-7">
            <legend className="sr-only">Choose a mirror story state</legend>
            {packets.map((packet) => (
              <button
                key={packet.id}
                type="button"
                aria-pressed={activePacket.id === packet.id}
                className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-3 text-left transition hover:-translate-y-0.5 hover:border-mirror-reflection/40 aria-pressed:border-mirror-proof/60 aria-pressed:bg-mirror-proof/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mirror-boundary"
                onClick={() => setActiveId(packet.id)}
              >
                <span className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  {packet.index}
                </span>
                <span className="mt-2 block text-xs font-bold leading-5 text-zinc-200">{packet.tab}</span>
              </button>
            ))}
          </fieldset>

          <dl className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2" aria-live="polite">
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Signal
              </dt>
              <dd className="mt-2 text-sm leading-6 text-zinc-300" data-state-output="signal">
                {activePacket.signal}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Organism response
              </dt>
              <dd className="mt-2 text-sm leading-6 text-zinc-300" data-state-output="response">
                {activePacket.response}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Proof return
              </dt>
              <dd className="mt-2 text-sm leading-6 text-zinc-300" data-state-output="proof">
                {activePacket.proof}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Boundary lock
              </dt>
              <dd className="mt-2 text-sm leading-6 text-zinc-300" data-state-output="boundary">
                {activePacket.boundary}
              </dd>
            </div>
          </dl>

          <a href={activePacket.href} className="mt-5 inline-flex rounded-full border border-mirror-reflection/30 px-4 py-3 text-sm font-bold text-mirror-reflection underline-offset-4 hover:underline">
            {activePacket.linkLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
