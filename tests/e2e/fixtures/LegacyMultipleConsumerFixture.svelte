<svelte:options runes={false} />

<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let ref1: null | HTMLDivElement = null;
  let ref2: null | HTMLDivElement = null;

  $: elements = [ref1, ref2];
</script>

<MultipleIntersectionObserver {elements}>
  {#snippet children({ elementIntersections })}
    <header>
      <div data-testid="item-1-status">
        Item 1: {elementIntersections.get(ref1) ? "visible" : "not visible"}
      </div>
      <div data-testid="item-2-status">
        Item 2: {elementIntersections.get(ref2) ? "visible" : "not visible"}
      </div>
    </header>

    <div
      bind:this={ref1}
      data-testid="item-1"
    >
      Item 1
    </div>
    <div
      bind:this={ref2}
      data-testid="item-2"
    >
      Item 2
    </div>
  {/snippet}
</MultipleIntersectionObserver>
