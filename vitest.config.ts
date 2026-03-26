import path from "node:path";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    silent: "passed-only",
    clearMocks: true,
    restoreMocks: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        plugins: [react()],
        define: {
          "process.env": {},
        },
        test: {
          name: "browser",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["tests/setup/browser.ts"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [
              { browser: "chromium", viewport: { width: 1280, height: 720 } },
            ],
          },
        },
      },
    ],
  },
});
