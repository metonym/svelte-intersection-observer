import { flushSync } from "svelte";
import { createIntersectionGroup } from "svelte-intersection-observer";
import { afterEach, describe, expect, test, vi } from "vitest";
import GroupSharedOptionsChangeFixture from "../e2e/fixtures/GroupSharedOptionsChangeFixture.svelte";
import IntersectionGroupFixture from "../e2e/fixtures/IntersectionGroupFixture.svelte";
import { MockIntersectionObserver } from "./mock-intersection-observer";
import { render } from "./render";

// `group.attach(...)` returns a plain `(node) => cleanup` function — unlike
// `intersectAttachment`, it doesn't go through `fromAction`'s render-effect
// plumbing, so the core logic is testable directly without mounting a
// component.
describe("createIntersectionGroup", () => {
  test("lazily creates one shared observer across multiple attach() calls", () => {
    const group = createIntersectionGroup();
    const nodeA = document.createElement("div");
    const nodeB = document.createElement("div");

    expect(MockIntersectionObserver.instances).toHaveLength(0);

    group.attach()(nodeA);
    expect(MockIntersectionObserver.instances).toHaveLength(1);

    group.attach()(nodeB);
    expect(MockIntersectionObserver.instances).toHaveLength(1);

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(nodeA)).toBe(true);
    expect(observer.observedElements.has(nodeB)).toBe(true);
  });

  test("skip prevents the initial observe for that node only", () => {
    const group = createIntersectionGroup();
    const nodeA = document.createElement("div");
    const nodeB = document.createElement("div");

    group.attach({ skip: true })(nodeA);
    group.attach()(nodeB);

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(nodeA)).toBe(false);
    expect(observer.observedElements.has(nodeB)).toBe(true);
  });

  test("dispatches onobserve/onintersect only to the matching node's callbacks", () => {
    const group = createIntersectionGroup();
    const nodeA = document.createElement("div");
    const nodeB = document.createElement("div");

    const observeA = vi.fn();
    const intersectA = vi.fn();
    const observeB = vi.fn();

    group.attach({ onobserve: observeA, onintersect: intersectA })(nodeA);
    group.attach({ onobserve: observeB })(nodeB);

    const observer = MockIntersectionObserver.last();
    observer.trigger([
      { target: nodeA, isIntersecting: true },
      { target: nodeB, isIntersecting: false },
    ]);

    expect(observeA).toHaveBeenCalledTimes(1);
    expect(intersectA).toHaveBeenCalledTimes(1);
    expect(observeB).toHaveBeenCalledTimes(1);
  });

  test("once unobserves only the node that intersected", () => {
    const group = createIntersectionGroup();
    const nodeA = document.createElement("div");
    const nodeB = document.createElement("div");

    group.attach({ once: true })(nodeA);
    group.attach()(nodeB);

    const observer = MockIntersectionObserver.last();
    observer.trigger([{ target: nodeA, isIntersecting: true }]);

    expect(observer.observedElements.has(nodeA)).toBe(false);
    expect(observer.observedElements.has(nodeB)).toBe(true);
  });

  test("detaching one node unobserves it without tearing down the shared observer", () => {
    const group = createIntersectionGroup();
    const nodeA = document.createElement("div");
    const nodeB = document.createElement("div");

    const detachA = group.attach()(nodeA);
    group.attach()(nodeB);

    const observer = MockIntersectionObserver.last();
    detachA?.();

    expect(observer.observedElements.has(nodeA)).toBe(false);
    expect(observer.observedElements.has(nodeB)).toBe(true);
    expect(observer.disconnected).toBe(false);
  });

  test("detaching the last node disconnects the observer; the next attach() creates a fresh one", () => {
    const group = createIntersectionGroup();
    const nodeA = document.createElement("div");

    const detachA = group.attach()(nodeA);
    const firstObserver = MockIntersectionObserver.last();

    detachA?.();
    expect(firstObserver.disconnected).toBe(true);
    expect(MockIntersectionObserver.instances).toHaveLength(1);

    const nodeB = document.createElement("div");
    group.attach()(nodeB);

    expect(MockIntersectionObserver.instances).toHaveLength(2);
    expect(MockIntersectionObserver.last()).not.toBe(firstObserver);
  });

  test("shared options are read once, when the observer is (re)created — not reactively", () => {
    let rootMargin = "0px";
    const group = createIntersectionGroup(() => ({ rootMargin }));
    const nodeA = document.createElement("div");

    const detachA = group.attach()(nodeA);
    expect(MockIntersectionObserver.last().options.rootMargin).toBe("0px");

    // The group already has a live observer; changing what the options
    // function returns must not retroactively reconfigure it.
    rootMargin = "-200px";
    detachA?.();

    const nodeB = document.createElement("div");
    group.attach()(nodeB);

    expect(MockIntersectionObserver.instances).toHaveLength(2);
    expect(MockIntersectionObserver.last().options.rootMargin).toBe("-200px");
  });
});

