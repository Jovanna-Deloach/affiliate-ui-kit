"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { useId, useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * <ProgressiveCollapse />
 * ---------------------------------------------------------------------------
 * SEO-safe progressive disclosure for deep specs, methodology, assay rows.
 *
 *   • Radix Collapsible with `forceMount`: the panel is ALWAYS in the SSR DOM
 *     (crawlers index it), never unmounted. Reveal is a CSS grid 0fr → 1fr.
 *   • The collapsed panel is `inert`: out of the tab order and the a11y tree.
 *   • Borders live on <ProgressiveCollapseGroup /> (`border-y` + `divide-y`),
 *     never on rows — adjacent items share one hairline.
 *
 * Row trigger = a KEYLINE GRID, so every value, meter and status pill in a
 * group lands on one vertical axis (Law of Continuity):
 *
 *   layout="assay"   minmax(180px,1.5fr) │ minmax(120px,1fr) │ 90px   │ 28px
 *                    analyte · method    │ preview (meter)   │ status │ +/−
 *   layout="simple"  minmax(0,1fr)       │ auto              │ 28px
 *                    title · subtitle    │ preview           │ +/−
 *
 * Below a 36rem container the assay preview column hides; status and the
 * toggle keep their keylines.
 *
 * Trigger styles:  row (grid, default) · button (outline control) · inline (text link)
 */

const triggerVariants = cva(
  [
    "group/collapse-trigger focus-ring cursor-pointer text-left text-ink",
    "transition-[color,background-color,border-color] duration-interactive ease-standard",
  ],
  {
    variants: {
      triggerStyle: {
        row: "grid w-full items-center gap-x-stack py-row",
        button: [
          "inline-flex h-control w-fit items-center gap-[0.6em] rounded-control border border-strong bg-surface px-cell-x type-eyebrow",
          "hover:border-ink hover:bg-recessed",
        ],
        inline: [
          "inline-flex w-fit items-center gap-[0.4em] type-eyebrow",
          "underline decoration-strong underline-offset-[0.3em] decoration-[length:var(--border-width)] hover:decoration-ink",
        ],
      },
      layout: {
        simple: "",
        assay: "",
      },
    },
    compoundVariants: [
      {
        triggerStyle: "row",
        layout: "simple",
        class: "grid-cols-[minmax(0,1fr)_auto_var(--keyline-toggle)]",
      },
      {
        triggerStyle: "row",
        layout: "assay",
        class:
          "grid-cols-[minmax(0,1fr)_var(--keyline-status)_var(--keyline-toggle)] @xl:grid-cols-[minmax(180px,1.5fr)_minmax(120px,1fr)_var(--keyline-status)_var(--keyline-toggle)]",
      },
    ],
    defaultVariants: { triggerStyle: "row", layout: "simple" },
  },
);

export interface ProgressiveCollapseProps
  extends Omit<ComponentProps<"div">, "title" | "children">,
    VariantProps<typeof triggerVariants> {
  /** Trigger label. */
  title: ReactNode;
  /** Muted second line under the title (row style only). */
  subtitle?: ReactNode;
  /** Right-aligned preview beside the title — a value, a <MicroMeter />, a count. */
  preview?: ReactNode;
  /** Status pill on the 90px keyline (assay layout). */
  status?: ReactNode;
  /** Always-mounted panel content. */
  children: ReactNode;
  /** Optional leading icon (lucide). */
  icon?: LucideIcon;
  /** Wrap the trigger in a heading for document outline (accordion pattern). */
  headingLevel?: 2 | 3 | 4;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
}

export function ProgressiveCollapse({
  title,
  subtitle,
  preview,
  status,
  children,
  icon: Icon,
  headingLevel,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  triggerStyle = "row",
  layout = "simple",
  contentClassName,
  className,
  ...props
}: ProgressiveCollapseProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const id = useId();
  const Heading = headingLevel ? (`h${headingLevel}` as const) : null;
  const row = triggerStyle === "row";
  const assay = layout === "assay";

  const toggleGlyph =
    triggerStyle === "inline" ? (
      <ChevronDown
        size="1.1em"
        strokeWidth={1.5}
        aria-hidden="true"
        className="shrink-0 transition-transform duration-interactive ease-standard group-data-[state=open]/collapse:rotate-180"
      />
    ) : (
      <span aria-hidden="true" className="plus-minus shrink-0 text-ink-tertiary" />
    );

  const trigger = (
    <Collapsible.Trigger id={`${id}-trigger`} className={cn(triggerVariants({ triggerStyle, layout }))}>
      {row ? (
        <>
          {/* Col 1 — title + subtitle (+ icon) */}
          <span className="flex min-w-0 items-center gap-cluster">
            {Icon && <Icon size="1.2em" strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-ink-tertiary" />}
            <span className="flex min-w-0 flex-col gap-hairline">
              <span className="min-w-0 truncate text-body-sm font-medium">{title}</span>
              {subtitle && <span className="min-w-0 truncate text-caption text-ink-tertiary">{subtitle}</span>}
            </span>
          </span>
          {/* Col 2 — preview (hidden below 36rem in the assay layout) */}
          {assay ? (
            <span data-slot="collapse-preview" className="hidden min-w-0 justify-self-end text-body-sm text-ink-secondary @xl:flex @xl:items-center">
              {preview}
            </span>
          ) : (
            <span data-slot="collapse-preview" className="flex min-w-0 items-center justify-self-end text-body-sm text-ink-secondary">
              {preview}
            </span>
          )}
          {/* Col 3 — status keyline (assay only) */}
          {assay && (
            <span data-slot="collapse-status" className="flex min-w-0 items-center justify-self-end">
              {status}
            </span>
          )}
          {/* Last col — toggle keyline */}
          <span className="flex items-center justify-self-end">{toggleGlyph}</span>
        </>
      ) : (
        <>
          {Icon && <Icon size="1.2em" strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-ink-tertiary" />}
          <span className="min-w-0 truncate">{title}</span>
          {toggleGlyph}
        </>
      )}
    </Collapsible.Trigger>
  );

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      data-slot="progressive-collapse"
      data-trigger-style={triggerStyle}
      data-layout={layout}
      className={cn("group/collapse flex min-w-0 flex-col", row && "@container px-(--collapse-inset,0px)", className)}
      {...props}
    >
      {Heading ? <Heading className="m-0 contents">{trigger}</Heading> : trigger}
      <Collapsible.Content forceMount className="reveal-grid">
        <div inert={!open} className="min-w-0">
          <div
            data-slot="collapse-panel"
            className={cn("text-body-sm leading-body text-ink-secondary", row ? "pb-stack" : "pt-cluster", contentClassName)}
          >
            {children}
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

/**
 * Stack of rows. Owns ALL the borders: one hairline above the first row,
 * one below the last, one between each pair — never doubled. `framed`
 * swaps the open hairlines for a bordered container and insets the rows.
 */
export function ProgressiveCollapseGroup({
  framed = false,
  className,
  ...props
}: ComponentProps<"div"> & { framed?: boolean }) {
  return (
    <div
      data-slot="progressive-collapse-group"
      className={cn(
        "flex min-w-0 flex-col divide-y divide-hairline",
        framed
          ? "overflow-hidden rounded-container border border-hairline bg-surface [--collapse-inset:var(--inset-cell-x)]"
          : "border-y border-hairline",
        className,
      )}
      {...props}
    />
  );
}

export { triggerVariants as progressiveCollapseTriggerVariants };
