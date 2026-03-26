import { test as base, expect } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { CommentForm } from "@/app/feedback/[id]/comment-form";
import { CommentList } from "@/app/feedback/[id]/comment-list";
import { type AddCommentFn, AddCommentProvider } from "@/contexts/add-comment";
import type { Comment } from "@/db/schema";
import { noopAddComment } from "../../../../../tests/support/stubs";
import { commentFormPageObject } from "./comment-form-page-object";

export { expect };

type MountOptions = {
  comments?: Comment[];
  addComment?: AddCommentFn;
};

export const test = base.extend("commentForm", async () => ({
  async mount(options?: MountOptions) {
    const { comments = [], addComment = noopAddComment } = options ?? {};
    const feedbackId = "test-feedback-id";
    await render(
      <AddCommentProvider value={addComment}>
        <section aria-labelledby="comments-heading">
          <h2 id="comments-heading">Comments ({comments.length})</h2>
          <CommentList comments={comments} />
          <CommentForm feedbackId={feedbackId} />
        </section>
      </AddCommentProvider>,
    );
    return commentFormPageObject(page);
  },
}));
