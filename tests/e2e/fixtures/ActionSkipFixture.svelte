<script lang="ts">
  import { intersect } from "svelte-intersection-observer";

  let intersecting = false;
  let skip = false;
</script>

<header class:intersecting>
  {intersecting ? "Element is in view" : "Element is not in view"}
  <button
    data-testid="toggle-skip"
    onclick={() => (skip = !skip)}
  >
    {skip ? "Resume" : "Pause"}
  </button>
</header>

<div
  use:intersect={{ skip }}
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
