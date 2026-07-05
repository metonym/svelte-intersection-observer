<svelte:options runes={false} />

<script lang="ts">
  import { createIntersectionObserver } from "svelte-intersection-observer";

  const observer = createIntersectionObserver(() => ({ once: true }));

  $: statusText = observer.intersecting
    ? "Element is in view"
    : "Element is not in view";
</script>

<header>{statusText}</header>

<div
  {@attach observer.attach}
  data-testid="target"
>
  Hello world
</div>
