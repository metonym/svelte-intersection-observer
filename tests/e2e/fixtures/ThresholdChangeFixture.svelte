<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let element: null | HTMLDivElement = null;
  let intersecting = false;
  let threshold = 0;
</script>

<header class:intersecting>
  {intersecting ? "Element is in view" : "Element is not in view"}
  <button
    data-testid="raise-threshold"
    onclick={() => (threshold = 0.99)}
  >
    Raise threshold
  </button>
</header>

<IntersectionObserver
  {element}
  bind:intersecting
  {threshold}
>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>

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
    margin-top: 100vh;
    height: 100vh;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
  }
</style>
