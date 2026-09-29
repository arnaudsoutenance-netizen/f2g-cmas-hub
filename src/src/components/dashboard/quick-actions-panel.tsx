"use client";

import { m } from "framer-motion";
import {
  Plus,
  FileText,
  Radio,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  href: string;
  icon: LucideIcon;
  variant?: "default" | "primary";
}

const defaultActions: QuickAction[] = [
  {
    id: "new-alert",
    label: "New Alert",
    description: "Create and broadcast",
    href: "/alerts/new",
    icon: Plus,
    variant: "primary",
  },
  {
    id: "templates",
    label: "Templates",
    description: "Manage templates",
    href: "/templates",
    icon: FileText,
  },
  {
    id: "cells",
    label: "Cells",
    description: "Network status",
    href: "/cells",
    icon: Radio,
  },
  {
    id: "settings",
    label: "Settings",
    description: "Configuration",
    href: "/settings",
    icon: Settings,
  },
];

export interface QuickActionsPanelProps {
  actions?: QuickAction[];
  className?: string;
}

export function QuickActionsPanel({
  actions = defaultActions,
  className,
}: QuickActionsPanelProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isPrimary = action.variant === "primary";

        return (
          <m.div
            key={action.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              delay: index * 0.05,
            }}
          >
            <Link
              href={action.href}
              className={cn(
                "group flex items-center gap-3 rounded-[10px] border p-4 transition-all duration-200",
                isPrimary
                  ? "border-primary/30 bg-primary-tint hover:border-primary hover:bg-primary hover:text-primary-fg"
                  : "border-hairline bg-shell hover:border-hairline-strong hover:shadow-sm"
              )}
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-[8px] transition-colors",
                  isPrimary
                    ? "bg-primary text-primary-fg group-hover:bg-primary-fg group-hover:text-primary"
                    : "bg-surface-sunken text-ink-2 group-hover:bg-primary-tint group-hover:text-primary"
                )}
              >
                <Icon className="size-5" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-[14px] font-medium transition-colors",
                    isPrimary
                      ? "text-primary group-hover:text-primary-fg"
                      : "text-ink"
                  )}
                >
                  {action.label}
                </p>
                {action.description && (
                  <p
                    className={cn(
                      "mt-0.5 truncate text-[12px] transition-colors",
                      isPrimary
                        ? "text-primary/70 group-hover:text-primary-fg/70"
                        : "text-ink-3"
                    )}
                  >
                    {action.description}
                  </p>
                )}
              </div>
            </Link>
          </m.div>
        );
      })}
    </div>
  );
}

export default QuickActionsPanel;
