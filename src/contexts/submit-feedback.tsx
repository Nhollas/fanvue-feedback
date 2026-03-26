"use client";

import type { SubmitFeedbackState } from "@/actions/submit-feedback";

import { createActionContext } from "./create-action-context";

export type SubmitFeedbackFn = (
  prevState: SubmitFeedbackState,
  formData: FormData,
) => Promise<SubmitFeedbackState>;

export const [SubmitFeedbackProvider, useSubmitFeedback] =
  createActionContext<SubmitFeedbackFn>("useSubmitFeedback");
