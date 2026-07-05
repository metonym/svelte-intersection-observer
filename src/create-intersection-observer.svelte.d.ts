import type { Attachment } from "svelte/attachments";
import type { IntersectActionOptions } from "./intersect.svelte.js";

export interface IntersectionObserverState {
  /** `true` if the observed element is intersecting the viewport. */
  readonly intersecting: boolean;

  /** Observed element metadata. */
  readonly entry: null | IntersectionObserverEntry;

  /** Attachment to apply to the observed element via `{@attach}`. */
  attach: Attachment<Element>;
}

/**
 * Rune-based composable that observes the attached element with the
 * Intersection Observer API, without a wrapper component or `use:`/`{@attach}`
 * directive of your own.
 */
export function createIntersectionObserver(
  getOptions?: () => IntersectActionOptions,
): IntersectionObserverState;
