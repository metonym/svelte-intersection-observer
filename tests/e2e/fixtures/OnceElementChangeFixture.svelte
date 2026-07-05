<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let element: null | HTMLDivElement = null;
  let elementB: null | HTMLDivElement = null;
  let intersecting = false;
</script>

<header class:intersecting>
  {intersecting ? "Element is in view" : "Element is not in view"}
  <button
    data-testid="switch"
    onclick={() => (element = elementB)}
  >
    Switch
  </button>
</header>

<IntersectionObserver
  {element}
  bind:intersecting
  once
>
  <div
    data-testid="el-a"
    bind:this={element}
  >
    A
  </div>
</IntersectionObserver>

<div
  data-testid="el-b"
  bind:this={elementB}
>
  B
</div>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    background-color: #e0f7f6;
  }

  [data-testid="el-a"] {
    height: 38vh;
    padding: 1rem;
    background-color: #376462;
    color: #fff;
  }

  [data-testid="el-b"] {
    margin-top: calc(100vh + 1px);
    height: 38vh;
    padding: 1rem;
    background-color: #2ecc71;
    color: #fff;
  }
</style>
