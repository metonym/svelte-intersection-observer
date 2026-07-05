import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8"),
);

export default defineConfig({
  plugins: [svelte({ preprocess: vitePreprocess() })],
  resolve: {
    // Match Svelte's own recommendation for testing runes-based code: force
    // the browser build so component internals behave as they do at runtime.
    conditions: ["browser"],
    alias: {
      [pkg.name]: path.resolve(__dirname, pkg.svelte),
    },
  },
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.ts"],
    setupFiles: ["./tests/unit/setup.ts"],
    typecheck: {
      enabled: true,
      include: ["tests/unit/**/*.test-d.ts"],
    },
  },
});
