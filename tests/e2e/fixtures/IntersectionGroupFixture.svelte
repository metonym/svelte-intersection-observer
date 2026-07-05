<script lang="ts">
  import { createIntersectionGroup } from "svelte-intersection-observer";

  // Spy on the global constructor to verify the group shares a single
  // underlying `IntersectionObserver` instead of one per element.
  let observerCount = 0;
  const NativeIntersectionObserver = window.IntersectionObserver;

  window.IntersectionObserver = class extends NativeIntersectionObserver {
    constructor(
      ...args: ConstructorParameters<typeof NativeIntersectionObserver>
    ) {
      super(...args);
      observerCount += 1;
    }
  };

  const group = createIntersectionGroup();

  const ids = [1, 2, 3];
  let visible: Record<number, boolean> = {};
</script>

<header>
  <p data-testid="observer-count">Observer count: {observerCount}</p>
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
    height: 50vh;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
    margin-bottom: 100vh;
  }

  div:first-of-type {
    margin-top: calc(100vh + 1px);
  }
</style>
