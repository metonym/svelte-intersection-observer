<script lang="ts">
  // biome-ignore lint/correctness/noUnusedImports: used in {@attach}, which Biome's Svelte parser doesn't yet analyze for usages
  import { intersectAttachment } from "svelte-intersection-observer";

  let intersecting = false;
  let rootMargin = "0px";
</script>

<header class:intersecting>
  {intersecting ? "Element is in view" : "Element is not in view"}
  <button
    data-testid="shrink-root-margin"
    onclick={() => (rootMargin = "-200px")}
  >
    Shrink root margin
  </button>
</header>

<div
  {@attach intersectAttachment(() => ({ rootMargin }))}
  onobserve={(e) => (intersecting = e.detail.isIntersecting)}
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
