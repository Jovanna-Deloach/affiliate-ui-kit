import { create } from "storybook/theming/create";

import pkg from "../package.json";

/**
 * The workshop's own look: the manager (sidebar, toolbar, panel) and the docs
 * pages share it. Warm paper and espresso ink from the kit's Atelier theme,
 * with its oxblood as the one accent: the selected page, links, focus. The
 * brand is HTML so the version can sit beside the name; manager-head.html
 * styles it.
 */
const ink = "#181614";
const muted = "#6a6157";
const accent = "#5e1914";
const line = "#e6e1d8";

export const kitTheme = create({
  base: "light",

  brandTitle: `<span class="kit-brand"><span class="kit-brand-mark" aria-hidden="true">a</span><span class="kit-brand-name">Affiliate UI Kit</span><span class="kit-brand-version">v${pkg.version}</span></span>`,
  // No brandImage: with only a title, Storybook renders the title as HTML.
  brandUrl: "./",
  brandTarget: "_self",

  colorPrimary: accent,
  colorSecondary: accent,

  appBg: "#faf8f5",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: line,
  appBorderRadius: 6,

  fontBase: '"Inter Variable", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',

  textColor: ink,
  textInverseColor: "#faf8f4",
  textMutedColor: muted,

  barTextColor: muted,
  barHoverColor: accent,
  barSelectedColor: accent,
  barBg: "#ffffff",

  buttonBg: "#ffffff",
  buttonBorder: line,
  booleanBg: "#f1ede6",
  booleanSelectedBg: "#ffffff",

  inputBg: "#ffffff",
  inputBorder: "#ddd7cc",
  inputTextColor: ink,
  inputBorderRadius: 6,
});
