"use client";

import { Pagination as UIPagination } from "@fanvue/ui";
import { useQueryState } from "nuqs";

import { feedSearchParams } from "@/lib/search-params";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const [, setPage] = useQueryState("page", {
    ...feedSearchParams.page,
    shallow: false,
  });

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center">
      <UIPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
