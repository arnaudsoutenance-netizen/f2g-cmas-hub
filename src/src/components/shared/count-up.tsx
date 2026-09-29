"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ease } from "@/lib/motion";

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

/**
 * Counts up on first mount only. After that, new values swap instantly and the
 * digits flash once (keyed CSS animation), so a refetch never replays the count.
 */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const [counting, setCounting] = useState<number | null>(reduce ? null : 0);
  const [initialTarget] = useState(value);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(0, initialTarget, {
      duration: 0.6,
      ease: ease.standard,
      onUpdate: setCounting,
      onComplete: () => setCounting(null),
    });
    return () => controls.stop();
  }, [reduce, initialTarget]);

  const settled = counting === null;
  const shown = settled ? value : Number.isInteger(initialTarget) ? Math.round(counting) : counting;

  return (
    <span
      key={settled ? value : "counting"}
      className={`${className ?? ""} rounded-[var(--radius-xs)] tabular-nums ${settled && value !== initialTarget ? "kpi-flash" : ""}`}
    >
      {numberFormat.format(shown)}
    </span>
  );
}
