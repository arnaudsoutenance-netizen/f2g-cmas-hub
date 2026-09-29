"use client";

import { m } from "framer-motion";
import { type PointerEvent, type ReactNode, useRef } from "react";
import { dur, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Card with a soft orange glow that follows the pointer (omicron-ui login
 * effect). The pointer position is written to CSS variables on the element,
 * so moving the mouse never re-renders React.
 */
export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--gy", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <m.div
      ref={ref}
      onPointerMove={onPointerMove}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: dur.slow * 1.6, ease: ease.emphasized }}
      className={cn(
        "group/glow relative overflow-hidden rounded-[20px] border border-brand-orange/20 bg-surface shadow-e3",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,30%),rgb(236_130_54/0.13),transparent_60%)] opacity-60 transition-opacity duration-300 group-hover/glow:opacity-100"
      />
      <div className="relative">{children}</div>
    </m.div>
  );
}
