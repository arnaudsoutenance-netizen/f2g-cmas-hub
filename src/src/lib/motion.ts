import type { Transition } from "framer-motion";

export const dur = { instant: 0, fast: 0.12, base: 0.18, moderate: 0.24, slow: 0.36 } as const;

export const ease = {
  standard: [0.2, 0, 0, 1],
  exit: [0.4, 0, 1, 1],
  emphasized: [0.32, 0.72, 0, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export const spring = {
  snappy: { type: "spring", stiffness: 520, damping: 40, mass: 0.8 },
  layout: { type: "spring", stiffness: 400, damping: 36 },
  gentle: { type: "spring", stiffness: 260, damping: 30 },
} as const satisfies Record<string, Transition>;

/** Page enter: no exit animation, App Router navigation must stay instant. */
export const pageEnter = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: dur.base, ease: ease.standard },
} as const;
