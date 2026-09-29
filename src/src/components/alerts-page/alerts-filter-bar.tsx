"use client";

import { Search, X } from "lucide-react";
import { STATUS_STYLES } from "@/components/alerts/alert-status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AlertStatus, AlertType } from "@/types/domain";
import { ALERT_STATUSES, parseStatus, parseType } from "./alert-dates";

const ALL = "all";

const STATUS_ITEMS: Record<string, string> = {
  [ALL]: "All statuses",
  ...Object.fromEntries(ALERT_STATUSES.map((s) => [s, STATUS_STYLES[s].label])),
};

const TYPE_ITEMS: Record<string, string> = {
  [ALL]: "All types",
  CMAS: "CMAS",
  ETWS: "ETWS",
};

/** Status, type and a text search over the rows currently loaded. */
export function AlertsFilterBar({
  status,
  type,
  search,
  onStatusChange,
  onTypeChange,
  onSearchChange,
  onClear,
}: {
  status: AlertStatus | undefined;
  type: AlertType | undefined;
  search: string;
  onStatusChange: (status: AlertStatus | undefined) => void;
  onTypeChange: (type: AlertType | undefined) => void;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}) {
  const filtered = status !== undefined || type !== undefined || search !== "";

  return (
    <div role="search" className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative min-w-0 flex-1 sm:min-w-[220px]">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-3" />
        <Input
          type="search"
          aria-label="Search alerts on this page by message, ID or message identifier"
          placeholder="Search message or ID on this page"
          className="h-9 pl-8 text-[13px]"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
        <Select
          items={STATUS_ITEMS}
          value={status ?? ALL}
          onValueChange={(v) => onStatusChange(parseStatus(typeof v === "string" ? v : null))}
        >
          <SelectTrigger aria-label="Filter by status" className="h-9 w-full text-[13px] sm:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_ITEMS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={TYPE_ITEMS}
          value={type ?? ALL}
          onValueChange={(v) => onTypeChange(parseType(typeof v === "string" ? v : null))}
        >
          <SelectTrigger aria-label="Filter by type" className="h-9 w-full text-[13px] sm:w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TYPE_ITEMS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered ? (
        <Button variant="ghost" size="sm" onClick={onClear} className="h-9 self-start sm:self-auto">
          <X aria-hidden className="size-3.5" /> Clear filters
        </Button>
      ) : null}
    </div>
  );
}
