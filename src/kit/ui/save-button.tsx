"use client";

import { Bookmark } from "lucide-react";

import { forget, remember, useReaderList } from "@/kit/lib/reader";
import type { ReaderItem } from "@/kit/types";
import { cn } from "@/lib/cn";

export interface SaveButtonProps {
  /** What to save: `toReaderItem(summary)` for a product, `{ kind: "guide", id, title, href }` for a guide. */
  item: Omit<ReaderItem, "at" | "note">;
  /** Saved, when the reader’s account keeps the list (with `onSavedChange`). Leave out to keep it on the device. */
  saved?: boolean;
  /** Called with the new state when the reader saves or unsaves, for an account. */
  onSavedChange?: (saved: boolean) => void;
  /** Icon only, for a card’s corner; the button is still named for screen readers (“Save Peak Supply Creatine Monohydrate”). */
  compact?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Save a product or a guide for later: a bookmark that fills when saved,
 * announced as a pressed toggle. Without an account it keeps the item on the
 * reader’s device (Saved items and Pick up where you left off read it there);
 * with one, the page keeps the state.
 *
 * **Use it for** a product’s or guide’s header, and a card’s corner
 * (`compact`). **Not for** comparing (`CompareButton`), a price alert, or
 * sharing.
 *
 * @summary Save a product or guide for later, on the device or in an account.
 * @import import { SaveButton } from "@/kit/ui";
 */
export function SaveButton({ item, saved, onSavedChange, compact = false, className }: SaveButtonProps) {
  const device = useReaderList("saved");
  const on = saved ?? device.some((entry) => entry.kind === item.kind && entry.id === item.id);
  const name = [item.brand, item.title].filter(Boolean).join(" ");
  const toggle = () => {
    if (onSavedChange) onSavedChange(!on);
    else if (on) forget("saved", item);
    else remember("saved", { ...item, at: new Date().toISOString() });
  };
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={compact ? `Save ${name}` : undefined}
      title={compact ? (on ? "Saved" : "Save") : undefined}
      onClick={toggle}
      className={cn(
        "kit-focus inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full t-ui transition-colors duration-(--dur) ease-(--ease)",
        compact ? "size-11 bg-paper text-fg ring-1 ring-line ring-inset hover:ring-line-strong" : "px-3 text-fg hover:bg-well",
        className,
      )}
    >
      <Bookmark aria-hidden="true" size={18} strokeWidth={1.75} fill={on ? "currentColor" : "none"} />
      {compact ? null : "Save"}
    </button>
  );
}
