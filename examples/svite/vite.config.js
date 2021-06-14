import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    plugins: [svelte()],
    build: { minify: mode === "production" },
  };
});
