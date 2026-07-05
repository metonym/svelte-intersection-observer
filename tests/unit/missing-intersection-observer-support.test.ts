import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import ActionFixture from "../e2e/fixtures/ActionFixture.svelte";
import BasicFixture from "../e2e/fixtures/BasicFixture.svelte";
import MultipleBasicFixture from "../e2e/fixtures/MultipleBasicFixture.svelte";
import { render } from "./render";

// setup.ts's global beforeEach stubs a mocked IntersectionObserver; these
// tests override it to be absent, matching environments without support
// (old browsers, some SSR contexts).
beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", undefined);
});

let cleanup: (() => void) | undefined;

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
});

describe("missing IntersectionObserver support", () => {
  test("IntersectionObserver component degrades gracefully without throwing", () => {
    let rendered: ReturnType<typeof render> | undefined;

    expect(() => {
      rendered = render(BasicFixture);
    }).not.toThrow();

    cleanup = rendered?.cleanup;
    expect(rendered?.target.querySelector("header")?.textContent).toContain(
      "Element is not in view",
    );
  });

  test("MultipleIntersectionObserver component degrades gracefully without throwing", () => {
    let rendered: ReturnType<typeof render> | undefined;

    expect(() => {
      rendered = render(MultipleBasicFixture);
    }).not.toThrow();

    cleanup = rendered?.cleanup;
    expect(
      rendered?.target.querySelector('[data-testid="item-1-indicator"]')
        ?.textContent,
    ).toContain("✗");
  });

  test("intersect action degrades gracefully without throwing", () => {
    let rendered: ReturnType<typeof render> | undefined;

    expect(() => {
      rendered = render(ActionFixture);
    }).not.toThrow();

    cleanup = rendered?.cleanup;
    expect(rendered?.target.querySelector("header")?.textContent).toContain(
      "Element is not in view",
    );
  });
});
