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

  it("scales confirmation with blast radius", () => {
    const level = (id: number) => classifyMessageId(id)?.confirmLevel;
    expect(level(4370)).toBe("presidential");
    expect([4371, 4375, 4379, 4352, 4354].map(level)).toEqual(Array(5).fill("standard"));
    expect([4380, 4381, 4355].map(level)).toEqual(["light", "light", "light"]);
  });
});
