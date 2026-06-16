'use client';

import { useMemo, useState } from 'react';
import type { MirrorProofObservatoryPacket } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  packets: readonly MirrorProofObservatoryPacket[];
  initialPacketId?: string;
};

export function ProofObservatory({ packets, initialPacketId }: Props) {
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
      id="mirror-proof-observatory"
      aria-labelledby="mirror-proof-observatory-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
      data-runtime-owner="bounded-proof-observatory"
      data-runtime-boundary="no-live-telemetry-storage-files-execution-deploy-posting-status-change-or-autonomy"
      data-active-proof={activePacket.id}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.4fr_0.6fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Proof observatory
          </p>
          <h3 id="mirror-proof-observatory-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            Architecture, metrics, deployments, and status become one inspectable instrument.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            This client leaf owns local selected-proof-lane state only. It cannot read live telemetry, store hidden state, execute code, write files, deploy, post publicly, grant autonomy, or change production status.
          </p>
        </div>

        <div className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7">
          <fieldset className="grid grid-cols-1 gap-2 md:grid-cols-4">
            <legend className="sr-only">Choose an evidence lane</legend>
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
                Evidence path
              </dt>
              <dd className="mt-2 text-sm leading-6 text-zinc-300" data-proof-output="evidence">
                {activePacket.evidence}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Current signal
              </dt>
              <dd className="mt-2 text-sm leading-6 text-zinc-300" data-proof-output="signal">
                {activePacket.signal}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Authority boundary
              </dt>
              <dd className="mt-2 text-sm leading-6 text-zinc-300" data-proof-output="boundary">
                {activePacket.boundary}
              </dd>
            </div>
            <div className="rounded-mirror border border-zinc-800 bg-mirror-void/70 p-4">
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Next artifact
              </dt>
              <dd className="mt-2 text-sm leading-6">
                <a href={activePacket.href} className="font-bold text-mirror-reflection underline-offset-4 hover:underline">
                  {activePacket.linkLabel}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
