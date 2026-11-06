import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Story tests (docs/STORYBOOK.md): every story renders in Chromium and its
 * play function runs, so the kit checks (assertKitPage) run for agents too,
 * through the Storybook MCP `test-run` tool or `bun run test:stories`, at the
 * preview’s default viewport (1280px); scripts/verify-stories.mjs also covers
 * 375px and 1440px.
 */
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, ".storybook"), storybookScript: "bun run storybook --ci" })],
        test: {
          name: "storybook",
          // One page for every story file: with a fresh iframe per file, a long
          // run can drop its browser connection (Storybook’s documented fix).
          isolate: false,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
