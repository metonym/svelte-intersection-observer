<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";
  import type { Entry } from "./types/IntersectionObserver";

  let entry: Entry = null;
  let element: HTMLElement;

  $: inView = entry && entry.isIntersecting;
</script>

<header>
  <strong>Scroll down.</strong>
  <div>
    Element in view?
    <strong class="answer" class:inView>{inView ? 'Yes' : 'No'}</strong>
  </div>
</header>

<IntersectionObserver {element} bind:entry>
  <div class="element" bind:this={element}>
    {#if inView}Element is in view{/if}
  </div>
</IntersectionObserver>
