import type { Component, Snippet } from "svelte";

export interface MultipleIntersectionObserverProps {
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
   * Set to `true` to enable occlusion-aware visibility tracking
   * (Intersection Observer v2), populating `entry.isVisible`.
   * Requires `delay` to be set per the spec.
   * @default false
   */
  trackVisibility?: boolean;

  /**
   * Minimum delay in milliseconds between notifications from the
   * observer. Required to be non-zero when `trackVisibility` is `true`.
   * @default 0
   */
  delay?: number;

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

  /**
   * Set to `true` to pause observing all elements without disconnecting
   * the observer or losing `elementIntersections`/`elementEntries` state.
   * Set back to `false` to resume.
   * @default false
   */
  skip?: boolean;

  /**
   * Called when an element is first observed
   * and also whenever an intersection event occurs.
   */
  onobserve?: (detail: {
    entry: IntersectionObserverEntry;
    target: HTMLElement;
  }) => void;

  /**
   * Called only when an element is intersecting the viewport.
   */
  onintersect?: (detail: {
    entry: IntersectionObserverEntry & { isIntersecting: true };
    target: HTMLElement;
  }) => void;

  children?: Snippet<
    [
      {
        observer: null | IntersectionObserver;
        elementIntersections: Map<HTMLElement | null, boolean>;
        elementEntries: Map<HTMLElement | null, IntersectionObserverEntry>;
      },
    ]
  >;
}

declare const MultipleIntersectionObserverComponent: Component<
  MultipleIntersectionObserverProps,
  Record<string, never>,
  "elementIntersections" | "elementEntries" | "observer"
>;

export default MultipleIntersectionObserverComponent;
