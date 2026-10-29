"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Copy, X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";
import { AffiliateAction } from "@/primitives/affiliate-action";
import type { AffiliateAttribution, AffiliateClickEvent } from "@/types/affiliate";

/**
 * <PromoCodeChip />
 * ---------------------------------------------------------------------------
 * Click-to-copy discount code with an SVG checkmark state morph and an
 * optional outbound trigger that routes through <AffiliateAction />.
 *
 *   --radius-inner / --inset-cell-x / --row-y     chip geometry (shared spine)
 *   type-mono                                     code voice — the one mono token
 *   --border-strong / --surface-recessed          ticket rule / recessed chip
 *   --duration-micro / --ease-standard            glyph + label morph
 *
 * Mobbin anatomy (Agoda perforated ticket, Tabby "Copy code", adidas voucher
 * + "copied" toast, Meta Quest "Code applied"): the code is the loudest
 * element, mono and tracked; the action sits in its own stub cell; copied
 * state is confirmed in place, not with a toast.
 *
 * 21st.dev physics (ddoemonn/copy-button → `check-draw` in mechanics.css):
 * stacked glyphs crossfade and the check stroke draws via pathLength /
 * dash-offset; labels crossfade in a 1×1 grid so the chip never changes
 * width. `role="status"` announces the result. Client leaf; the only timer
 * is the status reset.
 */

const chipVariants = cva("group/chip inline-flex max-w-full items-stretch text-ink", {
  variants: {
    chroming: {
      /** Perforated ticket: dashed strong hairline, code cell | copy stub | outbound. */
      ticket: [
        "rounded-inner border border-dashed border-strong bg-surface",
        "[&_[data-slot=chip-action]]:border-l [&_[data-slot=chip-action]]:border-dashed [&_[data-slot=chip-action]]:border-strong",
      ],
      /** Plane-2 chip: recessed fill, hairline stub rule. */
      recessed: [
        "rounded-inner border border-transparent bg-recessed",
        "[&_[data-slot=chip-action]]:border-l [&_[data-slot=chip-action]]:border-hairline",
      ],
      /** Bare inline lockup for prose and captions. */
      inline: "gap-stack bg-transparent",
    },
    size: {
      sm: "[--chip-pad-y:var(--row-y-compact)]",
      md: "[--chip-pad-y:var(--row-y)]",
    },
  },
  defaultVariants: { chroming: "ticket", size: "md" },
});

export interface PromoCodeChipProps
  extends Omit<ComponentProps<"div">, "children" | "onCopy">,
    VariantProps<typeof chipVariants> {
  code: string;
  /** "15% off first order" */
  description?: ReactNode;
  copyLabel?: string;
  copiedLabel?: string;
  errorLabel?: string;
  /** ms before the status resets to idle. */
  timeout?: number;
  onCopy?: (code: string) => void;
  /** Optional outbound trigger: merchant URL routed through <AffiliateAction />. */
  href?: string;
  outboundLabel?: ReactNode;
  attribution?: AffiliateAttribution;
  tracking?: Pick<AffiliateClickEvent, "merchant" | "productId" | "offerId" | "placement">;
}

export function PromoCodeChip({
  code,
  description,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  errorLabel = "Failed",
  timeout = 2000,
  onCopy,
  href,
  outboundLabel = "Shop with code",
  attribution,
  tracking,
  chroming = "ticket",
  size,
  className,
  ...props
}: PromoCodeChipProps) {
  const { copy, status } = useCopyToClipboard({ timeout, onCopy });
  const inline = chroming === "inline";

  return (
    <div
      data-slot="promo-code-chip"
      data-chroming={chroming}
      data-status={status}
      className={cn(chipVariants({ chroming, size }), className)}
      {...props}
    >
      {/* Code cell */}
      <div
        data-slot="chip-code"
        className={cn("flex min-w-0 flex-col justify-center gap-hairline", !inline && "px-cell-x py-(--chip-pad-y)")}
      >
        {/* The code is a short uppercase token — the one place mono belongs (Law 1). */}
        <span className="type-mono truncate text-body-sm text-ink" aria-label={`Promo code ${code}`}>
          {code}
        </span>
        {description && <span className="truncate text-caption text-ink-secondary">{description}</span>}
      </div>

      {/* Copy stub */}
      <button
        type="button"
        data-slot="chip-action"
        data-status={status}
        onClick={() => void copy(code)}
        aria-label={`Copy code ${code}`}
        className={cn(
          "check-draw focus-ring group/copy flex shrink-0 cursor-pointer items-center gap-[0.5em] type-eyebrow",
          "transition-[background-color,color] duration-interactive ease-standard",
          inline
            ? "text-ink-secondary hover:text-ink"
            : "px-cell-x hover:bg-recessed data-[status=copied]:text-positive-ink",
          !inline && chroming === "recessed" && "hover:bg-surface",
        )}
      >
        <span aria-hidden="true" className="grid size-[1.1em] shrink-0 place-items-center [&>svg]:size-full">
          <Copy data-glyph="idle" strokeWidth={1.5} />
          <svg data-glyph="copied" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8.5l3 3 7-7" pathLength={1} />
          </svg>
          <X data-glyph="error" strokeWidth={1.5} />
        </span>
        <span className="relative grid">
          <span data-label="idle" className="whitespace-nowrap">{copyLabel}</span>
          <span data-label="copied" className="whitespace-nowrap">{copiedLabel}</span>
          <span data-label="error" className="whitespace-nowrap">{errorLabel}</span>
        </span>
        <span role="status" aria-live="polite" className="sr-only">
          {status === "copied" ? `${copiedLabel}: ${code}` : status === "error" ? errorLabel : ""}
        </span>
      </button>

      {/* Optional outbound trigger */}
      {href && (
        <div
          data-slot="chip-outbound"
          className={cn("flex shrink-0 items-center", !inline && "border-l border-hairline px-cell-x")}
        >
          <AffiliateAction
            href={href}
            attribution={attribution}
            tracking={tracking}
            intent="inline"
            motion="arrow-nudge"
            className="type-eyebrow no-underline"
          >
            {outboundLabel}
          </AffiliateAction>
        </div>
      )}
    </div>
  );
}

export { chipVariants as promoCodeChipVariants };
