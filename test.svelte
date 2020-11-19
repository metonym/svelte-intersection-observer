<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let entry = {};
  let element = undefined;

  $: inView = entry.isIntersecting;
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
  on:observe={({ detail }) => {
    entry = detail;
  }}>
  <div bind:this={element} class="element">Element</div>
</IntersectionObserver>
