import { expect } from "vitest";
import type { BrowserPage } from "vitest/browser";

export function paginationPageObject(page: BrowserPage) {
  const self = {
    getNav: () => page.getByRole("navigation", { name: "Pagination" }),

    getPreviousButton: () =>
      page.getByRole("button", { name: "Previous page" }),

    getNextButton: () => page.getByRole("button", { name: "Next page" }),

    getPageButton: (pageNum: number) =>
      page.getByRole("button", { name: `Page ${pageNum}` }),

    expectNotRendered: async () => {
      await expect.element(self.getNav()).not.toBeInTheDocument();
    },

    expectRendered: async () => {
      await expect.element(self.getNav()).toBeVisible();
    },

    expectPreviousDisabled: async () => {
      await expect.element(self.getPreviousButton()).toBeDisabled();
    },

    expectPreviousEnabled: async () => {
      await expect.element(self.getPreviousButton()).toBeEnabled();
    },

    expectNextDisabled: async () => {
      await expect.element(self.getNextButton()).toBeDisabled();
    },

    expectNextEnabled: async () => {
      await expect.element(self.getNextButton()).toBeEnabled();
    },

    expectCurrentPage: async (pageNum: number) => {
      await expect
        .element(self.getPageButton(pageNum))
        .toHaveAttribute("aria-current", "page");
    },

    clickNext: async () => {
      await self.getNextButton().click();
    },

    clickPrevious: async () => {
      await self.getPreviousButton().click();
    },
  };

  return Object.assign(page, self);
}
