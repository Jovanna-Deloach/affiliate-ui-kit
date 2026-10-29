import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * <StatusPill />
 * ---------------------------------------------------------------------------
 * Two silhouettes, two meanings (Law of Similarity — a reader knows what a
 * tag means before reading it):
 *
 *   kind="status"     Inventory & commercial state — In stock · Low stock ·
 *                     Best price · Our partner. PILL silhouette
 *                     (`--radius-pill`) with a leading 6px status dot.
 *   kind="technical"  Lab / technical credentials — ISO 17025 · HPLC / ICP-MS ·
 *                     batch 2214. Recessed architectural CHIP
 *                     (`--radius-tag`, `--surface-recessed`, hairline, mono).
 *
 * Editorial accolades (Best Overall, Editor's Pick) are NOT pills — they are
 * <AwardBadge />, the inverse-fill tag.
 *
 *   --radius-pill / --radius-tag · --size-dot · --inset-pill-* / --inset-tag-*
 *   --status-* (shared semantic hues) · --surface-recessed · --border-hairline
 *
 * Non-interactive span by default (asChild for links). Server Component.
 */

const pillVariants = cva(
  "inline-flex max-w-full shrink-0 items-center whitespace-nowrap align-middle [&>svg]:size-[1.1em] [&>svg]:shrink-0",
  {
    variants: {
      kind: {
        status: "gap-[0.45em] rounded-pill border px-pill-x py-pill-y type-eyebrow",
        technical: "gap-[0.45em] rounded-tag border border-hairline bg-recessed px-tag-x py-tag-y type-mono text-ink-secondary",
      },
      tone: {
        positive: "",
        caution: "",
        negative: "",
        neutral: "",
      },
      size: {
        sm: "[--eyebrow-size:calc(var(--text-eyebrow)*0.9)]",
        md: "",
      },
    },
    compoundVariants: [
      { kind: "status", tone: "positive", class: "border-positive/20 bg-positive-soft text-positive-ink" },
      { kind: "status", tone: "caution", class: "border-caution/25 bg-caution-soft text-caution-ink" },
      { kind: "status", tone: "negative", class: "border-negative/20 bg-negative-soft text-negative-ink" },
      { kind: "status", tone: "neutral", class: "border-hairline bg-surface text-ink-secondary" },
    ],
    defaultVariants: { kind: "status", tone: "neutral", size: "md" },
  },
);

const dotVariants = cva("inline-block size-dot shrink-0 rounded-pill", {
  variants: {
    tone: {
      positive: "bg-positive",
      caution: "bg-caution",
      negative: "bg-negative",
      neutral: "bg-ink-tertiary",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export interface StatusPillProps
  extends Omit<ComponentProps<"span">, "children">,
    VariantProps<typeof pillVariants> {
  children: ReactNode;
  /** Leading status dot (status kind only). Defaults on for semantic tones. */
  dot?: boolean;
  /** lucide icon — technical chips, or in place of the dot. */
  icon?: LucideIcon;
  asChild?: boolean;
}

export function StatusPill({
  children,
  dot,
  icon: Icon,
  kind = "status",
  tone = "neutral",
  size,
  asChild = false,
  className,
  ...props
}: StatusPillProps) {
  const Comp = asChild ? Slot : "span";
  const resolvedKind = kind ?? "status";
  const resolvedTone = tone ?? "neutral";
  const showDot = resolvedKind === "status" && !Icon && (dot ?? resolvedTone !== "neutral");

  const content = (
    <>
      {showDot && <span aria-hidden="true" className={dotVariants({ tone: resolvedTone })} />}
      {Icon && <Icon strokeWidth={1.75} aria-hidden="true" />}
      <span className="min-w-0 truncate">{children}</span>
    </>
  );

  return (
    <Comp
      data-slot="status-pill"
      data-kind={resolvedKind}
      data-tone={resolvedTone}
      className={cn(pillVariants({ kind: resolvedKind, tone: resolvedTone, size }), className)}
      {...props}
    >
      {asChild ? <Slottable>{content}</Slottable> : content}
    </Comp>
  );
}

export { pillVariants as statusPillVariants };
