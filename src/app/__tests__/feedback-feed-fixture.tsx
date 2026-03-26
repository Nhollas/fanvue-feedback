import { test as base } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { FeedbackFeed } from "@/app/feedback-feed";
import { ToggleVoteProvider } from "@/contexts/toggle-vote";
import type { Feedback } from "@/db/schema";
import { noopToggleVote } from "../../../tests/support/stubs";
import { feedbackFeedPageObject } from "./feedback-feed-page-object";

type MountOptions = {
  items: Feedback[];
  filtered?: boolean;
};

export const test = base.extend("feedbackFeed", async () => ({
  async mount(options: MountOptions) {
    const { items, filtered } = options;
    await render(
      <ToggleVoteProvider value={noopToggleVote}>
        <FeedbackFeed items={items} filtered={filtered ?? false} />
      </ToggleVoteProvider>,
    );
    return feedbackFeedPageObject(page);
  },
}));
