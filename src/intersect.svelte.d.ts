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
