<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let element;
  let intersecting;
</script>

<div class="code-fence">
  <header class:intersecting>
    {intersecting ? "Element is in view" : "Element is not in view"}
  </header>

  <IntersectionObserver {element} bind:intersecting>
    <div bind:this={element}>Hello world</div>
  </IntersectionObserver>
</div>

<style>
  .code-fence {
    overflow-y: scroll;
    height: 380px;
  }

  header {
    position: sticky;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    background-color: #e0f7f6;
  }

  header:before {
    content: "Scroll down.";
    display: block;
    color: #111;
  }

  :global(.code-fence header ~ div) {
    margin-top: calc(380px);
    height: 200px;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
  }

  .code-fence header {
    font-weight: bold;
    color: #d54309;
  }

  .code-fence header.intersecting {
    color: #00a91c;
  }
</style>
