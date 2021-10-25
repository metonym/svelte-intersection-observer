<script>
  /**
   * The HTML Element to observe
   * @type {null | HTMLElement}
   */
  export let element = null;

  /**
   * Set to `true` to unobserve the element after it intersects the viewport
   * @type {boolean}
   */
  export let once = false;

  /**
   * Containing element
   * Defaults to the browser viewport
   * @type {null | HTMLElement}
   */
  export let root = null;

  /** Margin offset of the containing element */
  export let rootMargin = "0px";

  /**
   * Percentage of element visibility to trigger an event
   * Value must be between 0 and 1
   */
  export let threshold = 0;

  /** @type {null | IntersectionObserverEntry} */
  export let entry = null;

  /**
   * `true` is the observed element is intersecting the element
   */
  export let intersecting = false;

  /** @type {null | IntersectionObserver} */
  export let observer = null;

  import { tick, createEventDispatcher, afterUpdate, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  let prevRootMargin = null;
  let prevElement = null;

  const initialize = () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((_entry) => {
          entry = _entry;
          intersecting = _entry.isIntersecting;
        });
      },
      { root, rootMargin, threshold }
    );
  };

  onMount(() => {
    initialize();

    return () => {
      if (observer) observer.disconnect();
    };
  });

  afterUpdate(async () => {
    if (entry !== null) {
      dispatch("observe", entry);

      if (entry.isIntersecting) {
        dispatch("intersect", entry);

        if (once) observer.unobserve(element);
      }
    }

    await tick();

    if (element !== null && element !== prevElement) {
      observer.observe(element);

      if (prevElement !== null) observer.unobserve(prevElement);
      prevElement = element;
    }

    if (prevRootMargin && rootMargin !== prevRootMargin) {
      observer.disconnect();
      prevElement = null;
      initialize();
    }

    prevRootMargin = rootMargin;
  });
</script>

<slot {intersecting} {entry} {observer} />
