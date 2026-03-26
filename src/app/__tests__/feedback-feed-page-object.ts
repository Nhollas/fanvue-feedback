import { expect } from "vitest";
import type { BrowserPage } from "vitest/browser";

export function feedbackFeedPageObject(page: BrowserPage) {
  const self = {
    expectFeedbackVisible: async (title: string) => {
      await expect.element(page.getByText(title)).toBeVisible();
    },

    expectEmptyStateVisible: async () => {
      await expect.element(page.getByText("No feedback yet")).toBeVisible();
      await expect
        .element(page.getByText("Be the first to share an idea."))
        .toBeVisible();
    },

    expectFilteredEmptyStateVisible: async () => {
      await expect
        .element(page.getByText("No matching feedback"))
        .toBeVisible();
      await expect
        .element(page.getByText("Try adjusting your filters or search terms."))
        .toBeVisible();
    },
  };

  return Object.assign(page, self);
}
