<script>
  import { untrack } from "svelte";

  /**
   * @typedef {Object} Props
   * @property {ReadonlyArray<Element | null | undefined>} [elements] Array of Elements to observe. Use this for better performance when observing multiple elements.
   * @property {boolean} [once] Set to `true` to unobserve the element after it intersects the viewport.
   * @property {Element | Document | null | undefined} [root] Specify the containing element. Defaults to the browser viewport.
   * @property {string} [rootMargin] Margin offset of the containing element.
   * @property {number | number[]} [threshold] Percentage of element visibility to trigger an event. Value must be between 0 and 1.
   * @property {Map<Element | null | undefined, boolean>} [elementIntersections] Map of element to its intersection state.
   * @property {Map<Element | null | undefined, IntersectionObserverEntry>} [elementEntries] Map of element to its latest entry.
   * @property {null | IntersectionObserver} [observer] `IntersectionObserver` instance.
   * @property {boolean} [skip] Set to `true` to pause observing all elements without disconnecting the observer or losing `elementIntersections`/`elementEntries` state. Set back to `false` to resume.
   * @property {(detail: { entry: IntersectionObserverEntry, target: Element }) => void} [onobserve] Called when an element is first observed and also whenever an intersection event occurs.
   * @property {(detail: { entry: IntersectionObserverEntry & { isIntersecting: true }, target: Element }) => void} [onintersect] Called only when an element is intersecting the viewport.
   * @property {import("svelte").Snippet<[{ observer: null | IntersectionObserver, elementIntersections: Map<Element | null | undefined, boolean>, elementEntries: Map<Element | null | undefined, IntersectionObserverEntry> }]>} [children]
   */

  /** @type {Props} */
  let {
    elements = [],
    once = false,
    root = null,
    rootMargin = "0px",
    threshold = 0,
    elementIntersections = $bindable(new Map()),
    elementEntries = $bindable(new Map()),
    observer = $bindable(null),
    skip = false,
    onobserve,
    onintersect,
    children,
  } = $props();

  /** @type {Set<Element | null | undefined>} */
  let prevElements = new Set();

  let prevSkip = untrack(() => skip);

  const configKey = $derived(`${rootMargin}|${JSON.stringify(threshold)}`);

  const initialize = () => {
    if (typeof IntersectionObserver === "undefined") {
      observer = null;
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const _entry of entries) {
          const target = /** @type {Element} */ (_entry.target);

          elementIntersections.set(target, _entry.isIntersecting);
          elementEntries.set(target, _entry);

          onobserve?.({ entry: _entry, target });

          if (_entry.isIntersecting) {
            onintersect?.({
              entry:
                /** @type {IntersectionObserverEntry & { isIntersecting: true }} */ (
                  _entry
                ),
              target,
            });
            if (once) observer?.unobserve(target);
          }
        }

        // Trigger reactivity once per batch, not once per entry.
        elementIntersections = new Map(elementIntersections);
        elementEntries = new Map(elementEntries);
      },
      { root, rootMargin, threshold },
    );
  };

  $effect(() => {
    configKey;
    root;

    untrack(() => {
      prevElements = new Set();
      initialize();
    });

    return () => {
      observer?.disconnect();
      observer = null;
    };
  });

  $effect(() => {
    const currentElements = elements;
    const isSkipped = skip;
    const activeObserver = observer;

    const currentSet = new Set(currentElements);

    const newElements = currentElements.filter(
      (el) => el && !prevElements.has(el),
    );
    const removedElements = [...prevElements].filter(
      (el) => el && !currentSet.has(el),
    );

    if (!isSkipped) {
      for (const el of newElements) {
        if (el) activeObserver?.observe(el);
      }
    }

    for (const el of removedElements) {
      if (!el) continue;
      activeObserver?.unobserve(el);
      elementIntersections.delete(el);
      elementEntries.delete(el);
    }

    if (removedElements.length > 0) {
      elementIntersections = new Map(elementIntersections);
      elementEntries = new Map(elementEntries);
    }

    prevElements = currentSet;

    if (isSkipped !== prevSkip) {
      for (const el of currentElements) {
        if (!el) continue;
        if (isSkipped) activeObserver?.unobserve(el);
        else activeObserver?.observe(el);
      }
    }

    prevSkip = isSkipped;
  });
</script>

{@render children?.({ observer, elementIntersections, elementEntries })}
