import { Suspense } from "react";
import { RoadmapContent } from "./roadmap-content";
import { RoadmapSkeleton } from "./roadmap-skeleton";

export default function RoadmapPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Roadmap</h1>

      <Suspense fallback={<RoadmapSkeleton />}>
        <RoadmapContent />
      </Suspense>
    </div>
  );
}
