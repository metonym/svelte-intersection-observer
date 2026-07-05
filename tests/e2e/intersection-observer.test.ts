import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1200, height: 600 } });

test("Basic", async ({ page }) => {
  await page.goto("/basic.html");
  const app = page.locator("#app");

  await expect(page.locator("header")).toHaveText(/Element is not in view/);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(app).toHaveText(/Hello world/);
});

test("Once", async ({ page }) => {
  await page.goto("/once.html");
  const app = page.locator("#app");

  await expect(page.locator("header")).toHaveText(/Element is not in view/);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(app).toHaveText(/Hello world/);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(app).toHaveText(/Hello world/);
});

test("Once - does not re-dispatch intersect on unrelated updates", async ({
  page,
}) => {
  await page.goto("/once.html");

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

test("Root margin", async ({ page }) => {
  await page.goto("/root-margin.html");
  const app = page.locator("#app");

  await expect(page.locator("header")).toHaveText(/Element is not in view/);
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is not in view/);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(app).toHaveText(/Hello world/);
});

test("Element - switching the observed element retargets the observer", async ({
  page,
}) => {
  await page.goto("/element-change.html");

  await expect(page.locator("header")).toHaveText(/Element is in view/);

  await page.getByTestId("switch").click();
  await expect(page.locator("header")).toHaveText(/Element is not in view/);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator("header")).toHaveText(/Element is in view/);
});

test("Element - unobserves when element becomes null and re-observes when restored", async ({
  page,
}) => {
  await page.goto("/element-null.html");
  const header = page.locator("header");

  await expect(header).toHaveText(/Element is not in view/);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(header).toHaveText(/Element is in view/);

  await page.getByTestId("clear").click();
  await expect(header).toHaveText(/Element is not in view/);

  // Scrolling away and back must not resurrect a leaked observation of the
  // previous element.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(header).toHaveText(/Element is not in view/);

  await page.getByTestId("restore").click();
  await expect(header).toHaveText(/Element is in view/);
});

test("Root margin - reinitializes the observer when changed at runtime", async ({
  page,
}) => {
  await page.goto("/root-margin-change.html");

  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is in view/);

  await page.getByTestId("shrink-root-margin").click();
  await expect(page.locator("header")).toHaveText(/Element is not in view/);
});

test("Threshold - reinitializes the observer when changed at runtime", async ({
  page,
}) => {
  await page.goto("/threshold-change.html");

  await page.evaluate(() => window.scrollTo(0, 300));
  await expect(page.locator("header")).toHaveText(/Element is in view/);

  await page.getByTestId("raise-threshold").click();
  await expect(page.locator("header")).toHaveText(/Element is not in view/);
});

test("Threshold - value-equal but referentially-new arrays do not recreate the observer", async ({
  page,
}) => {
  await page.goto("/threshold-stable.html");

  await expect(page.getByTestId("observer-count")).toHaveText(
    /Observer count: 1/,
  );

  await page.getByTestId("unrelated-button").click();
  await page.getByTestId("unrelated-button").click();
  await page.getByTestId("unrelated-button").click();

  await expect(page.getByTestId("observer-count")).toHaveText(
    /Observer count: 1/,
  );
});

test("Skip - pauses observing without losing state, resumes on toggle", async ({
  page,
}) => {
  await page.goto("/skip.html");
  const header = page.locator("header");

  await expect(header).toHaveText(/Element is not in view/);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(header).toHaveText(/Element is in view/);

  await page.getByTestId("toggle-skip").click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).toHaveText(/Element is in view/);

  await page.getByTestId("toggle-skip").click();
  await expect(header).toHaveText(/Element is not in view/);
});

test("Multiple elements - skip pauses observing without losing state, resumes on toggle", async ({
  page,
}) => {
  await page.goto("/multiple-skip.html");

  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is not visible/,
  );
  await page.evaluate(() => window.scrollTo(0, window.innerHeight + 50));
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is visible/,
  );

  await page.getByTestId("toggle-skip").click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is visible/,
  );

  await page.getByTestId("toggle-skip").click();
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is not visible/,
  );
});

test("Action - skip pauses observing without losing state, resumes on toggle", async ({
  page,
}) => {
  await page.goto("/action-skip.html");
  const header = page.locator("header");

  await expect(header).toHaveText(/Element is not in view/);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(header).toHaveText(/Element is in view/);

  await page.getByTestId("toggle-skip").click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).toHaveText(/Element is in view/);

  await page.getByTestId("toggle-skip").click();
  await expect(header).toHaveText(/Element is not in view/);
});

