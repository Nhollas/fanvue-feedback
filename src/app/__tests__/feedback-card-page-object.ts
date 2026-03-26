import { expect } from "vitest";
import type { BrowserPage } from "vitest/browser";

export function feedbackCardPageObject(page: BrowserPage) {
  const self = {
    getLink: () => page.getByRole("link"),

    getTitle: () => page.getByRole("heading"),

    getDescription: (text: string) => page.getByText(text),

    getVoteButton: () => page.getByRole("button", { name: /votes/ }),

    getCategoryBadge: (category: string) => page.getByText(category),

    getStatusBadge: (status: string) => page.getByText(status),

    expectTitleVisible: async (title: string) => {
      await expect.element(self.getTitle()).toHaveTextContent(title);
    },

    expectVoteCountVisible: async (count: number) => {
      await expect
        .element(self.getVoteButton())
        .toHaveTextContent(count.toString());
    },

    expectCategoryVisible: async (category: string) => {
      await expect.element(self.getCategoryBadge(category)).toBeVisible();
    },

    expectStatusVisible: async (status: string) => {
      await expect.element(self.getStatusBadge(status)).toBeVisible();
    },

    expectLinksTo: async (href: string) => {
      await expect.element(self.getLink()).toHaveAttribute("href", href);
    },

    expectTitleTruncated: async () => {
      await expect.element(self.getTitle()).toHaveClass("line-clamp-1");
    },

    expectDescriptionTruncated: async () => {
      await expect
        .element(page.getByRole("paragraph"))
        .toHaveClass("line-clamp-2");
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
  };

  return Object.assign(page, self);
}
