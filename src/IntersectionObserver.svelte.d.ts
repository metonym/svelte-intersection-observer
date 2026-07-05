import type { Component, Snippet } from "svelte";

export interface IntersectionObserverProps {
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

  /**
   * Set to `true` to pause observing without disconnecting the
   * observer or losing `entry`/`intersecting` state. Set back to
   * `false` to resume.
   * @default false
   */
  skip?: boolean;

  /**
   * Called when the element is first observed
   * and also whenever an intersection event occurs.
   */
  onobserve?: (entry: IntersectionObserverEntry) => void;

  /**
   * Called only when the element is intersecting the viewport.
   * `entry.isIntersecting` will always be `true`.
   */
  onintersect?: (
    entry: IntersectionObserverEntry & { isIntersecting: true },
  ) => void;

  children?: Snippet<
    [
      {
        intersecting: boolean;
        entry: null | IntersectionObserverEntry;
        observer: null | IntersectionObserver;
      },
    ]
  >;
}

declare const IntersectionObserverComponent: Component<
  IntersectionObserverProps,
  Record<string, never>,
  "intersecting" | "entry" | "observer"
>;

export default IntersectionObserverComponent;
