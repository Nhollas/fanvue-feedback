import { afterEach, describe, vi } from "vitest";

import { buildFeedback } from "../../../tests/support/factories";
import { expect, test } from "./home-page-fixture";

afterEach(() => {
  localStorage.clear();
});

describe("Home Page", () => {
  test("renders heading and submit feedback link", async ({ homePage }) => {
    const page = await homePage.mount();

    await page.expectHeadingVisible();
    await page.expectSubmitLinkVisible();
  });

  test("displays feedback items with title, vote count, category, and status", async ({
    homePage,
  }) => {
    const items = [
      buildFeedback({
        title: "Dark mode support",
        voteCount: 42,
        category: "fan",
        status: "planned",
      }),
      buildFeedback({
        title: "Bulk scheduling",
        voteCount: 87,
        category: "creator",
        status: "in_progress",
      }),
    ];

    const page = await homePage.mount({ items });

    await page.expectFeedbackVisible("Dark mode support");
    await page.expectFeedbackVisible("Bulk scheduling");
    await page.expectVoteCountOn("Dark mode support", "42");
    await page.expectVoteCountOn("Bulk scheduling", "87");
  });

  test("shows empty state when no feedback exists", async ({ homePage }) => {
    const page = await homePage.mount({ items: [] });
    await page.expectEmptyState();
  });

  test("shows filtered empty state when filters are active", async ({
    homePage,
  }) => {
    const page = await homePage.mount({ items: [], filtered: true });
    await page.expectFilteredEmptyState();
  });

  test("voting updates the vote count on the correct card", async ({
    homePage,
  }) => {
    const toggleVote = vi.fn().mockResolvedValueOnce({
      voted: true,
      voteCount: 43,
    });

    const items = [
      buildFeedback({ title: "Dark mode support", voteCount: 42 }),
      buildFeedback({ title: "Bulk scheduling", voteCount: 87 }),
    ];

    const page = await homePage.mount({ items, toggleVote });

    await page.expectNotVotedOn("Dark mode support");
    await page.clickVoteOn("Dark mode support");
    await page.expectVotedOn("Dark mode support");
    await page.expectVoteCountOn("Dark mode support", "43");

    // Second card unchanged
    await page.expectNotVotedOn("Bulk scheduling");
    await page.expectVoteCountOn("Bulk scheduling", "87");
  });

  test("unvoting reverts the vote count", async ({ homePage }) => {
    const toggleVote = vi
      .fn()
      .mockResolvedValueOnce({ voted: true, voteCount: 43 })
      .mockResolvedValueOnce({ voted: false, voteCount: 42 });

    const items = [
      buildFeedback({ title: "Dark mode support", voteCount: 42 }),
    ];

    const page = await homePage.mount({ items, toggleVote });

    await page.clickVoteOn("Dark mode support");
    await page.expectVotedOn("Dark mode support");

    await page.clickVoteOn("Dark mode support");
    await page.expectNotVotedOn("Dark mode support");
    await page.expectVoteCountOn("Dark mode support", "42");
  });

  test("hides pagination when only one page of results", async ({
    homePage,
  }) => {
    const items = [buildFeedback({ title: "Only item" })];
    const page = await homePage.mount({ items, totalPages: 1 });
    await page.expectPaginationHidden();
  });

  test("shows pagination controls for multiple pages", async ({ homePage }) => {
    const items = [buildFeedback({ title: "An item" })];
    const page = await homePage.mount({
      items,
      currentPage: 1,
      totalPages: 3,
    });

    await page.expectPaginationVisible();
    await page.expectPreviousDisabled();
    await page.expectNextEnabled();
  });

  test("clicking next page updates page in URL", async ({ homePage }) => {
    const items = [buildFeedback({ title: "An item" })];
    const { onUrlUpdate, ...page } = await homePage.mount({
      items,
      currentPage: 1,
      totalPages: 3,
    });

    await page.clickNextPage();

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("page=2"),
      }),
    );
  });

  test("selecting a category tab updates URL", async ({ homePage }) => {
    const items = [buildFeedback({ title: "An item" })];
    const { onUrlUpdate, ...page } = await homePage.mount({ items });

    await page.clickCategoryTab("Creator");

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("category=creator"),
      }),
    );
  });

  test("search updates URL on submit", async ({ homePage }) => {
    const items = [buildFeedback({ title: "An item" })];
    const { onUrlUpdate, ...page } = await homePage.mount({ items });

    await page.fillSearch("dark mode");
    await page.submitSearch();

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("search=dark+mode"),
      }),
    );
  });
});
