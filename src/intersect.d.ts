import type { Action } from "svelte/action";

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
}

/**
 * Svelte action that observes the element with the Intersection Observer API.
 * Dispatches `observe` (on every change) and `intersect` (on entering the
 * viewport) `CustomEvent`s on the element — listen with `on:observe`/`on:intersect`.
 */
export const intersect: Action<
  HTMLElement,
  IntersectActionOptions | undefined,
  {
    "on:observe"?: (event: CustomEvent<IntersectionObserverEntry>) => void;
    "on:intersect"?: (event: CustomEvent<IntersectionObserverEntry & { isIntersecting: true }>) => void;
  }
>;
