<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let ref1: null | HTMLDivElement = null;
  let ref2: null | HTMLDivElement = null;
  let includeItem1 = true;
  let includeItem2 = false;

  $: elements = [includeItem1 ? ref1 : null, includeItem2 ? ref2 : null];
</script>

<MultipleIntersectionObserver
  {elements}
  let:elementIntersections
>
  <header>
    <button
      data-testid="add-item-2"
      on:click={() => (includeItem2 = true)}
    >
      Add item 2
    </button>
    <button
      data-testid="remove-item-1"
      on:click={() => (includeItem1 = false)}
    >
      Remove item 1
    </button>
    <p data-testid="item-1-status">Item 1 {elementIntersections.get(ref1) ? "is visible" : "is not visible"}</p>
    <p data-testid="item-2-status">Item 2 {elementIntersections.get(ref2) ? "is visible" : "is not visible"}</p>
  </header>

  <div style="display: flex; margin-top: calc(100vh + 1px);">
    <div
      bind:this={ref1}
      data-testid="item-1"
      style="height: 38vh; width: 50%; background-color: #376462; color: #fff;"
    >
      Item 1
    </div>
    <div
      bind:this={ref2}
      data-testid="item-2"
      style="height: 38vh; width: 50%; background-color: #2ecc71; color: #fff;"
    >
      Item 2
    </div>
  </div>
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
</style>
