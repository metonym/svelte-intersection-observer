<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let ref1: null | HTMLDivElement = null;
  let ref2: null | HTMLDivElement = null;
  let intersectCount1 = 0;
  let intersectCount2 = 0;

  $: elements = [ref1, ref2];
</script>

<MultipleIntersectionObserver
  {elements}
  once
  onintersect={(detail) => {
    if (detail.target === ref1) intersectCount1 += 1;
    if (detail.target === ref2) intersectCount2 += 1;
  }}
>
  {#snippet children({ elementIntersections })}
    <header>
      <p data-testid="item-1-status">
        {`Item 1 ${elementIntersections.get(ref1) ? "is visible" : "is not visible"}`}
      </p>
      <p data-testid="item-2-status">
        {`Item 2 ${elementIntersections.get(ref2) ? "is visible" : "is not visible"}`}
      </p>
      <p data-testid="item-1-count">
        Item 1 intersect count: {intersectCount1}
      </p>
      <p data-testid="item-2-count">
        Item 2 intersect count: {intersectCount2}
      </p>
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
