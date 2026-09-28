"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: string | string[];
  className?: string;
  children: ReactNode;
}

export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = ["#F97316", "#FB923C", "#FED7AA"],
  className,
  children,
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--border-width": `${borderWidth}px`,
          "--shine-pulse-duration": `${duration}s`,
          "--shine-color-1": Array.isArray(color) ? color[0] : color,
          "--shine-color-2": Array.isArray(color) ? color[1] : color,
          "--shine-color-3": Array.isArray(color) ? color[2] : color,
        } as React.CSSProperties
      }
      className={cn(
        "relative grid min-h-[60px] w-fit min-w-[300px] place-items-center rounded-[var(--border-radius)] bg-card p-3 text-foreground",
        // Shine effect
        "before:absolute before:inset-0 before:rounded-[var(--border-radius)] before:p-[var(--border-width)]",
        "before:will-change-[background-position] before:content-[''] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude]",
        "before:[background-image:linear-gradient(var(--shine-color-1),var(--shine-color-2),var(--shine-color-3),var(--shine-color-1))]",
        "before:[background-size:300%_300%] before:animate-shine",
        "before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]",
        className
      )}
    >
      {children}
    </div>
  );
}
