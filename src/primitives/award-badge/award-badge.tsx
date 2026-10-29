import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { AwardBadgeData, AwardTier } from "@/types/affiliate";

/**
 * <AwardBadge />
 * ---------------------------------------------------------------------------
 * Accolade mark: "Best Overall", "Editor's Pick", "Lab Tested".
 *
 *   --radius-badge                       0 → sharp block (luxury) · 6px → technical tag
 *   --space-badge-x / --space-badge-y    padding density (10px / 6px)
 *   --text-eyebrow / --tracking-eyebrow  10px ultra-tracked uppercase voice
 *   --color-badge-primary-bg/fg          winner ink
 *   --color-badge-secondary-bg/fg        runner-up / frosted glass surface
 *   --color-border, --shadow-badge       hairline + lift
 *   --blur-glass                         frosted backdrop
 *   --size-seal                          editorial-seal diameter
 *
 * Shapes
 *   architectural-flag  sharp, ultra-tracked uppercase block
 *   glass-pill          frosted surface for sitting over photography
 *   split-rank          rank index cell | hairline | accolade label
 *   editorial-seal      SVG circular <textPath> ring + centered numeral / icon
 *
 * Iconography is lucide-react at 1.1em (= 11px at the 10px voice) with a
 * 1.5 stroke, or a typographic rank numeral ("01"). No glyph characters, no
 * clip-path. Server Component, zero JS — safe inside 30-item loops.
 *
 * Mobbin rule (lululemon kicker, GOAT season tags, Shop corner pills): a badge
 * is ONE line and truncates with an ellipsis when its slot is narrower than
 * its label. The seal is reserved for hero placements.
 */

export const AWARD_BADGE_SHAPES = [
  "architectural-flag",
  "glass-pill",
  "split-rank",
  "editorial-seal",
] as const;
export type AwardBadgeShape = (typeof AWARD_BADGE_SHAPES)[number];

const badgeVariants = cva(
  [
    "inline-flex w-fit max-w-full shrink-0 items-center gap-[0.5em]",
    "type-eyebrow leading-none whitespace-nowrap [&_svg]:shrink-0",
  ],
  {
    variants: {
      shape: {
        "architectural-flag": "rounded-badge border-interactive-w px-badge-x py-badge-y",
        "glass-pill": [
          "rounded-badge border-interactive-w border-border px-badge-x py-[calc(var(--space-badge-y)*0.67)]",
          "bg-badge-secondary-bg text-badge-secondary-fg shadow-badge backdrop-blur-glass",
          "[--eyebrow-tracking:calc(var(--tracking-eyebrow)*0.78)]",
        ],
        "split-rank": [
          "gap-0 overflow-hidden rounded-badge border-interactive-w border-border",
          "bg-badge-secondary-bg text-badge-secondary-fg",
        ],
        "editorial-seal": "",
      },
      tier: {
        winner: "",
        "runner-up": "",
        callout: "",
      },
      size: {
        sm: "[--eyebrow-size:calc(var(--text-eyebrow)*0.9)]",
        md: "[--eyebrow-size:var(--text-eyebrow)]",
        lg: "[--eyebrow-size:calc(var(--text-eyebrow)*1.2)]",
      },
    },
    compoundVariants: [
      // Flag ink by tier
      {
        shape: "architectural-flag",
        tier: "winner",
        class: "border-badge-primary-bg bg-badge-primary-bg text-badge-primary-fg",
      },
      {
        shape: "architectural-flag",
        tier: "runner-up",
        class: "border-border bg-badge-secondary-bg text-badge-secondary-fg",
      },
      {
        shape: "architectural-flag",
        tier: "callout",
        class: "border-border-strong bg-transparent text-foreground",
      },
      // Glass stays glass; callout mutes the ink
      { shape: "glass-pill", tier: "callout", class: "text-muted" },
    ],
    defaultVariants: { shape: "architectural-flag", tier: "winner", size: "md" },
  },
);

const rankCellVariants = cva(
  [
    "flex items-center self-stretch border-r-[length:var(--border-width-surface)] border-border",
    "px-[calc(var(--space-badge-x)*0.8)] font-mono tabular-nums",
  ],
  {
    variants: {
      tier: {
        winner: "bg-badge-primary-bg text-badge-primary-fg border-badge-primary-bg",
        "runner-up": "bg-accent-soft text-foreground",
        callout: "bg-transparent text-foreground",
      },
    },
    defaultVariants: { tier: "winner" },
  },
);

export interface AwardBadgeProps
  extends Omit<ComponentProps<"span">, "children">,
    VariantProps<typeof badgeVariants> {
  /** Canonical payload slice — overrides `tier` / `children` when provided. */
  badge?: AwardBadgeData;
  /** Label text when not using `badge`. */
  children?: ReactNode;
  /** Rank index: rendered as "01" in split-rank and at the seal centre. */
  rank?: number | string;
  /** lucide-react icon component (rendered at 1.1em / 1.5 stroke). */
  icon?: LucideIcon;
  /** Render as the child element (e.g. a link to the methodology). */
  asChild?: boolean;
}

function formatRank(rank: number | string) {
  return typeof rank === "number" ? String(rank).padStart(2, "0") : rank;
}

