"use client";

import { Button, Card, CardContent } from "@fanvue/ui";
import Link from "next/link";
import { useMemo, useState } from "react";
import { RelativeTime } from "@/components/relative-time";
import type { RoadmapItem } from "./roadmap-content";

const COLLAPSED_COUNT = 10;

export function ShippedColumn({ items }: { items: RoadmapItem[] }) {
  const [expanded, setExpanded] = useState(false);

  // Collapsed view shows the most recent COLLAPSED_COUNT items in
  // status-change date order; expanded view falls back to the column's
  // vote-count order that arrives from the server.
  const mostRecent = useMemo(
    () =>
      [...items]
        .sort((a, b) => {
          const aTime = a.latestStatusChange?.getTime() ?? 0;
          const bTime = b.latestStatusChange?.getTime() ?? 0;
          return bTime - aTime;
        })
        .slice(0, COLLAPSED_COUNT),
    [items],
  );

  const visible = expanded ? items : mostRecent;

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-white/50">Nothing shipped yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {visible.map((item) => (
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
              {item.latestStatusChange && (
                <RelativeTime
                  date={item.latestStatusChange}
                  className="text-sm text-white/40"
                />
              )}
            </div>
          </div>
        </Card>
      ))}

      {!expanded && items.length > COLLAPSED_COUNT && (
        <Button
          variant="tertiary"
          size="32"
          className="self-center"
          onClick={() => setExpanded(true)}
        >
          View all {items.length} shipped items
        </Button>
      )}
    </div>
  );
}
