"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ButtonWithBadgeProps extends React.ComponentProps<typeof Button> {
  /** Le contenu du badge (nombre, texte court) */
  badge?: string | number;
  /** Variante du badge */
  badgeVariant?: "default" | "primary" | "danger" | "warning" | "success";
  /** Position du badge */
  badgePosition?: "right" | "left";
}

const badgeVariants = {
  default: "border-hairline bg-surface-sunken text-ink-2",
  primary: "border-primary/30 bg-primary-tint text-primary",
  danger: "border-st-failed/30 bg-st-failed-tint text-st-failed-fg",
  warning: "border-sev-severe-edge/30 bg-sev-severe-tint text-sev-severe-fg",
  success: "border-st-sent/30 bg-st-sent-tint text-st-sent-fg",
};

export function ButtonWithBadge({
  children,
  badge,
  badgeVariant = "default",
  badgePosition = "right",
  className,
  ...props
}: ButtonWithBadgeProps) {
  const badgeElement = badge != null && (
    <span
      className={cn(
        "inline-flex h-5 max-h-full items-center rounded border px-1.5 font-[inherit] text-[0.625rem] font-medium tabular-nums",
        badgePosition === "right" ? "-me-1" : "-ms-1",
        badgeVariants[badgeVariant]
      )}
    >
      {badge}
    </span>
  );

  return (
    <Button className={cn("gap-2.5", className)} {...props}>
      {badgePosition === "left" && badgeElement}
      {children}
      {badgePosition === "right" && badgeElement}
    </Button>
  );
}

export default ButtonWithBadge;
