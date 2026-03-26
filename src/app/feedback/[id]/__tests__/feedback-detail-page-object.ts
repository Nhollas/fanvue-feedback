import { expect } from "vitest";
import type { BrowserPage } from "vitest/browser";

export function feedbackDetailPageObject(page: BrowserPage) {
  const self = {
    getTitle: (name?: string | RegExp) =>
      page.getByRole("heading", {
        level: 1,
        ...(name != null && { name }),
      }),

    getDescription: (text: string) => page.getByText(text),

    getVoteButton: () => page.getByRole("button", { name: /votes/ }),

    getCategoryBadge: (category: string) =>
      page.getByText(category, { exact: true }),

    getStatusBadge: (status: string) => page.getByText(status, { exact: true }),

    getBackButton: () => page.getByRole("link", { name: "Back to feedback" }),

    getStatusHistoryTrigger: () =>
      page.getByRole("button", { name: /Status History/ }),

    getStatusHistory: () =>
      page.getByRole("region", { name: "Status history" }),

    expectTitleVisible: async (title: string) => {
      await expect.element(self.getTitle(title)).toBeVisible();
    },

    expectDescriptionVisible: async (text: string) => {
      await expect.element(self.getDescription(text)).toBeVisible();
    },

    expectVoteCountVisible: async (count: string) => {
      await expect.element(self.getVoteButton()).toHaveTextContent(count);
    },

    expectCategoryVisible: async (category: string) => {
      await expect.element(self.getCategoryBadge(category)).toBeVisible();
    },

    expectStatusVisible: async (status: string) => {
      await expect.element(self.getStatusBadge(status)).toBeVisible();
    },

    expectBackButtonVisible: async () => {
      await expect.element(self.getBackButton()).toBeVisible();
    },

    expectBackButtonLinksTo: async (href: string) => {
      await expect.element(self.getBackButton()).toHaveAttribute("href", href);
    },

    expectVoted: async () => {
      await expect
        .element(self.getVoteButton())
        .toHaveAttribute("aria-pressed", "true");
    },

    expectNotVoted: async () => {
      await expect
        .element(self.getVoteButton())
        .toHaveAttribute("aria-pressed", "false");
    },

    clickVote: async () => {
      await self.getVoteButton().click();
    },

    expectStatusHistoryTriggerVisible: async () => {
      await expect.element(self.getStatusHistoryTrigger()).toBeVisible();
    },

    expectStatusHistoryHidden: async () => {
      await expect
        .element(self.getStatusHistoryTrigger())
        .not.toBeInTheDocument();
    },

    toggleStatusHistory: async () => {
      await self.getStatusHistoryTrigger().click();
    },

    expectStatusStepVisible: async (label: string) => {
      const history = self.getStatusHistory();
      await expect
        .element(history.getByText(label, { exact: true }))
        .toBeVisible();
    },

    getShippedLink: () => page.getByRole("link", { name: "Shipped" }),

    expectShippedLinkVisible: async () => {
      await expect.element(self.getShippedLink()).toBeVisible();
    },

    expectShippedLinkHidden: async () => {
      await expect.element(self.getShippedLink()).not.toBeInTheDocument();
    },
  };

  return Object.assign(page, self);
}
