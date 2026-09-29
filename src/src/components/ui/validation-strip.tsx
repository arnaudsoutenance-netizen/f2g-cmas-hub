"use client";

import { m, AnimatePresence } from "framer-motion";
import { AlertTriangle, CircleX, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ValidationProblem = {
  id: string;
  message: string;
  severity: "error" | "warning" | "info";
  field?: string;
  onSelect?: () => void;
};

export interface ValidationStripProps {
  problems: ValidationProblem[];
  onClose?: () => void;
  className?: string;
  maxHeight?: string;
}

const severityConfig = {
  error: {
    icon: CircleX,
    marker: "×",
    markerClass: "text-st-failed-fg",
    bgClass: "bg-st-failed-tint",
    borderClass: "border-st-failed/30",
  },
  warning: {
    icon: AlertTriangle,
    marker: "!",
    markerClass: "text-sev-severe-fg",
    bgClass: "bg-sev-severe-tint",
    borderClass: "border-sev-severe-edge/30",
  },
  info: {
    icon: Info,
    marker: "i",
    markerClass: "text-primary",
    bgClass: "bg-primary-tint",
    borderClass: "border-primary/30",
  },
};

export function ValidationStrip({
  problems,
  onClose,
  className,
  maxHeight = "11rem",
}: ValidationStripProps) {
  const errorCount = problems.filter((p) => p.severity === "error").length;
  const warningCount = problems.filter((p) => p.severity === "warning").length;

  if (problems.length === 0) return null;

  return (
    <AnimatePresence>
      <m.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "shrink-0 overflow-hidden border-t border-hairline bg-shell",
          className
        )}
      >
        <div
          className="overflow-y-auto px-4 py-3"
          style={{ maxHeight }}
        >
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h4 className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">
                Problèmes
              </h4>
              {errorCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-st-failed-tint px-2 py-0.5 text-[10px] font-medium text-st-failed-fg">
                  {errorCount} erreur{errorCount > 1 ? "s" : ""}
                </span>
              )}
              {warningCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sev-severe-tint px-2 py-0.5 text-[10px] font-medium text-sev-severe-fg">
                  {warningCount} avertissement{warningCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="grid size-6 place-items-center rounded text-ink-3 hover:bg-surface-hover hover:text-ink"
                aria-label="Masquer les problèmes"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Problems list */}
          <ul className="space-y-1.5">
            {problems.map((problem) => {
              const config = severityConfig[problem.severity];
              return (
                <li
                  key={problem.id}
                  className="flex items-start gap-2 text-[13px]"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded text-[10px] font-bold",
                      config.markerClass
                    )}
                    aria-hidden
                  >
                    {config.marker}
                  </span>
                  <span className="min-w-0 flex-1 text-ink-2">
                    {problem.message}
                    {problem.onSelect && (
                      <button
                        type="button"
                        onClick={problem.onSelect}
                        className="ml-2 text-[12px] font-medium text-primary hover:underline"
                      >
                        voir
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </m.div>
    </AnimatePresence>
  );
}

export default ValidationStrip;
