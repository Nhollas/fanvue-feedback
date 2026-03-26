"use client";

import { SearchField } from "@fanvue/ui";
import { useQueryStates } from "nuqs";
import { useState } from "react";

import { feedSearchParams } from "@/lib/search-params";

export function SearchInput() {
  const [params, setParams] = useQueryStates(feedSearchParams, {
    shallow: false,
  });

  const [searchValue, setSearchValue] = useState(params.search);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ search: searchValue, page: 1 });
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <SearchField
        placeholder="Search feedback..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onClear={() => {
          setSearchValue("");
          setParams({ search: "", page: 1 });
        }}
        fullWidth
        size="40"
        aria-label="Search feedback"
      />
    </form>
  );
}
