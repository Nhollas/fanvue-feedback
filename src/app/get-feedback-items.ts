import { and, desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { type Feedback, feedback } from "@/db/schema";
import type { ParsedFeedSearchParams } from "@/lib/search-params";
import { trendingScoreSql } from "@/lib/trending";

const PAGE_SIZE = 10;

export type FeedData = {
  items: Feedback[];
  filtered: boolean;
  currentPage: number;
  totalPages: number;
};

export async function getFeedbackItems(
  params: ParsedFeedSearchParams,
): Promise<FeedData> {
  "use cache: remote";
  cacheTag("feedback-list");
  cacheLife("minutes");

  const { status, category, search, sort, page: currentPage } = params;

  const conditions = [];

  if (status !== "all") {
    conditions.push(eq(feedback.status, status));
  }

  if (category !== "all") {
    conditions.push(eq(feedback.category, category));
  }

  if (search) {
    conditions.push(
      sql`to_tsvector('english', ${feedback.title} || ' ' || ${feedback.description}) @@ plainto_tsquery('english', ${search})`,
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderClause =
    sort === "newest"
      ? desc(feedback.createdAt)
      : sort === "most_voted"
        ? desc(feedback.voteCount)
        : sql`${trendingScoreSql()} DESC`;

  const [countResult, items] = await Promise.all([
    db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(feedback)
      .where(whereClause),
    db
      .select()
      .from(feedback)
      .where(whereClause)
      .orderBy(orderClause)
      .limit(PAGE_SIZE)
      .offset((currentPage - 1) * PAGE_SIZE),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil((countResult[0]?.count ?? 0) / PAGE_SIZE),
  );

  return {
    items,
    filtered: conditions.length > 0,
    currentPage: Math.min(currentPage, totalPages),
    totalPages,
  };
}
