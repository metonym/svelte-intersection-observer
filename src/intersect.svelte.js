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
