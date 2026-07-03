import type { AdaptiveMirrorLens } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  lenses: readonly AdaptiveMirrorLens[];
};

export function AdaptiveMirrorEngine({ lenses }: Props) {
  return (
    <section
      id="mirror-adaptive-engine"
      aria-labelledby="mirror-adaptive-engine-title"
      className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-16 md:px-8"
      data-runtime-owner="bounded-adaptive-lens-relay"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.36fr_0.64fr]">
        <div className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            Adaptive mirror engine
          </p>
          <h3 id="mirror-adaptive-engine-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
            One reflection can be read four ways.
          </h3>
          <p className="text-sm leading-7 text-zinc-400">
            The lens is product grammar, not hidden authority. It names how a signal is captured, translated, kept, and bounded.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {lenses.map((lens) => (
            <li key={lens.id} data-adaptive-lens={lens.id} className="rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner">
              <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-reflection">
                {lens.label}
              </span>
              <strong className="mt-3 block text-lg text-zinc-100">{lens.description}</strong>
              <dl className="mt-5 grid grid-cols-1 gap-3 text-sm text-zinc-300">
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                    Capture
                  </dt>
                  <dd className="mt-1 leading-6">{lens.capture}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                    Translate
                  </dt>
                  <dd className="mt-1 leading-6">{lens.translate}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                    Keep
                  </dt>
                  <dd className="mt-1 leading-6">{lens.keep}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.68rem] font-black uppercase tracking-[0.12em] text-mirror-proof">
                    Boundary
                  </dt>
                  <dd className="mt-1 leading-6">{lens.boundary}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
