import { SelectContent, SelectItem, TabsTrigger } from "@fanvue/ui";

import { CATEGORIES, STATUSES } from "@/lib/feed-constants";
import { CategoryFilter } from "./category-filter";
import { SearchInput } from "./search-input";
import { SortButtons } from "./sort-select";
import { StatusSelect } from "./status-tabs";

export function FeedFilters() {
  return (
    <div className="flex flex-col gap-4">
      <CategoryFilter>
        {CATEGORIES.map((c) => (
          <TabsTrigger key={c.value} value={c.value}>
            {c.label}
          </TabsTrigger>
        ))}
      </CategoryFilter>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput />

        <div className="flex flex-wrap items-center gap-3">
          <StatusSelect>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </StatusSelect>

          <SortButtons />
        </div>
      </div>
    </div>
  );
}
