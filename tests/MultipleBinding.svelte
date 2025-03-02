<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let ref1: null | HTMLDivElement = null;
  let ref2: null | HTMLDivElement = null;
  let elementIntersections = new Map<HTMLElement | null, boolean>();

  $: elements = [ref1, ref2];
  $: anyItemVisible = Array.from(elementIntersections.values()).some(
    (visible) => visible,
  );
</script>

<MultipleIntersectionObserver
  {elements}
  bind:elementIntersections
  let:elementIntersections
>
  <header
    class:intersecting={anyItemVisible}
    data-testid="header"
    data-any-visible={anyItemVisible}
  >
    {#if anyItemVisible}
      <p data-testid="header-status">At least one item is visible</p>
    {:else}
      <p data-testid="header-status">No items visible</p>
    {/if}
    {#each elements as element, index}
      {@const visible = elementIntersections.get(element)}
      {#if visible}
        <p data-testid="item-{index + 1}-status">
          Item {index + 1} is visible
        </p>
      {/if}
    {/each}
  </header>

  <div
    bind:this={ref1}
    data-testid="item-1"
    class:visible={elementIntersections.get(ref1)}
    data-visible={elementIntersections.get(ref1)}
  >
    Item 1 ({elementIntersections.get(ref1)})
  </div>
  <div
    bind:this={ref2}
    data-testid="item-2"
    class:visible={elementIntersections.get(ref2)}
    data-visible={elementIntersections.get(ref2)}
  >
    Item 2 ({elementIntersections.get(ref2)})
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

  header.intersecting {
    background-color: #d5f4e6;
  }

  div {
    height: 50vh;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
    margin-bottom: 100vh;
  }

  div.visible {
    background-color: #2ecc71;
  }

  div:first-of-type {
    margin-top: calc(100vh + 1px);
  }
</style>
