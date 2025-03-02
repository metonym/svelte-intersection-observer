<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let ref1: null | HTMLDivElement = null;
  let ref2: null | HTMLDivElement = null;

  $: elements = [ref1, ref2];
</script>

<MultipleIntersectionObserver {elements} let:elementIntersections>
  <header>
    <div
      data-testid="item-1-indicator"
      class:intersecting={elementIntersections.get(ref1)}
    >
      Item 1: {elementIntersections.get(ref1) ? "✓" : "✗"}
    </div>
    <div
      data-testid="item-2-indicator"
      class:intersecting={elementIntersections.get(ref2)}
    >
      Item 2: {elementIntersections.get(ref2) ? "✓" : "✗"}
    </div>
  </header>

  <div bind:this={ref1} data-testid="item-1">Item 1</div>
  <div bind:this={ref2} data-testid="item-2">Item 2</div>
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
    height: 50vh;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
    margin-bottom: 100vh;
  }

  div.intersecting {
    background-color: #2ecc71;
  }

  div:first-of-type {
    margin-top: calc(100vh + 1px);
  }
</style>
