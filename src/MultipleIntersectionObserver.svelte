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

  /**
   * Set to `true` to pause observing all elements without disconnecting
   * the observer or losing `elementIntersections`/`elementEntries` state.
   * Set back to `false` to resume.
   * @type {boolean}
   */
  export let skip = false;

  import { afterUpdate, createEventDispatcher, onMount, tick } from "svelte";

  const dispatch = createEventDispatcher();

  let prevRootMargin = rootMargin;

  let prevThreshold = threshold;

  /** @type {null | HTMLElement} */
  let prevRoot = root;

  /** @type {(HTMLElement | null)[]} */
  let prevElements = [];

  let prevSkip = skip;

  const initialize = () => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const _entry of entries) {
          const target = /** @type {HTMLElement} */ (_entry.target);

          elementIntersections.set(target, _entry.isIntersecting);
          elementEntries.set(target, _entry);

          dispatch("observe", { entry: _entry, target });

          if (_entry.isIntersecting) {
            dispatch("intersect", { entry: _entry, target });
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
      const newElements = elements.filter((el) => el && !prevElements.includes(el));
      if (!skip) {
        for (const el of newElements) {
          if (el) observer?.observe(el);
        }
      }

      const removedElements = prevElements.filter((el) => el && !elements.includes(el));
      for (const el of removedElements) {
        if (el) observer?.unobserve(el);
      }

      prevElements = [...elements];
    }

    if (skip !== prevSkip) {
      for (const el of elements.filter((el) => el)) {
        if (!el) continue;
        if (skip) observer?.unobserve(el);
        else observer?.observe(el);
      }
    }

    if (rootMargin !== prevRootMargin || threshold !== prevThreshold || root !== prevRoot) {
      observer?.disconnect();
      prevElements = [];
      initialize();

      if (!skip) {
        for (const el of elements.filter((el) => el)) {
          if (el) observer?.observe(el);
        }
      }
    }

    prevRootMargin = rootMargin;
    prevThreshold = threshold;
    prevRoot = root;
    prevSkip = skip;
  });
</script>

<slot
  {observer}
  {elementIntersections}
  {elementEntries}
/>
