/**
 * Computes a trending score for a feedback item.
 *
 * Formula: vote_count / hours_since_posted ^ decay_factor
 *
 * Newer items with votes rank higher than older items with the
 * same total count, because the denominator grows over time.
 */

import { type SQL, sql } from "drizzle-orm";

const DECAY_FACTOR = 1.5;

export function trendingScore(
  voteCount: number,
  createdAt: Date,
  now: Date = new Date(),
): number {
  const hoursSincePosted = Math.max(
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60),
    1,
  );

  return voteCount / hoursSincePosted ** DECAY_FACTOR;
}

/**
 * SQL expression for trending score, computed at query time.
 *
 * The formula: vote_count / POWER(GREATEST(hours_since_posted, 1), 1.5)
 */
export function trendingScoreSql(): SQL {
  return sql`vote_count::float / POWER(GREATEST(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600, 1), ${DECAY_FACTOR})`;
}
