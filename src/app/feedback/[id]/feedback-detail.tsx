import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ArrowUpRightIcon,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  ChevronDownIcon,
  Divider,
} from "@fanvue/ui";
import Link from "next/link";
import { Suspense } from "react";
import { CategoryBadge } from "@/components/category-badge";
import { RelativeTime } from "@/components/relative-time";
import { StatusBadge } from "@/components/status-badge";
import { VoteButton } from "@/components/vote-button";
import type { Comment, Feedback, StatusChange } from "@/db/schema";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { StatusTimeline } from "./status-timeline";

export type LinkedChangelogEntry = {
  id: string;
  title: string;
  publishedAt: Date;
};

export type FeedbackDetailProps = {
  item: Feedback;
  comments?: Comment[] | undefined;
  statusChanges?: StatusChange[] | undefined;
  changelogEntry?: LinkedChangelogEntry | undefined;
};

export function FeedbackDetail({
  item,
  comments = [],
  statusChanges = [],
  changelogEntry,
}: FeedbackDetailProps) {
  return (
    <>
      <Card className="overflow-visible">
        <div className="flex flex-row gap-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <CardHeader>
              <h1 className="typography-semibold-body-lg text-content-primary">
                {item.title}
              </h1>
            </CardHeader>
            <CardContent>
              <CardDescription>{item.description}</CardDescription>
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
          <div className="flex flex-col items-center gap-2">
            <VoteButton feedbackId={item.id} initialCount={item.voteCount} />
            {changelogEntry && (
              <Link
                href={`/changelog/${changelogEntry.id}`}
                className="flex items-center gap-0.5 text-xs font-medium text-accent transition-opacity hover:opacity-80"
              >
                Shipped
                <ArrowUpRightIcon className="size-3" />
              </Link>
            )}
          </div>
        </div>
        {statusChanges.length > 0 && (
          <Accordion type="single" collapsible className="space-y-0">
            <AccordionItem
              value="status-history"
              className="rounded-none border-none bg-transparent"
            >
              <AccordionTrigger
                className="rounded-none p-0 pt-4 hover:bg-transparent"
                icon={<ChevronDownIcon className="size-6 text-white/50" />}
              >
                Status History ({statusChanges.length})
              </AccordionTrigger>
              <AccordionContent noPadding className="pb-0">
                <div className="pt-4">
                  <StatusTimeline statusChanges={statusChanges} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </Card>

      <section aria-labelledby="comments-heading">
        <Card>
          <CardHeader>
            <h2
              className="typography-semibold-body-lg text-content-primary"
              id="comments-heading"
            >
              Comments ({comments.length})
            </h2>
          </CardHeader>
          <CardContent>
            <CommentList comments={comments} />
            <Divider />
            <Suspense>
              <CommentForm feedbackId={item.id} />
            </Suspense>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
