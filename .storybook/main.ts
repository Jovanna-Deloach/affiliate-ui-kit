import { createRequire } from "node:module";

import type { StorybookConfig } from "@storybook/nextjs-vite";
import { mergeConfig } from "vite";

const require = createRequire(import.meta.url);

/**
 * The workshop self-hosts its faces (.storybook/fonts.ts). A missing package
 * would otherwise surface as a cryptic Vite "Failed to resolve import" in the
 * browser, so check up front and name the fix.
 */
const FONT_PACKAGES = [
  "@fontsource-variable/playfair-display",
  "@fontsource-variable/plus-jakarta-sans",
  "@fontsource-variable/inter",
  "@fontsource-variable/jetbrains-mono",
];
const missing = FONT_PACKAGES.filter((name) => {
  try {
    require.resolve(`${name}/package.json`);
    return false;
  } catch {
    return true;
  }
});
if (missing.length > 0) {
  throw new Error(
    `Storybook fonts are not installed: ${missing.join(", ")}.\n` +
      "They are declared in package.json — run `bun install` and start Storybook again.",
  );
}

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
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
