import { describe, expect, test } from "vitest";
import { formatCount } from "./format-count";

describe("formatCount", () => {
  test("returns raw number below 1000", () => {
    expect(formatCount(0)).toBe("0");
    expect(formatCount(1)).toBe("1");
    expect(formatCount(42)).toBe("42");
    expect(formatCount(999)).toBe("999");
  });

  test("formats thousands with compact notation", () => {
    expect(formatCount(1000)).toBe("1K");
    expect(formatCount(1200)).toBe("1.2K");
    expect(formatCount(1250)).toBe("1.3K");
    expect(formatCount(2500)).toBe("2.5K");
    expect(formatCount(9999)).toBe("10K");
  });

  test("formats tens of thousands", () => {
    expect(formatCount(10000)).toBe("10K");
    expect(formatCount(15700)).toBe("15.7K");
    expect(formatCount(99999)).toBe("100K");
  });
});
