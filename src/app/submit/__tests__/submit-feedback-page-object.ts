import { expect } from "vitest";
import type { BrowserPage } from "vitest/browser";

export function submitFeedbackPageObject(page: BrowserPage) {
  const self = {
    getTitle: () => page.getByRole("textbox", { name: "Title" }),

    getDescription: () => page.getByRole("textbox", { name: "Description" }),

    getCategorySelect: () => page.getByRole("combobox", { name: "Category" }),

    getSubmitButton: () =>
      page.getByRole("button", {
        name: /Submit|Submitting/,
      }),

    getCategoryOption: (value: string) =>
      page.getByRole("option", { name: value }),

    getErrorMessage: (text: string) => page.getByText(text),

    getSuggestionsRegion: () =>
      page.getByRole("region", { name: "Similar feedback already exists" }),

    getSuggestionLink: (text: string) => page.getByRole("link", { name: text }),

    getDismissButton: () => page.getByRole("button", { name: "Dismiss" }),

    fillTitle: async (value: string) => {
      await self.getTitle().fill(value);
    },

    fillDescription: async (value: string) => {
      await self.getDescription().fill(value);
    },

    selectCategory: async (value: string) => {
      await self.getCategorySelect().click();
      await self.getCategoryOption(value).click();
    },

    submit: async () => {
      await self.getSubmitButton().click();
    },

    blurTitle: async () => {
      await self.getDescription().click();
    },

    blurDescription: async () => {
      await self.getTitle().click();
    },

    expectTitleFieldVisible: async () => {
      await expect.element(self.getTitle()).toBeVisible();
    },

    expectDescriptionFieldVisible: async () => {
      await expect.element(self.getDescription()).toBeVisible();
    },

    expectCategoryFieldVisible: async () => {
      await expect.element(self.getCategorySelect()).toBeVisible();
    },

    expectSubmitButtonVisible: async () => {
      await expect.element(self.getSubmitButton()).toBeVisible();
    },

    expectSubmitButtonDisabled: async () => {
      await expect.element(self.getSubmitButton()).toBeDisabled();
    },

    expectSubmitButtonEnabled: async () => {
      await expect.element(self.getSubmitButton()).toBeEnabled();
    },

    expectErrorVisible: async (text: string) => {
      await expect.element(self.getErrorMessage(text)).toBeVisible();
    },

    expectErrorHidden: async (text: string) => {
      await expect.element(self.getErrorMessage(text)).not.toBeInTheDocument();
    },

    expectSubmitButtonText: async (text: string) => {
      await expect.element(self.getSubmitButton()).toHaveTextContent(text);
    },

    expectSuggestionsVisible: async () => {
      await expect.element(self.getSuggestionsRegion()).toBeVisible();
    },

    expectSuggestionsHidden: async () => {
      await expect.element(self.getSuggestionsRegion()).not.toBeInTheDocument();
    },

    expectSuggestionLinkVisible: async (title: string) => {
      await expect.element(self.getSuggestionLink(title)).toBeVisible();
    },

    expectDismissButtonVisible: async () => {
      await expect.element(self.getDismissButton()).toBeVisible();
    },

    clickDismiss: async () => {
      await self.getDismissButton().click();
    },
  };

  return Object.assign(page, self);
}
