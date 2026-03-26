import { afterEach, describe, vi } from "vitest";

import {
  buildChangelogEntry,
  buildFeedback,
  buildStatusChange,
} from "../../../../../tests/support/factories";
import { expect, test } from "./feedback-detail-fixture";

afterEach(() => {
  localStorage.clear();
});

describe("FeedbackDetail", () => {
  test("renders title, full description, vote count, category, and status", async ({
    feedbackDetail,
  }) => {
    const item = buildFeedback({
      title: "Bulk schedule content across multiple days",
      description:
        "As a creator, I want to schedule posts for the entire week in one session.",
      voteCount: 87,
      category: "creator",
      status: "planned",
    });

    const detail = await feedbackDetail.mount({ item });

    await detail.expectTitleVisible(
      "Bulk schedule content across multiple days",
    );
    await detail.expectDescriptionVisible(
      "As a creator, I want to schedule posts for the entire week in one session.",
    );
    await detail.expectVoteCountVisible("87");
    await detail.expectCategoryVisible("Creator");
    await detail.expectStatusVisible("Planned");
  });

  test("shows full description without truncation", async ({
    feedbackDetail,
  }) => {
    const longDescription =
      "This is a very long description that should be fully visible on the detail page without any truncation. ".repeat(
        5,
      );
    const item = buildFeedback({ description: longDescription });
    const detail = await feedbackDetail.mount({ item });

    const descriptionEl = detail.getDescription(longDescription.trim());
    await expect.element(descriptionEl).toBeVisible();
    await expect.element(descriptionEl).not.toHaveClass("line-clamp-2");
  });

  test("renders fan category badge", async ({ feedbackDetail }) => {
    const item = buildFeedback({ category: "fan" });
    const detail = await feedbackDetail.mount({ item });
    await detail.expectCategoryVisible("Fan");
  });

  test("renders each status with correct badge text", async ({
    feedbackDetail,
  }) => {
    const statuses = [
      { status: "requested" as const, label: "Requested" },
      { status: "under_review" as const, label: "Under Review" },
      { status: "planned" as const, label: "Planned" },
      { status: "in_progress" as const, label: "In Progress" },
      { status: "completed" as const, label: "Completed" },
      { status: "rejected" as const, label: "Rejected" },
    ];

    for (const { status, label } of statuses) {
      const item = buildFeedback({ status });
      const detail = await feedbackDetail.mount({ item });
      await detail.expectStatusVisible(label);
    }
  });

  test("formats large vote counts compactly", async ({ feedbackDetail }) => {
    const item = buildFeedback({ voteCount: 2400 });
    const detail = await feedbackDetail.mount({ item });
    await detail.expectVoteCountVisible("2.4K");
  });

  test("toggles vote on click", async ({ feedbackDetail }) => {
    const toggleVote = vi.fn().mockResolvedValueOnce({
      voted: true,
      voteCount: 88,
    });

    const item = buildFeedback({ voteCount: 87 });
    const detail = await feedbackDetail.mount({ item, toggleVote });

    await detail.expectNotVoted();
    await detail.clickVote();
    await detail.expectVoted();
    await detail.expectVoteCountVisible("88");
  });

  test("toggles vote off on second click", async ({ feedbackDetail }) => {
    const toggleVote = vi
      .fn()
      .mockResolvedValueOnce({ voted: true, voteCount: 88 })
      .mockResolvedValueOnce({ voted: false, voteCount: 87 });

    const item = buildFeedback({ voteCount: 87 });
    const detail = await feedbackDetail.mount({ item, toggleVote });

    await detail.clickVote();
    await detail.expectVoted();

    await detail.clickVote();
    await detail.expectNotVoted();
    await detail.expectVoteCountVisible("87");
  });

  test("hides status history when no status changes exist", async ({
    feedbackDetail,
  }) => {
    const item = buildFeedback();
    const detail = await feedbackDetail.mount({ item, statusChanges: [] });
    await detail.expectStatusHistoryHidden();
  });

  test("shows status stepper with all steps when accordion is opened", async ({
    feedbackDetail,
  }) => {
    const item = buildFeedback({ status: "planned" });
    const statusChanges = [
      buildStatusChange({
        feedbackId: item.id,
        fromStatus: "requested",
        toStatus: "under_review",
        changedAt: new Date("2026-01-20"),
      }),
      buildStatusChange({
        feedbackId: item.id,
        fromStatus: "under_review",
        toStatus: "planned",
        changedAt: new Date("2026-02-01"),
      }),
    ];

    const detail = await feedbackDetail.mount({ item, statusChanges });

    await detail.expectStatusHistoryTriggerVisible();
    await detail.toggleStatusHistory();
    await detail.expectStatusStepVisible("Requested");
    await detail.expectStatusStepVisible("Under Review");
    await detail.expectStatusStepVisible("Planned");
  });

  test("hides shipped link when no changelog entry exists", async ({
    feedbackDetail,
  }) => {
    const item = buildFeedback();
    const detail = await feedbackDetail.mount({ item });
    await detail.expectShippedLinkHidden();
  });

  test("shows shipped link when a changelog entry is linked", async ({
    feedbackDetail,
  }) => {
    const item = buildFeedback({ status: "completed" });
    const entry = buildChangelogEntry({
      title: "Dark mode now available in messaging",
    });

    const detail = await feedbackDetail.mount({
      item,
      changelogEntry: entry,
    });

    await detail.expectShippedLinkVisible();
  });
});
