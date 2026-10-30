import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * <Button />
 * ---------------------------------------------------------------------------
 * The NON-monetized control: newsletter submit, "Reset all", a view-mode
 * toggle, a link to an internal tool. It owns the control geometry that
 * <AffiliateAction /> also wears, so a merchant CTA and a "Subscribe" button
 * beside it share one silhouette (Law of Similarity) — but it never carries
 * rel / UTM / click tracking. A link to a retailer is never a <Button />.
 *
 *   --size-control / --size-control-lg   heights          --radius-control
 *   --inset-cell-x / --inset-well         horizontal inset --keyline-cta (width="cta")
 *   --duration-interactive / --ease-standard
 *
 * Intents
 *   primary   inverse fill — one per surface
 *   outline   hairline-strong on the card plane
 *   ghost     ink-secondary text on a hairline
 *   price     recessed metric chip (AffiliateAction's price intent)
 *   inline    underlined text link inside prose
 */
export const buttonVariants = cva(
  [
    "group/action relative inline-flex shrink-0 items-center justify-center gap-[0.5em]",
    "whitespace-nowrap select-none focus-ring cursor-pointer",
    "transition-[background-color,color,border-color,box-shadow,opacity] duration-interactive ease-standard",
    "disabled:cursor-default disabled:opacity-50 [&_svg]:shrink-0",
  ],
  {
    variants: {
      intent: {
        primary: [
          "type-eyebrow rounded-control border border-inverse bg-inverse text-ink-inverse",
          "hover:bg-[color-mix(in_srgb,var(--surface-inverse)_88%,var(--surface-primary))]",
        ],
        outline: [
          "type-eyebrow rounded-control border border-strong bg-surface text-ink",
          "hover:border-ink hover:bg-recessed",
        ],
        ghost: [
          "type-eyebrow rounded-control border border-hairline bg-transparent text-ink-secondary",
          "hover:border-strong hover:text-ink",
        ],
        price: [
          "type-metric rounded-control border border-transparent bg-recessed text-body-sm text-ink",
          "hover:border-strong",
        ],
        inline: [
          "font-sans text-current underline decoration-strong underline-offset-[0.3em]",
          "decoration-[length:var(--border-width)] hover:decoration-ink",
        ],
      },
      motion: {
        "arrow-nudge": "arrow-nudge",
        shimmer: "sheen-sweep arrow-nudge",
        flat: "",
      },
      size: {
        sm: "h-[calc(var(--size-control)-var(--space-2))] px-[calc(var(--inset-cell-x)*0.75)]",
        md: "h-control px-cell-x",
        lg: "h-control-lg px-well",
      },
      width: {
        auto: "",
        /** 148px keyline minimum — lists share one CTA axis; a longer label widens the track, never clips. */
        cta: "min-w-cta",
        full: "w-full",
      },
    },
    compoundVariants: [
      // Inline text links have no box geometry.
      { intent: "inline", size: ["sm", "md", "lg"], class: "h-auto px-0" },
    ],
    defaultVariants: { intent: "primary", motion: "flat", size: "md", width: "auto" },
  },
);

export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** Merge onto a child element (a framework <Link>, a label…) instead of rendering a <button>. */
  asChild?: boolean;
}

export function Button({ intent, motion, size, width, asChild = false, type, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      data-intent={intent ?? "primary"}
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ intent, motion, size, width }), className)}
      {...props}
    />
  );
}
