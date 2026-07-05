import { intersectAttachment } from "./intersect.svelte.js";

/**
 * Rune-based composable that observes the attached element with the
 * Intersection Observer API, exposing `intersecting`/`entry` as reactive
 * getters. Wraps `intersectAttachment`, reusing its observe/unobserve/cleanup
 * logic, and listens for the `observe` `CustomEvent` it dispatches on the
 * node to keep state in sync.
 * @param {() => import("./intersect.svelte.d.ts").IntersectActionOptions} [getOptions]
 */
export function createIntersectionObserver(getOptions = () => ({})) {
  let intersecting = $state(false);
  let entry = $state(/** @type {null | IntersectionObserverEntry} */ (null));

  const attachment = intersectAttachment(getOptions);

  /** @param {Element} node */
  function attach(node) {
    /** @param {Event} event */
    const onObserve = (event) => {
      const detail = /** @type {CustomEvent<IntersectionObserverEntry>} */ (
        event
      ).detail;
      entry = detail;
      intersecting = detail.isIntersecting;
    };

    node.addEventListener("observe", onObserve);
    const cleanup = attachment(node);

    return () => {
      node.removeEventListener("observe", onObserve);
      if (typeof cleanup === "function") cleanup();
    };
  }

  return {
    get intersecting() {
      return intersecting;
    },
    get entry() {
      return entry;
    },
    attach,
  };
}
