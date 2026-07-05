import { flushSync } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import BasicFixture from "../e2e/fixtures/BasicFixture.svelte";
import EachBindingFixture from "../e2e/fixtures/EachBindingFixture.svelte";
import ElementChangeFixture from "../e2e/fixtures/ElementChangeFixture.svelte";
import ElementNullFixture from "../e2e/fixtures/ElementNullFixture.svelte";
import ElementUndefinedFixture from "../e2e/fixtures/ElementUndefinedFixture.svelte";
import OnceElementChangeFixture from "../e2e/fixtures/OnceElementChangeFixture.svelte";
import OnceFixture from "../e2e/fixtures/OnceFixture.svelte";
import RootChangeFixture from "../e2e/fixtures/RootChangeFixture.svelte";
import RootFixture from "../e2e/fixtures/RootFixture.svelte";
import RootMarginChangeFixture from "../e2e/fixtures/RootMarginChangeFixture.svelte";
import RootMarginFixture from "../e2e/fixtures/RootMarginFixture.svelte";
import SkipFixture from "../e2e/fixtures/SkipFixture.svelte";
import ThresholdChangeFixture from "../e2e/fixtures/ThresholdChangeFixture.svelte";
import ThresholdFixture from "../e2e/fixtures/ThresholdFixture.svelte";
import ThresholdStableFixture from "../e2e/fixtures/ThresholdStableFixture.svelte";
import { MockIntersectionObserver } from "./mock-intersection-observer";
import { render } from "./render";

// These fixtures are shared with the Playwright e2e suite (real scroll,
// real browser). Reusing them here — driven by a mocked IntersectionObserver
// instead of real geometry — covers the reactive wiring around the observer
// (observe/unobserve, effect cleanup, prop syncing) fast and deterministically.

let cleanup: (() => void) | undefined;

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
});

