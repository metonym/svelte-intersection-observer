<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let element: null | HTMLDivElement = null;
  let intersecting = false;
  let entry: null | IntersectionObserverEntry = null;
  let occluded = true;

  $: isVisible = entry?.isVisible ?? false;
</script>

<header class:intersecting>
  {intersecting ? "Element is in view" : "Element is not in view"}
  <p data-testid="visibility-status">
    {isVisible ? "Element is visible" : "Element is not visible"}
  </p>
  <button
    data-testid="toggle-occluder"
    onclick={() => (occluded = !occluded)}
  >
    Toggle occluder
  </button>
</header>

<IntersectionObserver
  {element}
  bind:intersecting
  bind:entry
  trackVisibility
  delay={100}
>
  <div class="wrapper">
    <div
      bind:this={element}
      class="target"
    >
      Hello world
    </div>
    {#if occluded}
      <div
        class="occluder"
        data-testid="occluder"
      ></div>
    {/if}
  </div>
</IntersectionObserver>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    background-color: #e0f7f6;
  }

  .wrapper {
    position: relative;
    margin-top: calc(100vh + 1px);
    height: 38vh;
  }

  .target {
    height: 100%;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
  }

  .occluder {
    position: absolute;
    inset: 0;
    background-color: #000;
  }
</style>
