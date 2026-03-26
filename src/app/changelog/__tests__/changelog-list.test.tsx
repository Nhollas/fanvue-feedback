import { describe } from "vitest";
import { buildChangelogEntry } from "../../../../tests/support/factories";
import { expect, test } from "./changelog-list-fixture";

describe("ChangelogList", () => {
  test("renders empty state when no entries exist", async ({
    changelogList,
  }) => {
    const list = await changelogList.mount([]);
    await list.expectEmptyStateVisible();
  });

  test("renders changelog entry with title and description", async ({
    changelogList,
  }) => {
    const entry = buildChangelogEntry({
      title: "Dark mode now available in messaging",
      description: "Full dark mode support for the messaging interface.",
    });

    const list = await changelogList.mount([{ ...entry, feedbackItems: [] }]);

    await list.expectEntryVisible("Dark mode now available in messaging");
    await list.expectDescriptionVisible(
      "Full dark mode support for the messaging interface.",
    );
  });

  test("renders linked feedback items with correct links", async ({
    changelogList,
  }) => {
    const feedbackId = crypto.randomUUID();
    const entry = buildChangelogEntry({
      title: "Faster video playback",
    });

    const list = await changelogList.mount([
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

  test("renders multiple entries in order", async ({ changelogList }) => {
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

    const list = await changelogList.mount(entries);

    await list.expectEntryVisible("Feature A");
    await list.expectEntryVisible("Feature B");
  });

  test("renders entry with multiple linked feedback items", async ({
    changelogList,
  }) => {
    const entry = buildChangelogEntry({ title: "Big release" });

    const list = await changelogList.mount([
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

  test("hides inspired by section when no feedback items linked", async ({
    changelogList,
  }) => {
    const entry = buildChangelogEntry({ title: "Standalone update" });

    const list = await changelogList.mount([{ ...entry, feedbackItems: [] }]);

    await expect.element(list.getInspiredByLabel()).not.toBeInTheDocument();
  });
});
