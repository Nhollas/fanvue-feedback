import { Card, CardContent } from "@fanvue/ui";
import { desc, eq, inArray, max } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { RelativeTime } from "@/components/relative-time";
import { db } from "@/db";
import { feedback, statusChanges } from "@/db/schema";
import { ShippedColumn } from "./shipped-column";

export type RoadmapItem = {
  id: string;
  title: string;
  voteCount: number;
  latestStatusChange: Date | null;
};

async function getRoadmapItems() {
  "use cache";
  cacheTag("roadmap");
  cacheLife("minutes");

  const roadmapStatuses = [
    "planned",
    "under_review",
    "in_progress",
    "completed",
  ] as const;

  const rows = await db
    .select({
      id: feedback.id,
      title: feedback.title,
      status: feedback.status,
      voteCount: feedback.voteCount,
      latestStatusChange: max(statusChanges.changedAt),
    })
    .from(feedback)
    .leftJoin(statusChanges, eq(statusChanges.feedbackId, feedback.id))
    .where(inArray(feedback.status, [...roadmapStatuses]))
    .groupBy(feedback.id, feedback.title, feedback.status, feedback.voteCount)
    .orderBy(desc(feedback.voteCount));

  return rows;
}

type Row = Awaited<ReturnType<typeof getRoadmapItems>>[number];

function toRoadmapItem(row: Row): RoadmapItem {
  return {
    id: row.id,
    title: row.title,
    voteCount: row.voteCount,
    latestStatusChange: row.latestStatusChange ?? null,
  };
}

function StaticColumn({
  items,
  showDate,
}: {
  items: RoadmapItem[];
  showDate: boolean;
}) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-white/50">Nothing here yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <Card
          key={item.id}
          role="article"
          aria-label={item.title}
          className="relative has-[>a:focus-visible]:ring-2 has-[>a:focus-visible]:ring-secondary has-[>a:focus-visible]:ring-offset-2 has-[>a:focus-visible]:ring-offset-page"
        >
          <Link
            href={`/feedback/${item.id}`}
            className="absolute inset-0 rounded-md focus-visible:outline-none"
            aria-label={item.title}
          />
          <div className="flex flex-col p-4 gap-2">
            <h3 className="typography-semibold-body-md text-content-primary line-clamp-2">
              {item.title}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60">
                {item.voteCount} votes
              </span>
              {showDate && item.latestStatusChange && (
                <RelativeTime
                  date={item.latestStatusChange}
                  className="text-sm text-white/40"
                />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export async function RoadmapContent() {
  const rows = await getRoadmapItems();

  const planned = rows.filter((r) => r.status === "planned").map(toRoadmapItem);

  const inProgress = rows
    .filter((r) => r.status === "under_review" || r.status === "in_progress")
    .map(toRoadmapItem);

  const shipped = rows
    .filter((r) => r.status === "completed")
    .map(toRoadmapItem);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <section aria-label="Planned">
        <h2 className="typography-semibold-body-lg text-content-primary mb-3">
          Planned
        </h2>
        <StaticColumn items={planned} showDate={false} />
      </section>

      <section aria-label="In Progress">
        <h2 className="typography-semibold-body-lg text-content-primary mb-3">
          In Progress
        </h2>
        <StaticColumn items={inProgress} showDate={true} />
      </section>

      <section aria-label="Shipped">
        <h2 className="typography-semibold-body-lg text-content-primary mb-3">
          Shipped
        </h2>
        <ShippedColumn items={shipped} />
      </section>
    </div>
  );
}
