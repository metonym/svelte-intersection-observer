import { intersect } from "svelte-intersection-observer";
import { describe, expect, test, vi } from "vitest";
import { MockIntersectionObserver } from "./mock-intersection-observer";

/** `intersect()` always returns handlers; narrow away the `Action` type's `void` branch. */
function handlers<T>(action: T): Exclude<T, void> {
  if (!action) throw new Error("intersect() should always return handlers");
  return action as Exclude<T, void>;
}

describe("intersect action", () => {
  test("observes the node with default options", () => {
    const node = document.createElement("div");
    intersect(node);

    const observer = MockIntersectionObserver.last();
    expect(observer.options).toEqual({
      root: null,
      rootMargin: "0px",
      threshold: 0,
    });
    expect(observer.observedElements.has(node)).toBe(true);
  });

  test("does not observe when skip is true", () => {
    const node = document.createElement("div");
    intersect(node, { skip: true });

    expect(MockIntersectionObserver.last().observedElements.has(node)).toBe(
      false,
    );
  });

  test("dispatches observe on every callback and intersect only when intersecting", () => {
    const node = document.createElement("div");
    intersect(node);

    const observeSpy = vi.fn();
    const intersectSpy = vi.fn();
    node.addEventListener("observe", observeSpy);
    node.addEventListener("intersect", intersectSpy);

    const observer = MockIntersectionObserver.last();
    observer.trigger([{ target: node, isIntersecting: false }]);
    expect(observeSpy).toHaveBeenCalledTimes(1);
    expect(intersectSpy).not.toHaveBeenCalled();

    observer.trigger([{ target: node, isIntersecting: true }]);
    expect(observeSpy).toHaveBeenCalledTimes(2);
    expect(intersectSpy).toHaveBeenCalledTimes(1);
  });

  test("once unobserves the node after it intersects", () => {
    const node = document.createElement("div");
    intersect(node, { once: true });

    const observer = MockIntersectionObserver.last();
    observer.trigger([{ target: node, isIntersecting: true }]);

    expect(observer.observedElements.has(node)).toBe(false);
  });

  test("without once, the node stays observed after intersecting", () => {
    const node = document.createElement("div");
    intersect(node);

    const observer = MockIntersectionObserver.last();
    observer.trigger([{ target: node, isIntersecting: true }]);

    expect(observer.observedElements.has(node)).toBe(true);
  });

  test("update() with an unchanged config just toggles skip on the same observer", () => {
    const node = document.createElement("div");
    const action = handlers(intersect(node, {}));

    const observer = MockIntersectionObserver.last();
    action.update?.({ skip: true });

    expect(MockIntersectionObserver.instances).toHaveLength(1);
    expect(observer.observedElements.has(node)).toBe(false);

    action.update?.({ skip: false });
    expect(observer.observedElements.has(node)).toBe(true);
  });

  test("update() with a changed root/rootMargin/threshold recreates the observer", () => {
    const node = document.createElement("div");
    const action = handlers(intersect(node, { rootMargin: "0px" }));

    const firstObserver = MockIntersectionObserver.last();
    action.update?.({ rootMargin: "-200px" });

    expect(MockIntersectionObserver.instances).toHaveLength(2);
    expect(firstObserver.disconnected).toBe(true);

    const secondObserver = MockIntersectionObserver.last();
    expect(secondObserver).not.toBe(firstObserver);
    expect(secondObserver.options.rootMargin).toBe("-200px");
    expect(secondObserver.observedElements.has(node)).toBe(true);
  });

  test("update() does not recreate the observer when a threshold array is unchanged by value", () => {
    const node = document.createElement("div");
    const action = handlers(intersect(node, { threshold: [0, 0.5] }));

    action.update?.({ threshold: [0, 0.5] });

    expect(MockIntersectionObserver.instances).toHaveLength(1);
  });

  test("update() skips re-observing a recreated observer when newSkip is true", () => {
    const node = document.createElement("div");
    const action = handlers(intersect(node, { rootMargin: "0px" }));

    action.update?.({ rootMargin: "-200px", skip: true });

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(node)).toBe(false);
  });

  test("destroy() disconnects the observer", () => {
    const node = document.createElement("div");
    const action = handlers(intersect(node));

    action.destroy?.();

    expect(MockIntersectionObserver.last().disconnected).toBe(true);
  });
});
