import { flushSync } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import MultipleBasicFixture from "../e2e/fixtures/MultipleBasicFixture.svelte";
import MultipleBindingFixture from "../e2e/fixtures/MultipleBindingFixture.svelte";
import MultipleElementsChangeFixture from "../e2e/fixtures/MultipleElementsChangeFixture.svelte";
import MultipleFixture from "../e2e/fixtures/MultipleFixture.svelte";
import MultipleOnceFixture from "../e2e/fixtures/MultipleOnceFixture.svelte";
import MultipleRootChangeFixture from "../e2e/fixtures/MultipleRootChangeFixture.svelte";
import MultipleRootFixture from "../e2e/fixtures/MultipleRootFixture.svelte";
import MultipleRootMarginChangeFixture from "../e2e/fixtures/MultipleRootMarginChangeFixture.svelte";
import MultipleSkipFixture from "../e2e/fixtures/MultipleSkipFixture.svelte";
import MultipleThresholdFixture from "../e2e/fixtures/MultipleThresholdFixture.svelte";
import { MockIntersectionObserver } from "./mock-intersection-observer";
import { render } from "./render";

let cleanup: (() => void) | undefined;

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
});

describe("MultipleIntersectionObserver", () => {
  test("uses a single observer for all elements and tracks each independently", () => {
    const rendered = render(MultipleBasicFixture);
    cleanup = rendered.cleanup;
    const item1 = rendered.target.querySelector('[data-testid="item-1"]');
    const item2 = rendered.target.querySelector('[data-testid="item-2"]');
    if (!item1 || !item2) throw new Error("fixture markup missing");

    expect(MockIntersectionObserver.instances).toHaveLength(1);
    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(item1)).toBe(true);
    expect(observer.observedElements.has(item2)).toBe(true);

    flushSync(() =>
      observer.trigger([{ target: item1, isIntersecting: true }]),
    );

    expect(
      rendered.target.querySelector('[data-testid="item-1-indicator"]')
        ?.textContent,
    ).toContain("✓");
    expect(
      rendered.target.querySelector('[data-testid="item-2-indicator"]')
        ?.textContent,
    ).toContain("✗");
  });

  test("batches multiple entries from the same callback into one reactive update", () => {
    const rendered = render(MultipleFixture);
    cleanup = rendered.cleanup;
    const item1 = rendered.target.querySelector('[data-testid="item-1"]');
    const item2 = rendered.target.querySelector('[data-testid="item-2"]');
    const item3 = rendered.target.querySelector('[data-testid="item-3"]');
    if (!item1 || !item2 || !item3) throw new Error("fixture markup missing");

    const observer = MockIntersectionObserver.last();
    flushSync(() =>
      observer.trigger([
        { target: item1, isIntersecting: true },
        { target: item2, isIntersecting: false },
        { target: item3, isIntersecting: true },
      ]),
    );

    expect(
      rendered.target.querySelector('[data-testid="item-1-status"]')
        ?.textContent,
    ).toContain("Item 1 is visible");
    expect(
      rendered.target.querySelector('[data-testid="item-2-status"]')
        ?.textContent,
    ).toContain("Item 2 is not visible");
    expect(
      rendered.target.querySelector('[data-testid="item-3-status"]')
        ?.textContent,
    ).toContain("Item 3 is visible");
  });

  test("passes threshold through to the underlying observer", () => {
    const rendered = render(MultipleThresholdFixture);
    cleanup = rendered.cleanup;
    expect(MockIntersectionObserver.last().options.threshold).toBe(0.5);
  });

  test("bind:elementIntersections exposes reactive state to the parent", () => {
    const rendered = render(MultipleBindingFixture);
    cleanup = rendered.cleanup;
    const item1 = rendered.target.querySelector('[data-testid="item-1"]');
    if (!item1) throw new Error("fixture markup missing");

    expect(
      rendered.target
        .querySelector('[data-testid="header"]')
        ?.getAttribute("data-any-visible"),
    ).toBe("false");

    const observer = MockIntersectionObserver.last();
    flushSync(() =>
      observer.trigger([{ target: item1, isIntersecting: true }]),
    );

    expect(
      rendered.target
        .querySelector('[data-testid="header"]')
        ?.getAttribute("data-any-visible"),
    ).toBe("true");
    expect(
      rendered.target
        .querySelector('[data-testid="item-1"]')
        ?.getAttribute("data-visible"),
    ).toBe("true");
  });

  test("adding and removing elements updates observation without recreating the observer", () => {
    const rendered = render(MultipleElementsChangeFixture);
    cleanup = rendered.cleanup;
    const item1 = rendered.target.querySelector('[data-testid="item-1"]');
    const item2 = rendered.target.querySelector('[data-testid="item-2"]');
    const addButton = rendered.target.querySelector(
      '[data-testid="add-item-2"]',
    );
    const removeButton = rendered.target.querySelector(
      '[data-testid="remove-item-1"]',
    );
    if (
      !item1 ||
      !item2 ||
      !(addButton instanceof HTMLButtonElement) ||
      !(removeButton instanceof HTMLButtonElement)
    ) {
      throw new Error("fixture markup missing");
    }

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(item1)).toBe(true);
    expect(observer.observedElements.has(item2)).toBe(false);

    addButton.click();
    flushSync();
    expect(observer.observedElements.has(item2)).toBe(true);

    removeButton.click();
    flushSync();
    expect(observer.observedElements.has(item1)).toBe(false);
    expect(observer.observedElements.has(item2)).toBe(true);
    expect(MockIntersectionObserver.instances).toHaveLength(1);
  });

  test("removing the only element empties the array, unobserves it, and clears map entries; re-adding it re-observes", () => {
    const rendered = render(MultipleElementsChangeFixture);
    cleanup = rendered.cleanup;
    const item1 = rendered.target.querySelector('[data-testid="item-1"]');
    const removeButton = rendered.target.querySelector(
      '[data-testid="remove-item-1"]',
    );
    const addButton = rendered.target.querySelector(
      '[data-testid="add-item-1"]',
    );
    if (
      !item1 ||
      !(removeButton instanceof HTMLButtonElement) ||
      !(addButton instanceof HTMLButtonElement)
    ) {
      throw new Error("fixture markup missing");
    }

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(item1)).toBe(true);

    removeButton.click();
    flushSync();

    expect(observer.observedElements.has(item1)).toBe(false);
    expect(
      rendered.target.querySelector('[data-testid="item-1-map-status"]')
        ?.textContent,
    ).toContain("Item 1 is not in maps");
    expect(MockIntersectionObserver.instances).toHaveLength(1);

    addButton.click();
    flushSync();
    expect(observer.observedElements.has(item1)).toBe(true);
  });

  test("once unobserves only the target that intersected", () => {
    const rendered = render(MultipleOnceFixture);
    cleanup = rendered.cleanup;
    const item1 = rendered.target.querySelector('[data-testid="item-1"]');
    const item2 = rendered.target.querySelector('[data-testid="item-2"]');
    if (!item1 || !item2) throw new Error("fixture markup missing");

    const observer = MockIntersectionObserver.last();
    flushSync(() =>
      observer.trigger([{ target: item1, isIntersecting: true }]),
    );

    expect(observer.observedElements.has(item1)).toBe(false);
    expect(observer.observedElements.has(item2)).toBe(true);
    expect(
      rendered.target.querySelector('[data-testid="item-1-count"]')
        ?.textContent,
    ).toContain("Item 1 intersect count: 1");
    expect(
      rendered.target.querySelector('[data-testid="item-2-count"]')
        ?.textContent,
    ).toContain("Item 2 intersect count: 0");
  });

  test("root scopes observation to a containing element", () => {
    const rendered = render(MultipleRootFixture);
    cleanup = rendered.cleanup;
    const container = rendered.target.querySelector(
      '[data-testid="container"]',
    );
    if (!container) throw new Error("fixture markup missing");

    expect(MockIntersectionObserver.last().options.root).toBe(container);
  });

  test("changing root to a different element of the same tag recreates the observer and re-observes all elements", () => {
    const rendered = render(MultipleRootChangeFixture);
    cleanup = rendered.cleanup;
    const containerA = rendered.target.querySelector('[data-testid="root-a"]');
    const containerB = rendered.target.querySelector('[data-testid="root-b"]');
    const item1 = rendered.target.querySelector('[data-testid="item-1"]');
    const item2 = rendered.target.querySelector('[data-testid="item-2"]');
    const swapButton = rendered.target.querySelector(
      '[data-testid="swap-root"]',
    );
    if (
      !containerA ||
      !containerB ||
      !item1 ||
      !item2 ||
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
    expect(secondObserver.observedElements.has(item1)).toBe(true);
    expect(secondObserver.observedElements.has(item2)).toBe(true);
  });

  test("changing rootMargin recreates the observer and re-observes current elements", () => {
    const rendered = render(MultipleRootMarginChangeFixture);
    cleanup = rendered.cleanup;
    const shrinkButton = rendered.target.querySelector(
      '[data-testid="shrink-root-margin"]',
    );
    if (!(shrinkButton instanceof HTMLButtonElement)) {
      throw new Error("fixture markup missing");
    }

    const firstObserver = MockIntersectionObserver.last();
    shrinkButton.click();
    flushSync();

    expect(MockIntersectionObserver.instances).toHaveLength(2);
    expect(firstObserver.disconnected).toBe(true);
    expect(MockIntersectionObserver.last().options.rootMargin).toBe("-200px");
  });

  test("skip pauses and resumes observation of all elements", () => {
    const rendered = render(MultipleSkipFixture);
    cleanup = rendered.cleanup;
    const item1 = rendered.target.querySelector('[data-testid="item-1"]');
    const item2 = rendered.target.querySelector('[data-testid="item-2"]');
    const toggle = rendered.target.querySelector('[data-testid="toggle-skip"]');
    if (!item1 || !item2 || !(toggle instanceof HTMLButtonElement)) {
      throw new Error("fixture markup missing");
    }

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(item1)).toBe(true);
    expect(observer.observedElements.has(item2)).toBe(true);

    toggle.click();
    flushSync();
    expect(observer.observedElements.has(item1)).toBe(false);
    expect(observer.observedElements.has(item2)).toBe(false);

    toggle.click();
    flushSync();
    expect(observer.observedElements.has(item1)).toBe(true);
    expect(observer.observedElements.has(item2)).toBe(true);
  });
});
