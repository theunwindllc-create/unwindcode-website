import type { MirrorDepthGateLane } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  lanes: readonly MirrorDepthGateLane[];
};

export function MirrorDepthGate({ lanes }: Props) {
  return (
    <section
      id="mirror-depth-gate"
      aria-labelledby="mirror-depth-gate-title"
      className="mt-14 rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="max-w-3xl space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Depth readiness gate
        </p>
        <h3 id="mirror-depth-gate-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          The mirror becomes cinematic only when the fallback is already true.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          Depth is a privilege layer. CSS, Framer, GSAP, and Three/WebGL can deepen the portal only after semantic meaning,
          proof routes, mobile behavior, and shutdown rules are visible.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-4">
        {lanes.map((lane) => (
          <li key={lane.id} data-depth-lane={lane.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {lane.label}
            </span>
            <strong className="mt-3 block text-base text-zinc-100">{lane.title}</strong>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Trigger
                </dt>
                <dd className="mt-1 leading-6">{lane.trigger}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Allowed
                </dt>
                <dd className="mt-1 leading-6">{lane.allowed}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Proof needed
                </dt>
                <dd className="mt-1 leading-6">{lane.proofNeeded}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Fallback
                </dt>
                <dd className="mt-1 leading-6">{lane.fallback}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Kill switch
                </dt>
                <dd className="mt-1 leading-6">{lane.killSwitch}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      <p className="mt-5 rounded-mirror border border-mirror-proof/20 bg-mirror-proof/10 p-4 text-sm font-bold leading-6 text-zinc-300">
        Depth gate rule: if the cinematic layer cannot be removed without changing the claim, the claim is not ready for production.
      </p>
    </section>
  );
}
