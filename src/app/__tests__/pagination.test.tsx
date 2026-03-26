import { describe } from "vitest";

import { expect, test } from "./pagination-fixture";

describe("Pagination", () => {
  test("does not render when totalPages is 1", async ({ pagination }) => {
    const page = await pagination.mount(1, 1);
    await page.expectNotRendered();
  });

  test("renders pagination controls for multiple pages", async ({
    pagination,
  }) => {
    const page = await pagination.mount(1, 3);
    await page.expectRendered();
    await page.expectCurrentPage(1);
  });

  test("disables previous button on first page", async ({ pagination }) => {
    const page = await pagination.mount(1, 3);
    await page.expectPreviousDisabled();
  });

  test("enables next button on first page", async ({ pagination }) => {
    const page = await pagination.mount(1, 3);
    await page.expectNextEnabled();
  });

  test("disables next button on last page", async ({ pagination }) => {
    const page = await pagination.mount(3, 3);
    await page.expectNextDisabled();
  });

  test("enables previous button on last page", async ({ pagination }) => {
    const page = await pagination.mount(3, 3);
    await page.expectPreviousEnabled();
  });

  test("clicking next updates page in URL", async ({ pagination }) => {
    const { onUrlUpdate, ...page } = await pagination.mount(1, 3);
    await page.clickNext();

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("page=2"),
      }),
    );
  });

  test("clicking previous from page 2 removes page from URL", async ({
    pagination,
  }) => {
    const { onUrlUpdate, ...page } = await pagination.mount(2, 3);
    await page.clickPrevious();

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: "",
      }),
    );
  });
});
