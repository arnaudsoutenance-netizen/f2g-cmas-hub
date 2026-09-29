"use client";

import { m } from "framer-motion";
import {
  PencilLine,
  Clock3,
  Loader2,
  CircleCheck,
  CircleX,
  Ban,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "SENDING"
  | "SENT"
  | "FAILED"
  | "CANCELLED";

export interface TimelineStep {
  status: TimelineStatus;
  label: string;
  timestamp?: string;
  description?: string;
}

export interface StatusTimelineProps {
  steps: TimelineStep[];
  currentStatus: TimelineStatus;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const statusConfig: Record<
  TimelineStatus,
  {
    icon: LucideIcon;
    activeClass: string;
    completedClass: string;
    lineClass: string;
  }
> = {
  DRAFT: {
    icon: PencilLine,
    activeClass: "border-ink-3 bg-surface-sunken text-ink-3",
    completedClass: "border-st-sent bg-st-sent text-white",
    lineClass: "bg-st-sent",
  },
  SCHEDULED: {
    icon: Clock3,
    activeClass: "border-primary bg-primary-tint text-primary",
    completedClass: "border-st-sent bg-st-sent text-white",
    lineClass: "bg-st-sent",
  },
  SENDING: {
    icon: Loader2,
    activeClass: "border-primary bg-primary text-white",
    completedClass: "border-st-sent bg-st-sent text-white",
    lineClass: "bg-st-sent",
  },
  SENT: {
    icon: CircleCheck,
    activeClass: "border-st-sent bg-st-sent text-white",
    completedClass: "border-st-sent bg-st-sent text-white",
    lineClass: "bg-st-sent",
  },
  FAILED: {
    icon: CircleX,
    activeClass: "border-st-failed bg-st-failed text-white",
    completedClass: "border-st-failed bg-st-failed text-white",
    lineClass: "bg-st-failed",
  },
  CANCELLED: {
    icon: Ban,
    activeClass: "border-ink-3 bg-surface-sunken text-ink-3",
    completedClass: "border-ink-3 bg-surface-sunken text-ink-3",
    lineClass: "bg-hairline",
  },
};

const statusOrder: TimelineStatus[] = [
  "DRAFT",
  "SCHEDULED",
  "SENDING",
  "SENT",
];

function getStepState(
  stepStatus: TimelineStatus,
  currentStatus: TimelineStatus
): "completed" | "active" | "pending" {
  // Special cases for terminal states
  if (currentStatus === "FAILED" || currentStatus === "CANCELLED") {
    const currentIndex = statusOrder.indexOf(
      currentStatus === "FAILED" ? "SENDING" : "SCHEDULED"
    );
    const stepIndex = statusOrder.indexOf(stepStatus);
    if (stepIndex < currentIndex) return "completed";
    if (stepStatus === "SENDING" && currentStatus === "FAILED") return "active";
    if (stepStatus === "SCHEDULED" && currentStatus === "CANCELLED")
      return "active";
    return "pending";
  }

  const currentIndex = statusOrder.indexOf(currentStatus);
  const stepIndex = statusOrder.indexOf(stepStatus);

  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "active";
  return "pending";
}

export function StatusTimeline({
  steps,
  currentStatus,
  orientation = "horizontal",
  className,
}: StatusTimelineProps) {
  const isVertical = orientation === "vertical";

  return (
    <div
      className={cn(
        "flex",
        isVertical ? "flex-col gap-0" : "items-start gap-0",
        className
      )}
    >
      {steps.map((step, index) => {
        const config = statusConfig[step.status];
        const state = getStepState(step.status, currentStatus);
        const Icon = config.icon;
        const isLast = index === steps.length - 1;
        const isSending = step.status === "SENDING" && state === "active";

        return (
          <div
            key={step.status}
            className={cn(
              "flex",
              isVertical ? "flex-row" : "flex-col items-center",
              !isLast && (isVertical ? "pb-6" : "flex-1")
            )}
          >
            {/* Step node */}
            <div className="relative flex flex-col items-center">
              <m.div
                initial={false}
                animate={{
                  scale: state === "active" ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "relative z-10 flex size-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  state === "completed" && config.completedClass,
                  state === "active" && config.activeClass,
                  state === "pending" &&
                    "border-hairline bg-surface-sunken text-ink-3"
                )}
              >
                <Icon
                  className={cn("size-5", isSending && "animate-spin")}
                  strokeWidth={2}
                />
                {/* Pulse ring for active sending */}
                {isSending && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                )}
              </m.div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "transition-colors duration-300",
                    isVertical
                      ? "absolute left-1/2 top-10 h-6 w-0.5 -translate-x-1/2"
                      : "absolute left-10 top-1/2 h-0.5 w-[calc(100%-2.5rem)] -translate-y-1/2",
                    state === "completed" ? config.lineClass : "bg-hairline"
                  )}
                />
              )}
            </div>

            {/* Labels */}
            <div
              className={cn(
                isVertical ? "ml-4 flex-1" : "mt-3 text-center",
                "min-w-0"
              )}
            >
              <p
                className={cn(
                  "text-[13px] font-medium transition-colors",
                  state === "active" ? "text-ink" : "text-ink-2"
                )}
              >
                {step.label}
              </p>
              {step.timestamp && (
                <p className="mt-0.5 font-mono text-[11px] text-ink-3">
                  {step.timestamp}
                </p>
              )}
              {step.description && (
                <p className="mt-1 text-[12px] text-ink-3">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Preset pour CMAS Hub - Parcours standard d'une alerte
export function AlertStatusTimeline({
  currentStatus,
  timestamps,
  className,
}: {
  currentStatus: TimelineStatus;
  timestamps?: Partial<Record<TimelineStatus, string>>;
  className?: string;
}) {
  const steps: TimelineStep[] = [
    {
      status: "DRAFT",
      label: "Draft",
      timestamp: timestamps?.DRAFT,
    },
    {
      status: "SCHEDULED",
      label: "Scheduled",
      timestamp: timestamps?.SCHEDULED,
    },
    {
      status: "SENDING",
      label: "En cours",
      timestamp: timestamps?.SENDING,
    },
    {
      status: "SENT",
      label: "Sent",
      timestamp: timestamps?.SENT,
    },
  ];

  // Remplacer le dernier step si échec ou annulé
  if (currentStatus === "FAILED") {
    steps[3] = {
      status: "FAILED",
      label: "Échec",
      timestamp: timestamps?.FAILED,
    };
  } else if (currentStatus === "CANCELLED") {
    steps[2] = {
      status: "CANCELLED",
      label: "Annulée",
      timestamp: timestamps?.CANCELLED,
    };
    steps.pop(); // Retirer SENT
  }

  return (
    <StatusTimeline
      steps={steps}
      currentStatus={currentStatus}
      className={className}
    />
  );
}

export default StatusTimeline;
