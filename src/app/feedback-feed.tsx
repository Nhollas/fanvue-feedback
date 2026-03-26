import type { Feedback } from "@/db/schema";
import { FeedbackCard } from "./feedback-card";

type FeedbackFeedProps = {
  items: Feedback[];
  filtered?: boolean;
  returnTo?: string | undefined;
};

export function FeedbackFeed({
  items,
  filtered = false,
  returnTo,
}: FeedbackFeedProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border-subtle bg-surface py-16 text-center">
        <p className="text-lg font-medium text-text-primary">
          {filtered ? "No matching feedback" : "No feedback yet"}
        </p>
        <p className="text-sm text-text-secondary">
          {filtered
            ? "Try adjusting your filters or search terms."
            : "Be the first to share an idea."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <FeedbackCard key={item.id} item={item} returnTo={returnTo} />
      ))}
    </div>
  );
}
