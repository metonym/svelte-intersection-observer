<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let ref1: null | HTMLDivElement = null;

  $: elements = [ref1];
</script>

<MultipleIntersectionObserver
  {elements}
  threshold={0.5}
  let:elementIntersections
>
  <header>
    {elementIntersections.get(ref1)
      ? "Element is in view"
      : "Element is not in view"}
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
    margin-top: 100vh;
    height: 100vh;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
  }
</style>
