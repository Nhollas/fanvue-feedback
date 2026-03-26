"use client";

import { createActionContext } from "./create-action-context";

export type ToggleVoteFn = (
  feedbackId: string,
  voterIdentifier: string,
) => Promise<{ voted: boolean; voteCount: number }>;

export const [ToggleVoteProvider, useToggleVote] =
  createActionContext<ToggleVoteFn>("useToggleVote");
