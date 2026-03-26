import { HttpResponse, http } from "msw";
import { describe, vi } from "vitest";
import type { SubmitFeedbackState } from "@/actions/submit-feedback";
import { browserWorker, withJsonBody } from "../../../../tests/support/msw";
import { expect, test } from "./submit-feedback-fixture";

describe("SubmitFeedbackForm", () => {
  test("renders title, description, category fields and submit button", async ({
    submitFeedbackForm,
  }) => {
    const form = await submitFeedbackForm.mount();

    await form.expectTitleFieldVisible();
    await form.expectDescriptionFieldVisible();
    await form.expectCategoryFieldVisible();
    await form.expectSubmitButtonVisible();
    await form.expectSubmitButtonText("Submit");
  });

  test("displays category validation error from server action", async ({
    submitFeedbackForm,
  }) => {
    const errorState: SubmitFeedbackState = {
      errors: { category: "Category is required" },
      values: { title: "Test title", description: "" },
    };

    const submitFeedback = vi.fn().mockResolvedValueOnce(errorState);

    const form = await submitFeedbackForm.mount({ submitFeedback });
    await form.fillTitle("Test title");
    await form.fillDescription("Some description");
    await form.submit();

    await form.expectErrorVisible("Category is required");
  });

  test("displays title validation error from server action", async ({
    submitFeedbackForm,
  }) => {
    const errorState: SubmitFeedbackState = {
      errors: { title: "Title is required" },
      values: { title: "", description: "" },
    };

    const submitFeedback = vi.fn().mockResolvedValueOnce(errorState);

    const form = await submitFeedbackForm.mount({ submitFeedback });
    // Fill with whitespace to bypass browser required validation;
    // server trims and rejects empty titles
    await form.fillTitle("   ");
    await form.fillDescription("Some description");
    await form.submit();

    await form.expectErrorVisible("Title is required");
  });

  test("preserves field values on validation error", async ({
    submitFeedbackForm,
  }) => {
    const errorState: SubmitFeedbackState = {
      errors: { category: "Category is required" },
      values: {
        title: "My feedback title",
        description: "Some description",
      },
    };

    const submitFeedback = vi.fn().mockResolvedValueOnce(errorState);

    const form = await submitFeedbackForm.mount({ submitFeedback });
    await form.fillTitle("My feedback title");
    await form.fillDescription("Some description");
    await form.submit();

    await expect.element(form.getTitle()).toHaveValue("My feedback title");
    await expect.element(form.getDescription()).toHaveValue("Some description");
  });

  test("calls submitFeedback action with form data on submit", async ({
    submitFeedbackForm,
  }) => {
    const submitFeedback = vi.fn().mockResolvedValueOnce({});

    const form = await submitFeedbackForm.mount({ submitFeedback });
    await form.fillTitle("New feature request");
    await form.fillDescription("Please add this feature");
    await form.selectCategory("Creator");
    await form.submit();

    expect(submitFeedback).toHaveBeenCalledTimes(1);
    const formData = submitFeedback.mock.calls[0]?.[1] as FormData;
    expect(formData.get("title")).toBe("New feature request");
    expect(formData.get("description")).toBe("Please add this feature");
    expect(formData.get("category")).toBe("creator");
  });

  test("recovers from validation error on resubmit", async ({
    submitFeedbackForm,
  }) => {
    const submitFeedback = vi
      .fn()
      .mockResolvedValueOnce({
        errors: { category: "Category is required" },
        values: { title: "My idea", description: "Details here" },
        submissionCount: 1,
      } satisfies SubmitFeedbackState)
      .mockResolvedValueOnce({ submissionCount: 2 });

    const form = await submitFeedbackForm.mount({ submitFeedback });
    await form.fillTitle("My idea");
    await form.fillDescription("Details here");
    await form.submit();

    await form.expectErrorVisible("Category is required");

    await form.selectCategory("Creator");
    await form.submit();

    expect(submitFeedback).toHaveBeenCalledTimes(2);
    await form.expectErrorHidden("Category is required");
  });

  test("disables submit button and shows pending text while submitting", async ({
    submitFeedbackForm,
  }) => {
    let resolveSubmit!: (value: SubmitFeedbackState) => void;
    const submitFeedback = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<SubmitFeedbackState>(
            (resolve) => (resolveSubmit = resolve),
          ),
      );

    const form = await submitFeedbackForm.mount({ submitFeedback });
    await form.fillTitle("My idea");
    await form.fillDescription("Details");
    await form.selectCategory("Creator");
    await form.submit();

    await form.expectSubmitButtonDisabled();
    await form.expectSubmitButtonText("Submitting...");

    resolveSubmit({});

    await form.expectSubmitButtonEnabled();
    await form.expectSubmitButtonText("Submit");
  });
});

describe("SubmitFeedbackForm with duplicate detection", () => {
  test("shows similar suggestions after title blur without needing description", async ({
    submitFeedbackForm,
  }) => {
    browserWorker.use(
      http.post(
        "/api/feedback/similar",
        withJsonBody({ title: "dark mode for DMs", description: "" }, () => {
          return HttpResponse.json([
            {
              id: "def-456",
              title: "Add dark theme to messages",
              description:
                "It would be great to have a dark theme option for the messaging interface",
              status: "planned",
              voteCount: 150,
              similarity: 0.92,
            },
          ]);
        }),
      ),
    );

    const form = await submitFeedbackForm.mount({ duplicateDetection: true });
    await form.fillTitle("dark mode for DMs");
    await form.blurTitle();

    await form.expectSuggestionsVisible();
    await form.expectSuggestionLinkVisible("Add dark theme to messages");
    await form.expectDismissButtonVisible();
  });

  test("dismisses suggestions and allows normal submission", async ({
    submitFeedbackForm,
  }) => {
    browserWorker.use(
      http.post(
        "/api/feedback/similar",
        withJsonBody(
          {
            title: "dark mode for DMs",
            description: "I want dark mode in messages",
          },
          () => {
            return HttpResponse.json([
              {
                id: "def-456",
                title: "Add dark theme to messages",
                description:
                  "It would be great to have a dark theme option for the messaging interface",
                status: "planned",
                voteCount: 150,
                similarity: 0.88,
              },
            ]);
          },
        ),
      ),
    );

    const submitFeedback = vi.fn().mockResolvedValueOnce({});

    const form = await submitFeedbackForm.mount({
      duplicateDetection: true,
      submitFeedback,
    });
    await form.fillTitle("dark mode for DMs");
    await form.fillDescription("I want dark mode in messages");
    await form.blurDescription();

    await form.expectSuggestionsVisible();
    await form.clickDismiss();
    await form.expectSuggestionsHidden();

    await form.selectCategory("Fan");
    await form.submit();

    expect(submitFeedback).toHaveBeenCalled();
  });

  test("does not show suggestions when duplicate detection is disabled", async ({
    submitFeedbackForm,
  }) => {
    const form = await submitFeedbackForm.mount({ duplicateDetection: false });
    await form.fillTitle("dark mode");
    await form.fillDescription("I want dark mode");
    await form.blurDescription();

    await form.expectSuggestionsHidden();
  });
});
