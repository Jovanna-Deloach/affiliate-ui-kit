"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { useId, useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * <ProgressiveCollapse />
 * ---------------------------------------------------------------------------
 * SEO-safe progressive disclosure for deep specs, methodology, fine print.
 *
 *   • Radix Collapsible with `forceMount`: the panel is ALWAYS in the SSR DOM
 *     (crawlers index it), never unmounted.
 *   • Reveal is a CSS grid `0fr → 1fr` transition (`reveal-grid`, bound to
 *     --duration-reveal / --ease-spring) plus an opacity fade. No height
 *     measurement, no JS animation controller — safe in spec-heavy loops.
 *   • The collapsed panel is `inert`: out of the tab order and the
 *     accessibility tree until opened, exactly like a native disclosure.
 *
 * Trigger styles (Mobbin: H&M hairline "MATERIALS +", lululemon icon rows,
 * Skillshare bordered FAQ, Instacart minimal "Details ⌄"):
 *   minimal-underline  inline text trigger with chevron
 *   button-pill        bordered pill with a CSS plus/minus glyph
 *   hairline-row       full-width row, min-height --size-control, +/− at right
 *
 * The only state is a boolean; the component is a client leaf, the content
 * it wraps can be Server Component output.
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
          "hover:border-foreground hover:bg-accent-soft",
        ],
        "hairline-row": [
          "w-full min-h-control justify-between gap-cluster-gap py-[calc(var(--space-row-pad)*0.75)]",
          "border-t-surface-w border-border",
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
  /** Muted secondary text beside the title (hairline-row only). */
  summary?: ReactNode;
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

  const trigger = (
    <Collapsible.Trigger
      id={`${id}-trigger`}
      className={cn(triggerVariants({ triggerStyle }))}
    >
      {Icon && <Icon size="1.2em" strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-muted" />}
      <span className="flex min-w-0 flex-1 flex-col gap-[0.15em]">
        <span className="min-w-0 truncate">{title}</span>
        {summary && triggerStyle === "hairline-row" && (
          <span className="type-label-mono truncate text-muted">{summary}</span>
        )}
      </span>
      {triggerStyle === "minimal-underline" ? (
        <ChevronDown
          size="1.1em"
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0 transition-transform duration-interactive ease-spring group-data-[state=open]/collapse:rotate-180"
        />
      ) : (
        <span aria-hidden="true" className="plus-minus text-muted" />
      )}
    </Collapsible.Trigger>
  );

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      data-slot="progressive-collapse"
      data-trigger-style={triggerStyle}
      className={cn("group/collapse flex min-w-0 flex-col", className)}
      {...props}
    >
      {Heading ? <Heading className="m-0 contents">{trigger}</Heading> : trigger}
      <Collapsible.Content forceMount className="reveal-grid">
        <div inert={!open} className="min-w-0">
          <div
            data-slot="collapse-panel"
            className={cn(
              "text-sm leading-relaxed text-muted",
              triggerStyle === "hairline-row"
                ? "pb-row-pad"
                : "pt-cluster-gap",
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

/** Stack of hairline rows that closes the last hairline. */
export function ProgressiveCollapseGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="progressive-collapse-group"
      className={cn("flex min-w-0 flex-col border-b-surface-w border-border", className)}
      {...props}
    />
  );
}

export { triggerVariants as progressiveCollapseTriggerVariants };
