/**
 * Storybook-only: self-hosted woff2 via @fontsource so "Instrument Serif",
 * "Inter Variable" and "JetBrains Mono Variable" resolve offline. The Next.js
 * app uses next/font instead (see src/app/layout.tsx); tokens.css reads the
 * next/font variables first and falls back to these family names.
 */
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
