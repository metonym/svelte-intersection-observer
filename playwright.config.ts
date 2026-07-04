import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 10_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 4 : undefined,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html"]],
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },
  projects: process.env.CI
    ? [
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
      ]
    : [
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
      ],
  webServer: {
    // In CI, serve a production build via `vite preview`: bundled static
    // assets load far faster and with less variance than the dev server,
    // which transforms modules on demand through a single process. Locally,
    // keep the dev server for fast iteration (HMR, no build step).
    command: process.env.CI
      ? "bunx vite build --config tests/e2e/vite.config.ts && bunx vite preview --config tests/e2e/vite.config.ts --port 4173 --strictPort"
      : "bunx vite --config tests/e2e/vite.config.ts --port 4173",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
