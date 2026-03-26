import { expect } from "vitest";
import type { BrowserPage } from "vitest/browser";

export function changelogListPageObject(page: BrowserPage) {
  const self = {
    getEntryTitle: (title: string) =>
      page.getByRole("heading", { level: 2, name: title }),

    getEntryDescription: (text: string) => page.getByText(text),

    getEmptyState: () => page.getByText("No changelog entries yet."),

    getFeedbackLink: (title: string) => page.getByRole("link", { name: title }),

    getInspiredByLabel: () => page.getByText("Inspired by:"),

    expectEntryVisible: async (title: string) => {
      await expect.element(self.getEntryTitle(title)).toBeVisible();
    },

    expectDescriptionVisible: async (text: string) => {
      await expect.element(self.getEntryDescription(text)).toBeVisible();
    },

    expectEmptyStateVisible: async () => {
      await expect.element(self.getEmptyState()).toBeVisible();
    },

    expectFeedbackLinkVisible: async (title: string) => {
      await expect.element(self.getFeedbackLink(title)).toBeVisible();
    },

    expectFeedbackLinkHref: async (title: string, href: string) => {
      await expect
        .element(self.getFeedbackLink(title))
        .toHaveAttribute("href", href);
    },
  };

  return Object.assign(page, self);
}
