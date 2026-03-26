"use client";

import { Select } from "@fanvue/ui";
import { useQueryStates } from "nuqs";

import type { StatusValue } from "@/lib/feed-constants";
import { feedSearchParams } from "@/lib/search-params";

type StatusSelectProps = {
  children: React.ReactNode;
};

export function StatusSelect({ children }: StatusSelectProps) {
  const [params, setParams] = useQueryStates(feedSearchParams, {
    shallow: false,
  });

  return (
    <Select
      value={params.status}
      onValueChange={(value) =>
        setParams({
          status: value as StatusValue,
          page: 1,
        })
      }
      aria-label="Filter by status"
      placeholder="All"
      size="40"
      className="w-48 [&_button]:focus-visible:shadow-focus-ring [&_button]:focus-visible:outline-none"
    >
      {children}
    </Select>
  );
}
