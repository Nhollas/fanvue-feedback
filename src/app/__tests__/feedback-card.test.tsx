import { afterEach, describe } from "vitest";

import { buildFeedback } from "../../../tests/support/factories";
import { test } from "./feedback-card-fixture";

afterEach(() => {
  localStorage.clear();
});

describe("FeedbackCard", () => {
  test("renders title, vote count, category badge, and status badge", async ({
    feedbackCard,
  }) => {
    const item = buildFeedback({
      title: "Bulk schedule content",
      voteCount: 42,
      category: "creator",
      status: "planned",
    });

    const card = await feedbackCard.mount(item);

    await card.expectTitleVisible("Bulk schedule content");
    await card.expectVoteCountVisible(42);
    await card.expectCategoryVisible("Creator");
    await card.expectStatusVisible("Planned");
  });

  test("renders fan category badge for fan feedback", async ({
    feedbackCard,
  }) => {
    const item = buildFeedback({ category: "fan" });
    const card = await feedbackCard.mount(item);
    await card.expectCategoryVisible("Fan");
  });

  test("links to the feedback detail page", async ({ feedbackCard }) => {
    const item = buildFeedback({ id: "test-uuid-123" });
    const card = await feedbackCard.mount(item);
    await card.expectLinksTo("/feedback/test-uuid-123");
  });

  test("truncates long titles to a single line", async ({ feedbackCard }) => {
    const item = buildFeedback({
      title:
        "This is an extremely long feedback title that should definitely overflow and be truncated to a single line",
    });
    const card = await feedbackCard.mount(item);
    await card.expectTitleTruncated();
  });

  test("truncates long descriptions to two lines", async ({ feedbackCard }) => {
    const item = buildFeedback({
      description:
        "This is a very long description that keeps going and going. ".repeat(
          10,
        ),
    });
    const card = await feedbackCard.mount(item);
    await card.expectDescriptionTruncated();
  });

  test.for([
    { status: "requested" as const, label: "Requested" },
    { status: "under_review" as const, label: "Under Review" },
    { status: "in_progress" as const, label: "In Progress" },
    { status: "completed" as const, label: "Completed" },
    { status: "rejected" as const, label: "Rejected" },
  ])("renders $label badge for $status status", async ({ status, label }, {
    feedbackCard,
  }) => {
    const item = buildFeedback({ status });
    const card = await feedbackCard.mount(item);
    await card.expectStatusVisible(label);
  });
});
