"use client";

import { Button, ChevronUpIcon } from "@fanvue/ui";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { useToggleVote } from "@/contexts/toggle-vote";
import { formatCount } from "@/lib/format-count";
import {
  addVotedId,
  getVoterIdentifier,
  hasVotedFor,
  removeVotedId,
} from "@/lib/voter-id";

type VoteButtonProps = {
  feedbackId: string;
  initialCount: number;
};

export function VoteButton({ feedbackId, initialCount }: VoteButtonProps) {
  const toggleVote = useToggleVote();
  const [state, setState] = useState({
    count: initialCount,
    hasVoted: false,
  });

  useEffect(() => {
    setState({ count: initialCount, hasVoted: hasVotedFor(feedbackId) });
  }, [initialCount, feedbackId]);

  const [, startTransition] = useTransition();

  const [optimistic, setOptimistic] = useOptimistic(state);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      setOptimistic({
        count: state.hasVoted ? state.count - 1 : state.count + 1,
        hasVoted: !state.hasVoted,
      });
      try {
        const voterId = getVoterIdentifier();
        const result = await toggleVote(feedbackId, voterId);
        if (result.voted) {
          addVotedId(feedbackId);
        } else {
          removeVotedId(feedbackId);
        }
        setState({ count: result.voteCount, hasVoted: result.voted });
      } catch {
        // Transition ends without setState, so useOptimistic auto-reverts
      }
    });
  };

  return (
    <Button
      className="flex-col rounded-md w-11 shrink-0 h-max px-2 py-2 pb-3.25 gap-0 [&_svg]:size-6!"
      leftIcon={<ChevronUpIcon />}
      variant={optimistic.hasVoted ? "brand" : "white"}
      onClick={handleClick}
      aria-pressed={optimistic.hasVoted}
      aria-label={`${formatCount(optimistic.count)} votes`}
    >
      <span className="text-xs font-bold tabular-nums">
        {formatCount(optimistic.count)}
      </span>
    </Button>
  );
}
