"use client";

import { ChevronsLeftRight } from "lucide-react";
import Image from "next/image";
import { useId, useState, type ComponentProps, type CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { AwardBadge } from "@/primitives/award-badge";
import type { ProductImage } from "@/types/affiliate";

/**
 * <SplitComparisonSlider />
 * ---------------------------------------------------------------------------
 * Draggable before/after comparator for the same framing at two moments
 * (out of box vs. 400 miles logged, raw vs. edited macro).
 *
 *   ┌──────────────┬┃┬──────────────┐   "before" layer clipped at --split
 *   │ OUT OF BOX   │┃│  AFTER 400 MI│   (clip-path inset — compositor only)
 *   │              │◉│              │   1px divider + 36px handle on the
 *   │              │┃│              │   same line, labels pinned in the
 *   └──────────────┴┃┴──────────────┘   overlay safe zones
 *
 *   --aspect-media / --radius-inner / --surface-recessed   stage
 *   --size-control (36px) / --radius-pill                   handle
 *   --shadow-elevated / --border-strong                     handle lift + ring
 *   --inset-overlay                                         label safe zone
 *
 * Physics (0xuser64bit/image-compare, sanitised): the control is ONE native
 * `<input type="range">` laid over the stage — pointer, touch and keyboard
 * (← → Home End, aria-valuetext) for free, no pointer-capture code. The
 * divider and handle are decorative and follow `--split`.
 */

export interface SplitComparisonSliderProps extends Omit<ComponentProps<"figure">, "children"> {
  before: ProductImage;
  after: ProductImage;
  beforeLabel?: string;
  afterLabel?: string;
  /** Accessible name for the control. */
  label?: string;
  /** Initial reveal, 0–100 (% of the "before" frame shown). */
  defaultValue?: number;
  caption?: string;
  sizes?: string;
}

const DEFAULT_SIZES = "(min-width: 1280px) 48rem, (min-width: 768px) 60vw, 100vw";

export function SplitComparisonSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  label = "Before and after comparison",
  defaultValue = 50,
  caption,
  sizes = DEFAULT_SIZES,
  className,
  ...props
}: SplitComparisonSliderProps) {
  const [value, setValue] = useState(() => Math.max(0, Math.min(100, defaultValue)));
  const id = useId();

  return (
    <figure data-slot="split-comparison-slider" className={cn("m-0 flex w-full min-w-0 flex-col gap-cluster", className)} {...props}>
      <div
        data-slot="split-stage"
        className="split-reveal relative isolate w-full select-none overflow-hidden aspect-media rounded-inner bg-recessed"
        style={{ "--split": `${value}%`, backgroundColor: after.backdrop } as CSSProperties}
      >
        {/* After — full frame underneath */}
        <Image src={after.src} alt={after.alt} fill sizes={sizes} className="object-cover" draggable={false} />
        {/* Before — clipped to the left of the divider */}
        <div data-slot="split-before" className="absolute inset-0" style={{ backgroundColor: before.backdrop }}>
          <Image src={before.src} alt={before.alt} fill sizes={sizes} className="object-cover" draggable={false} />
        </div>

        {/* Divider + handle (decorative; the range input is the control) */}
        <div data-slot="split-divider" aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-10 w-px bg-surface shadow-[0_0_0_1px_var(--border-strong)]">
          <span
            data-slot="split-handle"
            className="absolute left-1/2 top-1/2 flex size-control -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill bg-surface text-ink shadow-elevated ring-1 ring-strong"
          >
            <ChevronsLeftRight size="1.1em" strokeWidth={1.5} aria-hidden="true" />
          </span>
        </div>

        {/* Pinned corner labels in the overlay safe zones */}
        <span className="pointer-events-none absolute left-overlay top-overlay z-10">
          <AwardBadge surface="glass" size="sm">
            {beforeLabel}
          </AwardBadge>
        </span>
        <span className="pointer-events-none absolute right-overlay top-overlay z-10">
          <AwardBadge surface="inverse" size="sm">
            {afterLabel}
          </AwardBadge>
        </span>

        {/* The control: one native range input over the whole stage */}
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          aria-valuetext={`${value}% ${beforeLabel.toLowerCase()}, ${100 - value}% ${afterLabel.toLowerCase()}`}
          onChange={(e) => setValue(Number(e.currentTarget.value))}
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 outline-none [touch-action:pan-y]"
        />
      </div>
      {caption && <figcaption className="m-0 text-caption text-ink-tertiary">{caption}</figcaption>}
    </figure>
  );
}
