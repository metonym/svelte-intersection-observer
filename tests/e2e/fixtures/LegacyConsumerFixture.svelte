<svelte:options runes={false} />

<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  export let element: null | HTMLDivElement = null;
  let intersecting = false;
  let exitCount = 0;

  $: statusText = intersecting
    ? "Element is in view"
    : "Element is not in view";
</script>

<header>{statusText}</header>

<IntersectionObserver
  {element}
  bind:intersecting
  onexit={() => (exitCount += 1)}
>
  <div
    bind:this={element}
    data-testid="exit-count"
  >
    Exit count: {exitCount}
  </div>
</IntersectionObserver>
