import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Affiliate UI Kit",
  description:
    "Multi-vertical affiliate & editorial commerce primitives. One behavioral codebase, radically different verticals via structural tokens.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-vertical="luxury-editorial">
      <body className="min-h-dvh bg-background text-foreground">{children}</body>
    </html>
  );
}
