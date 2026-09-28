"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  name?: string;
  className?: string;
  background?: ReactNode;
  icon?: ReactNode;
  description?: string;
  href?: string;
  cta?: string;
  children?: ReactNode;
}

export function BentoCard({
  name,
  className,
  background,
  icon,
  description,
  children,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
        // light styles
        "bg-card border border-border",
        // dark styles
        "transform-gpu dark:bg-card dark:border-border",
        className
      )}
    >
      <div>{background}</div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
        {icon && (
          <div className="h-12 w-12 origin-left transform-gpu text-primary transition-all duration-300 ease-in-out group-hover:scale-75">
            {icon}
          </div>
        )}
        {name && (
          <h3 className="text-xl font-semibold text-foreground">
            {name}
          </h3>
        )}
        {description && (
          <p className="max-w-lg text-muted-foreground">{description}</p>
        )}
        {children}
      </div>

      <div
        className={cn(
          "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        )}
      />
    </div>
  );
}
