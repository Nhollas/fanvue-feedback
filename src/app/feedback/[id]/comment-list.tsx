import { RelativeTime } from "@/components/relative-time";
import type { Comment } from "@/db/schema";

export function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-text-secondary py-4">
        No comments yet. Be the first to share your thoughts.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-white/10">
      {comments.map((comment) => (
        <li key={comment.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-medium">{comment.authorName}</span>
            <RelativeTime
              date={comment.createdAt}
              className="text-xs text-text-tertiary"
            />
          </div>
          <p className="text-sm text-text-secondary whitespace-pre-line">
            {comment.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
