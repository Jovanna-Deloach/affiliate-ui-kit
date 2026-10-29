/**
 * Storybook-only: self-hosted woff2 via @fontsource so "Playfair Display
 * Variable", "Plus Jakarta Sans Variable", "Inter Variable" and "JetBrains
 * Mono Variable" resolve offline. The Next.js app uses next/font instead
 * (src/app/layout.tsx); tokens.css reads the next/font variables first and
 * falls back to these family names.
 */
import "@fontsource-variable/playfair-display/index.css";
import "@fontsource-variable/plus-jakarta-sans/index.css";
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
