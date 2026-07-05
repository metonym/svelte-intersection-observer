<script lang="ts">
  import { untrack } from "svelte";
  import IntersectionObserver from "svelte-intersection-observer";

  let element: null | HTMLDivElement = $state(null);
  let intersecting = $state(false);
  let observer: null | IntersectionObserver = $state(null);
  let observerCount = $state(0);
  let unrelated = $state(0);

  // A fresh array literal on every `unrelated` update, but always
  // value-equal — this must not cause the underlying observer to be
  // recreated.
  let threshold = $derived([0, 0.5, unrelated * 0]);

  $effect(() => {
    if (observer) untrack(() => (observerCount += 1));
  });
</script>

<header class:intersecting>
  {intersecting ? "Element is in view" : "Element is not in view"}
  <p data-testid="observer-count">Observer count: {observerCount}</p>
  <button
    data-testid="unrelated-button"
    onclick={() => (unrelated += 1)}
  >
    Unrelated: {unrelated}
  </button>
</header>

<IntersectionObserver
  {element}
  bind:intersecting
  bind:observer
  {threshold}
>
  <div bind:this={element}>Hello world</div>
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
    margin-top: 100vh;
    height: 100vh;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
  }
</style>
