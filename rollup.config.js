import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import svelteReadme from "svelte-readme";
import pkg from "./package.json";

const DEV = process.env.ROLLUP_WATCH;
const BUNDLE = process.env.BUNDLE === "true";

export default () => {
  if (!BUNDLE) {
    return svelteReadme({
      minify: !DEV,
      svelte: { dev: DEV, immutable: true },
      prefixUrl: `${pkg.homepage}/tree/master/`,
      style: `
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

        .code-fence header ~ div {
          margin-top: calc(380px);
          height: 200px;
          padding: 1rem;
          background-color: #376462;
          color: #fff;
        }

        .code-fence header div strong {
          color: #d54309;
        }

        .code-fence header div strong.intersecting {
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
