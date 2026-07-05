import { flushSync } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import ActionFixture from "../e2e/fixtures/ActionFixture.svelte";
import ActionRootMarginChangeFixture from "../e2e/fixtures/ActionRootMarginChangeFixture.svelte";
import ActionSkipFixture from "../e2e/fixtures/ActionSkipFixture.svelte";
import AttachmentFixture from "../e2e/fixtures/AttachmentFixture.svelte";
import AttachmentRootMarginChangeFixture from "../e2e/fixtures/AttachmentRootMarginChangeFixture.svelte";
import AttachmentSkipFixture from "../e2e/fixtures/AttachmentSkipFixture.svelte";
import { MockIntersectionObserver } from "./mock-intersection-observer";
import { render } from "./render";

// `intersectAttachment` is a thin `fromAction` wrapper around `intersect`, and
// `fromAction`'s returned function relies on Svelte's internal render-effect
// plumbing — it can only be exercised inside a mounted component, unlike the
// plain-function `intersect` action tested in intersect-action.test.ts.

let cleanup: (() => void) | undefined;

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
});

describe.each([
  {
    name: "use:intersect",
    Fixture: ActionFixture,
    SkipFixture: ActionSkipFixture,
    RootMarginChangeFixture: ActionRootMarginChangeFixture,
  },
  {
    name: "{@attach intersectAttachment}",
    Fixture: AttachmentFixture,
    SkipFixture: AttachmentSkipFixture,
    RootMarginChangeFixture: AttachmentRootMarginChangeFixture,
  },
])("$name", ({ Fixture, SkipFixture, RootMarginChangeFixture }) => {
  test("onobserve/onintersect fire from dispatched events and once behavior applies", () => {
    const rendered = render(Fixture);
    cleanup = rendered.cleanup;
    const el = rendered.target.querySelector("div");
    if (!el) throw new Error("fixture markup missing");

    const header = rendered.target.querySelector("header");
    expect(header?.textContent).toContain("Element is not in view");

    const observer = MockIntersectionObserver.last();
    flushSync(() => observer.trigger([{ target: el, isIntersecting: true }]));

    expect(header?.textContent).toContain("Element is in view");
    expect(
      rendered.target.querySelector('[data-testid="intersect-count"]')
        ?.textContent,
    ).toContain("Intersect count: 1");
    // `once: true` in the fixture
    expect(observer.observedElements.has(el)).toBe(false);
  });

  test("skip pauses and resumes observation", () => {
    const rendered = render(SkipFixture);
    cleanup = rendered.cleanup;
    const el = rendered.target.querySelector("div");
    const toggle = rendered.target.querySelector('[data-testid="toggle-skip"]');
    if (!el || !(toggle instanceof HTMLButtonElement)) {
      throw new Error("fixture markup missing");
    }

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(el)).toBe(true);

    toggle.click();
    flushSync();
    expect(observer.observedElements.has(el)).toBe(false);
    expect(MockIntersectionObserver.instances).toHaveLength(1);

    toggle.click();
    flushSync();
    expect(observer.observedElements.has(el)).toBe(true);
  });

  test("changing rootMargin recreates the observer", () => {
    const rendered = render(RootMarginChangeFixture);
    cleanup = rendered.cleanup;
    const el = rendered.target.querySelector("div");
    const shrinkButton = rendered.target.querySelector(
      '[data-testid="shrink-root-margin"]',
    );
    if (!el || !(shrinkButton instanceof HTMLButtonElement)) {
      throw new Error("fixture markup missing");
    }

    const firstObserver = MockIntersectionObserver.last();
    shrinkButton.click();
    flushSync();

    expect(MockIntersectionObserver.instances).toHaveLength(2);
    expect(firstObserver.disconnected).toBe(true);

    const secondObserver = MockIntersectionObserver.last();
    expect(secondObserver.options.rootMargin).toBe("-200px");
    expect(secondObserver.observedElements.has(el)).toBe(true);
  });
});
