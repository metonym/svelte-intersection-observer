<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let element;
  let intersecting;

  let element2;
  let intersecting2;

  let element3;
  let intersecting3;

  let rootMargin;
</script>

<h2>Basic</h2>

<div class="code-fence">
  <header class:intersecting>
    {intersecting ? "Element is in view" : "Element is not in view"}
  </header>

  <IntersectionObserver {element} bind:intersecting>
    <div bind:this={element}>Hello world</div>
  </IntersectionObserver>
</div>

<h2>Once</h2>

<div class="code-fence">
  <header class:intersecting={intersecting2}>
    {intersecting2 ? "Element is in view" : "Element is not in view"}
  </header>

  <IntersectionObserver
    element={element2}
    bind:intersecting={intersecting2}
    once
  >
    <div bind:this={element2}>Hello world</div>
  </IntersectionObserver>
</div>

<h2>Dynamic rootMargin</h2>

<div class="code-fence">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
<header
    class:intersecting={intersecting3}
    on:click={() => {
      rootMargin = rootMargin ? undefined : "-200px";
    }}
  >
    {intersecting3 ? "Element is in view" : "Element is not in view"}
  </header>

  <IntersectionObserver
    element={element3}
    bind:intersecting={intersecting3}
    {rootMargin}
  >
    <div bind:this={element3}>Hello world</div>
  </IntersectionObserver>
</div>

<style>
  h2 {
    margin-bottom: 1rem;
  }

  .code-fence {
    overflow-y: scroll;
    height: 380px;
    margin-bottom: 3rem;
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
