"use client";

import * as React from "react";
import { m } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  /** Animation d'entrée */
  animate?: boolean;
  /** Délai d'animation */
  delay?: number;
}

export function DashboardCard({
  children,
  className,
  animate = true,
  delay = 0,
}: DashboardCardProps) {
  const baseClassName = cn(
    "rounded-[12px] border border-hairline bg-shell p-5",
    "transition-shadow duration-200 hover:shadow-sm",
    className
  );

  if (animate) {
    return (
      <m.div
        className={baseClassName}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          delay,
        }}
      >
        {children}
      </m.div>
    );
  }

  return <div className={baseClassName}>{children}</div>;
}

// Header de card avec titre et action optionnelle
export interface DashboardCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function DashboardCardHeader({
  title,
  subtitle,
  action,
  className,
}: DashboardCardHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-4", className)}>
      <div>
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-[12px] text-ink-3">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// Metric card - pour les KPIs
export interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  footer?: string;
  variant?: "default" | "hero-navy" | "hero-orange";
  className?: string;
  animate?: boolean;
  delay?: number;
}

const trendColors = {
  up: "text-st-sent-fg",
  down: "text-st-failed-fg",
  neutral: "text-ink-3",
};

const trendArrows = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  footer,
  variant = "default",
  className,
  animate = true,
  delay = 0,
}: MetricCardProps) {
  const isHero = variant.startsWith("hero");

  if (isHero) {
    const heroStyles = {
      "hero-navy": "bg-primary text-primary-fg",
      "hero-orange": "bg-[#B85418] text-white",
    };

    const content = (
      <>
        {/* Cercles décoratifs Berry */}
        <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-3 -right-3 size-16 rounded-full bg-white/5" />

        <p className="relative text-[12px] font-medium opacity-80">{label}</p>
        <p className="relative mt-2 font-display text-[32px] font-bold leading-none tabular-nums">
          {value}
        </p>
        {footer && (
          <p className="relative mt-2 text-[11px] opacity-70">{footer}</p>
        )}
      </>
    );

    const baseClassName = cn(
      "relative overflow-hidden rounded-[12px] p-5",
      heroStyles[variant as "hero-navy" | "hero-orange"],
      className
    );

    if (animate) {
      return (
        <m.div
          className={baseClassName}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            delay,
          }}
        >
          {content}
        </m.div>
      );
    }

    return <div className={baseClassName}>{content}</div>;
  }

  // Default variant
  const content = (
    <>
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-medium text-ink-3">{label}</p>
        {Icon && (
          <div className="flex size-8 items-center justify-center rounded-[6px] bg-surface-sunken">
            <Icon className="size-4 text-ink-2" strokeWidth={1.5} />
          </div>
        )}
      </div>
      
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-[28px] font-semibold leading-none text-ink tabular-nums">
          {value}
        </span>
        {trend && (
          <span className={cn("text-[12px] font-medium", trendColors[trend.direction])}>
            {trendArrows[trend.direction]} {trend.value}
          </span>
        )}
      </div>

      {footer && (
        <p className="mt-2 text-[11px] text-ink-3">{footer}</p>
      )}
    </>
  );

  const baseClassName = cn(
    "rounded-[12px] border border-hairline bg-shell p-4",
    "transition-shadow duration-200 hover:shadow-sm",
    className
  );

  if (animate) {
    return (
      <m.div
        className={baseClassName}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          delay,
        }}
      >
        {content}
      </m.div>
    );
  }

  return <div className={baseClassName}>{content}</div>;
}

// Grid pour organiser les cards
export interface DashboardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function DashboardGrid({
  children,
  columns = 4,
  className,
}: DashboardGridProps) {
  const colsClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", colsClass[columns], className)}>
      {children}
    </div>
  );
}

export default DashboardCard;
