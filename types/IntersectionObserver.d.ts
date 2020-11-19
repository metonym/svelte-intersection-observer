/// <reference types="svelte" />

type Entry = null | IntersectionObserverEntry;

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
}

export default class IntersectionObserver {
  $$prop_def: IntersectionObserverProps;
  $$slot_def: {
    default: { intersecting: boolean; entry: Entry };
  };

  $on(eventname: "observe", cb: (event: CustomEvent<Entry>) => void): () => void;
  $on(eventname: string, cb: (event: Event) => void): () => void;
}
