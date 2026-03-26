"use client";

import type { AddCommentState } from "@/actions/add-comment";

import { createActionContext } from "./create-action-context";

export type AddCommentFn = (
  feedbackId: string,
  prevState: AddCommentState,
  formData: FormData,
) => Promise<AddCommentState>;

export const [AddCommentProvider, useAddComment] =
  createActionContext<AddCommentFn>("useAddComment");
