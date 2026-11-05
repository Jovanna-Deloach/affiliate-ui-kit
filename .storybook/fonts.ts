/**
 * Storybook-only: self-hosted woff2 via @fontsource so "Playfair Display
 * Variable", "Plus Jakarta Sans Variable", "Inter Variable" and "JetBrains
 * Mono Variable" resolve offline. The Next.js app uses next/font instead
 * (src/app/layout.tsx); tokens.css reads the next/font variables first and
 * falls back to these family names.
 *
 * Package-root imports resolve through each package's `exports["."]` →
 * index.css. If Vite reports "Failed to resolve import @fontsource-variable/…",
 * the packages are not installed yet: run `bun install`.
 */
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";

/* Kit themes (docs/DESIGN.md): Newsreader with optical sizes (Atelier),
   Hanken Grotesk (Atelier interface), Archivo with the width axis (Assay). */
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/archivo/standard.css";
import "@fontsource-variable/archivo/standard-italic.css";
