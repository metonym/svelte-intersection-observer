import type { Component, ComponentProps } from "svelte";
import type { Action } from "svelte/action";
import type { Attachment } from "svelte/attachments";
import type {
  IntersectActionOptions,
  IntersectGroupNodeOptions,
  IntersectGroupSharedOptions,
  IntersectionGroup,
  IntersectionObserverState,
} from "svelte-intersection-observer";
import IntersectionObserverComponent, {
  createIntersectionGroup,
  createIntersectionObserver,
  intersect,
  intersectAttachment,
  MultipleIntersectionObserver,
} from "svelte-intersection-observer";
import type { IntersectionObserverProps } from "svelte-intersection-observer/IntersectionObserver.svelte";
import type { MultipleIntersectionObserverProps } from "svelte-intersection-observer/MultipleIntersectionObserver.svelte";
import { expectTypeOf, test } from "vitest";

test("IntersectActionOptions accepts the documented shape", () => {
  expectTypeOf<IntersectActionOptions>().toEqualTypeOf<{
    root?: null | HTMLElement;
    rootMargin?: string;
    threshold?: number | number[];
    once?: boolean;
    skip?: boolean;
  }>();
});

test("intersect is a Svelte action dispatching observe/intersect handlers", () => {
  expectTypeOf(intersect).toEqualTypeOf<
    Action<
      HTMLElement,
      IntersectActionOptions | undefined,
      {
        onobserve?: (event: CustomEvent<IntersectionObserverEntry>) => void;
        onintersect?: (
          event: CustomEvent<
            IntersectionObserverEntry & { isIntersecting: true }
          >,
        ) => void;
      }
    >
  >();
});

test("intersectAttachment returns an Attachment<HTMLElement>", () => {
  expectTypeOf(intersectAttachment).toEqualTypeOf<
    (getOptions?: () => IntersectActionOptions) => Attachment<HTMLElement>
  >();
});

test("IntersectGroupSharedOptions covers only the observer-wide options", () => {
  expectTypeOf<IntersectGroupSharedOptions>().toEqualTypeOf<{
    root?: null | HTMLElement;
    rootMargin?: string;
    threshold?: number | number[];
  }>();
});

test("IntersectGroupNodeOptions covers only the per-node options", () => {
  expectTypeOf<IntersectGroupNodeOptions>().toEqualTypeOf<{
    once?: boolean;
    skip?: boolean;
    onobserve?: (entry: IntersectionObserverEntry) => void;
    onintersect?: (
      entry: IntersectionObserverEntry & { isIntersecting: true },
    ) => void;
  }>();
});

test("IntersectionGroup.attach accepts node options and returns an Attachment", () => {
  expectTypeOf<IntersectionGroup>()
    .toHaveProperty("attach")
    .toEqualTypeOf<
      (options?: IntersectGroupNodeOptions) => Attachment<HTMLElement>
    >();
});

test("createIntersectionGroup returns an IntersectionGroup", () => {
  expectTypeOf(createIntersectionGroup).toEqualTypeOf<
    (getSharedOptions?: () => IntersectGroupSharedOptions) => IntersectionGroup
  >();
});

test("IntersectionObserverState exposes readonly intersecting/entry and an attach Attachment", () => {
  expectTypeOf<IntersectionObserverState>().toEqualTypeOf<{
    readonly intersecting: boolean;
    readonly entry: null | IntersectionObserverEntry;
    attach: Attachment<HTMLElement>;
  }>();
});

test("createIntersectionObserver returns an IntersectionObserverState", () => {
  expectTypeOf(createIntersectionObserver).toEqualTypeOf<
    (getOptions?: () => IntersectActionOptions) => IntersectionObserverState
  >();
});

test("default export is the IntersectionObserver component with its bindable props", () => {
  expectTypeOf(IntersectionObserverComponent).toEqualTypeOf<
    Component<
      IntersectionObserverProps,
      Record<string, never>,
      "intersecting" | "entry" | "observer"
    >
  >();
  expectTypeOf<
    ComponentProps<typeof IntersectionObserverComponent>
  >().toEqualTypeOf<IntersectionObserverProps>();
});

test("MultipleIntersectionObserver component exposes its bindable props", () => {
  expectTypeOf(MultipleIntersectionObserver).toEqualTypeOf<
    Component<
      MultipleIntersectionObserverProps,
      Record<string, never>,
      "elementIntersections" | "elementEntries" | "observer"
    >
  >();
  expectTypeOf<
    ComponentProps<typeof MultipleIntersectionObserver>
  >().toEqualTypeOf<MultipleIntersectionObserverProps>();
});
