import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { test as base, expect, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { FeedList, FeedPageView } from "@/app/feed-page-view";
import type { FeedData } from "@/app/get-feedback-items";
import { type ToggleVoteFn, ToggleVoteProvider } from "@/contexts/toggle-vote";
import { noopToggleVote } from "../../../tests/support/stubs";
import { homePagePageObject } from "./home-page-page-object";

export { expect };

type HomePageMountOptions = Partial<FeedData> & {
  toggleVote?: ToggleVoteFn;
  searchParams?: string | Record<string, string>;
};

export const test = base.extend("homePage", async () => ({
  async mount(options?: HomePageMountOptions) {
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
  },
}));
