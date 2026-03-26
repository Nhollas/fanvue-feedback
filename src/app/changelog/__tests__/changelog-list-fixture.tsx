import { test as base, expect } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import {
  type ChangelogEntryWithFeedback,
  ChangelogList,
} from "@/app/changelog/changelog-list";
import { changelogListPageObject } from "./changelog-list-page-object";

export { expect };

export const test = base.extend("changelogList", async () => ({
  async mount(entries: ChangelogEntryWithFeedback[]) {
    await render(<ChangelogList entries={entries} />);
    return changelogListPageObject(page);
  },
}));
