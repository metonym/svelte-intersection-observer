import { defineConfig, devices } from "@playwright/experimental-ct-svelte";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import pkg from "./package.json" assert { type: "json" };

export default defineConfig({
  testDir: "./",
  timeout: 10_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
    ctPort: 3100,
    ctViteConfig: {
      plugins: [svelte({ preprocess: vitePreprocess() })],
      resolve: {
        alias: {
          [pkg.name]: pkg.main,
        },
      },
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
