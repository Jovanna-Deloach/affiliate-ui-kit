import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * <StatusPill />
 * ---------------------------------------------------------------------------
 * Crisp semantic metadata pill: BEST PRICE · PASS · 20% OFF · ISO 17025.
 *
 *   --radius-badge                         geometry (0 luxury · 6px clinical)
 *   --tracking-tag / --text-eyebrow        10px · medium · wide tracking · uppercase
 *   --color-*-soft / --color-*             tone fill + ink (positive, caution, negative)
 *   --color-surface-recessed / --border-soft   neutral tone
 *
 * Non-interactive by default (span). Server Component, zero JS.
 */

const pillVariants = cva(
  [
    "inline-flex max-w-full shrink-0 items-center gap-[0.4em] whitespace-nowrap",
    "type-tag rounded-badge border-interactive-w px-tag-x py-tag-y",
    "[&>svg]:size-[1.1em] [&>svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        positive: "border-[color-mix(in_srgb,var(--color-positive)_15%,transparent)] bg-positive-soft text-positive",
        caution: "border-[color-mix(in_srgb,var(--color-caution)_18%,transparent)] bg-caution-soft text-caution",
        negative: "border-[color-mix(in_srgb,var(--color-negative)_15%,transparent)] bg-negative-soft text-negative",
        neutral: "border-border-soft bg-surface-recessed text-muted",
        accent: "border-accent bg-accent text-accent-foreground",
        outline: "border-border-strong bg-transparent text-foreground",
      },
      size: {
        sm: "[--eyebrow-size:calc(var(--text-eyebrow)*0.9)] px-[calc(var(--space-tag-x)*0.8)]",
        md: "",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export interface StatusPillProps
  extends Omit<ComponentProps<"span">, "children">,
    VariantProps<typeof pillVariants> {
  children: ReactNode;
  icon?: LucideIcon;
  asChild?: boolean;
}

export function StatusPill({
  children,
  icon: Icon,
  tone,
  size,
  asChild = false,
  className,
  ...props
}: StatusPillProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="status-pill"
      data-tone={tone ?? "neutral"}
      className={cn(pillVariants({ tone, size }), className)}
      {...props}
    >
      {Icon && <Icon strokeWidth={1.75} aria-hidden="true" />}
      {asChild ? <Slottable>{children}</Slottable> : <span className="min-w-0 truncate">{children}</span>}
    </Comp>
  );
}

export { pillVariants as statusPillVariants };
