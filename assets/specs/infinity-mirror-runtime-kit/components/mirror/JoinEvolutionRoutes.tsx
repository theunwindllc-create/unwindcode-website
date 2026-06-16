import type { JoinEvolutionRoute } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  routes: readonly JoinEvolutionRoute[];
};

export function JoinEvolutionRoutes({ routes }: Props) {
  return (
    <nav
      id="mirror-join-evolution-routes"
      aria-label="Infinity Mirror join evolution routes"
      className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-[1.1fr_0.9fr_1fr_0.8fr]"
    >
      {routes.map((route) => (
        <a
          key={route.href}
          href={route.href}
          className="rounded-mirror border border-zinc-800 bg-zinc-950/55 p-5 text-sm text-zinc-300 transition hover:-translate-y-0.5 hover:border-mirror-proof/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mirror-boundary"
        >
          <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-reflection">
            {route.role}
          </span>
          <strong className="mt-3 block text-lg text-zinc-100">{route.title}</strong>
          <span className="mt-3 block leading-6">{route.next}</span>
          <dl className="mt-5 grid grid-cols-1 gap-3">
            <div>
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Proof
              </dt>
              <dd className="mt-1 leading-6">{route.proof}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                Boundary
              </dt>
              <dd className="mt-1 leading-6">{route.boundary}</dd>
            </div>
          </dl>
        </a>
      ))}
    </nav>
  );
}
