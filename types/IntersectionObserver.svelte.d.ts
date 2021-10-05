/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export type Entry = null | IntersectionObserverEntry;

export interface IntersectionObserverProps {
  /**
   * @default null
   */
  element?: null | HTMLElement;

  /**
   * @default null
   */
  root?: null | HTMLElement;

  /**
   * @default "0px"
   */
  rootMargin?: string;

  /**
   * @default 0
   */
  threshold?: number;

  /**
   * @default null
   */
  entry?: null | Entry;

  /**
   * @default false
   */
  intersecting?: boolean;

  /**
   * @default null
   */
  observer?: null | IntersectionObserver;

  /**
   * @default false
   */
  once?: boolean;
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
