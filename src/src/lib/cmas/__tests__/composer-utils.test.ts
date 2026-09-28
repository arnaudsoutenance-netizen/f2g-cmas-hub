import { describe, expect, it } from "vitest";
import { measureCbs } from "../cbs-encoding";
import { clampDuration, convertToGsm7, formatDuration, groupCellsByRegion, regionOf } from "../composer-utils";

describe("formatDuration", () => {
  it.each([
    [60, "1 min"],
    [1_800, "30 min"],
    [3_600, "1 h"],
    [9_000, "2 h 30"],
    [86_400, "24 h"],
  ])("%i s → %s", (s, label) => expect(formatDuration(s)).toBe(label));

  it("clamps to the backend range", () => {
    expect(clampDuration(10)).toBe(60);
    expect(clampDuration(100_000)).toBe(86_400);
  });
});

describe("convertToGsm7", () => {
  it("turns a UCS-2 French message into GSM-7", () => {
    const text = "Tempête à Maroua : l’évacuation doit être immédiate… « Sortez » — maintenant";
    expect(measureCbs(text).encoding).toBe("UCS-2");
    const converted = convertToGsm7(text);
    expect(measureCbs(converted).encoding).toBe("GSM-7");
    expect(converted).toBe('Tempete à Maroua : l\'évacuation doit etre immédiate... "Sortez" - maintenant');
  });

  it("keeps letters that GSM-7 already has", () => {
    expect(convertToGsm7("éèùàìòÉÇ")).toBe("éèùàìòÉÇ");
  });
});

describe("regions", () => {
  it("derives the city from the cell ID prefix", () => {
    expect(regionOf({ cell_id: "YDE-001" })).toBe("Yaoundé · Centre");
    expect(regionOf({ cell_id: "XYZ-9" })).toBe("Zone XYZ");
  });

  it("groups and sorts cells", () => {
    const groups = groupCellsByRegion([{ cell_id: "YDE-1" }, { cell_id: "DLA-1" }, { cell_id: "YDE-2" }]);
    expect(groups.map(([r, c]) => [r, c.length])).toEqual([
      ["Douala · Littoral", 1],
      ["Yaoundé · Centre", 2],
    ]);
  });
});
