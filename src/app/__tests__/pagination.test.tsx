import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Pagination } from "@/components/pagination";
import { paginationPageObject } from "./pagination-page-object";

async function mount(currentPage: number, totalPages: number) {
  const onUrlUpdate = vi.fn();
  await render(
    <NuqsTestingAdapter onUrlUpdate={onUrlUpdate} hasMemory>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </NuqsTestingAdapter>,
  );
  return { ...paginationPageObject(page), onUrlUpdate };
}

describe("Pagination", () => {
  test("does not render when totalPages is 1", async () => {
    const page = await mount(1, 1);
    await page.expectNotRendered();
  });

  test("renders pagination controls for multiple pages", async () => {
    const page = await mount(1, 3);
    await page.expectRendered();
    await page.expectCurrentPage(1);
  });

  test("disables previous button on first page", async () => {
    const page = await mount(1, 3);
    await page.expectPreviousDisabled();
  });

  test("enables next button on first page", async () => {
    const page = await mount(1, 3);
    await page.expectNextEnabled();
  });

  test("disables next button on last page", async () => {
    const page = await mount(3, 3);
    await page.expectNextDisabled();
  });

  test("enables previous button on last page", async () => {
    const page = await mount(3, 3);
    await page.expectPreviousEnabled();
  });

  test("clicking next updates page in URL", async () => {
    const { onUrlUpdate, ...page } = await mount(1, 3);
    await page.clickNext();

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("page=2"),
      }),
    );
  });

  test("clicking previous from page 2 removes page from URL", async () => {
    const { onUrlUpdate, ...page } = await mount(2, 3);
    await page.clickPrevious();

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: "",
      }),
    );
  });
});
