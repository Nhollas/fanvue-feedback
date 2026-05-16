"use client";

import { Button, Card, CardContent, CardFooter, CardHeader } from "@fanvue/ui";
import Link from "next/link";
import { useState } from "react";
import { RelativeTime } from "@/components/relative-time";
import type { RoadmapItem } from "./roadmap-content";

const COLLAPSED_COUNT = 10;

export function ShippedColumn({ items }: { items: RoadmapItem[] }) {
  const [expanded, setExpanded] = useState(false);

  const recentIds = new Set(
    [...items]
      .sort((a, b) => {
        const aTime = a.latestStatusChange?.getTime() ?? 0;
        const bTime = b.latestStatusChange?.getTime() ?? 0;
        return bTime - aTime;
      })
      .slice(0, COLLAPSED_COUNT)
      .map((item) => item.id),
  );

  const visible = expanded
    ? items
    : items.filter((item) => recentIds.has(item.id));

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
          <CardHeader>
            <h3 className="typography-semibold-body-md text-content-primary line-clamp-2">
              {item.title}
            </h3>
          </CardHeader>
          <CardFooter className="gap-3">
            <span className="text-sm text-white/60">
              {item.voteCount} votes
            </span>
            {item.latestStatusChange && (
              <RelativeTime
                date={item.latestStatusChange}
                className="text-sm text-white/40"
              />
            )}
          </CardFooter>
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
