import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { test as base, expect, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Pagination } from "@/components/pagination";
import { paginationPageObject } from "./pagination-page-object";

export { expect };

export const test = base.extend("pagination", async () => ({
  async mount(currentPage: number, totalPages: number) {
    const onUrlUpdate = vi.fn();
    await render(
      <NuqsTestingAdapter onUrlUpdate={onUrlUpdate} hasMemory>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </NuqsTestingAdapter>,
    );
    return { ...paginationPageObject(page), onUrlUpdate };
  },
}));
