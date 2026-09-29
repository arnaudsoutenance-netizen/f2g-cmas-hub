"use client";

import { type LucideIcon } from "lucide-react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";

export type TrendDirection = "up" | "down" | "neutral";

export interface StatCardProps {
  /** Label affiché au-dessus de la valeur */
  label: string;
  /** Valeur principale (chiffre, pourcentage, etc.) */
  value: string | number;
  /** Icône Lucide affichée en haut à gauche */
  icon?: LucideIcon;
  /** Valeur du badge de tendance (ex: "+12.5%") */
  trend?: string;
  /** Direction de la tendance pour la couleur */
  trendDirection?: TrendDirection;
  /** Description secondaire en bas */
  description?: string;
  /** Classes CSS additionnelles */
  className?: string;
  /** Animation au chargement */
  animate?: boolean;
  /** Délai d'animation (en secondes) */
  animationDelay?: number;
}

const trendStyles: Record<TrendDirection, string> = {
  up: "bg-st-sent-tint text-st-sent-fg",
  down: "bg-st-failed-tint text-st-failed-fg",
  neutral: "bg-surface-sunken text-ink-2",
};

const trendIcons: Record<TrendDirection, string> = {
  up: "↗",
  down: "↘",
  neutral: "→",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendDirection = "neutral",
  description,
  className,
  animate = true,
  animationDelay = 0,
}: StatCardProps) {
  const baseClassName = cn(
    "relative rounded-[12px] border border-hairline bg-shell p-5",
    "transition-shadow duration-200 hover:shadow-sm",
    className
  );

  const content = (
    <>
      {Icon && (
        <div className="mb-3 flex size-10 items-center justify-center rounded-[8px] bg-surface-sunken">
          <Icon className="size-5 text-ink-2" strokeWidth={1.5} />
        </div>
      )}

      <p className="text-[13px] font-medium text-ink-2">{label}</p>

      <div className="mt-1 flex items-baseline gap-3">
        <span className="font-display text-[28px] font-semibold leading-tight text-ink tabular-nums">
          {value}
        </span>

        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-[6px] px-2 py-0.5 text-[11px] font-medium",
              trendStyles[trendDirection]
            )}
          >
            <span aria-hidden>{trendIcons[trendDirection]}</span>
            {trend}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-[12px] leading-4 text-ink-3">{description}</p>
      )}
    </>
  );

  if (animate) {
    return (
      <m.div
        className={baseClassName}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          delay: animationDelay,
        }}
      >
        {content}
      </m.div>
    );
  }

  return <div className={baseClassName}>{content}</div>;
}

// Variante compacte pour les grilles denses
export function StatCardCompact({
  label,
  value,
  icon: Icon,
  trend,
  trendDirection = "neutral",
  className,
}: Omit<StatCardProps, "description" | "animate" | "animationDelay">) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-[10px] border border-hairline bg-shell px-4 py-3",
        className
      )}
    >
      {Icon && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[6px] bg-surface-sunken">
          <Icon className="size-4 text-ink-2" strokeWidth={1.5} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium uppercase tracking-wide text-ink-3">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[20px] font-semibold text-ink tabular-nums">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                "text-[10px] font-medium",
                trendDirection === "up" && "text-st-sent-fg",
                trendDirection === "down" && "text-st-failed-fg",
                trendDirection === "neutral" && "text-ink-3"
              )}
            >
              {trendIcons[trendDirection]} {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Variante hero (grande card colorée) pour les stats principales
export interface HeroStatCardProps {
  label: string;
  value: string | number;
  description?: string;
  variant: "navy" | "orange";
  className?: string;
}

export function HeroStatCard({
  label,
  value,
  description,
  variant,
  className,
}: HeroStatCardProps) {
  const variantStyles = {
    navy: "bg-primary text-primary-fg",
    orange: "bg-[#B85418] text-white",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[12px] p-6",
        variantStyles[variant],
        className
      )}
    >
      {/* Cercles décoratifs style Berry */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-white/5" />

      <p className="relative text-[13px] font-medium opacity-80">{label}</p>
      <p className="relative mt-2 font-display text-[36px] font-bold leading-none tabular-nums">
        {value}
      </p>
      {description && (
        <p className="relative mt-2 text-[12px] opacity-70">{description}</p>
      )}
    </div>
  );
}

export default StatCard;
