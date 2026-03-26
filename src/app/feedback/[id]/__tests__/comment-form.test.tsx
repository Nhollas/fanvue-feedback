import { describe, vi } from "vitest";
import type { AddCommentState } from "@/actions/add-comment";
import { buildComment } from "../../../../../tests/support/factories";
import { expect, test } from "./comment-form-fixture";

describe("CommentForm", () => {
  test("renders name field, comment field, and submit button", async ({
    commentForm,
  }) => {
    const form = await commentForm.mount();

    await form.expectAuthorNameFieldVisible();
    await form.expectContentFieldVisible();
    await form.expectSubmitButtonVisible();
    await form.expectSubmitButtonText("Post Comment");
  });

  test("shows empty state when no comments exist", async ({ commentForm }) => {
    const form = await commentForm.mount({ comments: [] });

    await form.expectEmptyState();
    await form.expectCommentHeadingText("Comments (0)");
  });

  test("renders existing comments in chronological order", async ({
    commentForm,
  }) => {
    const comments = [
      buildComment({
        authorName: "Alice",
        content: "Great idea!",
        createdAt: new Date("2026-01-10"),
      }),
      buildComment({
        authorName: "Bob",
        content: "I agree, this would be useful.",
        createdAt: new Date("2026-01-12"),
      }),
    ];

    const form = await commentForm.mount({ comments });

    await form.expectCommentHeadingText("Comments (2)");
    await form.expectCommentVisible("Alice", "Great idea!");
    await form.expectCommentVisible("Bob", "I agree, this would be useful.");
    await form.expectCommentsInOrder("Alice", "Bob");
  });

  test("displays name validation error from server action", async ({
    commentForm,
  }) => {
    const errorState: AddCommentState = {
      errors: { authorName: "Name is required" },
      values: { authorName: "", content: "Some comment" },
    };

    const addComment = vi.fn().mockResolvedValueOnce(errorState);

    const form = await commentForm.mount({ addComment });
    await form.fillAuthorName("   ");
    await form.fillContent("Some comment");
    await form.submit();

    await form.expectErrorVisible("Name is required");
  });

  test("displays content validation error from server action", async ({
    commentForm,
  }) => {
    const errorState: AddCommentState = {
      errors: { content: "Comment is required" },
      values: { authorName: "Alice", content: "" },
    };

    const addComment = vi.fn().mockResolvedValueOnce(errorState);

    const form = await commentForm.mount({ addComment });
    await form.fillAuthorName("Alice");
    // Fill with whitespace to bypass browser required validation;
    // server trims and rejects empty content
    await form.fillContent("   ");
    await form.submit();

    await form.expectErrorVisible("Comment is required");
  });

  test("calls addComment action with form data on submit", async ({
    commentForm,
  }) => {
    const addComment = vi.fn().mockResolvedValueOnce({});

    const form = await commentForm.mount({ addComment });
    await form.fillAuthorName("Alice");
    await form.fillContent("This is a great feature request!");
    await form.submit();

    expect(addComment).toHaveBeenCalledTimes(1);
    expect(addComment.mock.calls[0]?.[0]).toBe("test-feedback-id");
    const formData = addComment.mock.calls[0]?.[2] as FormData;
    expect(formData.get("authorName")).toBe("Alice");
    expect(formData.get("content")).toBe("This is a great feature request!");
  });

  test("recovers from validation error on resubmit", async ({
    commentForm,
  }) => {
    const addComment = vi
      .fn()
      .mockResolvedValueOnce({
        errors: { content: "Comment is required" },
        values: { authorName: "Alice", content: "" },
        submissionCount: 1,
      } satisfies AddCommentState)
      .mockResolvedValueOnce({ submissionCount: 2 });

    const form = await commentForm.mount({ addComment });
    await form.fillAuthorName("Alice");
    await form.fillContent("   ");
    await form.submit();

    await form.expectErrorVisible("Comment is required");

    await form.fillContent("This is my actual comment");
    await form.submit();

    expect(addComment).toHaveBeenCalledTimes(2);
    await form.expectErrorHidden("Comment is required");
  });

  test("disables submit button and shows pending text while submitting", async ({
    commentForm,
  }) => {
    let resolveComment!: (value: AddCommentState) => void;
    const addComment = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<AddCommentState>((resolve) => (resolveComment = resolve)),
      );

    const form = await commentForm.mount({ addComment });
    await form.fillAuthorName("Alice");
    await form.fillContent("Great idea!");
    await form.submit();

    await form.expectSubmitButtonDisabled();
    await form.expectSubmitButtonText("Posting...");

    resolveComment({});

    await form.expectSubmitButtonEnabled();
    await form.expectSubmitButtonText("Post Comment");
  });
});
