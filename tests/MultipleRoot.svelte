<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let container: null | HTMLDivElement = null;
  let ref1: null | HTMLDivElement = null;
  let elementIntersections = new Map<HTMLElement | null, boolean>();

  $: elements = [ref1];
</script>

<div data-testid="status">
  {elementIntersections.get(ref1) ? "Element is in view" : "Element is not in view"}
</div>

<div
  bind:this={container}
  data-testid="container"
  style="height: 200px; overflow-y: auto;"
>
  <MultipleIntersectionObserver {elements} root={container} bind:elementIntersections>
    <div
      bind:this={ref1}
      style="margin-top: 400px; height: 100px; background-color: #376462; color: #fff;"
    >
      Hello world
    </div>
  </MultipleIntersectionObserver>
</div>
