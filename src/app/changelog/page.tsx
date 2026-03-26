import { Suspense } from "react";
import { ChangelogListContent } from "./changelog-list-content";
import { ChangelogListSkeleton } from "./changelog-list-skeleton";

export default function ChangelogPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>

      <Suspense fallback={<ChangelogListSkeleton />}>
        <ChangelogListContent />
      </Suspense>
    </div>
  );
}
