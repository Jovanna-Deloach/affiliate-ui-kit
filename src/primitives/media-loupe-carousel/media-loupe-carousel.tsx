"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { ProductImage } from "@/types/affiliate";

/**
 * <MediaLoupeCarousel />
 * ---------------------------------------------------------------------------
 * Multi-angle hands-on gallery with structured tester captions.
 *
 *   ┌──────────────────────────────────────────────┐
 *   │ stage · aspect-media · Plane 2 tile           │  every frame stays
 *   │ (frames stacked, active one crossfades in)    │  mounted — CSS opacity
 *   ├──────────────────────────────────────────────┤  only (loupe-crossfade)
 *   │ 02 / 04 │ Medial side — tester note …  │ ‹ › │  recessed caption bar
 *   ├──────────────────────────────────────────────┤
 *   │ [64] [64] [64] [64]   thumbnail tablist       │  roving tabindex
 *   └──────────────────────────────────────────────┘
 *
 *   --aspect-media / --surface-recessed      stage
 *   --size-thumb-lg / --radius-inner         thumbnails
 *   --inset-cell-x / --row-y                 caption bar + strip insets
 *   type-mono                                the angle index ("02 / 04")
 *   --duration-media / --ease-media          crossfade
 *
 * Accessibility (21st.dev thumbnail-image-viewer anatomy, sanitised): the
 * strip is a `tablist`, the stage a `tabpanel`; ← → Home End move the
 * selection; the caption bar is `aria-live="polite"`. No animation runtime
 * and no framer-motion: a gallery of five is five opacity transitions, so it
 * stays within the zero-runtime-JS guardrail.
 */

export interface LoupeFrameData {
  id: string;
  image: ProductImage;
  angle: string;
  note?: string;
}

const carouselVariants = cva("loupe-crossfade flex w-full min-w-0 flex-col overflow-hidden rounded-container border border-hairline bg-surface shadow-surface", {
  variants: {
    strip: {
      bottom: "",
      hidden: "",
    },
  },
  defaultVariants: { strip: "bottom" },
});

export interface MediaLoupeCarouselProps
  extends Omit<ComponentProps<"section">, "children">,
    VariantProps<typeof carouselVariants> {
  frames: LoupeFrameData[];
  /** Accessible name for the gallery ("Meridian Aerolite 3 — hands-on gallery"). */
  label: string;
  defaultIndex?: number;
  /** Preload the first frame (LCP on review pages). */
  priority?: boolean;
  sizes?: string;
}

const DEFAULT_SIZES = "(min-width: 1280px) 48rem, (min-width: 768px) 60vw, 100vw";

export function MediaLoupeCarousel({
  frames,
  label,
  defaultIndex = 0,
  priority = false,
  sizes = DEFAULT_SIZES,
  strip = "bottom",
  className,
  ...props
}: MediaLoupeCarouselProps) {
  const [active, setActive] = useState(() => clamp(defaultIndex, frames.length));
  const id = useId().replace(/:/g, "");
  const tabsRef = useRef<HTMLDivElement>(null);
  const count = frames.length;
  const current = frames[active];

  const choose = (next: number, focus = false) => {
    const index = ((next % count) + count) % count;
    setActive(index);
    if (focus) tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[index]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: count - 1 };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    choose(next, true);
  };

  if (!current) return null;

  return (
    <section
      data-slot="media-loupe-carousel"
      aria-label={label}
      className={cn(carouselVariants({ strip }), className)}
      {...props}
    >
      {/* Stage — all frames mounted; the active one fades in (CSS). */}
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        data-slot="loupe-stage"
        className="relative isolate w-full overflow-hidden aspect-media bg-recessed"
      >
        {frames.map((frame, i) => (
          <div
            key={frame.id}
            data-slot="loupe-frame"
            data-active={i === active}
            aria-hidden={i !== active}
            className="absolute inset-0"
            style={{ backgroundColor: frame.image.backdrop }}
          >
            <Image
              src={frame.image.src}
              alt={frame.image.alt}
              fill
              sizes={sizes}
              priority={priority && i === active}
              className="select-none object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Caption bar — index keyline | note | prev/next */}
      <div
        data-slot="loupe-caption"
        aria-live="polite"
        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-stack border-t border-hairline bg-recessed px-cell-x py-row"
      >
        <span className="type-mono whitespace-nowrap text-ink">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <p className="m-0 min-w-0 text-caption text-ink-secondary">
          <span className="font-medium text-ink">{current.angle}</span>
          {current.note && <span> — {current.note}</span>}
        </p>
        <span className="flex items-center gap-hairline">
          <StageButton label="Previous angle" onClick={() => choose(active - 1)} disabled={count < 2}>
            <ChevronLeft size="1.1em" strokeWidth={1.5} aria-hidden="true" />
          </StageButton>
          <StageButton label="Next angle" onClick={() => choose(active + 1)} disabled={count < 2}>
            <ChevronRight size="1.1em" strokeWidth={1.5} aria-hidden="true" />
          </StageButton>
        </span>
      </div>

      {/* Thumbnail tablist — 64px tiles on one keyline, roving tabindex */}
      {strip !== "hidden" && (
        <div
          ref={tabsRef}
          role="tablist"
          aria-label={`${label} — angles`}
          onKeyDown={onKeyDown}
          data-slot="loupe-strip"
          className="flex gap-cluster overflow-x-auto border-t border-hairline px-cell-x py-row"
        >
          {frames.map((frame, i) => {
            const selected = i === active;
            return (
              <button
                key={frame.id}
                type="button"
                id={`${id}-tab-${i}`}
                role="tab"
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                aria-label={frame.angle}
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(i)}
                className={cn(
                  "focus-ring relative size-thumb-lg shrink-0 cursor-pointer overflow-hidden rounded-inner border",
                  "transition-[border-color,opacity] duration-interactive ease-standard",
                  selected ? "border-ink opacity-100" : "border-hairline opacity-60 hover:opacity-100",
                )}
                style={{ backgroundColor: frame.image.backdrop }}
              >
                <Image src={frame.image.src} alt="" fill sizes="128px" className="object-cover" draggable={false} />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function StageButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "focus-ring flex size-[calc(var(--size-control)*0.8)] cursor-pointer items-center justify-center rounded-control border border-hairline bg-surface text-ink-secondary",
        "transition-colors duration-interactive ease-standard hover:border-strong hover:text-ink disabled:cursor-default disabled:opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function clamp(index: number, count: number) {
  return Math.max(0, Math.min(Math.max(0, count - 1), index));
}

export { carouselVariants as mediaLoupeCarouselVariants };
