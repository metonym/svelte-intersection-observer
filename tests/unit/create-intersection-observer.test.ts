import { flushSync } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import CreateIntersectionObserverFixture from "../e2e/fixtures/CreateIntersectionObserverFixture.svelte";
import { MockIntersectionObserver } from "./mock-intersection-observer";
import { render } from "./render";

// createIntersectionObserver wraps intersectAttachment, so — like
// intersectAttachment — it can only be exercised inside a mounted component
// (see intersect-component.test.ts).

let cleanup: (() => void) | undefined;

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
});

describe("createIntersectionObserver", () => {
  test("exposes intersecting/entry reactively via {@attach observer.attach} and honors once", () => {
    const rendered = render(CreateIntersectionObserverFixture);
    cleanup = rendered.cleanup;
    const el = rendered.target.querySelector("div");
    const header = rendered.target.querySelector("header");
    if (!el || !header) throw new Error("fixture markup missing");

    expect(header.textContent).toContain("Element is not in view");
    expect(
      rendered.target.querySelector('[data-testid="intersect-count"]')
        ?.textContent,
    ).toContain("Intersect count: 0");

    const observer = MockIntersectionObserver.last();
    flushSync(() => observer.trigger([{ target: el, isIntersecting: true }]));

    expect(header.textContent).toContain("Element is in view");
    expect(
      rendered.target.querySelector('[data-testid="intersect-count"]')
        ?.textContent,
    ).toContain("Intersect count: 1");
    // `once: true` in the fixture
    expect(observer.observedElements.has(el)).toBe(false);
  });
});
