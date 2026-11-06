"use client";

import { useState } from "react";

import { forget, READER_LIMITS, remember, useReaderList } from "@/kit/lib/reader";
import type { ReaderItem } from "@/kit/types";
import { cn } from "@/lib/cn";

import { Checkbox } from "./choice";

export interface CompareButtonProps {
  /** The product to compare: `toReaderItem(summary)`. */
  item: Omit<ReaderItem, "at" | "note">;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A “Compare” checkbox that puts a product in the compare tray on the
 * reader’s device, or takes it out. The tray holds four: a fifth is refused
 * with a line saying so, and the box stays clear. Each box is named for its
 * product for screen readers (“Compare Peak Supply Creatine Monohydrate”).
 *
 * **Use it for** product cards and ranking rows on pages that show the
 * `CompareTray`. **Not for** saving (`SaveButton`) or for picking options in
 * a form (`Checkbox`).
 *
 * @summary A Compare checkbox that adds a product to the compare tray (four at most).
 * @import import { CompareButton } from "@/kit/ui";
 */
export function CompareButton({ item, className }: CompareButtonProps) {
  const tray = useReaderList("compare");
  const [full, setFull] = useState(false);
  const on = tray.some((entry) => entry.kind === item.kind && entry.id === item.id);
  const name = [item.brand, item.title].filter(Boolean).join(" ");
  return (
    <span className={cn("grid justify-items-start", className)}>
      <Checkbox
        label={
          <>
            Compare<span className="sr-only"> {name}</span>
          </>
        }
        checked={on}
        onChange={() => {
          if (on) {
            forget("compare", item);
            setFull(false);
          } else setFull(!remember("compare", { ...item, at: new Date().toISOString() }));
        }}
      />
      {full ? (
        <span role="status" className="t-caption text-fg-muted">
          The tray holds {READER_LIMITS.compare}. Remove one to add this.
        </span>
      ) : null}
    </span>
  );
}
