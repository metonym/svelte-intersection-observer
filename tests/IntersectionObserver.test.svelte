<script lang="ts">
  /**
   * Run `bun test:types` to test the type definitions of the component using `svelte-check`.
   */

  import type { ComponentProps } from "svelte";
  import SvelteIntersectionObserver from "svelte-intersection-observer";

  type Props = ComponentProps<typeof SvelteIntersectionObserver>;

  let intersecting: Props["intersecting"] = false;
  let entry: Props["entry"];
  let element: Props["element"];
  let observer: Props["observer"];
  let skip: Props["skip"] = false;
  let once: Props["once"] = false;
  let root: Props["root"] = null;
  let rootMargin: Props["rootMargin"] = "0px";
  let threshold: Props["threshold"] = 0;

  $: entry?.isIntersecting;
</script>

<SvelteIntersectionObserver
  {element}
  {once}
  {root}
  {rootMargin}
  {threshold}
  {skip}
  bind:observer
  bind:intersecting
  bind:entry
  onobserve={(entry) => {
    entry.intersectionRect; // DOMRectReadOnly
    entry.isIntersecting; // boolean
  }}
  onintersect={(entry) => {
    entry.isIntersecting; // true
  }}
>
  {#snippet children({ entry, intersecting, observer })}
    <div bind:this={element}>
      {intersecting ? "Element is in view" : "Element is not in view"}
      {entry?.boundingClientRect}
      {observer}
    </div>
  {/snippet}
</SvelteIntersectionObserver>
