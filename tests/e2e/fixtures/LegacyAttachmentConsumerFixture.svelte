<svelte:options runes={false} />

<script lang="ts">
  // biome-ignore lint/correctness/noUnusedImports: used in {@attach}, which Biome's Svelte parser doesn't yet analyze for usages
  import { intersectAttachment } from "svelte-intersection-observer";

  let intersecting = false;
  let exitCount = 0;
</script>

<header>
  {intersecting ? "Element is in view" : "Element is not in view"}
</header>
<p data-testid="exit-count">Exit count: {exitCount}</p>

<div
  {@attach intersectAttachment()}
  onobserve={(e) => (intersecting = e.detail.isIntersecting)}
  onexit={() => (exitCount += 1)}
  data-testid="target"
>
  Hello world
</div>
