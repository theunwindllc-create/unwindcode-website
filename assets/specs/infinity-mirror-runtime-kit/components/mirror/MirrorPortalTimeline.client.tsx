'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function MirrorPortalTimeline() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 760px)').matches;

    if (!root || reduce || compact) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=520%',
            scrub: true,
            pin: true,
          },
        })
        .to('[data-portal-ring]', { scale: 1.08, opacity: 0.95, duration: 0.8, ease: 'power3.out' })
        .to('[data-portal-shard]', { xPercent: 18, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'power2.out' })
        .to('[data-portal-cell]', { scale: 1, opacity: 1, stagger: 0.04, duration: 0.6, ease: 'power2.out' })
        .to('[data-portal-proof]', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-[72dvh] overflow-hidden rounded-mirror border border-zinc-800 bg-zinc-950/70 shadow-mirror-inner" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 720 720" role="presentation" focusable="false">
        <path data-portal-ring d="M167 360c63-91 144-91 193 0 49 91 130 91 193 0" fill="none" stroke="rgba(185,247,239,.72)" strokeWidth="10" strokeLinecap="round" />
        <path data-portal-ring d="M167 360c63 91 144 91 193 0 49-91 130-91 193 0" fill="none" stroke="rgba(214,168,79,.42)" strokeWidth="6" strokeLinecap="round" />
        <path data-portal-shard d="M360 92v144M360 484v144M92 360h144M484 360h144" stroke="rgba(255,255,255,.16)" strokeWidth="2" strokeLinecap="round" />
        <circle data-portal-cell cx="360" cy="360" r="18" fill="rgba(19,184,166,.5)" opacity=".4" />
        <circle data-portal-cell cx="262" cy="302" r="8" fill="rgba(185,247,239,.72)" opacity=".3" />
        <circle data-portal-cell cx="458" cy="418" r="8" fill="rgba(214,168,79,.72)" opacity=".3" />
      </svg>
      <div data-portal-proof className="absolute bottom-6 left-6 max-w-sm translate-y-3 rounded-mirror border border-mirror-reflection/20 bg-mirror-void/80 p-4 opacity-80">
        <span className="font-mono text-[0.65rem] font-black uppercase tracking-[0.14em] text-mirror-proof">Proof returns</span>
      </div>
    </div>
  );
}
