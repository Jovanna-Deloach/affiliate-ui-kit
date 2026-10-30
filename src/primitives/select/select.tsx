"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/cn";

/**
 * <Select />
 * ---------------------------------------------------------------------------
 * Radix Select with the kit's control silhouette: the trigger is an outline
 * control (`--size-control`, `--radius-control`), the list a Plane-1 panel
 * on the overlay shadow with highlighted rows on Plane 2. Options are data
 * (`{ value, label }`), so a sort bar or a facet rail declares its choices
 * instead of composing items.
 */
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Visible prefix inside the trigger ("Sort"). */
  prefix?: string;
  /** Accessible name when there is no visible label. */
  label: string;
  placeholder?: string;
  size?: "sm" | "md";
  width?: "auto" | "full";
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  prefix,
  label,
  placeholder = "Choose…",
  size = "md",
  width = "auto",
  disabled,
  className,
}: SelectProps) {
  return (
    <SelectPrimitive.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
      <SelectPrimitive.Trigger
        aria-label={label}
        data-slot="select"
        className={cn(
          "focus-ring group/select inline-flex cursor-pointer items-center justify-between gap-cluster rounded-control border border-strong bg-surface text-ink",
          "transition-colors duration-interactive ease-standard hover:border-ink hover:bg-recessed disabled:cursor-default disabled:opacity-50",
          size === "sm" ? "h-[calc(var(--size-control)-var(--space-2))] px-[calc(var(--inset-cell-x)*0.75)] text-body-sm" : "h-control px-cell-x text-body-sm",
          width === "full" && "w-full",
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-hairline">
          {prefix && <span className="type-eyebrow text-ink-tertiary">{prefix}</span>}
          <span className="truncate font-medium">
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>
        </span>
        <SelectPrimitive.Icon asChild>
          <ChevronDown
            size="1em"
            strokeWidth={1.5}
            aria-hidden="true"
            className="shrink-0 text-ink-tertiary transition-transform duration-interactive ease-standard group-data-[state=open]/select:rotate-180"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          data-slot="select-content"
          className="menu-panel z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-container border border-hairline bg-surface text-ink shadow-overlay"
        >
          <SelectPrimitive.Viewport className="py-hairline">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "grid h-control cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-stack px-cell-x text-body-sm text-ink outline-none",
                  "data-highlighted:bg-recessed data-[state=checked]:font-medium",
                )}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <Check size="1em" strokeWidth={1.5} aria-hidden="true" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
