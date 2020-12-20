<script>
  /**
   * @typedef {null | IntersectionObserverEntry} Entry
   * @event {Entry} observe
   * @slot {{intersecting: boolean; entry: Entry }}
   */

  /** @type {null | HTMLElement} */
  export let element = null;

  /** @type {null | HTMLElement} */
  export let root = null;
  export let rootMargin = "0px";
  export let threshold = 0;

  /** @type {null | Entry} */
  export let entry = null;
  export let intersecting = false;

  import { tick, createEventDispatcher, onDestroy, afterUpdate } from "svelte";

  const dispatch = createEventDispatcher();

  let prevElement = null;
  let observer = undefined;

  afterUpdate(async () => {
    if (entry != null) dispatch("observe", entry);

    await tick();

    if (element != null && element != prevElement) {
      observer.observe(element);
      if (prevElement != null) observer.unobserve(prevElement);
      prevElement = element;
    }
  });

  onDestroy(() => {
    observer.disconnect();
  });

  $: observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((_entry) => {
        entry = _entry;
        intersecting = _entry.isIntersecting;
      });
    },
    { root, rootMargin, threshold }
  );
</script>

<slot {intersecting} {entry} />
