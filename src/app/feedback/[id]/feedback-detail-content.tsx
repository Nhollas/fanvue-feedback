import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/db";
import {
  changelogEntries,
  changelogFeedback,
  comments,
  feedback,
  statusChanges,
} from "@/db/schema";
import { isValidUuid } from "@/lib/uuid";
import { FeedbackBackButton } from "./feedback-back-button";
import { FeedbackDetail } from "./feedback-detail";

async function getFeedbackItem(id: string) {
  "use cache";
  cacheTag(`feedback-${id}`);
  cacheLife("minutes");

  return db.select().from(feedback).where(eq(feedback.id, id)).limit(1);
}

async function getFeedbackComments(id: string) {
  "use cache";
  cacheTag(`feedback-comments-${id}`);
  cacheLife("minutes");

  return db
    .select()
    .from(comments)
    .where(eq(comments.feedbackId, id))
    .orderBy(asc(comments.createdAt));
}

async function getFeedbackStatusChanges(id: string) {
  "use cache";
  cacheTag(`feedback-status-${id}`);
  cacheLife("minutes");

  return db
    .select()
    .from(statusChanges)
    .where(eq(statusChanges.feedbackId, id))
    .orderBy(asc(statusChanges.changedAt));
}

async function getLinkedChangelog(id: string) {
  "use cache";
  cacheTag(`feedback-changelog-${id}`);
  cacheLife("minutes");

  return db
    .select({
      id: changelogEntries.id,
      title: changelogEntries.title,
      publishedAt: changelogEntries.publishedAt,
    })
    .from(changelogFeedback)
    .innerJoin(
      changelogEntries,
      eq(changelogFeedback.changelogEntryId, changelogEntries.id),
    )
    .where(eq(changelogFeedback.feedbackId, id))
    .limit(1);
}

export async function FeedbackDetailContent({ id }: { id: string }) {
  if (!isValidUuid(id)) {
    notFound();
  }

  const [feedbackResult, itemComments, itemStatusChanges, linkedChangelog] =
    await Promise.all([
      getFeedbackItem(id),
      getFeedbackComments(id),
      getFeedbackStatusChanges(id),
      getLinkedChangelog(id),
    ]);

  const [item] = feedbackResult;

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Suspense>
        <FeedbackBackButton />
      </Suspense>

      <FeedbackDetail
        item={item}
        comments={itemComments}
        statusChanges={itemStatusChanges}
        changelogEntry={linkedChangelog[0]}
      />
    </div>
  );
}
