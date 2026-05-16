const skeletonIds = Array.from({ length: 3 }, (_, i) => `skeleton-${i}`);

function ColumnSkeleton({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="typography-semibold-body-lg text-content-primary">
        {label}
      </h2>
      <div className="flex flex-col gap-3">
        {skeletonIds.map((id) => (
          <div
            key={id}
            className="rounded-md border border-neutral-alphas-200 bg-surface-primary p-4 shadow-sm"
          >
            <div className="h-5 w-3/4 animate-pulse rounded bg-surface-hover" />
            <div className="mt-3 flex items-center gap-2">
              <div className="h-4 w-12 animate-pulse rounded bg-surface-hover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RoadmapSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <ColumnSkeleton label="Planned" />
      <ColumnSkeleton label="In Progress" />
      <ColumnSkeleton label="Shipped" />
    </div>
  );
}
