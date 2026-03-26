import { vi } from "vitest";
import type { AddCommentFn } from "@/contexts/add-comment";
import type { SubmitFeedbackFn } from "@/contexts/submit-feedback";
import type { ToggleVoteFn } from "@/contexts/toggle-vote";

export const noopToggleVote: ToggleVoteFn = vi.fn(async () => ({
  voted: false,
  voteCount: 0,
}));

export const noopAddComment: AddCommentFn = vi.fn(async () => ({}));

export const noopSubmitFeedback: SubmitFeedbackFn = vi.fn(async () => ({}));
