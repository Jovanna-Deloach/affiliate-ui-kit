import { OctagonAlert } from "lucide-react";

import { WARNING_LABEL } from "@/kit/lib/warnings";
import type { ProductWarning } from "@/kit/types";
import { cn } from "@/lib/cn";

export interface WarningNoteProps {
  /** The warning that stands against the product. */
  warning: ProductWarning;
  /** Where the full warning is: `#warning-{slug}` on the product’s page (`warningId`), or the product’s page from a list. */
  href: string;
  /** `line` in a card or a table row, where the price was (default) · `box` in a buy box, where the offers were. */
  size?: "line" | "box";
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * What a product under a standing warning shows where its price and buy
 * links would be: the kind of warning and its title in red, linked to the
 * full warning. The `box` size, for a buy box, also says the buy links are
 * down while the warning stands. The kit’s buy surfaces put it in
 * themselves; use it directly only in a part of your own.
 *
 * **Use it for** a product whose `warning` is active, in place of its price,
 * buy links and score. **Not for** the full warning (`ConsumerWarning`), a
 * page-wide notice (`Banner`), or a lapsed certification
 * (`CertificationNotice`).
 *
 * @summary The red note a warned product shows where its price and buy links were.
 * @import import { WarningNote } from "@/kit/components";
 */
export function WarningNote({ warning, href, size = "line", className }: WarningNoteProps) {
  if (size === "box")
    return (
      <div data-slot="warning-note" className={cn("grid gap-1.5 rounded-box border border-line border-l-4 border-l-fail bg-paper p-4", className)}>
        <p className="m-0 flex items-start gap-2 t-ui font-semibold text-pretty text-fail">
          <OctagonAlert aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          {WARNING_LABEL[warning.kind]}: {warning.title}
        </p>
        <p className="m-0 t-small text-fg-body">
          Buy links are down while it stands.{" "}
          <a href={href} className="kit-focus kit-link rounded-ctl text-fg">
            What happened, and what to do
          </a>
        </p>
      </div>
    );
  return (
    <p data-slot="warning-note" className={cn("m-0 flex items-start gap-1.5 t-small text-pretty text-fail", className)}>
      <OctagonAlert aria-hidden="true" size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
      <span>
        <a href={href} className="kit-focus kit-link rounded-ctl font-semibold">
          {WARNING_LABEL[warning.kind]}
        </a>
        : {warning.title}
      </span>
    </p>
  );
}
