'use client';

import { useMemo, useState } from 'react';
import type { BrainRouteStage, BrainSignalHandoffPacket } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  packets: readonly BrainSignalHandoffPacket[];
  stages: readonly BrainRouteStage[];
  initialPacketId?: string;
};

export function BrainSignalHandoff({ packets, stages, initialPacketId }: Props) {
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
      id="mirror-brain-signal-handoff"
      aria-labelledby="mirror-brain-signal-handoff-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
      data-runtime-owner="bounded-brain-signal-handoff"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.34fr_0.66fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Brain signal handoff
          </p>
          <h3 id="mirror-brain-signal-handoff-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            The signal composer can update the Brain route without hidden authority.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            This client leaf owns local selected-signal state only. It stores nothing, calls no network, writes no files, runs no code, deploys nothing, and posts nothing.
          </p>
        </div>

        <div className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-4" aria-label="Brain handoff signal profiles">
            {packets.map((packet) => (
              <button
                key={packet.id}
                type="button"
                aria-pressed={activePacket.id === packet.id}
                className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-3 text-left transition hover:border-mirror-reflection/40 active:translate-y-px"
                onClick={() => setActiveId(packet.id)}
              >
                <span className="block font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                  {packet.tab}
                </span>
                <span className="mt-2 block text-xs leading-5 text-zinc-400">{packet.tabDescription}</span>
              </button>
            ))}
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2" aria-live="polite">
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                Signal handoff
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300" data-brain-handoff="signal">
                {activePacket.signal}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                Cells
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300" data-brain-handoff="cells">
                {activePacket.cells}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                Authority lock
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300" data-brain-handoff="authority">
                {activePacket.authority}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                Proof return
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300" data-brain-handoff="proof">
                {activePacket.proof}
              </dd>
            </div>
          </dl>

          <ol className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
            {stages.map((stage) => (
              <li key={stage.id} data-route-stage={stage.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
                <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                  {stage.index}
                </span>
                <strong className="mt-3 block text-sm text-zinc-100">{stage.title}</strong>
                <p className="mt-3 text-sm leading-6 text-zinc-400" data-brain-route-copy={stage.id}>
                  {activePacket[stage.id]}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
