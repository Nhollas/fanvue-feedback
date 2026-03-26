"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { feedback, feedbackEmbeddings } from "@/db/schema";
import { embedTexts } from "@/lib/embed-text";

export type SubmitFeedbackState = {
  errors?: {
    title?: string | undefined;
    description?: string | undefined;
    category?: string | undefined;
  };
  values?: {
    title?: string | undefined;
    description?: string | undefined;
    category?: string | undefined;
  };
  submissionCount?: number;
};

const submitFeedbackSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description must be 2,000 characters or fewer"),
  category: z.enum(["creator", "fan"], {
    error: "Category is required",
  }),
});

export async function submitFeedback(
  prevState: SubmitFeedbackState,
  formData: FormData,
): Promise<SubmitFeedbackState> {
  const submissionCount = (prevState.submissionCount ?? 0) + 1;

  const result = submitFeedbackSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    category: formData.get("category"),
  });

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    return {
      errors: {
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
        category: fieldErrors.category?.[0],
      },
      values: {
        title: formData.get("title")?.toString(),
        description: formData.get("description")?.toString(),
        category: formData.get("category")?.toString(),
      },
      submissionCount,
    };
  }

  let createdId: string;

  try {
    const [created] = await db
      .insert(feedback)
      .values(result.data)
      .returning({ id: feedback.id });

    if (!created) {
      throw new Error("Failed to create feedback");
    }

    createdId = created.id;
  } catch {
    return {
      errors: { title: "Something went wrong. Please try again." },
      values: result.data,
      submissionCount,
    };
  }

  after(() =>
    generateEmbedding(createdId, result.data.title, result.data.description),
  );

  revalidateTag("feedback-list", "max");
  redirect(`/feedback/${createdId}`);
}

async function generateEmbedding(
  feedbackId: string,
  title: string,
  description: string,
) {
  try {
    const [titleEmbedding, descriptionEmbedding] = await embedTexts([
      title,
      description,
    ]);

    await db
      .insert(feedbackEmbeddings)
      .values({ feedbackId, titleEmbedding, descriptionEmbedding })
      .onConflictDoUpdate({
        target: feedbackEmbeddings.feedbackId,
        set: { titleEmbedding, descriptionEmbedding },
      });
  } catch (error) {
    console.error("Failed to generate embedding:", error);
  }
}
