"use client";

import { Minus, Plus } from "lucide-react";
import { useId, useState, type ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * <NumberStepper />
 * ---------------------------------------------------------------------------
 * One bordered control: [ − ][ value ][ + ]. The value is a real
 * `<input type="number">` (↑/↓ and typing work natively), the buttons step
 * it, min/max clamp on every change, and the figure is set in the metric
 * voice. A `prefix` ("$") sits inside the field so the number stays tabular.
 *
 *   --size-control / --radius-control        the control
 *   --keyline-figure                         default width (120px)
 *   --border-hairline / --border-strong      rest · hover/focus
 *
 * 21st.dev physics (coss.com/number-field #28180, sanitized): grouped
 * decrement / input / increment, touch hit-areas, clamp on blur. Controlled
 * via `value` + `onValueChange`, or uncontrolled with `defaultValue`.
 */
export interface NumberStepperProps extends Omit<ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "size"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  /** Accessible name for the field ("Target price"). */
  label: string;
  width?: "figure" | "full";
}

export function NumberStepper({
  value,
  defaultValue = 0,
  onValueChange,
  step = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  prefix,
  suffix,
  label,
  width = "figure",
  className,
  id,
  disabled,
  ...props
}: NumberStepperProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const generated = useId();
  const inputId = id ?? generated;

  const commit = (next: number) => {
    const clamped = Math.min(max, Math.max(min, Number.isFinite(next) ? next : min));
    if (value === undefined) setInternal(clamped);
    onValueChange?.(clamped);
  };

  const buttonClass = cn(
    "focus-ring relative flex h-full w-[calc(var(--size-control)*0.8)] shrink-0 cursor-pointer items-center justify-center text-ink-secondary",
    "transition-colors duration-interactive ease-standard hover:bg-recessed hover:text-ink disabled:cursor-default disabled:opacity-40",
    // Touch: grow the hit-area to the control height without changing the silhouette.
    "after:absolute after:inset-0 after:min-h-control after:content-['']",
  );

  return (
    <div
      data-slot="number-stepper"
      className={cn(
        "grid h-control grid-cols-[auto_minmax(0,1fr)_auto] items-stretch overflow-hidden rounded-control border border-hairline bg-surface",
        "transition-colors duration-interactive ease-standard focus-within:border-strong hover:border-strong",
        width === "figure" ? "w-figure" : "w-full",
        disabled && "opacity-50",
        className,
      )}
    >
      <button type="button" onClick={() => commit(current - step)} disabled={disabled || current <= min} aria-label={`Decrease ${label}`} className={cn(buttonClass, "rounded-l-control")}>
        <Minus size="1em" strokeWidth={1.5} aria-hidden="true" />
      </button>
      <label htmlFor={inputId} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center justify-items-center">
        <span className="sr-only">{label}</span>
        {prefix ? <span aria-hidden="true" className="type-metric text-body-sm text-ink-tertiary">{prefix}</span> : <span />}
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          value={current}
          step={step}
          min={Number.isFinite(min) ? min : undefined}
          max={Number.isFinite(max) ? max : undefined}
          disabled={disabled}
          onChange={(e) => commit(e.target.valueAsNumber)}
          onBlur={(e) => commit(e.target.valueAsNumber)}
          className="type-metric h-full w-full min-w-0 bg-transparent text-center text-body-sm text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...props}
        />
        {suffix ? <span aria-hidden="true" className="text-caption text-ink-tertiary">{suffix}</span> : <span />}
      </label>
      <button type="button" onClick={() => commit(current + step)} disabled={disabled || current >= max} aria-label={`Increase ${label}`} className={cn(buttonClass, "rounded-r-control")}>
        <Plus size="1em" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
