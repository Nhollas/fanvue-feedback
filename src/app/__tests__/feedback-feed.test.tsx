import { describe } from "vitest";

import { buildFeedback } from "../../../tests/support/factories";
import { test } from "./feedback-feed-fixture";

describe("FeedbackFeed", () => {
  test("renders all feedback items", async ({ feedbackFeed }) => {
    const items = [
      buildFeedback({ title: "First feedback item" }),
      buildFeedback({ title: "Second feedback item" }),
      buildFeedback({ title: "Third feedback item" }),
    ];

    const feed = await feedbackFeed.mount({ items });

    await feed.expectFeedbackVisible("First feedback item");
    await feed.expectFeedbackVisible("Second feedback item");
    await feed.expectFeedbackVisible("Third feedback item");
  });

  test("renders empty state when no items exist", async ({ feedbackFeed }) => {
    const feed = await feedbackFeed.mount({ items: [] });
    await feed.expectEmptyStateVisible();
  });

  test("renders filtered empty state when no items match filters", async ({
    feedbackFeed,
  }) => {
    const feed = await feedbackFeed.mount({ items: [], filtered: true });
    await feed.expectFilteredEmptyStateVisible();
  });
});
