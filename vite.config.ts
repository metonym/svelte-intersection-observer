import { svelteReadme } from "svelte-readme";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    svelteReadme({
      head: `
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Public+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      `,
      style: `
        :root {
          --sr-font-sans: "Public Sans", system-ui, sans-serif;
          --sr-font-mono: "JetBrains Mono", ui-monospace, monospace;
        }

        .code-fence {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          height: 50vh;
          min-height: 380px;
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
          flex-shrink: 0;
        }

        header:before {
          content: "Scroll down.";
          display: block;
          color: #111;
        }

        .code-fence header ~ div {
          padding: 1rem;
          background-color: #376462;
          color: #fff;
        }

        .code-fence header ~ div:not([style*="overflow"]) {
          margin-top: 50vh;
          height: 25vh;
          flex-shrink: 0;
        }

        .code-fence header ~ div[style*="overflow"] {
          flex: 1;
          min-height: 0;
        }

        .code-fence header {
          font-weight: bold;
          color: #d54309;
        }

        .code-fence .intersecting {
          color: #00a91c;
        }
      `,
    }),
  ],
});
