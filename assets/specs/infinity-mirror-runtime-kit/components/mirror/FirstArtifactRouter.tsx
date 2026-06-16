import type { FirstArtifactRoute } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  routes: readonly FirstArtifactRoute[];
};

export function FirstArtifactRouter({ routes }: Props) {
  return (
    <section
      id="mirror-first-artifact-router"
      aria-labelledby="mirror-first-artifact-router-title"
      data-runtime-owner="semantic-first-artifact-router"
      className="mt-5 rounded-mirror border border-mirror-boundary/20 bg-zinc-950/65 p-5 shadow-mirror-inner md:p-7"
    >
      <div className="grid gap-4 md:grid-cols-[0.34fr_0.66fr] md:items-end">
        <p className="font-mono text-xs font-black uppercase text-mirror-proof">
          First artifact router
        </p>
        <div className="space-y-3">
          <h3 id="mirror-first-artifact-router-title" className="max-w-xl text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            The next step is a packet someone can inspect.
          </h3>
          <p className="max-w-3xl text-sm leading-7 text-zinc-400">
            Each visitor leaves with a bounded artifact path: what to bring, what Unwind returns first, where proof lives, and what still needs explicit approval.
          </p>
        </div>
      </div>

      <ol aria-label="Role to first artifact paths" className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {routes.map((route) => (
          <li key={route.id} data-first-artifact-route={route.id} className="grid min-h-80 gap-3 rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <span className="font-mono text-xs font-black uppercase text-mirror-proof">
              {route.label}
            </span>
            <strong className="block text-base leading-tight text-zinc-100">{route.title}</strong>
            <dl className="grid gap-3 text-sm text-zinc-300">
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                  Bring
                </dt>
                <dd className="mt-1 leading-6">{route.bring}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                  First artifact
                </dt>
                <dd className="mt-1 leading-6">{route.firstArtifact}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                  Proof route
                </dt>
                <dd className="mt-1 leading-6">{route.proofRoute}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] font-black uppercase text-mirror-reflection">
                  Approval boundary
                </dt>
                <dd className="mt-1 leading-6">{route.approvalBoundary}</dd>
              </div>
            </dl>
            <a href={route.href} className="self-end text-sm font-bold text-zinc-100 underline decoration-mirror-proof/40 underline-offset-4">
              {route.cta}
            </a>
          </li>
        ))}
      </ol>

      <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-7 text-zinc-400">
        The router does not submit data, create a lead, start a build, spend money, deploy, post publicly, or grant autonomy. It only makes the first inspectable artifact legible.
      </p>
    </section>
  );
}
