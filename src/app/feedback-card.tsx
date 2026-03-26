import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@fanvue/ui";
import Link from "next/link";
import { CategoryBadge } from "@/components/category-badge";
import { RelativeTime } from "@/components/relative-time";
import { StatusBadge } from "@/components/status-badge";
import { VoteButton } from "@/components/vote-button";
import type { Feedback } from "@/db/schema";

export function FeedbackCard({
  item,
  returnTo,
}: {
  item: Feedback;
  returnTo?: string | undefined;
}) {
  const href = returnTo
    ? `/feedback/${item.id}?returnTo=${encodeURIComponent(returnTo)}`
    : `/feedback/${item.id}`;

  return (
    <Card
      role="article"
      aria-label={item.title}
      className="relative flex-row gap-4 has-[>a:focus-visible]:ring-2 has-[>a:focus-visible]:ring-secondary has-[>a:focus-visible]:ring-offset-2 has-[>a:focus-visible]:ring-offset-page"
    >
      <Link
        href={href}
        className="absolute inset-0 rounded-md focus-visible:outline-none"
        aria-label={item.title}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <CardHeader>
          <h2 className="typography-semibold-body-lg text-content-primary line-clamp-1">
            {item.title}
          </h2>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2">
            {item.description}
          </CardDescription>
        </CardContent>
        <CardFooter>
          <CategoryBadge category={item.category} />
          <StatusBadge status={item.status} />
          <RelativeTime
            date={item.createdAt}
            className="text-sm text-white/40"
          />
        </CardFooter>
      </div>
      <div className="relative z-10">
        <VoteButton feedbackId={item.id} initialCount={item.voteCount} />
      </div>
    </Card>
  );
}
