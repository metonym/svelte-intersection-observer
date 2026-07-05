<script lang="ts">
  /**
   * Run `bun test:types` to test the type definitions of the composable using `svelte-check`.
   */

  import { createIntersectionObserver } from "svelte-intersection-observer";

  const observer = createIntersectionObserver(() => ({
    once: true,
    root: null,
    rootMargin: "0px",
    threshold: 0,
    skip: false,
  }));

  observer.intersecting; // boolean
  observer.entry; // null | IntersectionObserverEntry
</script>

<div {@attach observer.attach}>
  {observer.intersecting ? "In view" : "Not in view"}
</div>
