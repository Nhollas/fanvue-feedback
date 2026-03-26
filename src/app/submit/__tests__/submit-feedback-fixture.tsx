import { test as base, expect } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { SubmitFeedbackForm } from "@/app/submit/submit-feedback-form";
import type { SubmitFeedbackFn } from "@/contexts/submit-feedback";
import { SubmitFeedbackProvider } from "@/contexts/submit-feedback";
import { noopSubmitFeedback } from "../../../../tests/support/stubs";
import { submitFeedbackPageObject } from "./submit-feedback-page-object";

export { expect };

export const test = base.extend("submitFeedbackForm", async () => ({
  async mount(options?: {
    duplicateDetection?: boolean;
    submitFeedback?: SubmitFeedbackFn;
  }) {
    const action = options?.submitFeedback ?? noopSubmitFeedback;
    await render(
      <SubmitFeedbackProvider value={action}>
        <SubmitFeedbackForm
          duplicateDetection={options?.duplicateDetection ?? false}
        />
      </SubmitFeedbackProvider>,
    );
    return submitFeedbackPageObject(page);
  },
}));
