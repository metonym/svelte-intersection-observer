<script lang="ts">
  import IntersectionObserver from "./types";

  let element = null;
</script>

<IntersectionObserver
  {element}
  rootMargin="50px"
  on:observe={({ detail }) => {
    console.log(detail);
  }} />
