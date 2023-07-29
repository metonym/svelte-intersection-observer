import type { SvelteComponentTyped } from "svelte";

export default class extends SvelteComponentTyped<
  {
    /**
     * The HTML Element to observe.
     * @default null
     */
    element?: null | HTMLElement;

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
     * Observed element metadata.
     * @default null
     */
    entry?: null | IntersectionObserverEntry;

    /**
     * `IntersectionObserver` instance.
     * @default null
     */
    observer?: null | IntersectionObserver;
  },
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
      entry: null | IntersectionObserverEntry;
      observer: IntersectionObserver;
    };
  }
> {}
