import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { test as base, expect, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { FeedFilters } from "@/app/feed-filters";
import { feedFiltersPageObject } from "./feed-filters-page-object";

export { expect };

type MountOptions = {
  searchParams?: string | Record<string, string>;
};

export const test = base.extend("feedFilters", async () => ({
  async mount(options?: MountOptions) {
    const onUrlUpdate = vi.fn();
    await render(
      <NuqsTestingAdapter
        {...(options?.searchParams != null && {
          searchParams: options.searchParams,
        })}
        onUrlUpdate={onUrlUpdate}
        hasMemory
      >
        <FeedFilters />
      </NuqsTestingAdapter>,
    );
    return { ...feedFiltersPageObject(page), onUrlUpdate };
  },
}));