describe("createIntersectionGroup (component integration)", () => {
  let cleanup: (() => void) | undefined;

  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
  });

  test("shares a single observer across #each items and dispatches per-node callbacks", () => {
    const rendered = render(IntersectionGroupFixture);
    cleanup = rendered.cleanup;
    const item2 = rendered.target.querySelector('[data-testid="item-2"]');
    if (!item2) throw new Error("fixture markup missing");

    expect(
      rendered.target.querySelector('[data-testid="observer-count"]')
        ?.textContent,
    ).toContain("Observer count: 1");

    const observer = MockIntersectionObserver.last();
    flushSync(() =>
      observer.trigger([{ target: item2, isIntersecting: true }]),
    );

    expect(
      rendered.target.querySelector('[data-testid="item-1-status"]')
        ?.textContent,
    ).toContain("Item 1 is not visible");
    expect(
      rendered.target.querySelector('[data-testid="item-2-status"]')
        ?.textContent,
    ).toContain("Item 2 is visible");

    expect(
      rendered.target.querySelector('[data-testid="observer-count"]')
        ?.textContent,
    ).toContain("Observer count: 1");
  });

  test("rebuilds the shared observer and re-observes every node when shared options change", () => {
    const rendered = render(GroupSharedOptionsChangeFixture);
    cleanup = rendered.cleanup;
    const item1 = rendered.target.querySelector('[data-testid="item-1"]');
    const item2 = rendered.target.querySelector('[data-testid="item-2"]');
    const button = rendered.target.querySelector<HTMLButtonElement>(
      '[data-testid="grow-root-margin"]',
    );
    if (!item1 || !item2 || !button) throw new Error("fixture markup missing");

    expect(MockIntersectionObserver.instances).toHaveLength(1);
    const firstObserver = MockIntersectionObserver.last();

    flushSync(() => button.click());

    expect(MockIntersectionObserver.instances).toHaveLength(2);
    expect(firstObserver.disconnected).toBe(true);

    const secondObserver = MockIntersectionObserver.last();
    expect(secondObserver.options.rootMargin).toBe("100px");
    expect(secondObserver.observedElements.has(item1)).toBe(true);
    expect(secondObserver.observedElements.has(item2)).toBe(true);
  });

  test("keeps tracking shared options reactively across repeated changes", () => {
    const rendered = render(GroupSharedOptionsChangeFixture);
    cleanup = rendered.cleanup;
    const item1 = rendered.target.querySelector('[data-testid="item-1"]');
    const item2 = rendered.target.querySelector('[data-testid="item-2"]');
    const button = rendered.target.querySelector<HTMLButtonElement>(
      '[data-testid="grow-root-margin"]',
    );
    if (!item1 || !item2 || !button) throw new Error("fixture markup missing");

    flushSync(() => button.click());
    expect(MockIntersectionObserver.last().options.rootMargin).toBe("100px");

    flushSync(() => button.click());

    expect(MockIntersectionObserver.instances).toHaveLength(3);
    const thirdObserver = MockIntersectionObserver.last();
    expect(thirdObserver.options.rootMargin).toBe("200px");
    expect(thirdObserver.observedElements.has(item1)).toBe(true);
    expect(thirdObserver.observedElements.has(item2)).toBe(true);
  });
});
