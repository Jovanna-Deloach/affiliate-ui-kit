import { ArrowDown } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** An in-page jump (“Read the full review”). The arrow is an icon, never a glyph in the label. */
export function JumpLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} data-slot="jump-link" className={cn("kit-focus group inline-flex min-h-11 items-center gap-1.5 self-start rounded-ctl t-ui text-fg", className)}>
      <span className="kit-link">{children}</span>
      <ArrowDown size="1em" strokeWidth={1.75} aria-hidden="true" className="transition-transform duration-(--dur) ease-(--ease) group-hover:translate-y-0.5" />
    </a>
  );
}
