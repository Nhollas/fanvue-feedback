import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { changelogEntries, changelogFeedback, feedback } from "@/db/schema";
import { isValidUuid } from "@/lib/uuid";

import { ChangelogDetail } from "./changelog-detail";

async function getChangelogDetail(id: string) {
  "use cache";
  cacheTag(`changelog-${id}`);
  cacheLife("minutes");

  const [entryResult, linkedFeedback] = await Promise.all([
    db
      .select()
      .from(changelogEntries)
      .where(eq(changelogEntries.id, id))
      .limit(1),
    db
      .select({
        feedbackId: feedback.id,
        feedbackTitle: feedback.title,
      })
      .from(changelogFeedback)
      .innerJoin(feedback, eq(changelogFeedback.feedbackId, feedback.id))
      .where(eq(changelogFeedback.changelogEntryId, id)),
  ]);

  return { entryResult, linkedFeedback };
}

export async function ChangelogDetailContent({ id }: { id: string }) {
  if (!isValidUuid(id)) {
    notFound();
  }

  const { entryResult, linkedFeedback } = await getChangelogDetail(id);

  const [entry] = entryResult;

  if (!entry) {
    notFound();
  }

  return <ChangelogDetail entry={entry} linkedFeedback={linkedFeedback} />;
}
