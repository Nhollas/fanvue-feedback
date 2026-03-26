"use client";

import { Tabs, TabsContent, TabsList } from "@fanvue/ui";
import { useQueryStates } from "nuqs";

import { CATEGORIES, type CategoryValue } from "@/lib/feed-constants";
import { feedSearchParams } from "@/lib/search-params";

type CategoryFilterProps = {
  children: React.ReactNode;
};

export function CategoryFilter({ children }: CategoryFilterProps) {
  const [params, setParams] = useQueryStates(feedSearchParams, {
    shallow: false,
  });

  return (
    <Tabs
      value={params.category}
      onValueChange={(value) =>
        setParams({
          category: value as CategoryValue,
          page: 1,
        })
      }
    >
      <TabsList className="w-full">{children}</TabsList>
      {CATEGORIES.map((c) => (
        <TabsContent key={c.value} value={c.value} forceMount hidden />
      ))}
    </Tabs>
  );
}
