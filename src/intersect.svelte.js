import { fromAction } from "svelte/attachments";

/**
 * Svelte action that observes `node` with the Intersection Observer API.
 * Dispatches `observe` (on every change) and `intersect` (on entering the
 * viewport) `CustomEvent`s on `node` — listen with `onobserve`/`onintersect`.
 * @param {HTMLElement} node
 * @param {import("./intersect.svelte.d.ts").IntersectActionOptions} [options]
 */
export function intersect(node, options = {}) {
  let {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    once = false,
    skip = false,
  } = options;

  /** @type {IntersectionObserver} */
  let observer;

  const createObserver = () =>
    new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          node.dispatchEvent(new CustomEvent("observe", { detail: entry }));

          if (entry.isIntersecting) {
            node.dispatchEvent(new CustomEvent("intersect", { detail: entry }));
            if (once) observer.unobserve(node);
          }
        }
      },
      { root, rootMargin, threshold },
    );

  observer = createObserver();
  if (!skip) observer.observe(node);

  return {
    /** @param {import("./intersect.svelte.d.ts").IntersectActionOptions} [newOptions] */
    update(newOptions = {}) {
      once = newOptions.once ?? false;

      const newSkip = newOptions.skip ?? false;

      const configChanged =
        (newOptions.root ?? null) !== root ||
        (newOptions.rootMargin ?? "0px") !== rootMargin ||
        JSON.stringify(newOptions.threshold ?? 0) !== JSON.stringify(threshold);

      if (configChanged) {
        root = newOptions.root ?? null;
        rootMargin = newOptions.rootMargin ?? "0px";
        threshold = newOptions.threshold ?? 0;

        observer.disconnect();
        observer = createObserver();
        if (!newSkip) observer.observe(node);
      } else if (newSkip !== skip) {
        if (newSkip) observer.unobserve(node);
        else observer.observe(node);
      }

      skip = newSkip;
    },
    destroy() {
      observer.disconnect();
    },
  };
}

/**
 * Svelte attachment that observes the element with the Intersection Observer
 * API. Equivalent to the `intersect` action, for use with `{@attach}` instead
 * of `use:`. Wraps `intersect` via `svelte/attachments`'s `fromAction`.
 * @param {() => import("./intersect.svelte.d.ts").IntersectActionOptions} [getOptions]
 */
export function intersectAttachment(getOptions = () => ({})) {
  return fromAction(intersect, getOptions);
}

/**
 * Creates a group of elements backed by a single shared `IntersectionObserver`
 * instance, for use with `{@attach}` inside an `#each` block. This brings
 * `MultipleIntersectionObserver`'s single-observer performance benefit to the
 * action/attachment API, where a bare `intersect`/`intersectAttachment` inside
 * a loop would otherwise create one `IntersectionObserver` per element.
 *
 * `root`/`rootMargin`/`threshold` are shared across every node in the group
 * (they configure the one underlying observer); only `once`/`skip` and the
 * `onobserve`/`onintersect` callbacks are meaningful per node.
 * @param {() => import("./intersect.svelte.d.ts").IntersectGroupSharedOptions} [getSharedOptions]
 * @returns {import("./intersect.svelte.d.ts").IntersectionGroup}
 */
export function createIntersectionGroup(getSharedOptions = () => ({})) {
  /** @type {IntersectionObserver | undefined} */
  let observer;

  /** @type {Map<Element, import("./intersect.svelte.d.ts").IntersectGroupNodeOptions>} */
  const callbacks = new Map();

  const handleEntries = (
    /** @type {IntersectionObserverEntry[]} */ entries,
  ) => {
    for (const entry of entries) {
      const target = entry.target;
      const nodeOptions = callbacks.get(target);

      nodeOptions?.onobserve?.(entry);

      if (entry.isIntersecting) {
        nodeOptions?.onintersect?.(
          /** @type {IntersectionObserverEntry & { isIntersecting: true }} */ (
            entry
          ),
        );
        if (nodeOptions?.once) observer?.unobserve(target);
      }
    }
  };

  /**
   * @param {import("./intersect.svelte.d.ts").IntersectGroupNodeOptions} [nodeOptions]
   */
  function attach(nodeOptions = {}) {
    return (/** @type {Element} */ node) => {
      if (!observer) {
        const {
          root = null,
          rootMargin = "0px",
          threshold = 0,
        } = getSharedOptions();
        observer = new IntersectionObserver(handleEntries, {
          root,
          rootMargin,
          threshold,
        });
      }

      callbacks.set(node, nodeOptions);
      if (!nodeOptions.skip) observer.observe(node);

      return () => {
        observer?.unobserve(node);
        callbacks.delete(node);

        if (callbacks.size === 0) {
          observer?.disconnect();
          observer = undefined;
        }
      };
    };
  }

  return { attach };
}
