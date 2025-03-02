import type { SvelteComponentTyped } from "svelte";

export default class extends SvelteComponentTyped<
  {
    /**
     * Array of HTML Elements to observe.
     * Use this for better performance when observing multiple elements.
     * @default []
     */
    elements?: (HTMLElement | null)[];

    /**
     * Set to `true` to unobserve the element
     * after it intersects the viewport.
     * @default false
     */
    once?: boolean;

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
     * Map of element to its intersection state.
     * @default new Map()
     */
    elementIntersections?: Map<HTMLElement | null, boolean>;

    /**
     * Map of element to its latest entry.
     * @default new Map()
     */
    elementEntries?: Map<HTMLElement | null, IntersectionObserverEntry>;

    /**
     * `IntersectionObserver` instance.
     * @default null
     */
    observer?: null | IntersectionObserver;
  },
  {
    /**
     * Dispatched when an element is first observed
     * and also whenever an intersection event occurs.
     */
    observe: CustomEvent<{
      entry: IntersectionObserverEntry;
      target: HTMLElement;
    }>;

    /**
     * Dispatched only when an element is intersecting the viewport.
     */
    intersect: CustomEvent<{
      entry: IntersectionObserverEntry & { isIntersecting: true };
      target: HTMLElement;
    }>;
  },
  {
    default: {
      observer: IntersectionObserver;
      elementIntersections: Map<HTMLElement | null, boolean>;
      elementEntries: Map<HTMLElement | null, IntersectionObserverEntry>;
    };
  }
> {}
