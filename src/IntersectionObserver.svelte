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

  const configKey = $derived(`${rootMargin}|${JSON.stringify(threshold)}`);

  const initialize = () => {
    if (typeof IntersectionObserver === "undefined") {
      observer = null;
      return;
    }

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
      { root, rootMargin, threshold },
    );
  };

  $effect(() => {
    configKey;
    root;

    untrack(() => {
      prevElement = null;
      initialize();
    });

    return () => {
      observer?.disconnect();
      observer = null;
    };
  });

  $effect(() => {
    const target = element;
    const isSkipped = skip;
    const activeObserver = observer;

    if (target !== prevElement) {
      if (prevElement !== null) activeObserver?.unobserve(prevElement);
      if (target !== null && !isSkipped) activeObserver?.observe(target);
      prevElement = target;

      if (target === null) {
        intersecting = false;
        entry = null;
      }
    }

    if (isSkipped !== prevSkip && target !== null) {
      if (isSkipped) activeObserver?.unobserve(target);
      else activeObserver?.observe(target);
    }

    prevSkip = isSkipped;
  });
</script>

{@render children?.({ intersecting, entry, observer })}
