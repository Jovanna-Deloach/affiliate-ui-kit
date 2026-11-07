import { create } from "storybook/theming/create";

import pkg from "../package.json";

/**
 * The workshop's own look: the manager (sidebar, toolbar, panel) and the docs
 * pages share it. White and blue, after the Wix Design System's Storybook:
 * every background white (sidebar, toolbar, content), hairlines between
 * them, one blue for the selected page, links and focus, and blue-gray ink.
 * Blue tints only on small marks (badges), never a background. No warm
 * tones. The brand is HTML so the version can sit beside the name;
 * manager-head.html styles it.
 */
const ink = "#162d3d";
const muted = "#577083";
const blue = "#116dff";
const line = "#dfe5eb";

export const kitTheme = create({
  base: "light",

  brandTitle: `<span class="kit-brand"><span class="kit-brand-mark" aria-hidden="true">A</span><span class="kit-brand-name">Affiliate UI Kit</span><span class="kit-brand-version">v${pkg.version}</span></span>`,
  // No brandImage: with only a title, Storybook renders the title as HTML.
  brandUrl: "./",
  brandTarget: "_self",

  colorPrimary: blue,
  colorSecondary: blue,

  appBg: "#ffffff",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: line,
  appBorderRadius: 6,

  fontBase: '"Inter Variable", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',

  textColor: ink,
  textInverseColor: "#ffffff",
  textMutedColor: muted,

  barTextColor: muted,
  barHoverColor: blue,
  barSelectedColor: blue,
  barBg: "#ffffff",

  buttonBg: "#ffffff",
  buttonBorder: line,
  booleanBg: "#eef3f8",
  booleanSelectedBg: "#ffffff",

  inputBg: "#ffffff",
  inputBorder: "#c9d6e2",
  inputTextColor: ink,
  inputBorderRadius: 6,
});
