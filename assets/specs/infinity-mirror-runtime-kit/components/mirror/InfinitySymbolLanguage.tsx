import type { InfinitySymbolState } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  states: readonly InfinitySymbolState[];
};

export function InfinitySymbolLanguage({ states }: Props) {
  return (
    <section
      id="mirror-infinity-language"
      aria-labelledby="mirror-infinity-language-title"
      className="mt-12 grid grid-cols-1 gap-6 rounded-mirror border border-zinc-800 bg-zinc-950/60 p-5 shadow-mirror-inner lg:grid-cols-[0.34fr_0.66fr] md:p-7"
    >
      <div className="space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
          Mirror engine language
        </p>
        <h3 id="mirror-infinity-language-title" className="text-2xl font-black leading-tight text-zinc-100 md:text-3xl">
          The symbol means loop plus boundary.
        </h3>
        <p className="text-sm leading-7 text-zinc-400">
          The infinity mark has seven public states. Each state names what loops, what proves it, and where authority stops.
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {states.map((state) => (
          <li key={state.id} className="rounded-mirror border border-zinc-800 bg-mirror-graphite/70 p-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">
                {state.index}
              </span>
              <b className="text-2xl font-black text-mirror-reflection" aria-hidden="true">
                &infin;
              </b>
              <strong className="text-base text-zinc-100">{state.title}</strong>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{state.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
