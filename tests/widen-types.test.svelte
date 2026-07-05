<script lang="ts">
  /**
   * Run `bun test:types` to test that `Element` (not just `HTMLElement`) and
   * `undefined` (not just `null`) `bind:this` refs type-check, using `svelte-check`.
   */

  import IntersectionObserver, {
    intersect,
    MultipleIntersectionObserver,
  } from "svelte-intersection-observer";

  let element: HTMLElement | undefined = $state();
  let ref1: HTMLElement | undefined = $state();
  let ref2: HTMLElement | undefined = $state();
  let elements = $derived([ref1, ref2]);
</script>

<IntersectionObserver {element}>
  {#snippet children({ intersecting })}
    <div bind:this={element}>
      {intersecting ? "Element is in view" : "Element is not in view"}
    </div>
  {/snippet}
</IntersectionObserver>

<MultipleIntersectionObserver {elements}>
  {#snippet children({ elementIntersections })}
    <div bind:this={ref1}>{elementIntersections.get(ref1) ? "✓" : "✗"}</div>
    <div bind:this={ref2}>{elementIntersections.get(ref2) ? "✓" : "✗"}</div>
  {/snippet}
</MultipleIntersectionObserver>

<svg use:intersect={{ once: true }}>
  <title>Scroll indicator</title>
  <circle
    cx="5"
    cy="5"
    r="4"
  />
</svg>
