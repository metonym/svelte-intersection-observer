<script lang="ts">
  /**
   * Run `bun test:types` to test the type definitions of the action using `svelte-check`.
   */

  import { type IntersectActionOptions, intersect } from "svelte-intersection-observer";

  let options: IntersectActionOptions = { once: true, rootMargin: "0px", threshold: 0 };
</script>

<div
  use:intersect={options}
  on:observe={(e) => {
    e.detail.intersectionRect; // DOMRectReadOnly
    e.detail.isIntersecting; // boolean
  }}
  on:intersect={(e) => {
    e.detail.isIntersecting; // true
  }}
>
  Hello world
</div>