test("Action - use:intersect dispatches observe/intersect events and honors once", async ({
  page,
}) => {
  await page.goto("/action.html");
  const app = page.locator("#app");

  await expect(page.locator("header")).toHaveText(/Element is not in view/);
  await expect(page.getByTestId("intersect-count")).toHaveText(
    /Intersect count: 0/,
  );

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(app).toHaveText(/Hello world/);
  await expect(page.getByTestId("intersect-count")).toHaveText(
    /Intersect count: 1/,
  );

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByTestId("intersect-count")).toHaveText(
    /Intersect count: 1/,
  );
});

test("Action - reinitializes the observer when the parameter changes at runtime", async ({
  page,
}) => {
  await page.goto("/action-root-margin-change.html");

  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is in view/);

  await page.getByTestId("shrink-root-margin").click();
  await expect(page.locator("header")).toHaveText(/Element is not in view/);
});

test("Attachment - skip pauses observing without losing state, resumes on toggle", async ({
  page,
}) => {
  await page.goto("/attachment-skip.html");
  const header = page.locator("header");

  await expect(header).toHaveText(/Element is not in view/);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(header).toHaveText(/Element is in view/);

  await page.getByTestId("toggle-skip").click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).toHaveText(/Element is in view/);

  await page.getByTestId("toggle-skip").click();
  await expect(header).toHaveText(/Element is not in view/);
});

test("Attachment - {@attach intersectAttachment} dispatches observe/intersect events and honors once", async ({
  page,
}) => {
  await page.goto("/attachment.html");
  const app = page.locator("#app");

  await expect(page.locator("header")).toHaveText(/Element is not in view/);
  await expect(page.getByTestId("intersect-count")).toHaveText(
    /Intersect count: 0/,
  );

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(app).toHaveText(/Hello world/);
  await expect(page.getByTestId("intersect-count")).toHaveText(
    /Intersect count: 1/,
  );

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByTestId("intersect-count")).toHaveText(
    /Intersect count: 1/,
  );
});

test("Attachment - reinitializes the observer when the parameter changes at runtime", async ({
  page,
}) => {
  await page.goto("/attachment-root-margin-change.html");

  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is in view/);

  await page.getByTestId("shrink-root-margin").click();
  await expect(page.locator("header")).toHaveText(/Element is not in view/);
});

test("Multiple elements - reinitializes the observer when root margin changes at runtime", async ({
  page,
}) => {
  await page.goto("/multiple-root-margin-change.html");

  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is in view/);

  await page.getByTestId("shrink-root-margin").click();
  await expect(page.locator("header")).toHaveText(/Element is not in view/);
});

test("Root - uses a custom scroll container instead of the viewport", async ({
  page,
}) => {
  await page.goto("/root.html");
  const app = page.locator("#app");

  await expect(page.getByTestId("status")).toHaveText(/Element is not in view/);

  await page.getByTestId("container").evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });

  await expect(page.getByTestId("status")).toHaveText(/Element is in view/);
  await expect(app).toHaveText(/Hello world/);
});

test("Multiple elements - uses a custom scroll container instead of the viewport", async ({
  page,
}) => {
  await page.goto("/multiple-root.html");

  await expect(page.getByTestId("status")).toHaveText(/Element is not in view/);

  await page.getByTestId("container").evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });

  await expect(page.getByTestId("status")).toHaveText(/Element is in view/);
});

test("Threshold - requires a minimum visible ratio before intersecting", async ({
  page,
}) => {
  await page.goto("/threshold.html");
  const app = page.locator("#app");

  await expect(page.locator("header")).toHaveText(/Element is not in view/);

  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is not in view/);

  await page.evaluate(() => window.scrollTo(0, 550));
  await expect(page.locator("header")).toHaveText(/Element is in view/);
  await expect(app).toHaveText(/Hello world/);
});

test("Multiple elements - threshold requires a minimum visible ratio", async ({
  page,
}) => {
  await page.goto("/multiple-threshold.html");

  await expect(page.locator("header")).toHaveText(/Element is not in view/);

  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(page.locator("header")).toHaveText(/Element is not in view/);

  await page.evaluate(() => window.scrollTo(0, 550));
  await expect(page.locator("header")).toHaveText(/Element is in view/);
});

