import { test, expect } from "@playwright/experimental-ct-svelte";
import Basic from "./Basic.svelte";
import Once from "./Once.svelte";
import RootMargin from "./RootMargin.svelte";
import RootMarginChange from "./RootMarginChange.svelte";
import Multiple from "./Multiple.svelte";
import MultipleBasic from "./MultipleBasic.svelte";
import MultipleBinding from "./MultipleBinding.svelte";
import MultipleOnce from "./MultipleOnce.svelte";
import MultipleRootMarginChange from "./MultipleRootMarginChange.svelte";
import Threshold from "./Threshold.svelte";
import MultipleThreshold from "./MultipleThreshold.svelte";

test.use({ viewport: { width: 1200, height: 600 } });

test("Basic", async ({ mount, page }) => {
  const component = await mount(Basic);

  await expect(page.locator("header")).toHaveText(/Element is not in view/);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(component).toHaveText(/Hello world/);
});

test("Once", async ({ mount, page }) => {
  const component = await mount(Once);

  await expect(page.locator("header")).toHaveText(/Element is not in view/);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(component).toHaveText(/Hello world/);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(component).toHaveText(/Hello world/);
});

test("Once - does not re-dispatch intersect on unrelated updates", async ({
  mount,
  page,
}) => {
  await mount(Once);

  await expect(page.getByTestId("intersect-count")).toHaveText(
    /Intersect count: 0/,
  );
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(page.getByTestId("intersect-count")).toHaveText(
    /Intersect count: 1/,
  );

  await page.getByTestId("unrelated-button").click();
  await page.getByTestId("unrelated-button").click();
  await page.getByTestId("unrelated-button").click();

  await expect(page.getByTestId("intersect-count")).toHaveText(
    /Intersect count: 1/,
  );
});

test("Root margin", async ({ mount, page }) => {
  const component = await mount(RootMargin);

  await expect(page.locator("header")).toHaveText(/Element is not in view/);
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is not in view/);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(component).toHaveText(/Hello world/);
});

test("Root margin - reinitializes the observer when changed at runtime", async ({
  mount,
  page,
}) => {
  await mount(RootMarginChange);

  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is in view/);

  await page.getByTestId("shrink-root-margin").click();
  await expect(page.locator("header")).toHaveText(/Element is not in view/);
});

test("Multiple elements - reinitializes the observer when root margin changes at runtime", async ({
  mount,
  page,
}) => {
  await mount(MultipleRootMarginChange);

  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is in view/);

  await page.getByTestId("shrink-root-margin").click();
  await expect(page.locator("header")).toHaveText(/Element is not in view/);
});

test("Threshold - requires a minimum visible ratio before intersecting", async ({
  mount,
  page,
}) => {
  const component = await mount(Threshold);

  await expect(page.locator("header")).toHaveText(/Element is not in view/);

  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is not in view/);

  await page.evaluate(() => window.scrollTo(0, 550));
  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(component).toHaveText(/Hello world/);
});

test("Multiple elements - threshold requires a minimum visible ratio", async ({
  mount,
  page,
}) => {
  await mount(MultipleThreshold);

  await expect(page.locator("header")).toHaveText(/Element is not in view/);

  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is not in view/);

  await page.evaluate(() => window.scrollTo(0, 550));
  await expect(page.locator("header")).toHaveText(/Element is in view/);
});

test("Multiple elements", async ({ mount, page }) => {
  await mount(Multiple);

  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is not visible/,
  );
  await expect(page.getByTestId("item-2-status")).toHaveText(
    /Item 2 is not visible/,
  );
  await expect(page.getByTestId("item-3-status")).toHaveText(
    /Item 3 is not visible/,
  );

  await page.evaluate(() => window.scrollTo(0, window.innerHeight + 50));
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is visible/,
  );
  await expect(page.getByTestId("item-2-status")).toHaveText(
    /Item 2 is not visible/,
  );
  await expect(page.getByTestId("item-3-status")).toHaveText(
    /Item 3 is not visible/,
  );

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2 + 50));
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is not visible/,
  );
  await expect(page.getByTestId("item-2-status")).toHaveText(
    /Item 2 is visible/,
  );
  await expect(page.getByTestId("item-3-status")).toHaveText(
    /Item 3 is not visible/,
  );

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is not visible/,
  );
  await expect(page.getByTestId("item-2-status")).toHaveText(
    /Item 2 is not visible/,
  );
  await expect(page.getByTestId("item-3-status")).toHaveText(
    /Item 3 is visible/,
  );

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is not visible/,
  );
  await expect(page.getByTestId("item-2-status")).toHaveText(
    /Item 2 is not visible/,
  );
  await expect(page.getByTestId("item-3-status")).toHaveText(
    /Item 3 is not visible/,
  );
});