describe("IntersectionObserver", () => {
  test("reflects intersecting state via bind:intersecting", () => {
    const rendered = render(BasicFixture);
    cleanup = rendered.cleanup;
    const header = rendered.target.querySelector("header");
    const el = rendered.target.querySelector("div");
    if (!header || !el) throw new Error("fixture markup missing");

    expect(header.textContent).toContain("Element is not in view");

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(el)).toBe(true);

    flushSync(() => observer.trigger([{ target: el, isIntersecting: true }]));
    expect(header.textContent).toContain("Element is in view");

    flushSync(() => observer.trigger([{ target: el, isIntersecting: false }]));
    expect(header.textContent).toContain("Element is not in view");
  });

  test("once unobserves the element after it intersects and ignores unrelated updates", () => {
    const rendered = render(OnceFixture);
    cleanup = rendered.cleanup;
    const el = rendered.target.querySelector("div");
    if (!el) throw new Error("fixture markup missing");

    const observer = MockIntersectionObserver.last();
    flushSync(() => observer.trigger([{ target: el, isIntersecting: true }]));

    expect(observer.observedElements.has(el)).toBe(false);
    expect(
      rendered.target.querySelector('[data-testid="intersect-count"]')
        ?.textContent,
    ).toContain("Intersect count: 1");

    const unrelatedButton = rendered.target.querySelector(
      '[data-testid="unrelated-button"]',
    );
    if (!(unrelatedButton instanceof HTMLButtonElement)) {
      throw new Error("fixture markup missing");
    }

    for (let i = 0; i < 3; i++) {
      unrelatedButton.click();
      flushSync();
    }

    expect(
      rendered.target.querySelector('[data-testid="intersect-count"]')
        ?.textContent,
    ).toContain("Intersect count: 1");
  });

  test("once unobserves the entry's own target, not a stale element prop, when the element changes before delivery", () => {
    const rendered = render(OnceElementChangeFixture);
    cleanup = rendered.cleanup;
    const elementA = rendered.target.querySelector('[data-testid="el-a"]');
    const elementB = rendered.target.querySelector('[data-testid="el-b"]');
    const switchButton = rendered.target.querySelector(
      '[data-testid="switch"]',
    );
    if (
      !elementA ||
      !elementB ||
      !(switchButton instanceof HTMLButtonElement)
    ) {
      throw new Error("fixture markup missing");
    }

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(elementA)).toBe(true);

    switchButton.click();
    flushSync();

    flushSync(() =>
      observer.trigger([{ target: elementA, isIntersecting: true }]),
    );

    expect(observer.observedElements.has(elementB)).toBe(true);
    expect(observer.observedElements.has(elementA)).toBe(false);
  });

  test("skip pauses and resumes observation without losing state", () => {
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

    toggle.click();
    flushSync();
    expect(observer.observedElements.has(el)).toBe(true);
  });

  test("switching the observed element unobserves the old one and observes the new one", () => {
    const rendered = render(ElementChangeFixture);
    cleanup = rendered.cleanup;
    const elementA = rendered.target.querySelector('[data-testid="element-a"]');
    const elementB = rendered.target.querySelector('[data-testid="element-b"]');
    const switchButton = rendered.target.querySelector(
      '[data-testid="switch"]',
    );
    if (
      !elementA ||
      !elementB ||
      !(switchButton instanceof HTMLButtonElement)
    ) {
      throw new Error("fixture markup missing");
    }

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(elementA)).toBe(true);
    expect(observer.observedElements.has(elementB)).toBe(false);

    switchButton.click();
    flushSync();

    expect(MockIntersectionObserver.instances).toHaveLength(1);
    expect(observer.observedElements.has(elementA)).toBe(false);
    expect(observer.observedElements.has(elementB)).toBe(true);
  });

  test("changing threshold recreates the observer and re-observes the current element", () => {
    const rendered = render(ThresholdChangeFixture);
    cleanup = rendered.cleanup;
    const el = rendered.target.querySelector("div");
    const raiseButton = rendered.target.querySelector(
      '[data-testid="raise-threshold"]',
    );
    if (!el || !(raiseButton instanceof HTMLButtonElement)) {
      throw new Error("fixture markup missing");
    }

    const firstObserver = MockIntersectionObserver.last();
    raiseButton.click();
    flushSync();

    expect(MockIntersectionObserver.instances).toHaveLength(2);
    expect(firstObserver.disconnected).toBe(true);

    const secondObserver = MockIntersectionObserver.last();
    expect(secondObserver.options.threshold).toBe(0.99);
    expect(secondObserver.observedElements.has(el)).toBe(true);
  });

  test("changing rootMargin recreates the observer", () => {
    const rendered = render(RootMarginChangeFixture);
    cleanup = rendered.cleanup;
    const shrinkButton = rendered.target.querySelector(
      '[data-testid="shrink-root-margin"]',
    );
    if (!(shrinkButton instanceof HTMLButtonElement)) {
      throw new Error("fixture markup missing");
    }

    shrinkButton.click();
    flushSync();

    expect(MockIntersectionObserver.instances).toHaveLength(2);
    expect(MockIntersectionObserver.last().options.rootMargin).toBe("-200px");
  });

  test("passes root/rootMargin/threshold through to the underlying observer", () => {
    const threshold = render(ThresholdFixture);
    cleanup = threshold.cleanup;
    expect(MockIntersectionObserver.last().options.threshold).toBe(0.5);
    threshold.cleanup();

    const rootMargin = render(RootMarginFixture);
    cleanup = rootMargin.cleanup;
    expect(MockIntersectionObserver.last().options.rootMargin).toBe("-200px");
  });

  test("root scopes observation to a containing element", () => {
    const rendered = render(RootFixture);
    cleanup = rendered.cleanup;
    const container = rendered.target.querySelector(
      '[data-testid="container"]',
    );
    if (!container) throw new Error("fixture markup missing");

    expect(MockIntersectionObserver.last().options.root).toBe(container);
  });

  test("changing root to a different element of the same tag recreates the observer", () => {
    const rendered = render(RootChangeFixture);
    cleanup = rendered.cleanup;
    const containerA = rendered.target.querySelector('[data-testid="root-a"]');
    const containerB = rendered.target.querySelector('[data-testid="root-b"]');
    const element = rendered.target.querySelector('[data-testid="element"]');
    const swapButton = rendered.target.querySelector(
      '[data-testid="swap-root"]',
    );
    if (
      !containerA ||
      !containerB ||
      !element ||
      !(swapButton instanceof HTMLButtonElement)
    ) {
      throw new Error("fixture markup missing");
    }

    const instanceCountBefore = MockIntersectionObserver.instances.length;
    const firstObserver = MockIntersectionObserver.last();
    expect(firstObserver.root).toBe(containerA);

    swapButton.click();
    flushSync();

    expect(MockIntersectionObserver.instances.length).toBe(
      instanceCountBefore + 1,
    );
    expect(firstObserver.disconnected).toBe(true);

    const secondObserver = MockIntersectionObserver.last();
    expect(secondObserver.root).toBe(containerB);
    expect(secondObserver.observedElements.has(element)).toBe(true);
  });

  test("each block instances get independent observers", () => {
    const rendered = render(EachBindingFixture);
    cleanup = rendered.cleanup;

    expect(MockIntersectionObserver.instances).toHaveLength(3);

    const sectionOne = rendered.target.querySelector(
      '[data-testid="section-one"]',
    );
    if (!sectionOne) throw new Error("fixture markup missing");

    const observerOne = MockIntersectionObserver.instances[0];
    flushSync(() =>
      observerOne.trigger([{ target: sectionOne, isIntersecting: true }]),
    );

    expect(sectionOne.textContent).toContain("visible");
    expect(
      rendered.target.querySelector('[data-testid="section-two"]')?.textContent,
    ).toContain("not visible");
  });

  test("element becoming null unobserves it and resets intersecting/entry; restoring re-observes", () => {
    const rendered = render(ElementNullFixture);
    cleanup = rendered.cleanup;
    const el = rendered.target.querySelector("div");
    const header = rendered.target.querySelector("header");
    const clearButton = rendered.target.querySelector('[data-testid="clear"]');
    const restoreButton = rendered.target.querySelector(
      '[data-testid="restore"]',
    );
    if (
      !el ||
      !header ||
      !(clearButton instanceof HTMLButtonElement) ||
      !(restoreButton instanceof HTMLButtonElement)
    ) {
      throw new Error("fixture markup missing");
    }

    const observer = MockIntersectionObserver.last();
    flushSync(() => observer.trigger([{ target: el, isIntersecting: true }]));
    expect(header.textContent).toContain("Element is in view");

    clearButton.click();
    flushSync();

    expect(observer.observedElements.has(el)).toBe(false);
    expect(header.textContent).toContain("Element is not in view");

    restoreButton.click();
    flushSync();
    expect(observer.observedElements.has(el)).toBe(true);
  });

  test("element becoming undefined unobserves it and resets intersecting/entry; restoring re-observes", () => {
    const rendered = render(ElementUndefinedFixture);
    cleanup = rendered.cleanup;
    const el = rendered.target.querySelector("div");
    const header = rendered.target.querySelector("header");
    const clearButton = rendered.target.querySelector('[data-testid="clear"]');
    const restoreButton = rendered.target.querySelector(
      '[data-testid="restore"]',
    );
    if (
      !el ||
      !header ||
      !(clearButton instanceof HTMLButtonElement) ||
      !(restoreButton instanceof HTMLButtonElement)
    ) {
      throw new Error("fixture markup missing");
    }

    const observer = MockIntersectionObserver.last();
    flushSync(() => observer.trigger([{ target: el, isIntersecting: true }]));
    expect(header.textContent).toContain("Element is in view");

    clearButton.click();
    flushSync();

    expect(observer.observedElements.has(el)).toBe(false);
    expect(header.textContent).toContain("Element is not in view");

    restoreButton.click();
    flushSync();
    expect(observer.observedElements.has(el)).toBe(true);
  });

  test("value-equal but referentially-new threshold arrays do not recreate the observer", () => {
    const rendered = render(ThresholdStableFixture);
    cleanup = rendered.cleanup;
    const unrelatedButton = rendered.target.querySelector(
      '[data-testid="unrelated-button"]',
    );
    if (!(unrelatedButton instanceof HTMLButtonElement)) {
      throw new Error("fixture markup missing");
    }

    expect(
      rendered.target.querySelector('[data-testid="observer-count"]')
        ?.textContent,
    ).toContain("Observer count: 1");

    for (let i = 0; i < 3; i++) {
      unrelatedButton.click();
      flushSync();
    }

    expect(
      rendered.target.querySelector('[data-testid="observer-count"]')
        ?.textContent,
    ).toContain("Observer count: 1");
  });
});
