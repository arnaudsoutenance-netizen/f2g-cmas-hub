import { describe, expect, it } from "vitest";
import type { Alert } from "@/types/domain";
import { alertsToCsv, dayLabel, filterHistory, groupByDay, sortByHistoryTime, successRate } from "../history-utils";

function alert(overrides: Partial<Alert>): Alert {
  return {
    id: "a",
    alert_type: "CMAS",
    message_id: 4371,
    content: "Flood warning",
    duration: 3600,
    status: "SENT",
    scheduled_at: null,
    sent_at: null,
    expires_at: null,
    created_at: "2026-09-29T08:00:00",
    updated_at: "2026-09-29T08:00:00",
    created_by: "u",
    template_id: null,
    cells: [],
    ...overrides,
  };
}

const NOW = new Date(2026, 8, 29, 15, 0);

describe("dayLabel", () => {
  it("names today and yesterday, dates otherwise", () => {
    expect(dayLabel(new Date(2026, 8, 29, 0, 1), NOW)).toBe("Today");
    expect(dayLabel(new Date(2026, 8, 28, 23, 59), NOW)).toBe("Yesterday");
    expect(dayLabel(new Date(2026, 8, 27, 12), NOW)).toBe("Sunday 27 September 2026");
  });
});

describe("sort, group, filter", () => {
  const rows = [
    alert({ id: "old", created_at: new Date(2026, 8, 27, 9).toISOString() }),
    alert({ id: "sent", sent_at: new Date(2026, 8, 29, 10).toISOString(), created_at: new Date(2026, 8, 20).toISOString() }),
    alert({ id: "fail", status: "FAILED", message_id: 4370, created_at: new Date(2026, 8, 29, 9).toISOString() }),
  ];

  it("orders by the sent time first and groups by day", () => {
    const groups = groupByDay(sortByHistoryTime(rows), NOW);
    expect(groups.map((g) => [g.label, g.alerts.map((a) => a.id)])).toEqual([
      ["Today", ["sent", "fail"]],
      ["Sunday 27 September 2026", ["old"]],
    ]);
  });

  it("filters by status and class", () => {
    expect(filterHistory(rows, "FAILED", "all").map((a) => a.id)).toEqual(["fail"]);
    expect(filterHistory(rows, "all", "presidential").map((a) => a.id)).toEqual(["fail"]);
    expect(filterHistory(rows, "SENT", "presidential")).toEqual([]);
  });
});

describe("successRate", () => {
  it("ignores cancelled and returns null with nothing attempted", () => {
    expect(successRate(0, 0)).toBeNull();
    expect(successRate(3, 1)).toBe(75);
  });
});

describe("alertsToCsv", () => {
  it("quotes separators and neutralises formulas", () => {
    const csv = alertsToCsv([alert({ content: 'Evacuate, "now"' }), alert({ content: "=HYPERLINK(1)" })]);
    const lines = csv.trimEnd().split("\r\n");
    expect(lines[0]).toBe("id,status,alert_type,message_id,class,created_at,scheduled_at,sent_at,duration_s,cells,content");
    expect(lines[1]).toContain('"Evacuate, ""now"""');
    expect(lines[2]?.endsWith(`"'=HYPERLINK(1)"`)).toBe(true);
  });
});
