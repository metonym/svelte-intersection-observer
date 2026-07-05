<script lang="ts">
  /**
   * Run `bun test:types` to test the type definitions of the action using `svelte-check`.
   */

  import {
    type IntersectActionOptions,
    intersect,
    // biome-ignore lint/correctness/noUnusedImports: used in {@attach}, which Biome's Svelte parser doesn't yet analyze for usages
    intersectAttachment,
  } from "svelte-intersection-observer";

  let options: IntersectActionOptions = {
    once: true,
    root: null,
    rootMargin: "0px",
    threshold: 0,
    skip: false,
  };
</script>

<div
  use:intersect={options}
  onobserve={(e) => {
    e.detail.intersectionRect; // DOMRectReadOnly
    e.detail.isIntersecting; // boolean
  }}
  onintersect={(e) => {
    e.detail.isIntersecting; // true
  }}
>
  Hello world
</div>

<div
  {@attach intersectAttachment(() => options)}
  onobserve={(e) => {
    e.detail.intersectionRect; // DOMRectReadOnly
    e.detail.isIntersecting; // boolean
  }}
  onintersect={(e) => {
    e.detail.isIntersecting; // true
  }}
>
  Hello world
</div>
