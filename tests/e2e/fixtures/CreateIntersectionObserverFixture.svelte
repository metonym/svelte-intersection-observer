<script lang="ts">
  import { createIntersectionObserver } from "svelte-intersection-observer";

  const observer = createIntersectionObserver(() => ({ once: true }));
  let intersectCount = $derived(observer.intersecting ? 1 : 0);
</script>

<header class:intersecting={observer.intersecting}>
  {observer.intersecting ? "Element is in view" : "Element is not in view"}
  <p data-testid="intersect-count">Intersect count: {intersectCount}</p>
</header>

<div {@attach observer.attach}>Hello world</div>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    background-color: #e0f7f6;
  }

  div {
    margin-top: calc(100vh + 1px);
    height: 38vh;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
  }
</style>
