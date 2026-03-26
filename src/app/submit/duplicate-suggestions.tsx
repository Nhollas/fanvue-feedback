"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@fanvue/ui";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { SimilarFeedbackItem } from "@/app/api/feedback/similar/schema";
import { StatusBadge } from "@/components/status-badge";
import { formatCount } from "@/lib/format-count";

export function DuplicateSuggestions({
  items,
  heading,
  description,
  onDismissAction,
}: {
  items: SimilarFeedbackItem[];
  heading: string;
  description: string;
  onDismissAction?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (items.length > 0) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div ref={ref}>
      <Card aria-label={heading} role="region">
        <CardHeader>
          <h2 className="typography-semibold-body-lg text-content-primary">
            {heading}
          </h2>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-1.5">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/feedback/${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md bg-surface-hover px-3 py-2.5 transition-colors hover:bg-white/5"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
                      {item.title}
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={item.status} />
                      <span className="text-xs text-text-tertiary">
                        {formatCount(item.voteCount)} votes
                      </span>
                    </span>
                  </span>
                  {item.description && (
                    <span className="mt-1 block text-xs leading-relaxed text-text-tertiary line-clamp-2">
                      {item.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
        {onDismissAction && (
          <CardFooter>
            <Button
              type="button"
              variant="primary"
              size="32"
              onClick={onDismissAction}
            >
              Dismiss
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
