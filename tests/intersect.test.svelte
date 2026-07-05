<script lang="ts">
  /**
   * Run `bun test:types` to test the type definitions of the action using `svelte-check`.
   */

  import {
    createIntersectionGroup,
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

  // biome-ignore lint/correctness/noUnusedVariables: used in {@attach}, which Biome's Svelte parser doesn't yet analyze for usages
  const group = createIntersectionGroup(() => ({
    root: null,
    rootMargin: "0px",
    threshold: 0,
  }));

  const ids = [1, 2, 3];
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

{#each ids as id (id)}
  <div
    {@attach group.attach({
      once: true,
      skip: false,
      onobserve: (entry) => {
        entry.intersectionRect; // DOMRectReadOnly
        entry.isIntersecting; // boolean
      },
      onintersect: (entry) => {
        entry.isIntersecting; // true
      },
    })}
  >
    Item {id}
  </div>
{/each}
