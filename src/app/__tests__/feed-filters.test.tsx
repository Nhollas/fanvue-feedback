import { describe } from "vitest";

import { expect, test } from "./feed-filters-fixture";

describe("FeedFilters", () => {
  test("renders category tabs", async ({ feedFilters }) => {
    const filters = await feedFilters.mount();

    await filters.expectCategoryTabVisible("All Categories");
    await filters.expectCategoryTabVisible("Creator");
    await filters.expectCategoryTabVisible("Fan");
  });

  test("All Categories tab is selected by default", async ({ feedFilters }) => {
    const filters = await feedFilters.mount();
    await filters.expectCategoryTabSelected("All Categories");
  });

  test("renders search field, status select, and sort buttons", async ({
    feedFilters,
  }) => {
    const filters = await feedFilters.mount();

    await filters.expectSearchFieldVisible();
    await filters.expectStatusSelectVisible();
    await filters.expectSortButtonVisible("Trending");
    await filters.expectSortButtonVisible("Newest");
    await filters.expectSortButtonVisible("Most Voted");
  });

  test("clicking a category tab updates category in URL", async ({
    feedFilters,
  }) => {
    const { onUrlUpdate, ...filters } = await feedFilters.mount();
    await filters.clickCategoryTab("Creator");

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("category=creator"),
      }),
    );
  });

  test("clicking All Categories tab removes category from URL", async ({
    feedFilters,
  }) => {
    const { onUrlUpdate, ...filters } = await feedFilters.mount({
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

  test("selecting a status updates status in URL", async ({ feedFilters }) => {
    const { onUrlUpdate, ...filters } = await feedFilters.mount();
    await filters.selectStatus("Requested");

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("status=requested"),
      }),
    );
  });

  test("clicking a sort button updates sort in URL", async ({
    feedFilters,
  }) => {
    const { onUrlUpdate, ...filters } = await feedFilters.mount();
    await filters.clickSort("Most Voted");

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("sort=most_voted"),
      }),
    );
  });

  test("submitting search updates search in URL", async ({ feedFilters }) => {
    const { onUrlUpdate, ...filters } = await feedFilters.mount();
    await filters.fillSearch("dark mode");
    await filters.submitSearch();

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("search=dark+mode"),
      }),
    );
  });
});
