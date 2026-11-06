import { createRequire } from "node:module";

import type { StorybookConfig } from "@storybook/nextjs-vite";
import remarkGfm from "remark-gfm";
import { mergeConfig } from "vite";

const require = createRequire(import.meta.url);

/**
 * Every runtime dependency in package.json must be installed before the
 * workshop starts — a package added by a later commit would otherwise
 * surface as a cryptic Vite "Failed to resolve import" in the browser.
 * Check up front and name the fix.
 */
const pkg = require("../package.json") as { dependencies?: Record<string, string> };
const missing = Object.keys(pkg.dependencies ?? {}).filter((name) => {
  try {
    require.resolve(`${name}/package.json`);
    return false;
  } catch {
    // Packages without an exported package.json (rare) resolve their entry instead.
    try {
      require.resolve(name);
      return false;
    } catch {
      return true;
    }
  }
});
if (missing.length > 0) {
  throw new Error(
    `Dependencies are not installed: ${missing.join(", ")}.\n` +
      "They are declared in package.json — run `bun install` and start Storybook again.",
  );
}

const config: StorybookConfig = {
  // Guides (MDX) first, so "Start here" opens the kit; then every stories file.
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    // GitHub-flavoured Markdown (tables) in the MDX guides.
    { name: "@storybook/addon-docs", options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } } },
    "@storybook/addon-a11y",
    // Story tests in Chromium (vitest.config.ts): the MCP server's test-run tool.
    "@storybook/addon-vitest",
    // MCP server for AI agents at http://localhost:6006/mcp (docs/STORYBOOK.md).
    "@storybook/addon-mcp",
  ],
  features: {
    // The components and docs manifests the MCP docs tools read. Curate them
    // with the `!manifest` tag: agents should see the kit, not the legacy library.
    componentsManifest: true,
    // Manifest props from the TypeScript language service. Unlike
    // react-docgen-typescript, it keeps a component's JSDoc tags, so `@summary`
    // (the one line agents see in the component list) and `@import` (the
    // import line printed above every snippet) reach the manifest.
    experimentalReactComponentMeta: true,
  },
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      build: {
        rollupOptions: {
          onwarn(
            warning: { code?: string; message: string; loc?: { line: number; column: number } },
            warn: (w: unknown) => void,
          ) {
            // Client leaves carry "use client" for the Next.js app; Rollup drops the
            // directive when bundling the workshop (expected) and then fails to map
            // that 1:0 position through the sourcemap. Neither is a defect.
            if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
            if (warning.code === "SOURCEMAP_ERROR" && warning.loc?.line === 1 && warning.loc.column === 0) return;
            warn(warning);
          },
        },
      },
    }),
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      // Docgen is for component files only; the preview/config files carry no props.
      exclude: ["**/*.stories.tsx", "**/.storybook/**"],
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;
