<script>
  /**
   * Array of HTML Elements to observe.
   * Use this for better performance when observing multiple elements.
   * @type {(HTMLElement | null)[]}
   */
  export let elements = [];

  /**
   * Set to `true` to unobserve the element
   * after it intersects the viewport.
   * @type {boolean}
   */
  export let once = false;

  /**
   * Specify the containing element.
   * Defaults to the browser viewport.
   * @type {null | HTMLElement}
   */
  export let root = null;

  /** Margin offset of the containing element. */
  export let rootMargin = "0px";

  /**
   * Percentage of element visibility to trigger an event.
   * Value must be between 0 and 1.
   */
  export let threshold = 0;

  /**
   * Map of element to its intersection state.
   * @type {Map<HTMLElement | null, boolean>}
   */
  export let elementIntersections = new Map();

  /**
   * Map of element to its latest entry.
   * @type {Map<HTMLElement | null, IntersectionObserverEntry>}
   */
  export let elementEntries = new Map();

  /**
   * `IntersectionObserver` instance.
   * @type {null | IntersectionObserver}
   */
  export let observer = null;

  import { tick, createEventDispatcher, afterUpdate, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  /** @type {null | string} */
  let prevRootMargin = null;

  /** @type {null | HTMLElement} */
  let prevElement = null;

  /** @type {(HTMLElement | null)[]} */
  let prevElements = [];

  const initialize = () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((_entry) => {
          const target = /** @type {HTMLElement} */ (_entry.target);

          elementIntersections.set(target, _entry.isIntersecting);
          elementEntries.set(target, _entry);

          // Trigger reactivity.
          elementIntersections = new Map(elementIntersections);
          elementEntries = new Map(elementEntries);

          dispatch("observe", { entry: _entry, target });

          if (_entry.isIntersecting) {
            dispatch("intersect", { entry: _entry, target });
            if (once) observer?.unobserve(target);
          }
        });
      },
      { root, rootMargin, threshold },
    );
  };

  onMount(() => {
    initialize();

    return () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
  });

  afterUpdate(async () => {
    await tick();

    if (elements.length > 0) {
      const newElements = elements.filter(
        (el) => el && !prevElements.includes(el),
      );
      newElements.forEach((el) => {
        if (el) observer?.observe(el);
      });

      const removedElements = prevElements.filter(
        (el) => el && !elements.includes(el),
      );
      removedElements.forEach((el) => {
        if (el) observer?.unobserve(el);
      });

      prevElements = [...elements];
    }

    if (prevRootMargin && rootMargin !== prevRootMargin) {
      observer?.disconnect();
      prevElement = null;
      prevElements = [];
      initialize();

      elements
        .filter((el) => el)
        .forEach((el) => {
          if (el) observer?.observe(el);
        });
    }

    prevRootMargin = rootMargin;
  });
</script>

<slot {observer} {elementIntersections} {elementEntries} />
