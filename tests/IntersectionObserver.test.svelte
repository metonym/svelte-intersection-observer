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

  $: entry?.isIntersecting;
</script>

<SvelteIntersectionObserver
  {element}
  {skip}
  bind:observer
  bind:intersecting
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
