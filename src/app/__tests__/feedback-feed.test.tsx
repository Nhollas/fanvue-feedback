import { describe, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { FeedbackFeed } from "@/app/feedback-feed";
import { ToggleVoteProvider } from "@/contexts/toggle-vote";
import type { Feedback } from "@/db/schema";
import { buildFeedback } from "../../../tests/support/factories";
import { noopToggleVote } from "../../../tests/support/stubs";
import { feedbackFeedPageObject } from "./feedback-feed-page-object";

type MountOptions = {
  items: Feedback[];
  filtered?: boolean;
};

async function mount(options: MountOptions) {
  const { items, filtered } = options;
  await render(
    <ToggleVoteProvider value={noopToggleVote}>
      <FeedbackFeed items={items} filtered={filtered ?? false} />
    </ToggleVoteProvider>,
  );
  return feedbackFeedPageObject(page);
}

describe("FeedbackFeed", () => {
  test("renders all feedback items", async () => {
    const items = [
      buildFeedback({ title: "First feedback item" }),
      buildFeedback({ title: "Second feedback item" }),
      buildFeedback({ title: "Third feedback item" }),
    ];

    const feed = await mount({ items });

    await feed.expectFeedbackVisible("First feedback item");
    await feed.expectFeedbackVisible("Second feedback item");
    await feed.expectFeedbackVisible("Third feedback item");
  });

  test("renders empty state when no items exist", async () => {
    const feed = await mount({ items: [] });
    await feed.expectEmptyStateVisible();
  });

  test("renders filtered empty state when no items match filters", async () => {
    const feed = await mount({ items: [], filtered: true });
    await feed.expectFilteredEmptyStateVisible();
  });
});
