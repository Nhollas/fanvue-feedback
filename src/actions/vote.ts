"use server";

import { and, eq, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { feedback, votes } from "@/db/schema";

const toggleVoteSchema = z.object({
  feedbackId: z.uuid("Invalid feedback ID"),
  voterIdentifier: z.uuid("Invalid voter identifier"),
});

export async function toggleVote(
  feedbackId: string,
  voterIdentifier: string,
): Promise<{ voted: boolean; voteCount: number }> {
  const { data, error } = toggleVoteSchema.safeParse({
    feedbackId,
    voterIdentifier,
  });

  if (error) {
    throw new Error(error.issues[0]?.message ?? "Validation failed");
  }

  const result = await db.transaction(async (tx) => {
    const [existingVote] = await tx
      .select()
      .from(votes)
      .where(
        and(
          eq(votes.feedbackId, data.feedbackId),
          eq(votes.voterIdentifier, data.voterIdentifier),
        ),
      )
      .limit(1);

    if (existingVote) {
      await tx
        .delete(votes)
        .where(
          and(
            eq(votes.feedbackId, data.feedbackId),
            eq(votes.voterIdentifier, data.voterIdentifier),
          ),
        );
      const [updated] = await tx
        .update(feedback)
        .set({ voteCount: sql`${feedback.voteCount} - 1` })
        .where(eq(feedback.id, data.feedbackId))
        .returning({ voteCount: feedback.voteCount });
      if (!updated) throw new Error("Feedback not found");
      return { voted: false, voteCount: updated.voteCount };
    }

    await tx.insert(votes).values({
      feedbackId: data.feedbackId,
      voterIdentifier: data.voterIdentifier,
    });
    const [updated] = await tx
      .update(feedback)
      .set({ voteCount: sql`${feedback.voteCount} + 1` })
      .where(eq(feedback.id, data.feedbackId))
      .returning({ voteCount: feedback.voteCount });
    if (!updated) throw new Error("Feedback not found");
    return { voted: true, voteCount: updated.voteCount };
  });

  updateTag("feedback-list");
  updateTag(`feedback-${data.feedbackId}`);

  return result;
}
