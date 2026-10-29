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
 *     (crawlers index it), never unmounted.
 *   • Reveal is a CSS grid `0fr → 1fr` transition (`reveal-grid`) plus an
 *     opacity fade. No height measurement, no JS animation controller.
 *   • The collapsed panel is `inert`: out of the tab order and the
 *     accessibility tree until opened, exactly like a native disclosure.
 *   • Borders live on <ProgressiveCollapseGroup> (`divide-y` + `border-y`),
 *     never on rows — adjacent items share one hairline, no double lines.
 *   • `preview` is the summary slot in the closed header, right before the
 *     +/− glyph (e.g. "5.02 g · 100.4% of claim" + PASS pill), so a reader
 *     gets the answer before expanding. It fades when open.
 *
 * Trigger styles (Mobbin: H&M hairline "MATERIALS +", lululemon icon rows,
 * Skillshare bordered FAQ, Instacart "Details ⌄"):
 *   minimal-underline  inline text trigger with chevron
 *   button-pill        bordered pill with a CSS plus/minus glyph
 *   hairline-row       full-width row, min-height --size-control, +/− at right
 */

const triggerVariants = cva(
  [
    "group/collapse-trigger focus-ring flex cursor-pointer items-center text-left text-foreground",
    "transition-[color,background-color,border-color] duration-interactive ease-spring",
  ],
  {
    variants: {
      triggerStyle: {
        "minimal-underline": [
          "w-fit gap-[0.4em] type-eyebrow",
          "underline decoration-border-strong underline-offset-[0.3em] decoration-[length:var(--border-width-interactive)] hover:decoration-foreground",
        ],
        "button-pill": [
          "w-fit gap-[0.6em] type-eyebrow leading-none",
          "h-[calc(var(--size-control)*0.8)] rounded-badge border-interactive-w border-border-strong bg-surface px-badge-x",
          "hover:border-foreground hover:bg-surface-recessed",
        ],
        "hairline-row": [
          "w-full min-h-control gap-row-pad py-[calc(var(--space-row-pad)*0.75)]",
          "text-sm font-medium",
        ],
      },
    },
    defaultVariants: { triggerStyle: "hairline-row" },
  },
);

export interface ProgressiveCollapseProps
  extends Omit<ComponentProps<"div">, "title" | "children">,
    VariantProps<typeof triggerVariants> {
  /** Trigger label. */
  title: ReactNode;
  /** Muted secondary line under the title (hairline-row only). */
  summary?: ReactNode;
  /** Right-hand summary preview shown while closed (hairline-row only). */
  preview?: ReactNode;
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
  summary,
  preview,
  children,
  icon: Icon,
  headingLevel,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  triggerStyle = "hairline-row",
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
  const row = triggerStyle === "hairline-row";

  const trigger = (
    <Collapsible.Trigger id={`${id}-trigger`} className={cn(triggerVariants({ triggerStyle }))}>
      {Icon && <Icon size="1.2em" strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-muted" />}
      <span className="flex min-w-0 flex-1 flex-col gap-[0.2em]">
        <span className="min-w-0 truncate">{title}</span>
        {summary && row && <span className="truncate text-xs font-normal text-muted">{summary}</span>}
      </span>
      {preview && row && (
        <span
          data-slot="collapse-preview"
          className={cn(
            "flex shrink-0 items-center gap-[0.5em] text-sm font-normal text-muted",
            "transition-[opacity,visibility] duration-interactive ease-spring",
            "group-data-[state=open]/collapse:invisible group-data-[state=open]/collapse:opacity-0",
          )}
        >
          {preview}
        </span>
      )}
      {triggerStyle === "minimal-underline" ? (
        <ChevronDown
          size="1.1em"
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0 transition-transform duration-interactive ease-spring group-data-[state=open]/collapse:rotate-180"
        />
      ) : (
        <span aria-hidden="true" className="plus-minus shrink-0 text-muted" />
      )}
    </Collapsible.Trigger>
  );

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      data-slot="progressive-collapse"
      data-trigger-style={triggerStyle}
      className={cn("group/collapse flex min-w-0 flex-col", row && "@container", className)}
      {...props}
    >
      {Heading ? <Heading className="m-0 contents">{trigger}</Heading> : trigger}
      <Collapsible.Content forceMount className="reveal-grid">
        <div inert={!open} className="min-w-0">
          <div
            data-slot="collapse-panel"
            className={cn(
              "text-sm leading-relaxed text-muted",
              row ? "pb-row-pad" : "pt-cluster-gap",
              contentClassName,
            )}
          >
            {children}
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

/**
 * Stack of hairline rows. Owns ALL the borders: one hairline above the
 * first row, one below the last, one between each pair — never doubled.
 */
export function ProgressiveCollapseGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="progressive-collapse-group"
      className={cn(
        "flex min-w-0 flex-col",
        "border-y-[length:var(--border-width-surface)] border-border-soft",
        "divide-y divide-border-soft",
        className,
      )}
      {...props}
    />
  );
}

export { triggerVariants as progressiveCollapseTriggerVariants };
