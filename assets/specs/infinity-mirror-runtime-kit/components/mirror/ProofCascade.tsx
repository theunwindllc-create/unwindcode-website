import type { ProofCascadeStep } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  steps: readonly ProofCascadeStep[];
};

export function ProofCascade({ steps }: Props) {
  return (
    <section
      id="mirror-proof-cascade"
      aria-labelledby="mirror-proof-cascade-title"
      className="mt-14 rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="max-w-3xl space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Proof cascade
        </p>
        <h3 id="mirror-proof-cascade-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          Wonder stabilizes when every claim becomes evidence.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          The cascade turns the premium feeling into a diligence path: claim, evidence, artifact, and boundary.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {steps.map((step) => (
          <li key={step.id} data-proof-step={step.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
              {step.index}
            </span>
            <strong className="mt-3 block text-base text-zinc-100">{step.title}</strong>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Claim
                </dt>
                <dd className="mt-1 leading-6">{step.claim}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Evidence
                </dt>
                <dd className="mt-1 leading-6">{step.evidence}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Artifact
                </dt>
                <dd className="mt-1 leading-6">
                  <a href={step.artifact} className="font-bold text-mirror-reflection underline-offset-4 hover:underline">
                    {step.artifact}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-reflection">
                  Boundary
                </dt>
                <dd className="mt-1 leading-6">{step.boundary}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
