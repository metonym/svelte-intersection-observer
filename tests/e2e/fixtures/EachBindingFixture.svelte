<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  const sections = [
    {
      id: "one",
      node: undefined as undefined | HTMLElement,
      intersecting: undefined as undefined | boolean,
    },
    {
      id: "two",
      node: undefined as undefined | HTMLElement,
      intersecting: undefined as undefined | boolean,
    },
    {
      id: "three",
      node: undefined as undefined | HTMLElement,
      intersecting: undefined as undefined | boolean,
    },
  ];
</script>

{#each sections as { id, node, intersecting }}
  <IntersectionObserver
    element={node}
    bind:intersecting
  >
    <section
      data-testid="section-{id}"
      class:intersecting
      bind:this={node}
    >
      Section {id}: {intersecting ? "visible" : "not visible"}
    </section>
  </IntersectionObserver>
{/each}

<style>
  section {
    height: 50vh;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
    margin-bottom: 100vh;
  }

  section:first-of-type {
    margin-top: calc(100vh + 1px);
  }

  section.intersecting {
    background-color: #2ecc71;
  }
</style>
