<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let containerA: null | HTMLDivElement = null;
  let containerB: null | HTMLDivElement = null;
  let ref1: null | HTMLDivElement = null;
  let ref2: null | HTMLDivElement = null;
  let root: null | HTMLDivElement = null;

  $: elements = [ref1, ref2];
  $: if (!root && containerA) root = containerA;
</script>

<div
  bind:this={containerA}
  data-testid="root-a"
  style="height: 200px; overflow-y: auto;"
></div>

<div
  bind:this={containerB}
  data-testid="root-b"
  style="height: 200px; overflow-y: auto;"
></div>

<button
  data-testid="swap-root"
  onclick={() => (root = containerB)}
>
  Swap root
</button>

<MultipleIntersectionObserver
  {elements}
  {root}
>
  {#snippet children()}
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
