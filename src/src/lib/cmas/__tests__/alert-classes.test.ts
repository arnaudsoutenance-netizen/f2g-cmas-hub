import { describe, expect, it } from "vitest";
import { ALERT_CLASSES, classifyMessageId } from "../alert-classes";

describe("classifyMessageId (3GPP TS 23.041)", () => {
  it.each([
    [4370, "presidential"],
    [4371, "extreme"],
    [4372, "extreme"],
    [4373, "severe"],
    [4378, "severe"],
    [4379, "amber"],
    [4380, "monthly-test"],
    [4381, "exercise"],
    [4352, "earthquake"],
    [4353, "tsunami"],
    [4354, "earthquake-tsunami"],
    [4355, "etws-test"],
  ])("maps %i to %s", (id, key) => {
    expect(classifyMessageId(id)?.key).toBe(key);
  });

  it("does not treat the old seed IDs 4375/4376 as AMBER or test", () => {
    expect(classifyMessageId(4375)?.key).toBe("severe");
    expect(classifyMessageId(4376)?.key).toBe("severe");
  });

  it("returns undefined outside the standard ranges", () => {
    expect(classifyMessageId(1234)).toBeUndefined();
  });

  it("uses no message ID twice", () => {
    const ids = ALERT_CLASSES.flatMap((c) => c.messageIds);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only Presidential needs the critical confirmation", () => {
    expect(ALERT_CLASSES.filter((c) => c.critical).map((c) => c.key)).toEqual(["presidential"]);
  });
});
