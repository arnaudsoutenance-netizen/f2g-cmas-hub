import { describe, expect, it } from "vitest";
import { cellState } from "../cell-state";

describe("cellState", () => {
  it("accepts both lowercase and uppercase backend values", () => {
    expect(cellState("active")).toBe("online");
    expect(cellState("ONLINE")).toBe("online");
    expect(cellState("OFFLINE")).toBe("offline");
    expect(cellState("Maintenance")).toBe("maintenance");
  });

  it("never reports an unrecognised status as online", () => {
    expect(cellState("degraded")).toBe("unknown");
    expect(cellState("")).toBe("unknown");
    expect(cellState(null)).toBe("unknown");
  });
});
