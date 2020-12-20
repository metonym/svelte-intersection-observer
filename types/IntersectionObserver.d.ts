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
  entry?: {} | Entry;
}

export default class IntersectionObserver extends SvelteComponentTyped<
  IntersectionObserverProps,
  { observe: CustomEvent<Entry> },
  { default: { intersecting: boolean; entry: Entry } }
> {}
