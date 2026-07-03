<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let ref1: null | HTMLDivElement = null;
  let rootMargin = "0px";

  $: elements = [ref1];
</script>

<MultipleIntersectionObserver
  {elements}
  {rootMargin}
  let:elementIntersections
>
  <header>
    {elementIntersections.get(ref1) ? "Element is in view" : "Element is not in view"}
    <button
      data-testid="shrink-root-margin"
      on:click={() => (rootMargin = "-200px")}
    >
      Shrink root margin
    </button>
  </header>

  <div bind:this={ref1}>Hello world</div>
</MultipleIntersectionObserver>

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
