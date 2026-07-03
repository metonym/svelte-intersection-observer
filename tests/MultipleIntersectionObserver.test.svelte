<script lang="ts">
  /**
   * Run `bun test:types` to test the type definitions of the component using `svelte-check`.
   */

  import type { ComponentProps } from "svelte";
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  type Props = ComponentProps<MultipleIntersectionObserver>;

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
  on:observe={(e) => {
    e.detail.target; // HTMLElement
    e.detail.entry.intersectionRect; // DOMRectReadOnly
    e.detail.entry.isIntersecting; // boolean
  }}
  on:intersect={(e) => {
    e.detail.target; // HTMLElement
    e.detail.entry.isIntersecting; // true
  }}
  let:elementIntersections
  let:elementEntries
  let:observer
>
  <div bind:this={ref1}>
    {elementIntersections.get(ref1) ? "visible" : "not visible"}
    {elementEntries.get(ref1)?.boundingClientRect}
  </div>
  <div bind:this={ref2}>
    {elementIntersections.get(ref2) ? "visible" : "not visible"}
    {elementEntries.get(ref2)?.boundingClientRect}
  </div>
  {observer}
</MultipleIntersectionObserver>
