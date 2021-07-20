import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import svelteReadme from "svelte-readme";
import pkg from "./package.json";

const DEV = process.env.ROLLUP_WATCH;
const BUNDLE = process.env.BUNDLE === "true";

export default () => {
  if (!BUNDLE) {
    return svelteReadme({
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
  }

  return ["es", "umd"].map((format) => {
    const UMD = format === "umd";

    return {
      input: pkg.svelte,
      output: {
        format,
        file: UMD ? pkg.main : pkg.module,
        name: UMD ? pkg.name : undefined,
      },
      plugins: [svelte(), resolve()],
    };
  });
};
