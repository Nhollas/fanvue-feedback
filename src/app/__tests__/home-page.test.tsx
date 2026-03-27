import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { FeedList, FeedPageView } from "@/app/feed-page-view";
import type { FeedData } from "@/app/get-feedback-items";
import { type ToggleVoteFn, ToggleVoteProvider } from "@/contexts/toggle-vote";
import { buildFeedback } from "../../../tests/support/factories";
import { noopToggleVote } from "../../../tests/support/stubs";
import { homePagePageObject } from "./home-page-page-object";

type HomePageMountOptions = Partial<FeedData> & {
  toggleVote?: ToggleVoteFn;
  searchParams?: string | Record<string, string>;
};

async function mount(options?: HomePageMountOptions) {
  const {
    items = [],
    filtered = false,
    currentPage = 1,
    totalPages = 1,
    toggleVote = noopToggleVote,
    searchParams,
  } = options ?? {};

  const onUrlUpdate = vi.fn();

  await render(
    <NuqsTestingAdapter
      {...(searchParams != null && { searchParams })}
      onUrlUpdate={onUrlUpdate}
      hasMemory
    >
      <ToggleVoteProvider value={toggleVote}>
        <FeedPageView>
          <FeedList
            items={items}
            filtered={filtered}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </FeedPageView>
      </ToggleVoteProvider>
    </NuqsTestingAdapter>,
  );

  return { ...homePagePageObject(page), onUrlUpdate };
}

describe("Home Page", () => {
  test("renders heading and submit feedback link", async () => {
    await using page = await mount();

    await page.expectHeadingVisible();
    await page.expectSubmitLinkVisible();
  });

  test("displays feedback items with title, vote count, category, and status", async () => {
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

    await using page = await mount({ items });

    await page.expectFeedbackVisible("Dark mode support");
    await page.expectFeedbackVisible("Bulk scheduling");
    await page.expectVoteCountOn("Dark mode support", "42");
    await page.expectVoteCountOn("Bulk scheduling", "87");
  });

  test("shows empty state when no feedback exists", async () => {
    await using page = await mount({ items: [] });
    await page.expectEmptyState();
  });

  test("shows filtered empty state when filters are active", async () => {
    await using page = await mount({ items: [], filtered: true });
    await page.expectFilteredEmptyState();
  });

  test("voting updates the vote count on the correct card", async () => {
    const toggleVote = vi.fn().mockResolvedValueOnce({
      voted: true,
      voteCount: 43,
    });

    const items = [
      buildFeedback({ title: "Dark mode support", voteCount: 42 }),
      buildFeedback({ title: "Bulk scheduling", voteCount: 87 }),
    ];

    await using page = await mount({ items, toggleVote });

    await page.expectNotVotedOn("Dark mode support");
    await page.clickVoteOn("Dark mode support");
    await page.expectVotedOn("Dark mode support");
    await page.expectVoteCountOn("Dark mode support", "43");

    // Second card unchanged
    await page.expectNotVotedOn("Bulk scheduling");
    await page.expectVoteCountOn("Bulk scheduling", "87");
  });

  test("unvoting reverts the vote count", async () => {
    const toggleVote = vi
      .fn()
      .mockResolvedValueOnce({ voted: true, voteCount: 43 })
      .mockResolvedValueOnce({ voted: false, voteCount: 42 });

    const items = [
      buildFeedback({ title: "Dark mode support", voteCount: 42 }),
    ];

    await using page = await mount({ items, toggleVote });

    await page.clickVoteOn("Dark mode support");
    await page.expectVotedOn("Dark mode support");

    await page.clickVoteOn("Dark mode support");
    await page.expectNotVotedOn("Dark mode support");
    await page.expectVoteCountOn("Dark mode support", "42");
  });

  test("hides pagination when only one page of results", async () => {
    const items = [buildFeedback({ title: "Only item" })];
    await using page = await mount({ items, totalPages: 1 });
    await page.expectPaginationHidden();
  });

  test("shows pagination controls for multiple pages", async () => {
    const items = [buildFeedback({ title: "An item" })];
    await using page = await mount({
      items,
      currentPage: 1,
      totalPages: 3,
    });

    await page.expectPaginationVisible();
    await page.expectPreviousDisabled();
    await page.expectNextEnabled();
  });

  test("clicking next page updates page in URL", async () => {
    const items = [buildFeedback({ title: "An item" })];
    await using page = await mount({
      items,
      currentPage: 1,
      totalPages: 3,
    });

    await page.clickNextPage();

    expect(page.onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("page=2"),
      }),
    );
  });

  test("selecting a category tab updates URL", async () => {
    const items = [buildFeedback({ title: "An item" })];
    await using page = await mount({ items });

    await page.clickCategoryTab("Creator");

    expect(page.onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("category=creator"),
      }),
    );
  });

  test("search updates URL on submit", async () => {
    const items = [buildFeedback({ title: "An item" })];
    await using page = await mount({ items });

    await page.fillSearch("dark mode");
    await page.submitSearch();

    expect(page.onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("search=dark+mode"),
      }),
    );
  });
});
