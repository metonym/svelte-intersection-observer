<script>
  import { untrack } from "svelte";

  /**
   * @typedef {Object} Props
   * @property {(HTMLElement | null)[]} [elements] Array of HTML Elements to observe. Use this for better performance when observing multiple elements.
   * @property {boolean} [once] Set to `true` to unobserve the element after it intersects the viewport.
   * @property {null | HTMLElement} [root] Specify the containing element. Defaults to the browser viewport.
   * @property {string} [rootMargin] Margin offset of the containing element.
   * @property {number | number[]} [threshold] Percentage of element visibility to trigger an event. Value must be between 0 and 1.
   * @property {boolean} [trackVisibility] Set to `true` to enable occlusion-aware visibility tracking (Intersection Observer v2), populating `entry.isVisible`. Requires `delay` to be set per the spec.
   * @property {number} [delay] Minimum delay in milliseconds between notifications from the observer. Required to be non-zero when `trackVisibility` is `true`.
   * @property {Map<HTMLElement | null, boolean>} [elementIntersections] Map of element to its intersection state.
   * @property {Map<HTMLElement | null, IntersectionObserverEntry>} [elementEntries] Map of element to its latest entry.
   * @property {null | IntersectionObserver} [observer] `IntersectionObserver` instance.
   * @property {boolean} [skip] Set to `true` to pause observing all elements without disconnecting the observer or losing `elementIntersections`/`elementEntries` state. Set back to `false` to resume.
   * @property {(detail: { entry: IntersectionObserverEntry, target: HTMLElement }) => void} [onobserve] Called when an element is first observed and also whenever an intersection event occurs.
   * @property {(detail: { entry: IntersectionObserverEntry & { isIntersecting: true }, target: HTMLElement }) => void} [onintersect] Called only when an element is intersecting the viewport.
   * @property {import("svelte").Snippet<[{ observer: null | IntersectionObserver, elementIntersections: Map<HTMLElement | null, boolean>, elementEntries: Map<HTMLElement | null, IntersectionObserverEntry> }]>} [children]
   */

  /** @type {Props} */
  let {
    elements = [],
    once = false,
    root = null,
    rootMargin = "0px",
    threshold = 0,
    trackVisibility = false,
    delay = 0,
    elementIntersections = $bindable(new Map()),
    elementEntries = $bindable(new Map()),
    observer = $bindable(null),
    skip = false,
    onobserve,
    onintersect,
    children,
  } = $props();

  /** @type {(HTMLElement | null)[]} */
  let prevElements = [];

  let prevSkip = untrack(() => skip);

  const initialize = () => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const _entry of entries) {
          const target = /** @type {HTMLElement} */ (_entry.target);

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
      { root, rootMargin, threshold, trackVisibility, delay },
    );
  };

  $effect(() => {
    prevElements = [];
    initialize();

    return () => {
      observer?.disconnect();
      observer = null;
    };
  });

  $effect(() => {
    const currentElements = elements;
    const isSkipped = skip;
    const activeObserver = observer;

    if (currentElements.length > 0) {
      const newElements = currentElements.filter(
        (el) => el && !prevElements.includes(el),
      );

      if (!isSkipped) {
        for (const el of newElements) {
          if (el) activeObserver?.observe(el);
        }
      }

      const removedElements = prevElements.filter(
        (el) => el && !currentElements.includes(el),
      );

      for (const el of removedElements) {
        if (el) activeObserver?.unobserve(el);
      }

      prevElements = [...currentElements];
    }

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
