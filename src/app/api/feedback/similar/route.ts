import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { feedback, feedbackEmbeddings } from "@/db/schema";
import { embedTexts } from "@/lib/embed-text";
import type { SimilarFeedbackItem } from "./schema";

const SIMILARITY_THRESHOLD = 0.75;

const requestSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).default(""),
});

export async function POST(request: Request) {
  const body = requestSchema.safeParse(await request.json());

  if (!body.success) {
    return Response.json([]);
  }

  const { title, description } = body.data;
  const hasDescription = description.length > 0;

  let embeddings: number[][];
  try {
    const textsToEmbed = hasDescription ? [title, description] : [title];
    embeddings = await embedTexts(textsToEmbed);
  } catch {
    return Response.json([]);
  }

  const titleEmbedding = embeddings[0];
  if (!titleEmbedding) return Response.json([]);
  const titleVec = `[${titleEmbedding.join(",")}]`;

  if (hasDescription) {
    const descEmbedding = embeddings[1];
    if (!descEmbedding) return Response.json([]);
    const descVec = `[${descEmbedding.join(",")}]`;

    const titleSim = sql<number>`1 - (${feedbackEmbeddings.titleEmbedding} <=> ${titleVec}::vector)`;
    const descSim = sql<number>`1 - (${feedbackEmbeddings.descriptionEmbedding} <=> ${descVec}::vector)`;
    const bestSim = sql<number>`GREATEST(${titleSim}, ${descSim})`;

    const results = await db
      .select({
        id: feedback.id,
        title: feedback.title,
        description: feedback.description,
        status: feedback.status,
        voteCount: feedback.voteCount,
        similarity: bestSim.as("similarity"),
      })
      .from(feedbackEmbeddings)
      .innerJoin(feedback, eq(feedbackEmbeddings.feedbackId, feedback.id))
      .where(sql`${bestSim} > ${SIMILARITY_THRESHOLD}`)
      .orderBy(sql`${bestSim} DESC`)
      .limit(5);

    return Response.json(results satisfies SimilarFeedbackItem[]);
  }

  // Title-only search
  const titleSim = sql<number>`1 - (${feedbackEmbeddings.titleEmbedding} <=> ${titleVec}::vector)`;

  const results = await db
    .select({
      id: feedback.id,
      title: feedback.title,
      description: feedback.description,
      status: feedback.status,
      voteCount: feedback.voteCount,
      similarity: titleSim.as("similarity"),
    })
    .from(feedbackEmbeddings)
    .innerJoin(feedback, eq(feedbackEmbeddings.feedbackId, feedback.id))
    .where(sql`${titleSim} > ${SIMILARITY_THRESHOLD}`)
    .orderBy(sql`${titleSim} DESC`)
    .limit(5);

  return Response.json(results satisfies SimilarFeedbackItem[]);
}
