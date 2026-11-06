"use client";

import { Search, X } from "lucide-react";
import { useId, useRef, useState, type ComponentProps } from "react";

import { cn } from "@/lib/cn";

import { inputStyles } from "./field";

export interface SearchFieldProps extends Omit<ComponentProps<"input">, "tw" | "type" | "size" | "children" | "value" | "defaultValue"> {
  /** What it searches, for screen readers (and shown with `showLabel`): “Search reviews”. */
  label: string;
  /** Show the label above the field. */
  showLabel?: boolean;
  /** The text, when the page keeps the state (with `onValueChange`). */
  value?: string;
  /** The text on load, when the field keeps its own state. */
  defaultValue?: string;
  /** Called with the text as the reader types, and with "" when they clear it. */
  onValueChange?: (value: string) => void;
  /** A key hint shown at the end while the field is empty: “⌘K”. The page binds the key. */
  shortcut?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A search box: a magnifier, the text, and a clear button once there is
 * text. A native search input, so Enter submits its form; put it in
 * `<form role="search" action="…">` to search with no script.
 *
 * **Use it for** searching the site or within a list (reviews, studies).
 * **Not for** a filter with known options (`Checkbox`, `Chip`) or a field in
 * a form (`TextField`).
 *
 * @summary A search box with clear button and an optional key hint (⌘K).
 * @import import { SearchField } from "@/kit/ui";
 */
export function SearchField({ label, showLabel, value, defaultValue, onValueChange, shortcut, id, className, onChange, placeholder, ...input }: SearchFieldProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  const ref = useRef<HTMLInputElement>(null);
  const [own, setOwn] = useState(defaultValue ?? "");
  const text = value ?? own;
  const change = (next: string) => {
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };
  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={fieldId} className={cn("t-ui font-semibold text-fg", !showLabel && "sr-only")}>
        {label}
      </label>
      <div className="relative">
        <Search aria-hidden="true" size={18} strokeWidth={1.75} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted" />
        <input
          ref={ref}
          id={fieldId}
          type="search"
          value={text}
          placeholder={placeholder ?? label}
          onChange={(event) => {
            change(event.target.value);
            onChange?.(event);
          }}
          className={cn(inputStyles, "h-11 pr-12 pl-10 [&::-webkit-search-cancel-button]:appearance-none")}
          {...input}
        />
        {text ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              change("");
              ref.current?.focus();
            }}
            className="kit-focus absolute top-0 right-0 grid size-11 cursor-pointer place-items-center rounded-ctl text-fg-muted hover:text-fg"
          >
            <X aria-hidden="true" size={16} strokeWidth={2} />
          </button>
        ) : shortcut ? (
          <kbd aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-ctl border border-line px-1.5 py-0.5 t-caption text-fg-muted">
            {shortcut}
          </kbd>
        ) : null}
      </div>
    </div>
  );
}
