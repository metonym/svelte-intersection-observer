<svelte:options runes={false} />

<script lang="ts">
  import { intersect } from "svelte-intersection-observer";

  let intersecting = false;
  let exitCount = 0;
</script>

<header>
  {intersecting ? "Element is in view" : "Element is not in view"}
</header>
<p data-testid="exit-count">Exit count: {exitCount}</p>

<div
  use:intersect
  onobserve={(e) => (intersecting = e.detail.isIntersecting)}
  onexit={() => (exitCount += 1)}
  data-testid="target"
>
  Hello world
</div>
