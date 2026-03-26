const skeletonIds = Array.from({ length: 5 }, (_, i) => `skeleton-${i}`);

export function FeedbackListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {skeletonIds.map((id) => (
        <div
          key={id}
          className="flex w-full flex-row gap-4 rounded-md border border-neutral-alphas-200 bg-surface-primary p-4 shadow-sm"
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start gap-3">
              <div className="h-6 w-3/4 animate-pulse rounded bg-surface-hover" />
            </div>
            <div className="flex-1 py-4">
              <div className="h-8 w-full animate-pulse rounded bg-surface-hover" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-16 animate-pulse rounded-sm bg-surface-hover" />
              <div className="h-5 w-20 animate-pulse rounded-sm bg-surface-hover" />
            </div>
          </div>
          <div className="flex h-max w-11 shrink-0 flex-col items-center gap-2 rounded-md bg-surface-hover px-2 py-2 pb-2">
            <div className="size-6 animate-pulse rounded bg-border-subtle" />
            <div className="h-4 w-6 animate-pulse rounded bg-border-subtle" />
          </div>
        </div>
      ))}
    </div>
  );
}
