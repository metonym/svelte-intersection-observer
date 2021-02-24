<script>
  /**
   * @typedef {null | IntersectionObserverEntry} Entry
   * @event {Entry} observe
   * @slot {{intersecting: boolean; entry: Entry }}
   */

  /** @type {null | HTMLElement} */
  export let element = null;
  export let once = false;

  /** @type {null | HTMLElement} */
  export let root = null;
  export let rootMargin = "0px";
  export let threshold = 0;

  /** @type {null | Entry} */
  export let entry = null;
  export let intersecting = false;
  /** @type {null | IntersectionObserver} */
  export let observer = null;

  import { tick, createEventDispatcher, onDestroy, afterUpdate } from "svelte";

  const dispatch = createEventDispatcher();

  let prevElement = null;

  afterUpdate(async () => {
    if (entry !== null) {
      dispatch("observe", entry);

      if (entry.isIntersecting) {
        dispatch("intersect", entry);

        if (once) observer.unobserve(entry.target);
      }
    }

    await tick();

    if (element !== null && element !== prevElement) {
      observer.observe(element);

      if (prevElement !== null) observer.unobserve(prevElement);
      prevElement = element;
    }
  });

  onDestroy(() => {
    if (observer) observer.disconnect();
  });

  $: if (typeof window !== "undefined") {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((_entry) => {
          entry = _entry;
          intersecting = _entry.isIntersecting;
        });
      },
      { root, rootMargin, threshold }
    );
  }
</script>

<slot {intersecting} {entry} {observer} />
