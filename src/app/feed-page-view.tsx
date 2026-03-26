import { Button, PlusIcon } from "@fanvue/ui";
import Link from "next/link";
import { Suspense } from "react";
import { Pagination } from "@/components/pagination";
import { FeedFilters } from "./feed-filters";
import { FeedbackFeed } from "./feedback-feed";
import type { FeedData } from "./get-feedback-items";

export function FeedPageView({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        <Button variant="brand" size="32" leftIcon={<PlusIcon />} asChild>
          <Link href="/submit">Submit Feedback</Link>
        </Button>
      </div>

      <Suspense>
        <FeedFilters />
      </Suspense>

      {children}
    </div>
  );
}

export function FeedList({
  items,
  filtered,
  currentPage,
  totalPages,
  returnTo,
}: FeedData & { returnTo?: string | undefined }) {
  return (
    <>
      <FeedbackFeed items={items} filtered={filtered} returnTo={returnTo} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
