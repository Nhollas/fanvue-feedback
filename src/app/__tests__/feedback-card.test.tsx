import { describe, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { FeedbackCard } from "@/app/feedback-card";
import { type ToggleVoteFn, ToggleVoteProvider } from "@/contexts/toggle-vote";
import type { Feedback } from "@/db/schema";
import { buildFeedback } from "../../../tests/support/factories";
import { noopToggleVote } from "../../../tests/support/stubs";
import { feedbackCardPageObject } from "./feedback-card-page-object";

type MountOptions = {
  toggleVote?: ToggleVoteFn;
};

async function mount(item: Feedback, options?: MountOptions) {
  const toggleVote = options?.toggleVote ?? noopToggleVote;
  await render(
    <ToggleVoteProvider value={toggleVote}>
      <FeedbackCard item={item} />
    </ToggleVoteProvider>,
  );
  return feedbackCardPageObject(page);
}

describe("FeedbackCard", () => {
  test("renders title, vote count, category badge, and status badge", async () => {
    const item = buildFeedback({
      title: "Bulk schedule content",
      voteCount: 42,
      category: "creator",
      status: "planned",
    });

    await using card = await mount(item);

    await card.expectTitleVisible("Bulk schedule content");
    await card.expectVoteCountVisible(42);
    await card.expectCategoryVisible("Creator");
    await card.expectStatusVisible("Planned");
  });

  test("renders fan category badge for fan feedback", async () => {
    const item = buildFeedback({ category: "fan" });
    await using card = await mount(item);
    await card.expectCategoryVisible("Fan");
  });

  test("links to the feedback detail page", async () => {
    const item = buildFeedback({ id: "test-uuid-123" });
    await using card = await mount(item);
    await card.expectLinksTo("/feedback/test-uuid-123");
  });

  test("truncates long titles to a single line", async () => {
    const item = buildFeedback({
      title:
        "This is an extremely long feedback title that should definitely overflow and be truncated to a single line",
    });
    await using card = await mount(item);
    await card.expectTitleTruncated();
  });

  test("truncates long descriptions to two lines", async () => {
    const item = buildFeedback({
      description:
        "This is a very long description that keeps going and going. ".repeat(
          10,
        ),
    });
    await using card = await mount(item);
    await card.expectDescriptionTruncated();
  });

  test.for([
    { status: "requested" as const, label: "Requested" },
    { status: "under_review" as const, label: "Under Review" },
    { status: "in_progress" as const, label: "In Progress" },
    { status: "completed" as const, label: "Completed" },
    { status: "rejected" as const, label: "Rejected" },
  ])("renders $label badge for $status status", async ({ status, label }) => {
    const item = buildFeedback({ status });
    await using card = await mount(item);
    await card.expectStatusVisible(label);
  });
});
