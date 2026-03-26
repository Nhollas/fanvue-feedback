import { z } from "zod";

export const similarFeedbackItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum([
    "requested",
    "under_review",
    "planned",
    "in_progress",
    "completed",
    "rejected",
  ]),
  voteCount: z.number(),
  similarity: z.number(),
});

export const similarFeedbackResponseSchema = z.array(similarFeedbackItemSchema);

export type SimilarFeedbackItem = z.infer<typeof similarFeedbackItemSchema>;
