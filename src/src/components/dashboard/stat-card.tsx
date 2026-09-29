"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string; // Tailwind bg class for icon circle
  iconColor?: string; // Tailwind text class for icon
  trend?: {
    value: string;
    positive?: boolean;
  };
  suffix?: string; // e.g. "/4" for "3/4"
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  iconBg = "bg-emerald-50",
  iconColor = "text-emerald-500",
  trend,
  suffix,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-medium text-gray-500">{label}</span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-[32px] font-semibold leading-none tracking-tight text-gray-900">
            {value}
          </span>
          {suffix && (
            <span className="text-[18px] font-medium text-gray-400">{suffix}</span>
          )}
        </div>
        {trend && (
          <span
            className={cn(
              "mt-1 text-[12px] font-medium",
              trend.positive !== false ? "text-emerald-500" : "text-red-500"
            )}
          >
            {trend.positive !== false ? "↗" : "↘"} {trend.value}
          </span>
        )}
      </div>
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          iconBg
        )}
      >
        <div className={cn("h-6 w-6", iconColor)}>{icon}</div>
      </div>
    </div>
  );
}
