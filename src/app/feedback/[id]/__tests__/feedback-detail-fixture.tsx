import { test as base, expect } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import {
  FeedbackDetail,
  type FeedbackDetailProps,
} from "@/app/feedback/[id]/feedback-detail";
import { type AddCommentFn, AddCommentProvider } from "@/contexts/add-comment";
import { type ToggleVoteFn, ToggleVoteProvider } from "@/contexts/toggle-vote";
import {
  noopAddComment,
  noopToggleVote,
} from "../../../../../tests/support/stubs";
import { feedbackDetailPageObject } from "./feedback-detail-page-object";

export { expect };

type MountOptions = FeedbackDetailProps & {
  toggleVote?: ToggleVoteFn;
  addComment?: AddCommentFn;
};

export const test = base.extend("feedbackDetail", async () => ({
  async mount({
    toggleVote = noopToggleVote,
    addComment = noopAddComment,
    ...props
  }: MountOptions) {
    await render(
      <ToggleVoteProvider value={toggleVote}>
        <AddCommentProvider value={addComment}>
          <FeedbackDetail {...props} />
        </AddCommentProvider>
      </ToggleVoteProvider>,
    );
    return feedbackDetailPageObject(page);
  },
}));
