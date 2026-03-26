import { expect } from "vitest";
import type { BrowserPage } from "vitest/browser";

export function feedFiltersPageObject(page: BrowserPage) {
  const self = {
    getCategoryTab: (name: string) => page.getByRole("tab", { name }),

    getSearchField: () =>
      page.getByRole("searchbox", { name: "Search feedback" }),

    getStatusSelect: () =>
      page.getByRole("combobox", { name: "Filter by status" }),

    getSortButton: (name: string) =>
      page.getByRole("button", { name, exact: true }),

    expectCategoryTabVisible: async (name: string) => {
      await expect.element(self.getCategoryTab(name)).toBeVisible();
    },

    expectCategoryTabSelected: async (name: string) => {
      await expect
        .element(self.getCategoryTab(name))
        .toHaveAttribute("aria-selected", "true");
    },

    clickCategoryTab: async (name: string) => {
      await self.getCategoryTab(name).click();
    },

    expectSearchFieldVisible: async () => {
      await expect.element(self.getSearchField()).toBeVisible();
    },

    fillSearch: async (value: string) => {
      await self.getSearchField().fill(value);
    },

    submitSearch: async () => {
      await self.getSearchField().click();
      const { userEvent } = await import("vitest/browser");
      await userEvent.keyboard("{Enter}");
    },

    expectStatusSelectVisible: async () => {
      await expect.element(self.getStatusSelect()).toBeVisible();
    },

    selectStatus: async (value: string) => {
      await self.getStatusSelect().click();
      await page.getByRole("option", { name: value }).click();
    },

    expectSortButtonVisible: async (name: string) => {
      await expect.element(self.getSortButton(name)).toBeVisible();
    },

    expectSortPressed: async (name: string) => {
      await expect
        .element(self.getSortButton(name))
        .toHaveAttribute("aria-pressed", "true");
    },

    clickSort: async (name: string) => {
      await self.getSortButton(name).click();
    },
  };

  return Object.assign(page, self);
}
