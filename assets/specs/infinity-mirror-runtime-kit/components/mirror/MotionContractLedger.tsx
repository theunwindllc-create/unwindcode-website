import type { MotionContract } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  contracts: readonly MotionContract[];
};

export function MotionContractLedger({ contracts }: Props) {
  return (
    <section
      id="mirror-motion-contract"
      aria-labelledby="mirror-motion-contract-title"
      className="mt-14 rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="max-w-3xl space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Motion contract
        </p>
        <h3 id="mirror-motion-contract-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          Every cinematic move has a proof job.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          The experience can feel alive only when each motion explains the organism: what triggered it, what changed, how long it runs, and how it stays lightweight.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {contracts.map((contract) => (
          <li key={contract.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {contract.label}
            </span>
            <strong className="mt-3 block text-base text-zinc-100">{contract.title}</strong>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Trigger
                </dt>
                <dd className="mt-1 leading-6">{contract.trigger}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Animation
                </dt>
                <dd className="mt-1 leading-6">{contract.animation}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Timing
                </dt>
                <dd className="mt-1 leading-6">{contract.timing}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Duration
                </dt>
                <dd className="mt-1 leading-6">{contract.duration}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Easing
                </dt>
                <dd className="mt-1 leading-6">{contract.easing}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Performance
                </dt>
                <dd className="mt-1 leading-6">{contract.performance}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