test("Multiple elements", async ({ page }) => {
  await page.goto("/multiple.html");

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

test("Multiple elements - once", async ({ page }) => {
  await page.goto("/multiple-once.html");

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

test("Multiple elements - elements array add/remove retargets the observer", async ({
  page,
}) => {
  await page.goto("/multiple-elements-change.html");

  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is not visible/,
  );
  await expect(page.getByTestId("item-2-status")).toHaveText(
    /Item 2 is not visible/,
  );

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is visible/,
  );
  await expect(page.getByTestId("item-2-status")).toHaveText(
    /Item 2 is not visible/,
  );

  await page.getByTestId("add-item-2").click();
  await expect(page.getByTestId("item-2-status")).toHaveText(
    /Item 2 is visible/,
  );

  await page.getByTestId("remove-item-1").click();
  await page.evaluate(() => window.scrollTo(0, 0));

  await expect(page.getByTestId("item-2-status")).toHaveText(
    /Item 2 is not visible/,
  );
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is not visible/,
  );
});

test("Multiple elements - re-observes the same refs after elements becomes empty", async ({
  page,
}) => {
  await page.goto("/multiple-elements-change.html");

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is visible/,
  );

  await page.getByTestId("remove-item-1").click();
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is not visible/,
  );

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByTestId("add-item-1").click();
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is not visible/,
  );

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByTestId("item-1-status")).toHaveText(
    /Item 1 is visible/,
  );
});

test("Multiple elements - basic pattern", async ({ page }) => {
  await page.goto("/multiple-basic.html");

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

test("Each block - bind:this + bind:intersecting per item does not deadlock and tracks independently", async ({
  page,
}) => {
  await page.goto("/each-binding.html", { timeout: 5_000 });

  await expect(page.getByTestId("section-one")).toHaveText(/not visible/);
  await expect(page.getByTestId("section-two")).toHaveText(/not visible/);
  await expect(page.getByTestId("section-three")).toHaveText(/not visible/);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight + 50));
  await expect(page.getByTestId("section-one")).toHaveText(/visible/, {
    timeout: 5_000,
  });
  await expect(page.getByTestId("section-two")).toHaveText(/not visible/);
  await expect(page.getByTestId("section-three")).toHaveText(/not visible/);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2.5 + 50));
  await expect(page.getByTestId("section-two")).toHaveText(/visible/, {
    timeout: 5_000,
  });
  await expect(page.getByTestId("section-one")).toHaveText(/not visible/);
  await expect(page.getByTestId("section-three")).toHaveText(/not visible/);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByTestId("section-three")).toHaveText(/visible/, {
    timeout: 5_000,
  });
  await expect(page.getByTestId("section-one")).toHaveText(/not visible/);
  await expect(page.getByTestId("section-two")).toHaveText(/not visible/);
});

test("Multiple elements - binding pattern", async ({ page }) => {
  await page.goto("/multiple-binding.html");

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

test.describe("Missing IntersectionObserver support", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "IntersectionObserver", {
        value: undefined,
        configurable: true,
      });
    });
  });

  test("IntersectionObserver component - degrades gracefully without throwing", async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (err) => pageErrors.push(err));

    await page.goto("/basic.html");
    await expect(page.locator("header")).toHaveText(/Element is not in view/);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);
    await expect(page.locator("header")).toHaveText(/Element is not in view/);

    expect(pageErrors).toEqual([]);
  });

  test("MultipleIntersectionObserver component - degrades gracefully without throwing", async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (err) => pageErrors.push(err));

    await page.goto("/multiple-basic.html");
    await expect(page.getByTestId("item-1-indicator")).toHaveText(/Item 1: ✗/);

    await page.evaluate(() => window.scrollTo(0, window.innerHeight + 50));
    await page.waitForTimeout(200);
    await expect(page.getByTestId("item-1-indicator")).toHaveText(/Item 1: ✗/);

    expect(pageErrors).toEqual([]);
  });

  test("intersect action - degrades gracefully without throwing", async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (err) => pageErrors.push(err));

    await page.goto("/action.html");
    await expect(page.locator("header")).toHaveText(/Element is not in view/);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);
    await expect(page.locator("header")).toHaveText(/Element is not in view/);

    expect(pageErrors).toEqual([]);
  });
});
