"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { comments } from "@/db/schema";

export type AddCommentState = {
  errors?: {
    authorName?: string | undefined;
    content?: string | undefined;
  };
  values?: {
    authorName?: string | undefined;
    content?: string | undefined;
  };
  submissionCount?: number;
};

const addCommentSchema = z.object({
  feedbackId: z.uuid("Invalid feedback ID"),
  authorName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  content: z
    .string()
    .trim()
    .min(1, "Comment is required")
    .max(2000, "Comment must be 2,000 characters or fewer"),
});

export async function addComment(
  feedbackId: string,
  prevState: AddCommentState,
  formData: FormData,
): Promise<AddCommentState> {
  const submissionCount = (prevState.submissionCount ?? 0) + 1;

  const result = addCommentSchema.safeParse({
    feedbackId,
    authorName: formData.get("authorName"),
    content: formData.get("content"),
  });

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    return {
      errors: {
        authorName: fieldErrors.authorName?.[0],
        content: fieldErrors.content?.[0],
      },
      values: {
        authorName: formData.get("authorName")?.toString(),
        content: formData.get("content")?.toString(),
      },
      submissionCount,
    };
  }

  try {
    await db.insert(comments).values(result.data);
  } catch {
    return {
      errors: { content: "Something went wrong. Please try again." },
      values: {
        authorName: result.data.authorName,
        content: result.data.content,
      },
      submissionCount,
    };
  }

  updateTag(`feedback-comments-${feedbackId}`);
  return { submissionCount };
}
