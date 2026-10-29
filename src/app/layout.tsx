import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "@/styles/globals.css";

/**
 * next/font self-hosts the families, preloads them and generates
 * metric-adjusted fallbacks, so the serif display never reflows (zero CLS).
 * The variables are consumed by tokens.css (`var(--font-instrument-serif, …)`).
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Affiliate UI Kit",
  description:
    "Multi-vertical affiliate & editorial commerce primitives. One behavioral codebase, radically different verticals via structural tokens.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-vertical="luxury-editorial"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground">{children}</body>
    </html>
  );
}
