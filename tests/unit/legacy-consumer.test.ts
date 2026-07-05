import { flushSync } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import LegacyActionConsumerFixture from "../e2e/fixtures/LegacyActionConsumerFixture.svelte";
import LegacyAttachmentConsumerFixture from "../e2e/fixtures/LegacyAttachmentConsumerFixture.svelte";
import LegacyComposableConsumerFixture from "../e2e/fixtures/LegacyComposableConsumerFixture.svelte";
import LegacyConsumerFixture from "../e2e/fixtures/LegacyConsumerFixture.svelte";
import LegacyGroupConsumerFixture from "../e2e/fixtures/LegacyGroupConsumerFixture.svelte";
import LegacyMultipleConsumerFixture from "../e2e/fixtures/LegacyMultipleConsumerFixture.svelte";
import { MockIntersectionObserver } from "./mock-intersection-observer";
import { render } from "./render";

// Every primitive here is implemented with runes ($props, $bindable, $state),
// but Svelte 5 lets a non-runes ("legacy", `<svelte:options runes={false}/>`)
// parent consume them. Each fixture below locks in `runes={false}` (so it
// can't silently drift into runes mode) and exercises one primitive from
// that legacy parent, confirming bind:/callback props/`{@attach}`/snippets
// and legacy `$:` reactivity all interoperate correctly across the boundary.

let cleanup: (() => void) | undefined;

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
});

describe("legacy (non-runes) consumer", () => {
  test("IntersectionObserver: bind:intersecting updates a legacy $: derived value and onexit fires", () => {
    const rendered = render(LegacyConsumerFixture);
    cleanup = rendered.cleanup;
    const header = rendered.target.querySelector("header");
    const el = rendered.target.querySelector('[data-testid="exit-count"]');
    if (!header || !el) throw new Error("fixture markup missing");

    expect(header.textContent).toContain("Element is not in view");

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(el)).toBe(true);

    flushSync(() => observer.trigger([{ target: el, isIntersecting: true }]));
    expect(header.textContent).toContain("Element is in view");
    expect(el.textContent).toContain("Exit count: 0");

    flushSync(() => observer.trigger([{ target: el, isIntersecting: false }]));
    expect(header.textContent).toContain("Element is not in view");
    expect(el.textContent).toContain("Exit count: 1");
  });

  test("MultipleIntersectionObserver: snippet params reflect per-element state via a legacy $: elements array", () => {
    const rendered = render(LegacyMultipleConsumerFixture);
    cleanup = rendered.cleanup;
    const item1 = rendered.target.querySelector('[data-testid="item-1"]');
    const item2 = rendered.target.querySelector('[data-testid="item-2"]');
    if (!item1 || !item2) throw new Error("fixture markup missing");

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(item1)).toBe(true);
    expect(observer.observedElements.has(item2)).toBe(true);

    flushSync(() =>
      observer.trigger([{ target: item1, isIntersecting: true }]),
    );

    expect(
      rendered.target.querySelector('[data-testid="item-1-status"]')
        ?.textContent,
    ).toContain("Item 1: visible");
    expect(
      rendered.target.querySelector('[data-testid="item-2-status"]')
        ?.textContent,
    ).toContain("Item 2: not visible");
  });

  test("intersect action: use:intersect updates legacy state via onobserve/onexit callback props", () => {
    const rendered = render(LegacyActionConsumerFixture);
    cleanup = rendered.cleanup;
    const header = rendered.target.querySelector("header");
    const el = rendered.target.querySelector('[data-testid="target"]');
    if (!header || !el) throw new Error("fixture markup missing");

    expect(header.textContent).toContain("Element is not in view");

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(el)).toBe(true);

    flushSync(() => observer.trigger([{ target: el, isIntersecting: true }]));
    expect(header.textContent).toContain("Element is in view");

    flushSync(() => observer.trigger([{ target: el, isIntersecting: false }]));
    expect(header.textContent).toContain("Element is not in view");
    expect(
      rendered.target.querySelector('[data-testid="exit-count"]')?.textContent,
    ).toContain("Exit count: 1");
  });

  test("intersectAttachment: {@attach} updates legacy state via onobserve/onexit callback props", () => {
    const rendered = render(LegacyAttachmentConsumerFixture);
    cleanup = rendered.cleanup;
    const header = rendered.target.querySelector("header");
    const el = rendered.target.querySelector('[data-testid="target"]');
    if (!header || !el) throw new Error("fixture markup missing");

    expect(header.textContent).toContain("Element is not in view");

    const observer = MockIntersectionObserver.last();
    expect(observer.observedElements.has(el)).toBe(true);

    flushSync(() => observer.trigger([{ target: el, isIntersecting: true }]));
    expect(header.textContent).toContain("Element is in view");

    flushSync(() => observer.trigger([{ target: el, isIntersecting: false }]));
    expect(header.textContent).toContain("Element is not in view");
    expect(
      rendered.target.querySelector('[data-testid="exit-count"]')?.textContent,
    ).toContain("Exit count: 1");
  });

  // Unlike the other primitives, `createIntersectionObserver` exposes state
  // via plain getters (no bind:/callback prop) — a legacy-mode consumer reads
  // those getters directly in the template. Svelte's legacy compiler wraps
  // such reads in `untrack()` (dependencies are inferred syntactically from
  // reassigned local `let`s, not from external reactive getters), so the
  // getter's *value* is correct at every read, but the template does not
  // re-render when it changes underneath a legacy parent.
  test("createIntersectionObserver: side effects (unobserve on `once`) still run, but the legacy template does not re-render off the getter", () => {
    const rendered = render(LegacyComposableConsumerFixture);
    cleanup = rendered.cleanup;
    const header = rendered.target.querySelector("header");
    const el = rendered.target.querySelector('[data-testid="target"]');
    if (!header || !el) throw new Error("fixture markup missing");

    expect(header.textContent).toContain("Element is not in view");

    const observer = MockIntersectionObserver.last();
    flushSync(() => observer.trigger([{ target: el, isIntersecting: true }]));

    // `once: true` still unobserves — that's driven by the composable's own
    // internal event listener, not by legacy template reactivity.
    expect(observer.observedElements.has(el)).toBe(false);

    // But the legacy `<header>` text never updates to reflect it.
    expect(header.textContent).toContain("Element is not in view");
  });

  test("createIntersectionGroup: one shared observer drives independent legacy state per element", () => {
    const rendered = render(LegacyGroupConsumerFixture);
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
      rendered.target.querySelector('[data-testid="item-1-status"]')
        ?.textContent,
    ).toContain("Item 1 is visible");
    expect(
      rendered.target.querySelector('[data-testid="item-2-status"]')
        ?.textContent,
    ).toContain("Item 2 is not visible");
  });
});
