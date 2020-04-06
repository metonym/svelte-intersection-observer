<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let entry = {};
  let element = undefined;

  $: inView = entry.isIntersecting;
</script>

<style>
  header {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    background-color: #e0f7f6;
  }

  .element {
    margin-top: calc(100vh + 1px);
    height: 38vh;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
  }

  .answer {
    color: #d54309;
  }

  .answer.inView {
    color: #00a91c;
  }
</style>

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
