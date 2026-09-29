"use client";

import { LayoutGrid, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AlertClass, AlertClassKey } from "@/lib/cmas/alert-classes";
import { ALERT_CLASS_ICONS } from "@/lib/cmas/severity-styles";

export type ClassFilter = AlertClassKey | "all";

const CHIP =
  "h-8 rounded-full px-3 text-[13px] aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/90";

/** Class chips (only classes that have templates) plus a free-text search. */
export function TemplateFilters({
  classes,
  total,
  value,
  onChange,
  query,
  onQueryChange,
}: {
  classes: ReadonlyArray<{ alertClass: AlertClass; count: number }>;
  total: number;
  value: ClassFilter;
  onChange: (next: ClassFilter) => void;
  query: string;
  onQueryChange: (next: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div role="group" aria-label="Filter by alert class" className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" aria-pressed={value === "all"} className={CHIP} onClick={() => onChange("all")}>
          <LayoutGrid aria-hidden />
          All
          <span className="tnum text-[12px] opacity-80">{total}</span>
        </Button>
        {classes.map(({ alertClass, count }) => {
          const Icon = ALERT_CLASS_ICONS[alertClass.key];
          const pressed = value === alertClass.key;
          return (
            <Button
              key={alertClass.key}
              variant="outline"
              size="sm"
              aria-pressed={pressed}
              className={CHIP}
              onClick={() => onChange(pressed ? "all" : alertClass.key)}
            >
              <Icon aria-hidden />
              {alertClass.label}
              <span className="tnum text-[12px] opacity-80">{count}</span>
            </Button>
          );
        })}
      </div>

      <div className="relative w-full lg:w-72">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-3" />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search name, content, ID…"
          aria-label="Search templates"
          className="h-9 bg-surface pl-8"
        />
      </div>
    </div>
  );
}
