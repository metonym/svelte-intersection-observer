<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let element;
  let intersecting;
  let rootMargin = "-200px";
</script>

<header class:intersecting>
  {intersecting ? "Element is in view" : "Element is not in view"}
</header>

<IntersectionObserver {element} bind:intersecting {rootMargin}>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>

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
    margin-top: calc(100vh + 1px);
    height: 38vh;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
  }

  header:before {
    content: "Scroll down.";
    display: block;
    color: #111;
  }

  header {
    font-weight: bold;
    color: #d54309;
  }

  header.intersecting {
    color: #00a91c;
  }
</style>
