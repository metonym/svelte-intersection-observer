<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let element: null | HTMLDivElement = null;
  let exitCount = 0;
</script>

<p data-testid="exit-count">Exit count: {exitCount}</p>

<IntersectionObserver
  {element}
  onexit={() => (exitCount += 1)}
>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>
