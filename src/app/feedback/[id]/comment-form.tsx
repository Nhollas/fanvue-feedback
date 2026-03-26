"use client";

import { Button, TextArea, TextField } from "@fanvue/ui";
import { useActionState, useId } from "react";
import type { AddCommentState } from "@/actions/add-comment";
import { useAddComment } from "@/contexts/add-comment";

const initialState: AddCommentState = {};

export function CommentForm({ feedbackId }: { feedbackId: string }) {
  const id = useId();
  const addComment = useAddComment();
  const boundAction = addComment.bind(null, feedbackId);
  const [state, formAction, pending] = useActionState(
    boundAction,
    initialState,
  );

  const formKey = `${id}-${state.submissionCount ?? 0}`;

  return (
    <form action={formAction} key={formKey} className="flex flex-col gap-4">
      <TextField
        name="authorName"
        label="Name"
        placeholder="Your name"
        required
        maxLength={100}
        fullWidth
        defaultValue={state.values?.authorName}
        error={!!state.errors?.authorName}
        {...(state.errors?.authorName != null && {
          errorMessage: state.errors.authorName,
        })}
      />

      <TextArea
        name="content"
        label="Comment"
        placeholder="Write a comment..."
        required
        rows={3}
        maxLength={2000}
        fullWidth
        defaultValue={state.values?.content}
        error={!!state.errors?.content}
        {...(state.errors?.content != null && {
          errorMessage: state.errors.content,
        })}
      />

      <Button
        type="submit"
        variant="brand"
        disabled={pending}
        className="self-start"
      >
        {pending ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
}
