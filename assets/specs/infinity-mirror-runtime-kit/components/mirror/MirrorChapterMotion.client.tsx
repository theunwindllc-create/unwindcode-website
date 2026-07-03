'use client';

import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type MirrorMotionCell = {
  id: string;
  label: string;
  proof: string;
  boundary: string;
};

type Props = {
  chapterId: string;
  cells: readonly MirrorMotionCell[];
};

const container = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

export const MirrorChapterMotion = memo(function MirrorChapterMotion({ chapterId, cells }: Props) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2" data-motion-state="static">
        {cells.map((cell) => (
          <li key={cell.id} className="rounded-mirror border border-zinc-800 p-5">
            <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">{cell.label}</span>
            <strong className="mt-3 block text-lg text-zinc-100">{cell.proof}</strong>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{cell.boundary}</p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <motion.ul
      className="grid grid-cols-1 gap-3 md:grid-cols-2"
      data-motion-state="framer-leaf"
      data-chapter-id={chapterId}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      {cells.map((cell) => (
        <motion.li
          key={cell.id}
          variants={item}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-mirror border border-zinc-800 bg-zinc-950/70 p-5 shadow-mirror-inner"
        >
          <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">{cell.label}</span>
          <strong className="mt-3 block text-lg text-zinc-100">{cell.proof}</strong>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{cell.boundary}</p>
        </motion.li>
      ))}
    </motion.ul>
  );
});
