<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let containerA: null | HTMLDivElement = null;
  let containerB: null | HTMLDivElement = null;
  let element: null | HTMLDivElement = null;
  let root: null | HTMLDivElement = null;

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

<IntersectionObserver
  {element}
  {root}
>
  <div
    bind:this={element}
    data-testid="element"
  >
    Hello world
  </div>
</IntersectionObserver>
