// @ts-check
import { test, expect } from "@playwright/experimental-ct-svelte";
import Basic from "./Basic.svelte";
import Once from "./Once.svelte";
import RootMargin from "./RootMargin.svelte";

test.use({ viewport: { width: 1200, height: 900 } });

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

test("Root margin", async ({ mount, page }) => {
  const component = await mount(RootMargin);

  await expect(page.locator("header")).toHaveText(/Element is not in view/);
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is not in view/);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(component).toHaveText(/Hello world/);
});
