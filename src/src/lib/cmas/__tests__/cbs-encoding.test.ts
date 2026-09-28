import { describe, expect, it } from "vitest";
import { GSM7_MAX_CHARS, UCS2_MAX_CHARS, measureCbs } from "../cbs-encoding";

describe("measureCbs", () => {
  it("keeps plain English in GSM-7, one page up to 93 septets", () => {
    const r = measureCbs("A".repeat(93));
    expect(r).toMatchObject({ encoding: "GSM-7", units: 93, pages: 1, fits: true });
    expect(measureCbs("A".repeat(94)).pages).toBe(2);
  });

  it("allows 1395 GSM-7 septets and rejects one more", () => {
    expect(measureCbs("A".repeat(GSM7_MAX_CHARS)).fits).toBe(true);
    expect(measureCbs("A".repeat(GSM7_MAX_CHARS + 1)).fits).toBe(false);
  });

  it("counts extension characters as two septets", () => {
    expect(measureCbs("€").units).toBe(2);
    expect(measureCbs("[x]").units).toBe(5);
  });

  it("keeps French letters that exist in GSM-7 (é, è, à, Ç)", () => {
    expect(measureCbs("Évacuez à côté").encoding).toBe("UCS-2"); // ô is not GSM-7
    expect(measureCbs("Évacuez la zone près de la rivière").encoding).toBe("GSM-7");
  });

  it("switches to UCS-2 and reports the offending characters", () => {
    const r = measureCbs("Tempête à Maroua");
    expect(r.encoding).toBe("UCS-2");
    expect(r.nonGsmChars).toEqual(["ê"]);
    expect(r.maxUnits).toBe(UCS2_MAX_CHARS);
    expect(measureCbs("x".repeat(41) + "ê").pages).toBe(2);
  });
});
