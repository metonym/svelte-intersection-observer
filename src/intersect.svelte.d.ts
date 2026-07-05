import type { Action } from "svelte/action";
import type { Attachment } from "svelte/attachments";

export interface IntersectActionOptions {
  /**
   * Specify the containing element.
   * Defaults to the browser viewport.
   * @default null
   */
  root?: null | HTMLElement;

  /**
   * Margin offset of the containing element.
   * @default "0px"
   */
  rootMargin?: string;

  /**
   * Percentage of element visibility to trigger an event.
   * Value must be a number between 0 and 1, or an array of numbers between 0 and 1.
   * @default 0
   */
  threshold?: number | number[];

  /**
   * Set to `true` to unobserve the element
   * after it intersects the viewport.
   * @default false
   */
  once?: boolean;

  /**
   * Set to `true` to pause observing without disconnecting the
   * observer. Set back to `false` to resume.
   * @default false
   */
  skip?: boolean;
}

/**
 * Svelte action that observes the element with the Intersection Observer API.
 * Dispatches `observe` (on every change) and `intersect` (on entering the
 * viewport) `CustomEvent`s on the element — listen with `onobserve`/`onintersect`.
 */
export const intersect: Action<
  HTMLElement,
  IntersectActionOptions | undefined,
  {
    onobserve?: (event: CustomEvent<IntersectionObserverEntry>) => void;
    onintersect?: (
      event: CustomEvent<IntersectionObserverEntry & { isIntersecting: true }>,
    ) => void;
  }
>;

/**
 * Svelte attachment that observes the element with the Intersection Observer
 * API. Equivalent to `intersect`, for use with `{@attach}` instead of `use:`.
 */
export function intersectAttachment(
  getOptions?: () => IntersectActionOptions,
): Attachment<HTMLElement>;

declare module "svelte/elements" {
  export interface HTMLAttributes<T> {
    onobserve?: (event: CustomEvent<IntersectionObserverEntry>) => void;
    onintersect?: (
      event: CustomEvent<IntersectionObserverEntry & { isIntersecting: true }>,
    ) => void;
  }
}

/**
 * Options shared by every node in an `createIntersectionGroup` group. These
 * configure the one underlying `IntersectionObserver` instance, so they
 * can't vary per node.
 */
export interface IntersectGroupSharedOptions {
  /**
   * Specify the containing element.
   * Defaults to the browser viewport.
   * @default null
   */
  root?: null | HTMLElement;

  /**
   * Margin offset of the containing element.
   * @default "0px"
   */
  rootMargin?: string;

  /**
   * Percentage of element visibility to trigger an event.
   * Value must be a number between 0 and 1, or an array of numbers between 0 and 1.
   * @default 0
   */
  threshold?: number | number[];
}

/**
 * Per-node options for a single element within an `createIntersectionGroup` group.
 */
export interface IntersectGroupNodeOptions {
  /**
   * Set to `true` to unobserve the element
   * after it intersects the viewport.
   * @default false
   */
  once?: boolean;

  /**
   * Set to `true` to skip observing this element without
   * affecting the rest of the group.
   * @default false
   */
  skip?: boolean;

  /** Called when the element is first observed and also whenever an intersection change occurs. */
  onobserve?: (entry: IntersectionObserverEntry) => void;

  /** Called only when the element is intersecting the viewport. */
  onintersect?: (
    entry: IntersectionObserverEntry & { isIntersecting: true },
  ) => void;
}

export interface IntersectionGroup {
  /**
   * Returns an attachment for a single node in the group. Call once per
   * element in a loop, e.g. `{@attach group.attach({ onobserve })}`.
   */
  attach(options?: IntersectGroupNodeOptions): Attachment<HTMLElement>;
}

/**
 * Creates a group of elements backed by a single shared `IntersectionObserver`
 * instance, for use with `{@attach}` inside an `#each` block. Brings
 * `MultipleIntersectionObserver`'s single-observer performance benefit to the
 * action/attachment API. Changing shared options rebuilds the single shared
 * observer and re-observes every element in the group; elements whose `once`
 * already fired are re-observed as well, so their callbacks may fire again
 * under the new config.
 */
export function createIntersectionGroup(
  getSharedOptions?: () => IntersectGroupSharedOptions,
): IntersectionGroup;
