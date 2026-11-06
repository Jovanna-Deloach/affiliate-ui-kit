import { CalendarCheck, Clock, MailCheck, MessageSquareReply, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { TrustSignals as TrustSignalsData } from "@/kit/types";
import { cn } from "@/lib/cn";
import { formatDateLong } from "@/lib/format";

export interface TrustSignalsProps {
  /** The brand's name: “Peak Supply”. */
  brand: string;
  /** What the site has seen of how the brand handles its reviews. */
  signals: TrustSignalsData;
  /** Where the site explains how brands use it, and what they cannot do. */
  href?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * How a brand handles its reviews, as the site has seen it: whether it asks
 * every customer for one (a brand that rarely asks gets a warning, since its
 * reviews may lean negative), how many negative reviews it answers and how
 * fast, and since when it has managed its page.
 *
 * **Use it for** beside a brand's or product's rating summary. **Not for**
 * the site's own methods (`TrustPrinciples`) or a warning about a product
 * (`Alert`).
 *
 * @summary How a brand handles reviews: asks for them, replies, and how fast.
 * @import import { TrustSignals } from "@/kit/components";
 */
export function TrustSignals({ brand, signals, href, className }: TrustSignalsProps) {
  const rows: { icon: LucideIcon; text: ReactNode; warn?: boolean }[] = [];
  if (signals.asksForReviews === "rarely") rows.push({ icon: TriangleAlert, text: "No recent history of asking for reviews, so they may lean negative", warn: true });
  else rows.push({ icon: MailCheck, text: signals.asksForReviews === "always" ? "Asks every customer for a review" : "Asks some customers for a review" });
  if (signals.replyRate !== undefined) rows.push({ icon: MessageSquareReply, text: <>Replied to {Math.round(signals.replyRate * 100)}% of negative reviews</> });
  if (signals.replyTime) rows.push({ icon: Clock, text: <>Usually replies within {signals.replyTime}</> });
  if (signals.claimedSince) rows.push({ icon: CalendarCheck, text: <>Has managed this page since {formatDateLong(signals.claimedSince)}</> });
  return (
    <section aria-label={`How ${brand} handles reviews`} className={cn("grid gap-3", className)}>
      <p className="m-0 t-micro text-fg-muted">How {brand} handles reviews</p>
      <ul className="m-0 grid list-none gap-2.5 p-0">
        {rows.map(({ icon: Icon, text, warn }, i) => (
          <li key={i} className="flex items-start gap-2.5 t-small text-fg-body">
            <Icon aria-hidden="true" size={16} strokeWidth={1.75} className={cn("mt-0.5 shrink-0", warn ? "text-warn" : "text-fg-muted")} />
            <span data-numeric>{text}</span>
          </li>
        ))}
      </ul>
      {href ? (
        <a href={href} className="kit-focus kit-link justify-self-start rounded-ctl t-small text-fg">
          How brands use our reviews
        </a>
      ) : null}
    </section>
  );
}
