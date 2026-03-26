import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./format-relative-time";

const BASE = new Date("2026-03-15T12:00:00Z").getTime();

function ago(ms: number) {
  return formatRelativeTime(new Date(BASE - ms), BASE);
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("formatRelativeTime", () => {
  it("returns 'just now' for less than 60 seconds", () => {
    expect(ago(0)).toBe("just now");
    expect(ago(30 * SECOND)).toBe("just now");
    expect(ago(59 * SECOND)).toBe("just now");
  });

  it("returns singular minute", () => {
    expect(ago(1 * MINUTE)).toBe("1 minute ago");
  });

  it("returns plural minutes", () => {
    expect(ago(5 * MINUTE)).toBe("5 minutes ago");
    expect(ago(59 * MINUTE)).toBe("59 minutes ago");
  });

  it("returns singular hour", () => {
    expect(ago(1 * HOUR)).toBe("1 hour ago");
  });

  it("returns plural hours", () => {
    expect(ago(3 * HOUR)).toBe("3 hours ago");
    expect(ago(23 * HOUR)).toBe("23 hours ago");
  });

  it("returns singular day", () => {
    expect(ago(1 * DAY)).toBe("1 day ago");
  });

  it("returns plural days", () => {
    expect(ago(7 * DAY)).toBe("7 days ago");
    expect(ago(29 * DAY)).toBe("29 days ago");
  });

  it("returns singular month", () => {
    expect(ago(30 * DAY)).toBe("1 month ago");
  });

  it("returns plural months", () => {
    expect(ago(90 * DAY)).toBe("3 months ago");
    expect(ago(330 * DAY)).toBe("11 months ago");
  });

  it("returns singular year", () => {
    expect(ago(365 * DAY)).toBe("1 year ago");
  });

  it("returns plural years", () => {
    expect(ago(730 * DAY)).toBe("2 years ago");
  });

  it("handles the 60-second boundary correctly", () => {
    expect(ago(59 * SECOND)).toBe("just now");
    expect(ago(60 * SECOND)).toBe("1 minute ago");
  });
});
