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
  { observe: CustomEvent<Entry>; intersect: CustomEvent<Entry> },
  {
    default: {
      intersecting: boolean;
      entry: Entry;
      observer: IntersectionObserver;
    };
  }
> {}
