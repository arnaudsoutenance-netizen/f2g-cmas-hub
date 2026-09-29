import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Dashboard section card: title, one-line description, optional action on the right. */
export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const id = `panel-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section aria-labelledby={id} className={cn("overflow-hidden rounded-[16px] border border-hairline bg-surface shadow-e1", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
        <div>
          <h2 id={id} className="font-display text-[17px] leading-tight font-semibold text-ink">
            {title}
          </h2>
          {description ? <p className="mt-0.5 text-[12px] text-ink-3">{description}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
