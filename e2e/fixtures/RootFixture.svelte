<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let container: null | HTMLDivElement = null;
  let element: null | HTMLDivElement = null;
  let intersecting = false;
</script>

<div data-testid="status">
  {intersecting ? "Element is in view" : "Element is not in view"}
</div>

<div
  bind:this={container}
  data-testid="container"
  style="height: 200px; overflow-y: auto;"
>
  <IntersectionObserver {element} root={container} bind:intersecting>
    <div
      bind:this={element}
      style="margin-top: 400px; height: 100px; background-color: #376462; color: #fff;"
    >
      Hello world
    </div>
  </IntersectionObserver>
</div>
