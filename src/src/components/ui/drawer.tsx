"use client";

import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

export interface DrawerProps {
  /** Controlled open state */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Drawer title */
  title?: string;
  /** Drawer description */
  description?: string;
  /** Custom header content (replaces title/description) */
  header?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Drawer size */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Children content */
  children: React.ReactNode;
  /** Additional class for content area */
  className?: string;
  /** Ref to the content container */
  contentRef?: React.RefObject<HTMLDivElement>;
  /** Whether footer has padding (default true) */
  footerPadding?: boolean;
  /** Side of the drawer */
  side?: "right" | "left";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  header,
  footer,
  size = "md",
  children,
  className,
  contentRef,
  footerPadding = true,
  side = "right",
}: DrawerProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = contentRef ?? internalRef;

  // Close on ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    },
    [open, onOpenChange]
  );

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open, handleKeyDown]);

  // Focus trap - focus first focusable element on open
  useEffect(() => {
    if (open && ref.current) {
      const focusable = ref.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }
  }, [open, ref]);

  const slideDirection = side === "right" ? "100%" : "-100%";

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <m.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onOpenChange(false)}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <m.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? "drawer-title" : undefined}
              aria-describedby={description ? "drawer-description" : undefined}
              className={cn(
                "fixed inset-y-0 z-50 flex w-full flex-col bg-shell shadow-xl",
                side === "right" ? "right-0" : "left-0",
                sizeClasses[size]
              )}
              initial={{ x: slideDirection }}
              animate={{ x: 0 }}
              exit={{ x: slideDirection }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 35,
              }}
            >
              {/* Header */}
              <div className="flex shrink-0 items-start justify-between border-b border-hairline px-5 py-4">
                {header ?? (
                  <div className="space-y-1">
                    {title && (
                      <h2
                        id="drawer-title"
                        className="text-[16px] font-semibold text-ink"
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p
                        id="drawer-description"
                        className="text-[13px] text-ink-3"
                      >
                        {description}
                      </p>
                    )}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onOpenChange(false)}
                  aria-label="Fermer"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Content */}
              <div
                className={cn(
                  "flex-1 overflow-y-auto px-5 py-4",
                  className
                )}
              >
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div
                  className={cn(
                    "shrink-0 border-t border-hairline bg-surface-sunken",
                    footerPadding && "px-5 py-4"
                  )}
                >
                  {footer}
                </div>
              )}
            </m.div>
          </>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

// Hook for easy drawer state management
export function useDrawer(initialOpen = false) {
  const [open, setOpen] = React.useState(initialOpen);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const toggleDrawer = useCallback(() => setOpen((prev) => !prev), []);

  return {
    open,
    onOpenChange: setOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
}

export default Drawer;
