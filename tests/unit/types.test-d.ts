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
    root?: Element | Document | null;
    rootMargin?: string;
    threshold?: number | number[];
    once?: boolean;
    skip?: boolean;
  }>();
});

test("intersect is a Svelte action dispatching observe/intersect/exit handlers", () => {
  expectTypeOf(intersect).toEqualTypeOf<
    Action<
      Element,
      IntersectActionOptions | undefined,
      {
        onobserve?: (event: CustomEvent<IntersectionObserverEntry>) => void;
        onintersect?: (
          event: CustomEvent<
            IntersectionObserverEntry & { isIntersecting: true }
          >,
        ) => void;
        onexit?: (
          event: CustomEvent<
            IntersectionObserverEntry & { isIntersecting: false }
          >,
        ) => void;
      }
    >
  >();
});

test("svelte/elements HTMLAttributes.onexit entry param types as isIntersecting: false", () => {
  expectTypeOf<
    import("svelte/elements").HTMLAttributes<Element>["onexit"]
  >().toEqualTypeOf<
    | ((
        event: CustomEvent<
          IntersectionObserverEntry & { isIntersecting: false }
        >,
      ) => void)
    | undefined
  >();
});

test("intersect is usable on SVGElement", () => {
  expectTypeOf(intersect).toBeCallableWith(
    {} as SVGElement,
    {} as IntersectActionOptions,
  );
});

test("intersectAttachment returns an Attachment<Element>", () => {
  expectTypeOf(intersectAttachment).toEqualTypeOf<
    (getOptions?: () => IntersectActionOptions) => Attachment<Element>
  >();
});

test("IntersectGroupSharedOptions covers only the observer-wide options", () => {
  expectTypeOf<IntersectGroupSharedOptions>().toEqualTypeOf<{
    root?: Element | Document | null;
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
    onexit?: (
      entry: IntersectionObserverEntry & { isIntersecting: false },
    ) => void;
  }>();
});

test("IntersectionGroup.attach accepts node options and returns an Attachment", () => {
  expectTypeOf<IntersectionGroup>()
    .toHaveProperty("attach")
    .toEqualTypeOf<
      (options?: IntersectGroupNodeOptions) => Attachment<Element>
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
    attach: Attachment<Element>;
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

test("IntersectionObserverProps.element accepts SVGElement | undefined and null", () => {
  expectTypeOf<SVGElement | undefined>().toExtend<
    IntersectionObserverProps["element"]
  >();
  expectTypeOf<null>().toExtend<IntersectionObserverProps["element"]>();
});

test("IntersectionObserverProps.root accepts Document", () => {
  expectTypeOf<Document>().toExtend<IntersectionObserverProps["root"]>();
});

test("IntersectionObserverProps.onexit entry param types as isIntersecting: false", () => {
  expectTypeOf<IntersectionObserverProps["onexit"]>().toEqualTypeOf<
    | ((entry: IntersectionObserverEntry & { isIntersecting: false }) => void)
    | undefined
  >();
});

test("MultipleIntersectionObserverProps.elements accepts (HTMLElement | undefined)[]", () => {
  expectTypeOf<(HTMLElement | undefined)[]>().toExtend<
    MultipleIntersectionObserverProps["elements"]
  >();
});

test("MultipleIntersectionObserverProps.root accepts Document", () => {
  expectTypeOf<Document>().toExtend<
    MultipleIntersectionObserverProps["root"]
  >();
});

test("MultipleIntersectionObserverProps.onexit entry param types as isIntersecting: false", () => {
  expectTypeOf<MultipleIntersectionObserverProps["onexit"]>().toEqualTypeOf<
    | ((detail: {
        entry: IntersectionObserverEntry & { isIntersecting: false };
        target: Element;
      }) => void)
    | undefined
  >();
});

test("elementIntersections.get type-checks with an HTMLElement | undefined ref", () => {
  const ref = {} as HTMLElement | undefined;
  const elementIntersections = {} as NonNullable<
    MultipleIntersectionObserverProps["elementIntersections"]
  >;
  expectTypeOf(elementIntersections.get(ref)).toEqualTypeOf<
    boolean | undefined
  >();
});
