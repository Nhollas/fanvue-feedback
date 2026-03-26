"use client";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  TextArea,
  TextField,
} from "@fanvue/ui";
import { startTransition, useActionState, useId } from "react";
import type { SubmitFeedbackState } from "@/actions/submit-feedback";
import { useSubmitFeedback } from "@/contexts/submit-feedback";
import { useDuplicateDetection } from "@/hooks/use-duplicate-detection";
import { DuplicateSuggestions } from "./duplicate-suggestions";

const initialState: SubmitFeedbackState = {};

export function SubmitFeedbackForm({
  duplicateDetection = false,
}: {
  duplicateDetection?: boolean;
}) {
  const id = useId();
  const submitFeedback = useSubmitFeedback();
  const [state, formAction, pending] = useActionState(
    submitFeedback,
    initialState,
  );
  const {
    suggestions,
    isSearching,
    onTitleChange,
    onDescriptionChange,
    onFieldBlur,
    dismissSuggestions,
    clearSuggestions,
  } = useDuplicateDetection(duplicateDetection);

  // Force remount on each submission so defaultValue applies to fresh inputs
  const formKey = `${id}-${state.submissionCount ?? 0}`;

  function handleSubmit(formData: FormData) {
    clearSuggestions();
    startTransition(() => formAction(formData));
  }

  return (
    <>
      {duplicateDetection && suggestions.length > 0 && (
        <DuplicateSuggestions
          items={suggestions}
          heading="Similar feedback already exists"
          description="These existing items look similar. You can vote on them instead, or continue submitting."
          onDismissAction={dismissSuggestions}
        />
      )}

      <div className="rounded-xl bg-surface p-6 sm:p-8">
        <form
          action={handleSubmit}
          key={formKey}
          className="flex flex-col gap-8"
        >
          <TextField
            name="title"
            label="Title"
            placeholder="Short, descriptive title for your feedback"
            required
            maxLength={200}
            fullWidth
            defaultValue={state.values?.title}
            error={!!state.errors?.title}
            {...(state.errors?.title != null && {
              errorMessage: state.errors.title,
            })}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={onFieldBlur}
          />

          <TextArea
            name="description"
            label="Description"
            placeholder="Describe your feedback in detail..."
            required
            rows={5}
            maxLength={2000}
            fullWidth
            defaultValue={state.values?.description}
            error={!!state.errors?.description}
            {...(state.errors?.description != null && {
              errorMessage: state.errors.description,
            })}
            onChange={(e) => onDescriptionChange(e.target.value)}
            onBlur={onFieldBlur}
          />

          <Select
            name="category"
            label="Category"
            placeholder="Select a category"
            fullWidth
            {...(state.values?.category != null && {
              defaultValue: state.values.category,
            })}
            error={!!state.errors?.category}
            {...(state.errors?.category != null && {
              errorMessage: state.errors.category,
            })}
          >
            <SelectContent>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="fan">Fan</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="submit"
            variant="brand"
            disabled={pending}
            className="self-start"
          >
            {pending ? "Submitting..." : "Submit"}
          </Button>

          {isSearching && (
            <span className="sr-only" aria-live="polite">
              Searching for similar feedback...
            </span>
          )}
        </form>
      </div>
    </>
  );
}
