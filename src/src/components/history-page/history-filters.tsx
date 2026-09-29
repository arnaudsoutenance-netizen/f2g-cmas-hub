"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALERT_CLASSES, type AlertClassKey } from "@/lib/cmas/alert-classes";
import type { ClassFilter, StatusFilter } from "./history-utils";

const STATUS_ITEMS: Record<StatusFilter, string> = {
  all: "All outcomes",
  SENT: "Sent",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

const CLASS_ITEMS: Record<string, string> = {
  all: "All classes",
  ...Object.fromEntries(ALERT_CLASSES.map((c) => [c.key, c.label])),
};

function isStatusFilter(value: unknown): value is StatusFilter {
  return typeof value === "string" && value in STATUS_ITEMS;
}

function isClassFilter(value: unknown): value is ClassFilter {
  return value === "all" || ALERT_CLASSES.some((c) => c.key === (value as AlertClassKey));
}

export function HistoryFilters({
  status,
  alertClass,
  onStatusChange,
  onClassChange,
}: {
  status: StatusFilter;
  alertClass: ClassFilter;
  onStatusChange: (value: StatusFilter) => void;
  onClassChange: (value: ClassFilter) => void;
}) {
  return (
    <div role="group" aria-label="Filter the log" className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <Select items={STATUS_ITEMS} value={status} onValueChange={(v) => isStatusFilter(v) && onStatusChange(v)}>
        <SelectTrigger aria-label="Outcome" className="h-9 w-full text-[13px] sm:w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(STATUS_ITEMS) as StatusFilter[]).map((key) => (
            <SelectItem key={key} value={key}>
              {STATUS_ITEMS[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select items={CLASS_ITEMS} value={alertClass} onValueChange={(v) => isClassFilter(v) && onClassChange(v)}>
        <SelectTrigger aria-label="Alert class" className="h-9 w-full text-[13px] sm:w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(CLASS_ITEMS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
