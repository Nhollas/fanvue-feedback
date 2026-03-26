"use client";

import { Button } from "@fanvue/ui";
import { useQueryStates } from "nuqs";
import type { SortValue } from "@/lib/feed-constants";
import { SORT_OPTIONS } from "@/lib/feed-constants";
import { feedSearchParams } from "@/lib/search-params";

export function SortButtons() {
  const [params, setParams] = useQueryStates(feedSearchParams, {
    shallow: false,
  });

  return (
    <fieldset className="flex gap-1.5" aria-label="Sort by">
      {SORT_OPTIONS.map((s) => (
        <Button
          key={s.value}
          variant={params.sort === s.value ? "brand" : "white"}
          size="32"
          onClick={() =>
            setParams({
              sort: s.value as SortValue,
              page: 1,
            })
          }
          aria-pressed={params.sort === s.value}
        >
          {s.label}
        </Button>
      ))}
    </fieldset>
  );
}
