import { expect } from "vitest";
import type { BrowserPage } from "vitest/browser";

export function homePagePageObject(page: BrowserPage) {
  const self = {
    // --- Header ---

    getHeading: () => page.getByRole("heading", { level: 1, name: "Feedback" }),

    getSubmitLink: () => page.getByRole("link", { name: "Submit Feedback" }),

    expectHeadingVisible: async () => {
      await expect.element(self.getHeading()).toBeVisible();
    },

    expectSubmitLinkVisible: async () => {
      await expect.element(self.getSubmitLink()).toBeVisible();
    },

    // --- Filters ---

    getCategoryTab: (name: string) => page.getByRole("tab", { name }),

    getSearchField: () =>
      page.getByRole("searchbox", { name: "Search feedback" }),

    getStatusSelect: () =>
      page.getByRole("combobox", { name: "Filter by status" }),

    getSortButton: (name: string) =>
      page.getByRole("button", { name, exact: true }),

    clickCategoryTab: async (name: string) => {
      await self.getCategoryTab(name).click();
    },

    fillSearch: async (value: string) => {
      await self.getSearchField().fill(value);
    },

    submitSearch: async () => {
      await self.getSearchField().click();
      const { userEvent } = await import("vitest/browser");
      await userEvent.keyboard("{Enter}");
    },

    selectStatus: async (value: string) => {
      await self.getStatusSelect().click();
      await page.getByRole("option", { name: value }).click();
    },

    clickSort: async (name: string) => {
      await self.getSortButton(name).click();
    },

    // --- Feed ---

    getVoteButtonFor: (title: string) =>
      page
        .getByRole("article", { name: title })
        .getByRole("button", { name: /votes/ }),

    expectFeedbackVisible: async (title: string) => {
      await expect
        .element(page.getByRole("heading", { name: title }))
        .toBeVisible();
    },

    clickVoteOn: async (title: string) => {
      await self.getVoteButtonFor(title).click();
    },

    expectVoteCountOn: async (title: string, count: string) => {
      await expect
        .element(self.getVoteButtonFor(title))
        .toHaveTextContent(count);
    },

    expectVotedOn: async (title: string) => {
      await expect
        .element(self.getVoteButtonFor(title))
        .toHaveAttribute("aria-pressed", "true");
    },

    expectNotVotedOn: async (title: string) => {
      await expect
        .element(self.getVoteButtonFor(title))
        .toHaveAttribute("aria-pressed", "false");
    },

    // --- Empty states ---

    expectEmptyState: async () => {
      await expect.element(page.getByText("No feedback yet")).toBeVisible();
    },

    expectFilteredEmptyState: async () => {
      await expect
        .element(page.getByText("No matching feedback"))
        .toBeVisible();
    },

    // --- Pagination ---

    getPaginationNav: () =>
      page.getByRole("navigation", { name: "Pagination" }),

    getPreviousButton: () =>
      page.getByRole("button", { name: "Previous page" }),

    getNextButton: () => page.getByRole("button", { name: "Next page" }),

    expectPaginationVisible: async () => {
      await expect.element(self.getPaginationNav()).toBeVisible();
    },

    expectPaginationHidden: async () => {
      await expect.element(self.getPaginationNav()).not.toBeInTheDocument();
    },

    expectPreviousDisabled: async () => {
      await expect.element(self.getPreviousButton()).toBeDisabled();
    },

    expectNextEnabled: async () => {
      await expect.element(self.getNextButton()).toBeEnabled();
    },

    clickNextPage: async () => {
      await self.getNextButton().click();
    },

    clickPreviousPage: async () => {
      await self.getPreviousButton().click();
    },
  };

  return Object.assign(page, self);
}
