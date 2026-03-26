import { test as base } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { FeedbackCard } from "@/app/feedback-card";
import { type ToggleVoteFn, ToggleVoteProvider } from "@/contexts/toggle-vote";
import type { Feedback } from "@/db/schema";
import { noopToggleVote } from "../../../tests/support/stubs";
import { feedbackCardPageObject } from "./feedback-card-page-object";

type MountOptions = {
  toggleVote?: ToggleVoteFn;
};

export const test = base.extend("feedbackCard", async () => ({
  async mount(item: Feedback, options?: MountOptions) {
    const toggleVote = options?.toggleVote ?? noopToggleVote;
    await render(
      <ToggleVoteProvider value={toggleVote}>
        <FeedbackCard item={item} />
      </ToggleVoteProvider>,
    );
    return feedbackCardPageObject(page);
  },
}));
