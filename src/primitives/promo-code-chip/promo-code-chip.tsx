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
 *   --radius-badge / --space-badge-x / --space-badge-y   chip geometry
 *   --font-mono                                          code voice
 *   --color-border-strong / --color-accent-soft          ticket / pill ink
 *   --duration-micro / --ease-spring                     glyph + label morph
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

const chipVariants = cva(
  [
    "group/chip inline-flex max-w-full items-stretch text-foreground",
    "font-sans text-sm",
  ],
  {
    variants: {
      chroming: {
        "dashed-ticket": [
          "rounded-badge border-[length:var(--border-width-interactive)] border-dashed border-border-strong bg-surface",
          "[&_[data-slot=chip-action]]:border-l-[length:var(--border-width-interactive)] [&_[data-slot=chip-action]]:border-dashed [&_[data-slot=chip-action]]:border-border-strong",
        ],
        "pill-badge": [
          "rounded-badge border-interactive-w border-transparent bg-surface-recessed",
          "[&_[data-slot=chip-action]]:border-l-surface-w [&_[data-slot=chip-action]]:border-border-soft",
        ],
        "minimal-inline": "gap-[0.75em] rounded-badge bg-transparent",
      },
      size: {
        sm: "[--chip-pad-y:calc(var(--space-badge-y)*0.8)] text-xs",
        md: "[--chip-pad-y:var(--space-badge-y)]",
      },
    },
    defaultVariants: { chroming: "dashed-ticket", size: "md" },
  },
);

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
  chroming = "dashed-ticket",
  size,
  className,
  ...props
}: PromoCodeChipProps) {
  const { copy, status } = useCopyToClipboard({ timeout, onCopy });
  const inline = chroming === "minimal-inline";

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
        className={cn(
          "flex min-w-0 flex-col justify-center gap-[0.15em]",
          !inline && "px-badge-x py-(--chip-pad-y)",
        )}
      >
        {/* The code is a short uppercase token — the one place mono belongs (Law 1). */}
        <span
          className="truncate font-mono font-medium uppercase tracking-label tabular-nums text-foreground"
          aria-label={`Promo code ${code}`}
        >
          {code}
        </span>
        {description && <span className="truncate text-xs text-muted">{description}</span>}
      </div>

      {/* Copy stub */}
      <button
        type="button"
        data-slot="chip-action"
        data-status={status}
        onClick={() => void copy(code)}
        aria-label={`Copy code ${code}`}
        className={cn(
          "check-draw focus-ring group/copy flex shrink-0 cursor-pointer items-center gap-[0.5em] type-eyebrow leading-none",
          "transition-[background-color,color] duration-interactive ease-spring",
          inline
            ? "text-muted hover:text-foreground"
            : "px-badge-x hover:bg-surface-recessed data-[status=copied]:text-positive",
          !inline && chroming === "pill-badge" && "hover:bg-surface",
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
          className={cn(
            "flex shrink-0 items-center",
            !inline && "border-l-surface-w border-border px-badge-x",
          )}
        >
          <AffiliateAction
            href={href}
            attribution={attribution}
            tracking={tracking}
            intent="inline-editorial"
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
