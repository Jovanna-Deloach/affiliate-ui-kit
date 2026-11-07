import { CircleCheck, OctagonAlert } from "lucide-react";

import { WARNING_LABEL } from "@/kit/lib/warnings";
import type { ProductWarning } from "@/kit/types";
import { Sep } from "@/kit/ui";
import { cn } from "@/lib/cn";
import { formatDateLong } from "@/lib/format";

export interface ConsumerWarningProps {
  /** The warning: its kind, title, what happened, what it covers, what to do, when, and who issued it. */
  warning: ProductWarning;
  /** What it is about, as readers know it: “Fieldwork Creatine Capsules”, or a brand. */
  subject: string;
  /** The section’s id: `warningId(product)` from `@/kit/lib/warnings`, so the notes that replace the buy links can point here (default `warning`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The full warning about a product or a brand: a recall, a regulator’s
 * warning, a failed safety test or fake reviews. Its kind and whether it
 * still stands, the title, what it is about, when it was issued and by whom
 * (linked), what happened, what it covers, and what to do, set apart. While
 * it stands, the product’s score, certification and buy links are down
 * everywhere in the kit (`KitProduct.warning`), and the block says so. Resolved, it stays as
 * history, in gray.
 *
 * **Use it for** the top of a product’s or brand’s page, under the article
 * header, while a warning stands, and lower down once it is resolved.
 * **Not for** a page-wide notice (`Banner`, which links here), a lapsed
 * certification (`CertificationNotice`), or side effects (`SafetyPanel`).
 *
 * @summary The full warning: what happened, when, who says so, and what to do.
 * @import import { ConsumerWarning } from "@/kit/blocks";
 */
export function ConsumerWarning({ warning, subject, id = "warning", className }: ConsumerWarningProps) {
  const active = warning.status === "active";
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-slot="consumer-warning"
      data-warning={warning.status}
      className={cn("kit-card scroll-mt-8", className)}
    >
      <div className="grid max-w-[65ch] gap-4 p-5 sm:p-6">
        <p className={cn("m-0 flex flex-wrap items-center gap-x-2 gap-y-1 t-micro", active ? "text-fail" : "text-fg-muted")}>
          {active ? <OctagonAlert aria-hidden="true" size={16} strokeWidth={2} /> : <CircleCheck aria-hidden="true" size={16} strokeWidth={2} />}
          <span>{WARNING_LABEL[warning.kind]}</span>
          <Sep />
          <span>{active ? "In force" : "Resolved"}</span>
        </p>
        <div className="grid gap-1.5">
          <h2 id={`${id}-title`} className="m-0 t-title text-fg">
            {warning.title}
          </h2>
          <p className="m-0 t-small text-fg-muted">
            {subject}
            <Sep />
            Issued <time dateTime={warning.issuedAt}>{formatDateLong(warning.issuedAt)}</time> by{" "}
            <a href={warning.source.href} className="kit-focus kit-link rounded-ctl text-fg">
              {warning.source.name}
            </a>
            {warning.resolvedAt ? (
              <>
                <Sep />
                Resolved <time dateTime={warning.resolvedAt}>{formatDateLong(warning.resolvedAt)}</time>
              </>
            ) : null}
          </p>
        </div>
        <p className="m-0 t-body text-fg-body">{warning.summary}</p>
        {warning.affected ? (
          <p className="m-0 t-small text-fg-body">
            <strong className="font-semibold text-fg">Affected: </strong>
            {warning.affected}
          </p>
        ) : null}
        <div className="grid gap-1 rounded-box bg-well p-4">
          <h3 className="m-0 t-ui font-semibold text-fg">What to do</h3>
          <p className="m-0 t-small text-fg-body">{warning.action}</p>
        </div>
        <p className="m-0 t-caption text-fg-muted">
          {active ? "We’ve taken down the score, the certification and every buy link while this warning stands." : "Kept here so you know it happened."}
        </p>
      </div>
    </section>
  );
}
