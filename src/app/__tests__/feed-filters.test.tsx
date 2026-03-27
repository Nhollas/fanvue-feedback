import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { FeedFilters } from "@/app/feed-filters";
import { feedFiltersPageObject } from "./feed-filters-page-object";

type MountOptions = {
  searchParams?: string | Record<string, string>;
};

async function mount(options?: MountOptions) {
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
}

describe("FeedFilters", () => {
  test("renders category tabs", async () => {
    const filters = await mount();

    await filters.expectCategoryTabVisible("All Categories");
    await filters.expectCategoryTabVisible("Creator");
    await filters.expectCategoryTabVisible("Fan");
  });

  test("All Categories tab is selected by default", async () => {
    const filters = await mount();
    await filters.expectCategoryTabSelected("All Categories");
  });

  test("renders search field, status select, and sort buttons", async () => {
    const filters = await mount();

    await filters.expectSearchFieldVisible();
    await filters.expectStatusSelectVisible();
    await filters.expectSortButtonVisible("Trending");
    await filters.expectSortButtonVisible("Newest");
    await filters.expectSortButtonVisible("Most Voted");
  });

  test("clicking a category tab updates category in URL", async () => {
    const { onUrlUpdate, ...filters } = await mount();
    await filters.clickCategoryTab("Creator");

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("category=creator"),
      }),
    );
  });

  test("clicking All Categories tab removes category from URL", async () => {
    const { onUrlUpdate, ...filters } = await mount({
      searchParams: "category=creator",
    });

    await filters.expectCategoryTabSelected("Creator");
    await filters.clickCategoryTab("All Categories");

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: "",
      }),
    );
  });

  test("selecting a status updates status in URL", async () => {
    const { onUrlUpdate, ...filters } = await mount();
    await filters.selectStatus("Requested");

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("status=requested"),
      }),
    );
  });

  test("clicking a sort button updates sort in URL", async () => {
    const { onUrlUpdate, ...filters } = await mount();
    await filters.clickSort("Most Voted");

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("sort=most_voted"),
      }),
    );
  });

  test("submitting search updates search in URL", async () => {
    const { onUrlUpdate, ...filters } = await mount();
    await filters.fillSearch("dark mode");
    await filters.submitSearch();

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("search=dark+mode"),
      }),
    );
  });
});
