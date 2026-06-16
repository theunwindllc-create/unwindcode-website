'use client';

import { useMemo, useState } from 'react';
import type { MirrorEmotionalProgressionPacket } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  packets: readonly MirrorEmotionalProgressionPacket[];
  initialPacketId?: string;
};

export function EmotionalProgressionRail({ packets, initialPacketId }: Props) {
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
      id="mirror-emotional-progression"
      aria-labelledby="mirror-emotional-progression-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
      data-runtime-owner="bounded-emotional-progress"
      data-runtime-boundary="no-emotional-profiling-storage-network-files-execution-deploy-posting-or-identity-authority"
      data-active-emotion={activePacket.id}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.4fr_0.6fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Emotional progression
          </p>
          <h3 id="mirror-emotional-progression-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            The experience moves feeling into proof before it asks for trust.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            This client leaf owns local selected-emotion state only. It cannot profile emotion, infer identity, store memory, call a network, write files, execute code, deploy, or post publicly.
          </p>
        </div>

        <div className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7">
          <fieldset className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <legend className="sr-only">Choose an emotional progression state</legend>
            {packets.map((packet) => (
              <button
                key={packet.id}
                type="button"
                aria-pressed={activePacket.id === packet.id}
                className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-3 text-left transition hover:-translate-y-0.5 hover:border-mirror-reflection/40 aria-pressed:border-mirror-proof/60 aria-pressed:bg-mirror-proof/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mirror-boundary"
                onClick={() => setActiveId(packet.id)}
              >
                <span className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  {packet.tab}
                </span>
                <span className="mt-2 block text-xs leading-5 text-zinc-400">{packet.tabDescription}</span>
              </button>
            ))}
          </fieldset>

          <dl className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2" aria-live="polite">
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Feeling
              </dt>
              <dd className="mt-2 text-sm leading-6 text-zinc-300" data-emotion-output="feeling">
                {activePacket.feeling}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Organism route
              </dt>
              <dd className="mt-2 text-sm leading-6 text-zinc-300" data-emotion-output="organism">
                {activePacket.organism}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Proof return
              </dt>
              <dd className="mt-2 text-sm leading-6 text-zinc-300" data-emotion-output="proof">
                {activePacket.proof}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Authority boundary
              </dt>
              <dd className="mt-2 text-sm leading-6 text-zinc-300" data-emotion-output="boundary">
                {activePacket.boundary}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
