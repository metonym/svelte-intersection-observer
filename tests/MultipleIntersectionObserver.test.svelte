<script lang="ts">
  /**
   * Run `bun test:types` to test the type definitions of the component using `svelte-check`.
   */

  import type { ComponentProps } from "svelte";
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  type Props = ComponentProps<typeof MultipleIntersectionObserver>;

  let elements: Props["elements"] = [];
  let elementIntersections: Props["elementIntersections"] = new Map();
  let elementEntries: Props["elementEntries"] = new Map();
  let observer: Props["observer"];
  let skip: Props["skip"] = false;

  let ref1: null | HTMLDivElement = null;
  let ref2: null | HTMLDivElement = null;

  $: elements = [ref1, ref2];
</script>

<MultipleIntersectionObserver
  {elements}
  {skip}
  bind:observer
  bind:elementIntersections
  bind:elementEntries
  onobserve={(detail) => {
    detail.target; // HTMLElement
    detail.entry.intersectionRect; // DOMRectReadOnly
    detail.entry.isIntersecting; // boolean
  }}
  onintersect={(detail) => {
    detail.target; // HTMLElement
    detail.entry.isIntersecting; // true
  }}
>
  {#snippet children({ elementIntersections, elementEntries, observer })}
    <div bind:this={ref1}>
      {elementIntersections.get(ref1) ? "visible" : "not visible"}
      {elementEntries.get(ref1)?.boundingClientRect}
    </div>
    <div bind:this={ref2}>
      {elementIntersections.get(ref2) ? "visible" : "not visible"}
      {elementEntries.get(ref2)?.boundingClientRect}
    </div>
    {observer}
  {/snippet}
</MultipleIntersectionObserver>