test("Multiple elements - once", async ({ mount, page }) => {
  await mount(MultipleOnce);

  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is not visible/,
  );
  await expect(page.getByTestId("item-1-count")).toHaveText(
    /Item 1 intersect count: 0/,
  );

  await page.evaluate(() => window.scrollTo(0, window.innerHeight + 50));
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is visible/,
  );
  await expect(page.getByTestId("item-1-count")).toHaveText(
    /Item 1 intersect count: 1/,
  );

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is visible/,
  );
  await expect(page.getByTestId("item-1-count")).toHaveText(
    /Item 1 intersect count: 1/,
  );

  await expect(page.getByTestId("item-2-status")).toHaveText(
    /Item 2 is not visible/,
  );
  await expect(page.getByTestId("item-2-count")).toHaveText(
    /Item 2 intersect count: 0/,
  );
});

test("Multiple elements - basic pattern", async ({ mount, page }) => {
  await mount(MultipleBasic);

  await expect(page.getByTestId("item-1-indicator")).toHaveText(/Item 1: ✗/);
  await expect(page.getByTestId("item-2-indicator")).toHaveText(/Item 2: ✗/);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight + 50));
  await expect(page.getByTestId("item-1-indicator")).toHaveText(/Item 1: ✓/);
  await expect(page.getByTestId("item-2-indicator")).toHaveText(/Item 2: ✗/);

  await expect(page.getByTestId("item-1-indicator")).toHaveClass(
    /intersecting/,
  );
  await expect(page.getByTestId("item-2-indicator")).not.toHaveClass(
    /intersecting/,
  );

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2 + 50));
  await expect(page.getByTestId("item-1-indicator")).toHaveText(/Item 1: ✗/);
  await expect(page.getByTestId("item-2-indicator")).toHaveText(/Item 2: ✓/);
  await expect(page.getByTestId("item-2-indicator")).toHaveClass(
    /intersecting/,
  );

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.getByTestId("item-1-indicator")).toHaveText(/Item 1: ✗/);
  await expect(page.getByTestId("item-2-indicator")).toHaveText(/Item 2: ✗/);
});

test("Multiple elements - binding pattern", async ({ mount, page }) => {
  await mount(MultipleBinding);

  await expect(page.getByTestId("header-status")).toHaveText(
    /No items visible/,
  );
  await expect(page.getByTestId("header")).toHaveAttribute(
    "data-any-visible",
    "false",
  );
  await expect(page.getByTestId("header")).not.toHaveClass(/intersecting/);

  await expect(page.getByTestId("item-1")).toHaveAttribute(
    "data-visible",
    "false",
  );
  await expect(page.getByTestId("item-2")).toHaveAttribute(
    "data-visible",
    "false",
  );

  await page.evaluate(() => window.scrollTo(0, window.innerHeight + 50));

  await expect(page.getByTestId("header-status")).toHaveText(
    /At least one item is visible/,
  );
  await expect(page.getByTestId("header")).toHaveAttribute(
    "data-any-visible",
    "true",
  );
  await expect(page.getByTestId("header")).toHaveClass(/intersecting/);

  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is visible/,
  );

  await expect(page.getByTestId("item-1")).toHaveAttribute(
    "data-visible",
    "true",
  );
  await expect(page.getByTestId("item-1")).toHaveClass(/visible/);
  await expect(page.getByTestId("item-2")).toHaveAttribute(
    "data-visible",
    "false",
  );

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2 + 50));

  await expect(page.getByTestId("header-status")).toHaveText(
    /At least one item is visible/,
  );

  await expect(page.getByTestId("item-2-status")).toHaveText(
    /Item 2 is visible/,
  );
  await expect(page.getByTestId("item-2")).toHaveAttribute(
    "data-visible",
    "true",
  );
  await expect(page.getByTestId("item-2")).toHaveClass(/visible/);
  await expect(page.getByTestId("item-1")).toHaveAttribute(
    "data-visible",
    "false",
  );

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.getByTestId("header-status")).toHaveText(
    /No items visible/,
  );
  await expect(page.getByTestId("header")).toHaveAttribute(
    "data-any-visible",
    "false",
  );
  await expect(page.getByTestId("item-1")).toHaveAttribute(
    "data-visible",
    "false",
  );
  await expect(page.getByTestId("item-2")).toHaveAttribute(
    "data-visible",
    "false",
  );
});
