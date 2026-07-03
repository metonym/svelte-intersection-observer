<script lang="ts">
  import { intersect } from "svelte-intersection-observer";

  let intersecting = false;
  let intersectCount = 0;
</script>

<header class:intersecting>
  {intersecting ? "Element is in view" : "Element is not in view"}
  <p data-testid="intersect-count">Intersect count: {intersectCount}</p>
</header>

<div
  use:intersect={{ once: true }}
  on:observe={(e) => (intersecting = e.detail.isIntersecting)}
  on:intersect={() => (intersectCount += 1)}
>
  Hello world
</div>

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
