import svelteReadme from "svelte-readme";

export default svelteReadme({
  style: `
    .code-fence {
      overflow-y: scroll;
      height: 380px;
      padding: 0;
    }

    header {
      position: sticky;
      z-index: 1;
      top: 0;
      left: 0;
      min-height: 80px;
      width: 100%;
      padding: 1rem;
      background-color: #e0f7f6;
    }

    header:before {
      content: "Scroll down.";
      display: block;
      color: #111;
    }

    .code-fence header ~ div {
      margin-top: calc(380px - 80px);
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
  `,
});
