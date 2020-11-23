<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let element = undefined;
  let inView = false;
</script>

<header>
  <strong>Scroll down.</strong>
  <div>
    Element in view?
    <strong class="answer" class:inView>{inView ? 'Yes' : 'No'}</strong>
  </div>
</header>

<IntersectionObserver
  {element}
  let:intersecting
  on:observe={({ detail }) => {
    inView = detail.isIntersecting;
  }}>
  <div bind:this={element}>
    {#if intersecting}Element is in view{/if}
  </div>
</IntersectionObserver>
