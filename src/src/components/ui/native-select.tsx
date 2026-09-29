"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const nativeSelectVariants = cva(
  "relative inline-flex w-full cursor-pointer appearance-none items-center rounded-lg border bg-transparent pr-8 text-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input focus:border-ring focus:ring-3 focus:ring-ring/50",
        outline:
          "border-control-border bg-surface focus:border-ring focus:ring-3 focus:ring-ring/50",
        ghost: "border-transparent hover:bg-muted focus:bg-muted",
      },
      size: {
        sm: "h-7 px-2 text-[13px]",
        default: "h-8 px-2.5",
        lg: "h-10 px-3 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface NativeSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof nativeSelectVariants> {
  /** Placeholder option text */
  placeholder?: string;
}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    { className, variant, size, placeholder, children, ...props },
    ref
  ) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(nativeSelectVariants({ variant, size }), className)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-ink-3"
          aria-hidden="true"
        />
      </div>
    );
  }
);
NativeSelect.displayName = "NativeSelect";

export { NativeSelect, nativeSelectVariants };
