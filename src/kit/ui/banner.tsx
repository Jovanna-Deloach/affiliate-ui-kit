import { Info, OctagonAlert, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const TONES: Record<"info" | "warning" | "danger", { icon: LucideIcon; band: string; ink: string }> = {
  info: { icon: Info, band: "bg-well", ink: "text-fg-muted" },
  warning: { icon: TriangleAlert, band: "border-t-4 border-t-warn bg-paper", ink: "text-warn" },
  danger: { icon: OctagonAlert, band: "border-t-4 border-t-fail bg-paper", ink: "text-fail" },
};

export interface BannerProps {
  /** `info` news about the site (default) · `warning` read before relying on the page · `danger` a recall or a safety warning. */
  tone?: keyof typeof TONES;
  /** The point, in a few words, set in bold: “Peak Supply recalled batch 2214”. */
  title: string;
  /** One sentence after the title: what it means for the reader. */
  children?: ReactNode;
  /** A link at the end: where to read more (“What to do”). */
  action?: ReactNode;
  /** Announce it when it appears after load; leave off for a banner that is part of the page. */
  live?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A notice across the whole width of the page, under the masthead, in its
 * own page well: an icon in its tone, the point in bold, a sentence, and a
 * link. Warnings and dangers sit on white under a 4px bar in their color;
 * news sits on the cool gray well. One at a time, at the top.
 *
 * **Use it for** something every reader of the page must see first: a
 * recall of the product, a warning about the brand, news about the site’s
 * testing. **Not for** a notice inside the content (`Alert`), the result of
 * an action (`Toast`), or the full warning (`ConsumerWarning`).
 *
 * @summary A full-width notice under the masthead: info, warning or danger.
 * @import import { Banner } from "@/kit/ui";
 */
export function Banner({ tone = "info", title, children, action, live = false, className }: BannerProps) {
  const { icon: Icon, band, ink } = TONES[tone];
  return (
    <aside aria-label={title} role={live ? (tone === "danger" ? "alert" : "status") : undefined} className={cn("border-b border-line", band, className)}>
      <div className="kit-well flex items-start gap-3 py-3">
        <Icon aria-hidden="true" size={20} strokeWidth={1.75} className={cn("mt-0.5 shrink-0", ink)} />
        <p className="m-0 t-small text-fg-body">
          <strong className="font-semibold text-fg">{title}</strong>
          {children ? <> {children}</> : null}
          {action ? <> {action}</> : null}
        </p>
      </div>
    </aside>
  );
}
