import { expect } from "vitest";
import type { BrowserPage } from "vitest/browser";

export function commentFormPageObject(page: BrowserPage) {
  const self = {
    getAuthorName: () => page.getByRole("textbox", { name: "Name" }),

    getContent: () => page.getByRole("textbox", { name: "Comment" }),

    getSubmitButton: () =>
      page.getByRole("button", { name: /Post Comment|Posting/ }),

    getErrorMessage: (text: string) => page.getByText(text),

    getCommentHeading: () => page.getByRole("heading", { name: /Comments/ }),

    getCommentAuthor: (name: string) => page.getByText(name, { exact: true }),

    getCommentContent: (text: string) => page.getByText(text),

    fillAuthorName: async (value: string) => {
      await self.getAuthorName().fill(value);
    },

    fillContent: async (value: string) => {
      await self.getContent().fill(value);
    },

    submit: async () => {
      await self.getSubmitButton().click();
    },

    expectAuthorNameFieldVisible: async () => {
      await expect.element(self.getAuthorName()).toBeVisible();
    },

    expectContentFieldVisible: async () => {
      await expect.element(self.getContent()).toBeVisible();
    },

    expectSubmitButtonVisible: async () => {
      await expect.element(self.getSubmitButton()).toBeVisible();
    },

    expectSubmitButtonText: async (text: string) => {
      await expect.element(self.getSubmitButton()).toHaveTextContent(text);
    },

    expectErrorVisible: async (text: string) => {
      await expect.element(self.getErrorMessage(text)).toBeVisible();
    },

    expectErrorHidden: async (text: string) => {
      await expect.element(self.getErrorMessage(text)).not.toBeInTheDocument();
    },

    expectCommentHeadingText: async (text: string) => {
      await expect.element(self.getCommentHeading()).toHaveTextContent(text);
    },

    expectCommentVisible: async (author: string, content: string) => {
      await expect.element(self.getCommentAuthor(author)).toBeVisible();
      await expect.element(self.getCommentContent(content)).toBeVisible();
    },

    expectSubmitButtonDisabled: async () => {
      await expect.element(self.getSubmitButton()).toBeDisabled();
    },

    expectSubmitButtonEnabled: async () => {
      await expect.element(self.getSubmitButton()).toBeEnabled();
    },

    expectCommentsInOrder: async (...authors: string[]) => {
      const items = page.getByRole("listitem");
      for (const [i, author] of authors.entries()) {
        await expect.element(items.nth(i)).toHaveTextContent(author);
      }
    },

    expectEmptyState: async () => {
      await expect
        .element(
          page.getByText(
            "No comments yet. Be the first to share your thoughts.",
          ),
        )
        .toBeVisible();
    },
  };

  return Object.assign(page, self);
}
