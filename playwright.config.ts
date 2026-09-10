import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against a production build, not `next dev`. The whole site is
 * prerendered (22 static pages), so `next dev`'s on-demand compilation would
 * measure the compiler rather than the page — and the reveal/no-JS nets in
 * globals.css only behave like production once the CSS is built.
 *
 * `channel: "chrome"` uses the locally installed Google Chrome rather than a
 * downloaded Playwright chromium. On CI, drop the channel and run
 * `npx playwright install --with-deps chromium` in the setup step instead.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1440, height: 900 } },
    },
    {
      // 1024–1200 is the band where this layout's columns are far narrower
      // than at 1400 and where breakage hides. It gets its own project.
      name: "laptop-narrow",
      use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1100, height: 800 } },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], channel: "chrome" },
    },
  ],

  webServer: {
    command: "npm run build && npx next start -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
