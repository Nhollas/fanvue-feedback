import { addComment } from "@/actions/add-comment";
import { toggleVote } from "@/actions/vote";
import { AddCommentProvider } from "@/contexts/add-comment";
import { ToggleVoteProvider } from "@/contexts/toggle-vote";
import { db } from "@/db";
import { feedback } from "@/db/schema";

import { FeedbackDetailContent } from "./feedback-detail-content";

export async function generateStaticParams() {
  const items = await db.select({ id: feedback.id }).from(feedback);
  return items.map(({ id }) => ({ id }));
}

export default async function FeedbackDetailPage(
  props: PageProps<"/feedback/[id]">,
) {
  const { id } = await props.params;

  return (
    <ToggleVoteProvider value={toggleVote}>
      <AddCommentProvider value={addComment}>
        <FeedbackDetailContent id={id} />
      </AddCommentProvider>
    </ToggleVoteProvider>
  );
}
