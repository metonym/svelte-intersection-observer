<script>
  import { untrack } from "svelte";

  /**
   * @typedef {Object} Props
   * @property {null | HTMLElement} [element] The HTML Element to observe.
   * @property {boolean} [once] Set to `true` to unobserve the element after it intersects the viewport.
   * @property {boolean} [intersecting] `true` if the observed element is intersecting the viewport.
   * @property {null | HTMLElement} [root] Specify the containing element. Defaults to the browser viewport.
   * @property {string} [rootMargin] Margin offset of the containing element.
   * @property {number | number[]} [threshold] Percentage of element visibility to trigger an event. Value must be between 0 and 1.
   * @property {boolean} [trackVisibility] Set to `true` to enable occlusion-aware visibility tracking (Intersection Observer v2), populating `entry.isVisible`. Requires `delay` to be set per the spec.
   * @property {number} [delay] Minimum delay in milliseconds between notifications from the observer. Required to be non-zero when `trackVisibility` is `true`.
   * @property {null | IntersectionObserverEntry} [entry] Observed element metadata.
   * @property {null | IntersectionObserver} [observer] `IntersectionObserver` instance.
   * @property {boolean} [skip] Set to `true` to pause observing without disconnecting the observer or losing `entry`/`intersecting` state. Set back to `false` to resume.
   * @property {(entry: IntersectionObserverEntry) => void} [onobserve] Called when the element is first observed and also whenever an intersection event occurs.
   * @property {(entry: IntersectionObserverEntry & { isIntersecting: true }) => void} [onintersect] Called only when the observed element is intersecting the viewport.
   * @property {import("svelte").Snippet<[{ intersecting: boolean, entry: null | IntersectionObserverEntry, observer: null | IntersectionObserver }]>} [children]
   */

  /** @type {Props} */
  let {
    element = null,
    once = false,
    intersecting = $bindable(false),
    root = null,
    rootMargin = "0px",
    threshold = 0,
    trackVisibility = false,
    delay = 0,
    entry = $bindable(null),
    observer = $bindable(null),
    skip = false,
    onobserve,
    onintersect,
    children,
  } = $props();

  /** @type {null | HTMLElement} */
  let prevElement = null;

  let prevSkip = untrack(() => skip);

  const initialize = () => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const _entry of entries) {
          entry = _entry;
          intersecting = _entry.isIntersecting;

          onobserve?.(_entry);

          if (_entry.isIntersecting) {
            onintersect?.(
              /** @type {IntersectionObserverEntry & { isIntersecting: true }} */ (
                _entry
              ),
            );

            if (element && once) observer?.unobserve(element);
          }
        }
      },
      { root, rootMargin, threshold, trackVisibility, delay },
    );
  };

  $effect(() => {
    prevElement = null;
    initialize();

    return () => {
      observer?.disconnect();
      observer = null;
    };
  });

  $effect(() => {
    const target = element;
    const isSkipped = skip;
    const activeObserver = observer;

    if (target !== null && target !== prevElement) {
      if (!isSkipped) activeObserver?.observe(target);
      if (prevElement !== null) activeObserver?.unobserve(prevElement);
      prevElement = target;
    }

    if (isSkipped !== prevSkip && target !== null) {
      if (isSkipped) activeObserver?.unobserve(target);
      else activeObserver?.observe(target);
    }

    prevSkip = isSkipped;
  });
</script>

{@render children?.({ intersecting, entry, observer })}