export function AwardBadge({
  badge,
  children,
  rank,
  icon: Icon,
  shape = "architectural-flag",
  tier,
  size,
  asChild = false,
  className,
  ...props
}: AwardBadgeProps) {
  const resolvedTier: AwardTier = badge?.tier ?? tier ?? "winner";
  const label = badge?.label ?? children;

  if (shape === "editorial-seal") {
    return (
      <EditorialSeal
        label={typeof label === "string" ? label : String(label ?? "")}
        tier={resolvedTier}
        rank={rank}
        icon={Icon}
        size={size}
        className={className}
        {...props}
      />
    );
  }

  const Comp = asChild ? Slot : "span";
  const iconNode = Icon ? (
    <Icon size="1.1em" strokeWidth={1.5} absoluteStrokeWidth={false} aria-hidden="true" />
  ) : null;

  const content =
    shape === "split-rank" ? (
      <>
        {rank !== undefined && (
          <span data-slot="badge-rank" className={rankCellVariants({ tier: resolvedTier })}>
            {formatRank(rank)}
          </span>
        )}
        <span
          data-slot="badge-label"
          className="flex min-w-0 items-center gap-[0.5em] px-badge-x py-badge-y"
        >
          {iconNode}
          <span className="min-w-0 truncate">{label}</span>
        </span>
      </>
    ) : (
      <>
        {iconNode}
        <span className="min-w-0 truncate">{label}</span>
      </>
    );

  return (
    <Comp
      data-slot="award-badge"
      data-shape={shape}
      data-tier={resolvedTier}
      className={cn(badgeVariants({ shape, tier: resolvedTier, size }), className)}
      {...props}
    >
      {asChild ? <Slottable>{content}</Slottable> : content}
    </Comp>
  );
}

/* -------------------------------------------------------------------------- */
/* Editorial seal: text set on a circular path, numeral or icon at centre.    */
/* -------------------------------------------------------------------------- */

const SEAL_VIEW = 100;
const RING_R = 37; // text path radius (viewBox units)
const CIRCUMFERENCE = 2 * Math.PI * RING_R;
const RING_SEPARATOR = " · ";
const RING_EM = 0.74; // average uppercase advance incl. 0.12em tracking

const sealVariants = cva(
  "inline-block size-seal shrink-0 select-none [&_text]:font-weight-eyebrow",
  {
    variants: {
      tier: {
        winner: "text-badge-primary-fg [--seal-fill:var(--color-badge-primary-bg)] [--seal-ring:var(--color-badge-primary-fg)]",
        "runner-up": "text-foreground [--seal-fill:var(--color-badge-secondary-bg)] [--seal-ring:var(--color-border-strong)]",
        callout: "text-foreground [--seal-fill:transparent] [--seal-ring:var(--color-border-strong)]",
      },
      size: {
        sm: "[--seal-scale:0.8]",
        md: "[--seal-scale:1]",
        lg: "[--seal-scale:1.25]",
      },
    },
    defaultVariants: { tier: "winner", size: "md" },
  },
);

interface EditorialSealProps extends Omit<ComponentProps<"span">, "children"> {
  label: string;
  tier: AwardTier;
  rank?: number | string;
  icon?: LucideIcon;
  size?: "sm" | "md" | "lg" | null;
}

function EditorialSeal({ label, tier, rank, icon: Icon, size, className, ...props }: EditorialSealProps) {
  const pathId = `seal-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  // The ring reads continuously: repeat the label 2–3× and size the type so
  // the natural run length ≈ circumference; textLength only absorbs the
  // small residual instead of stretching one label around the whole circle.
  const unit = label.toUpperCase();
  const chars = unit.length + RING_SEPARATOR.length;
  const repeats = Math.max(1, Math.round(CIRCUMFERENCE / (chars * 9 * RING_EM)));
  const ringFontSize = Math.min(10.5, Math.max(7.5, CIRCUMFERENCE / (repeats * chars * RING_EM)));
  const ringText = Array.from({ length: repeats }, () => unit).join(RING_SEPARATOR) + RING_SEPARATOR.trimEnd();

  return (
    <span
      data-slot="award-badge"
      data-shape="editorial-seal"
      data-tier={tier}
      role="img"
      aria-label={rank !== undefined ? `${label}, rank ${rank}` : label}
      className={cn(sealVariants({ tier, size }), className)}
      style={{ width: "calc(var(--size-seal) * var(--seal-scale))", height: "calc(var(--size-seal) * var(--seal-scale))" }}
      {...props}
    >
      <svg viewBox={`0 0 ${SEAL_VIEW} ${SEAL_VIEW}`} className="size-full overflow-visible" aria-hidden="true">
        <defs>
          <path
            id={pathId}
            d={`M ${SEAL_VIEW / 2} ${SEAL_VIEW / 2} m -${RING_R} 0 a ${RING_R} ${RING_R} 0 1 1 ${RING_R * 2} 0 a ${RING_R} ${RING_R} 0 1 1 -${RING_R * 2} 0`}
          />
        </defs>
        {/* Seal body */}
        <circle cx={50} cy={50} r={49} fill="var(--seal-fill)" stroke="var(--seal-ring)" strokeWidth={1} />
        {/* Inner hairline ring */}
        <circle cx={50} cy={50} r={28} fill="none" stroke="var(--seal-ring)" strokeWidth={0.75} opacity={0.6} />
        {/* Circular text */}
        <text
          fill="currentColor"
          fontSize={ringFontSize}
          style={{
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <textPath href={`#${pathId}`} startOffset={0} textLength={CIRCUMFERENCE} lengthAdjust="spacing">
            {ringText}
          </textPath>
        </text>
        {/* Centre: numeral or icon */}
        {rank !== undefined ? (
          <text
            x={50}
            y={50}
            textAnchor="middle"
            dominantBaseline="central"
            fill="currentColor"
            fontSize={26}
            style={{ fontFamily: "var(--font-display)", letterSpacing: "var(--tracking-display)" }}
          >
            {formatRank(rank)}
          </text>
        ) : Icon ? (
          <Icon x={39} y={39} width={22} height={22} strokeWidth={1.5} />
        ) : null}
      </svg>
    </span>
  );
}

export { badgeVariants as awardBadgeVariants };
