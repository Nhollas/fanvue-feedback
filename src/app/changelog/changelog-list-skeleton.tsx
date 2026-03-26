const skeletonIds = Array.from({ length: 3 }, (_, i) => `skeleton-${i}`);

export function ChangelogListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {skeletonIds.map((id) => (
        <div
          key={id}
          className="rounded-md border border-neutral-alphas-200 bg-surface-primary p-4 shadow-sm"
        >
          <div className="h-6 w-2/3 animate-pulse rounded bg-surface-hover" />
          <div className="space-y-2 py-4">
            <div className="h-4 w-full animate-pulse rounded bg-surface-hover" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-surface-hover" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-16 animate-pulse rounded bg-surface-hover" />
          </div>
        </div>
      ))}
    </div>
  );
}
