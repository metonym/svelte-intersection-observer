<script lang="ts">
  import { createIntersectionGroup } from "svelte-intersection-observer";

  const margins = ["0px", "100px", "200px"];
  let step = $state(0);
  let rootMargin = $derived(margins[step]);

  const group = createIntersectionGroup(() => ({ rootMargin }));
  const ids = [1, 2];
</script>

<header>
  <p>Root margin: {rootMargin}</p>
  <button
    data-testid="grow-root-margin"
    onclick={() => (step = Math.min(step + 1, margins.length - 1))}
  >
    Grow root margin
  </button>
</header>

{#each ids as id (id)}
  <div
    data-testid="item-{id}"
    {@attach group.attach()}
  >
    Item {id}
  </div>
{/each}
