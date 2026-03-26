import { desc, eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { changelogEntries, changelogFeedback, feedback } from "@/db/schema";
import { ChangelogList } from "./changelog-list";

async function getChangelogEntries() {
  "use cache";
  cacheTag("changelog-list");
  cacheLife("minutes");

  const entries = await db
    .select()
    .from(changelogEntries)
    .orderBy(desc(changelogEntries.publishedAt));

  const entryIds = entries.map((e) => e.id);

  const linkedFeedback =
    entryIds.length > 0
      ? await db
          .select({
            changelogEntryId: changelogFeedback.changelogEntryId,
            feedbackId: feedback.id,
            feedbackTitle: feedback.title,
          })
          .from(changelogFeedback)
          .innerJoin(feedback, eq(changelogFeedback.feedbackId, feedback.id))
          .where(inArray(changelogFeedback.changelogEntryId, entryIds))
      : [];

  const feedbackByEntry = new Map<string, { id: string; title: string }[]>();

  for (const row of linkedFeedback) {
    const existing = feedbackByEntry.get(row.changelogEntryId) ?? [];
    existing.push({ id: row.feedbackId, title: row.feedbackTitle });
    feedbackByEntry.set(row.changelogEntryId, existing);
  }

  return entries.map((entry) => ({
    ...entry,
    feedbackItems: feedbackByEntry.get(entry.id) ?? [],
  }));
}

export async function ChangelogListContent() {
  const entriesWithFeedback = await getChangelogEntries();
  return <ChangelogList entries={entriesWithFeedback} />;
}
