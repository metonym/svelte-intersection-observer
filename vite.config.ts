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
          height: 16rem;
          min-height: 16rem;
          padding: 0;
          background-color: var(--sr-color-canvas);
          border: 1px solid var(--sr-color-border);
        }

        .code-fence header {
          position: sticky;
          z-index: 1;
          top: 0;
          left: 0;
          min-height: 3rem;
          width: 100%;
          padding: var(--sr-box-padding);
          background-color: var(--sr-color-canvas-subtle);
          border-bottom: 1px solid var(--sr-color-border-muted);
          flex-shrink: 0;
          font-family: var(--sr-font-sans);
          font-size: var(--sr-text-sm);
          font-weight: 600;
          color: var(--sr-color-fg-subtle);
        }

        .code-fence header:before {
          content: "Scroll down.";
          display: block;
          margin-top: 0.25rem;
          font-size: var(--sr-text-xs);
          font-weight: 400;
          color: var(--sr-color-fg-muted);
        }

        .code-fence header ~ div {
          padding: var(--sr-box-padding);
          background-color: var(--sr-color-canvas);
          color: var(--sr-color-fg);
          font-family: var(--sr-font-sans);
          font-size: var(--sr-text-base);
        }

        .code-fence header ~ div:not([style*="overflow"]) {
          display: flex;
          align-items: center;
          margin-top: 13rem;
          height: 4rem;
          flex-shrink: 0;
        }

        .code-fence header ~ div[style*="overflow"] {
          flex: 1;
          min-height: 0;
        }

        .code-fence .intersecting {
          color: var(--sr-color-link);
          font-weight: 600;
        }
      `,
    }),
  ],
});
