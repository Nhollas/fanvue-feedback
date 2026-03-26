import { describe, expect, test } from "vitest";
import { trendingScore } from "./trending";

const now = new Date("2026-03-21T12:00:00Z");

function hoursAgo(hours: number): Date {
  return new Date(now.getTime() - hours * 60 * 60 * 1000);
}

describe("trendingScore", () => {
  test("returns higher score for newer items with same votes", () => {
    const recent = trendingScore(10, hoursAgo(2), now);
    const older = trendingScore(10, hoursAgo(48), now);
    expect(recent).toBeGreaterThan(older);
  });

  test("returns higher score for more votes at same age", () => {
    const moreVotes = trendingScore(50, hoursAgo(24), now);
    const fewerVotes = trendingScore(10, hoursAgo(24), now);
    expect(moreVotes).toBeGreaterThan(fewerVotes);
  });

  test("recent item with fewer votes can beat old item with more votes", () => {
    const recentFewVotes = trendingScore(5, hoursAgo(1), now);
    const oldManyVotes = trendingScore(20, hoursAgo(200), now);
    expect(recentFewVotes).toBeGreaterThan(oldManyVotes);
  });

  test("clamps hours to minimum of 1 to avoid division by zero", () => {
    const justNow = trendingScore(10, now, now);
    expect(justNow).toBe(10);
    expect(Number.isFinite(justNow)).toBe(true);
  });

  test("items posted in the future are treated as 1 hour old", () => {
    const futureItem = trendingScore(
      10,
      new Date(now.getTime() + 3600000),
      now,
    );
    expect(futureItem).toBe(10);
  });

  test("zero votes returns zero score regardless of age", () => {
    expect(trendingScore(0, hoursAgo(1), now)).toBe(0);
    expect(trendingScore(0, hoursAgo(100), now)).toBe(0);
  });

  test("score decays over time following power law", () => {
    const at1h = trendingScore(10, hoursAgo(1), now);
    const at10h = trendingScore(10, hoursAgo(10), now);
    const at100h = trendingScore(10, hoursAgo(100), now);

    expect(at1h).toBeGreaterThan(at10h);
    expect(at10h).toBeGreaterThan(at100h);

    // Verify decay factor 1.5: score at 10h should be 10^1.5 = ~31.6x smaller than at 1h
    expect(at1h / at10h).toBeCloseTo(10 ** 1.5, 1);
  });
});
