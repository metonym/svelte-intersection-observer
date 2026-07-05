<svelte:options runes={false} />

<script lang="ts">
  import { createIntersectionGroup } from "svelte-intersection-observer";

  const group = createIntersectionGroup();
  const ids = [1, 2];
  let visible: Record<number, boolean> = {};
</script>

<header>
  {#each ids as id}
    <p data-testid="item-{id}-status">
      Item {id} is {visible[id] ? "visible" : "not visible"}
    </p>
  {/each}
</header>

{#each ids as id (id)}
  <div
    data-testid="item-{id}"
    {@attach group.attach({
      onobserve: (entry) => {
        visible = { ...visible, [id]: entry.isIntersecting };
      },
    })}
  >
    Item {id}
  </div>
{/each}
