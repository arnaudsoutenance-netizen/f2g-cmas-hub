"use client";

import * as React from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CollapsibleFieldCardProps {
  /** Section title */
  title: string;
  /** Subtitle or short description */
  subtitle?: string;
  /** Icon to the left of the title */
  icon?: LucideIcon;
  /** Badge to display (e.g. "Required", counter) */
  badge?: React.ReactNode;
  /** Error state */
  hasError?: boolean;
  /** Success/validated state */
  isValid?: boolean;
  /** Open by default */
  defaultOpen?: boolean;
  /** External control of the open state */
  open?: boolean;
  /** Callback when the state changes */
  onOpenChange?: (open: boolean) => void;
  /** Disabled */
  disabled?: boolean;
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function CollapsibleFieldCard({
  title,
  subtitle,
  icon: Icon,
  badge,
  hasError = false,
  isValid = false,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  children,
  className,
}: CollapsibleFieldCardProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isOpen;
    if (!isControlled) {
      setInternalOpen(newState);
    }
    onOpenChange?.(newState);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[10px] border transition-colors",
        hasError
          ? "border-st-failed/50 bg-st-failed-tint/30"
          : isValid
            ? "border-st-sent/50 bg-st-sent-tint/30"
            : "border-hairline bg-shell",
        disabled && "opacity-60",
        className
      )}
    >
      {/* Header - clickable to toggle */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
          !disabled && "hover:bg-surface-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
        )}
        aria-expanded={isOpen}
      >
        {/* Icon */}
        {Icon && (
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-[6px]",
              hasError
                ? "bg-st-failed-tint text-st-failed-fg"
                : isValid
                  ? "bg-st-sent-tint text-st-sent-fg"
                  : "bg-surface-sunken text-ink-2"
            )}
          >
            <Icon className="size-4" strokeWidth={1.5} />
          </div>
        )}

        {/* Title & subtitle */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[14px] font-medium",
                hasError ? "text-st-failed-fg" : "text-ink"
              )}
            >
              {title}
            </span>
            {badge && (
              <span className="inline-flex items-center rounded bg-surface-sunken px-1.5 py-0.5 text-[10px] font-medium text-ink-3">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <span className="mt-0.5 block text-[12px] text-ink-3 truncate">
              {subtitle}
            </span>
          )}
        </div>

        {/* Status indicators */}
        {hasError && (
          <span className="size-2 rounded-full bg-st-failed" aria-hidden />
        )}
        {isValid && !hasError && (
          <span className="size-2 rounded-full bg-st-sent" aria-hidden />
        )}

        {/* Chevron */}
        <m.span
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="text-ink-3"
        >
          <ChevronDown className="size-4" />
        </m.span>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="border-t border-hairline px-4 py-4">{children}</div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Group version: several mutually exclusive cards (accordion)
export interface CollapsibleFieldGroupProps {
  children: React.ReactElement<CollapsibleFieldCardProps>[];
  /** Only one open at a time */
  singleOpen?: boolean;
  className?: string;
}

export function CollapsibleFieldGroup({
  children,
  singleOpen = false,
  className,
}: CollapsibleFieldGroupProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  if (!singleOpen) {
    return <div className={cn("space-y-3", className)}>{children}</div>;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          open: openIndex === index,
          onOpenChange: (open: boolean) => setOpenIndex(open ? index : null),
        });
      })}
    </div>
  );
}

export default CollapsibleFieldCard;
