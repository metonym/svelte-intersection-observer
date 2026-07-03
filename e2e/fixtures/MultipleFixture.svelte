<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let ref1: null | HTMLDivElement = null;
  let ref2: null | HTMLDivElement = null;
  let ref3: null | HTMLDivElement = null;

  $: elements = [ref1, ref2, ref3];
</script>

<MultipleIntersectionObserver {elements} let:elementIntersections>
  <header>
    {#each elements as el, index}
      {@const visible = elementIntersections.get(el)}
      {#if visible}
        <p data-testid="item-{index + 1}-status">Item {index + 1} is visible</p>
      {:else}
        <p data-testid="item-{index + 1}-status">
          Item {index + 1} is not visible
        </p>
      {/if}
    {/each}
  </header>

  <div bind:this={ref1} data-testid="item-1">Item 1</div>
  <div bind:this={ref2} data-testid="item-2">Item 2</div>
  <div bind:this={ref3} data-testid="item-3">Item 3</div>
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

  div:first-of-type {
    margin-top: calc(100vh + 1px);
  }
</style>
