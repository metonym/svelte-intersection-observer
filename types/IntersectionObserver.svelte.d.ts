/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export type Entry = null | IntersectionObserverEntry;

export interface IntersectionObserverProps {
  /**
   * The HTML Element to observe.
   * @default null
   */
  element?: HTMLElement;

  /**
   * Set to `true` to unobserve the element
   * after it intersects the viewport.
   * @default false
   */
  once?: boolean;

  /**
   * `true` if the observed element
   * is intersecting the viewport.
   * @default false
   */
  intersecting?: boolean;

  /**
   * Specify the containing element.
   * Defaults to the browser viewport.
   * @default null
   */
  root?: HTMLElement;

  /**
   * Margin offset of the containing element.
   * @default "0px"
   */
  rootMargin?: string;

  /**
   * Percentage of element visibility to trigger an event.
   * Value must be between 0 and 1.
   * @default 0
   */
  threshold?: number;

  /**
   * Observed element metadata.
   * @default null
   */
  entry?: null | Entry;

  /**
   * `IntersectionObserver` instance.
   * @default null
   */
  observer?: null | IntersectionObserver;
}

export default class SvelteIntersectionObserver extends SvelteComponentTyped<
  IntersectionObserverProps,
  {
    /**
     * Dispatched when the element is first observed
     * and also whenever an intersection event occurs.
     */
    observe: CustomEvent<IntersectionObserverEntry>;

    /**
     * Dispatched only when the element is intersecting the viewport.
     * `event.detail.isIntersecting` will only be `true`
     */
    intersect: CustomEvent<
      IntersectionObserverEntry & { isIntersecting: true }
    >;
  },
  {
    default: {
      intersecting: boolean;
      entry: Entry;
      observer: IntersectionObserver;
    };
  }
> {}
