import { Suspense } from "react";

import { toggleVote } from "@/actions/vote";
import { ToggleVoteProvider } from "@/contexts/toggle-vote";
import { loadFeedSearchParams } from "@/lib/search-params";

import { FeedList, FeedPageView } from "./feed-page-view";
import { FeedbackListSkeleton } from "./feedback-list-skeleton";
import { getFeedbackItems } from "./get-feedback-items";

export default function Page({ searchParams }: PageProps<"/">) {
  return (
    <ToggleVoteProvider value={toggleVote}>
      <FeedPageView>
        <Suspense fallback={<FeedbackListSkeleton />}>
          <FeedContent searchParams={searchParams} />
        </Suspense>
      </FeedPageView>
    </ToggleVoteProvider>
  );
}

async function FeedContent({
  searchParams,
}: {
  searchParams: PageProps<"/">["searchParams"];
}) {
  const raw = await searchParams;
  const qs = new URLSearchParams(
    Object.entries(raw).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  ).toString();
  const returnTo = qs ? `/?${qs}` : undefined;

  const params = await loadFeedSearchParams(searchParams);
  const data = await getFeedbackItems(params);
  return <FeedList {...data} returnTo={returnTo} />;
}
