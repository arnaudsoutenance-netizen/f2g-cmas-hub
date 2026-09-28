import { cn } from "@/lib/utils";

/** F2G logo mark: the only orange in the product, always placed on navy. */
export function F2GMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-brand-orange font-display text-[13px] font-bold leading-none text-rail",
        className,
      )}
    >
      F2G
    </span>
  );
}

export function F2GWordmark({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <F2GMark />
      {!collapsed && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[17px] font-semibold text-rail-ink">CMAS Hub</span>
          <span className="mt-1 text-[10px] font-semibold tracking-[0.08em] text-rail-ink-2 uppercase">F2G Solutions</span>
        </span>
      )}
    </span>
  );
}
