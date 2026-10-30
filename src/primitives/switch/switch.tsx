"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * <Switch />
 * ---------------------------------------------------------------------------
 * Radix Switch on the spine: a 36px track (`--size-switch`), a thumb that
 * is the track height minus the emphasis inset, ink when on, the meter
 * track colour inside a strong rule when off. Pass `label` for a visible label on the right (the switch
 * is still the labelled control); pass `aria-label` for an unlabelled one.
 *
 *   --size-switch / --radius-pill            track (pill — it IS a toggle)
 *   --surface-inverse / --border-strong      on / off
 *   --duration-interactive / --ease-standard  thumb travel (CSS transition)
 */
export interface SwitchProps extends ComponentProps<typeof SwitchPrimitive.Root> {
  label?: ReactNode;
  /** Secondary line under the label. */
  description?: ReactNode;
  size?: "sm" | "md";
}

export function Switch({ label, description, size = "md", className, id, ...props }: SwitchProps) {
  const control = (
    <SwitchPrimitive.Root
      id={id}
      data-slot="switch"
      className={cn(
        "focus-ring group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-pill border border-strong bg-meter-track",
        "transition-colors duration-interactive ease-standard data-[state=checked]:border-inverse data-[state=checked]:bg-inverse disabled:cursor-default disabled:opacity-50",
        "[--track-h:calc(var(--size-switch)*0.56)] [--track-w:var(--size-switch)]",
        size === "sm" && "[--track-h:calc(var(--size-switch)*0.5)] [--track-w:calc(var(--size-switch)*0.85)]",
        "h-(--track-h) w-(--track-w)",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-[calc(var(--track-h)-2*var(--border-width-emphasis))] translate-x-[var(--border-width-emphasis)] rounded-pill bg-surface shadow-badge",
          "transition-transform duration-interactive ease-standard",
          "group-data-[state=checked]/switch:translate-x-[calc(var(--track-w)-var(--track-h))]",
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (!label) return control;

  return (
    <label className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-x-cluster">
      {control}
      <span className="flex min-w-0 flex-col">
        <span className="text-body-sm font-medium text-ink">{label}</span>
        {description && <span className="text-caption text-ink-tertiary">{description}</span>}
      </span>
    </label>
  );
}
