<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let ref: undefined | HTMLDivElement;
  let includeElement = true;
  let intersecting = false;

  $: element = includeElement ? ref : undefined;
</script>

<header class:intersecting>
  {intersecting ? "Element is in view" : "Element is not in view"}
  <button
    data-testid="clear"
    onclick={() => (includeElement = false)}
  >
    Clear
  </button>
  <button
    data-testid="restore"
    onclick={() => (includeElement = true)}
  >
    Restore
  </button>
</header>

<IntersectionObserver
  {element}
  bind:intersecting
>
  <div bind:this={ref}>Hello world</div>
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

  div {
    margin-top: calc(100vh + 1px);
    height: 38vh;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
  }
</style>
