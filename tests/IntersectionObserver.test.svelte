<script lang="ts">
  /**
   * Run `bun test:types` to test the type definitions of the component using `svelte-check`.
   */

  import type { ComponentProps } from "svelte";
  import SvelteIntersectionObserver from "svelte-intersection-observer";

  type Props = ComponentProps<SvelteIntersectionObserver>;

  let intersecting: Props["intersecting"] = false;
  let entry: Props["entry"];
  let element: Props["element"];
  let observer: Props["observer"];

  $: entry?.isIntersecting;
</script>

<SvelteIntersectionObserver
  {element}
  bind:observer
  bind:intersecting
  on:observe={(e) => {
    e.detail.intersectionRect; // DOMRectReadOnly
    e.detail.isIntersecting; // boolean
  }}
  on:intersect={(e) => {
    e.detail.isIntersecting; // true
  }}
  let:entry
  let:intersecting
  let:observer
>
  <div bind:this={element}>
    {intersecting ? "Element is in view" : "Element is not in view"}
    {entry?.boundingClientRect}
    {observer}
  </div>
</SvelteIntersectionObserver>
