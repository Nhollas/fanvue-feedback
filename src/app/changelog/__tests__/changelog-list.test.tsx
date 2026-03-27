import { describe, expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import {
  type ChangelogEntryWithFeedback,
  ChangelogList,
} from "@/app/changelog/changelog-list";
import { buildChangelogEntry } from "../../../../tests/support/factories";
import { changelogListPageObject } from "./changelog-list-page-object";

async function mount(entries: ChangelogEntryWithFeedback[]) {
  await render(<ChangelogList entries={entries} />);
  return changelogListPageObject(page);
}

describe("ChangelogList", () => {
  test("renders empty state when no entries exist", async () => {
    const list = await mount([]);
    await list.expectEmptyStateVisible();
  });

  test("renders changelog entry with title and description", async () => {
    const entry = buildChangelogEntry({
      title: "Dark mode now available in messaging",
      description: "Full dark mode support for the messaging interface.",
    });

    const list = await mount([{ ...entry, feedbackItems: [] }]);

    await list.expectEntryVisible("Dark mode now available in messaging");
    await list.expectDescriptionVisible(
      "Full dark mode support for the messaging interface.",
    );
  });

  test("renders linked feedback items with correct links", async () => {
    const feedbackId = crypto.randomUUID();
    const entry = buildChangelogEntry({
      title: "Faster video playback",
    });

    const list = await mount([
      {
        ...entry,
        feedbackItems: [
          { id: feedbackId, title: "Improve video loading speed" },
        ],
      },
    ]);

    await list.expectFeedbackLinkVisible("Improve video loading speed");
    await list.expectFeedbackLinkHref(
      "Improve video loading speed",
      `/feedback/${feedbackId}`,
    );
  });

  test("renders multiple entries in order", async () => {
    const entries = [
      {
        ...buildChangelogEntry({ title: "Feature A" }),
        feedbackItems: [],
      },
      {
        ...buildChangelogEntry({ title: "Feature B" }),
        feedbackItems: [],
      },
    ];

    const list = await mount(entries);

    await list.expectEntryVisible("Feature A");
    await list.expectEntryVisible("Feature B");
  });

  test("renders entry with multiple linked feedback items", async () => {
    const entry = buildChangelogEntry({ title: "Big release" });

    const list = await mount([
      {
        ...entry,
        feedbackItems: [
          { id: crypto.randomUUID(), title: "Feature request A" },
          { id: crypto.randomUUID(), title: "Feature request B" },
        ],
      },
    ]);

    await list.expectFeedbackLinkVisible("Feature request A");
    await list.expectFeedbackLinkVisible("Feature request B");
  });

  test("hides inspired by section when no feedback items linked", async () => {
    const entry = buildChangelogEntry({ title: "Standalone update" });

    const list = await mount([{ ...entry, feedbackItems: [] }]);

    await expect.element(list.getInspiredByLabel()).not.toBeInTheDocument();
  });
});
