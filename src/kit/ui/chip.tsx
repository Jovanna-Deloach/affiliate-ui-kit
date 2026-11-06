import { X } from "lucide-react";
import type { MouseEventHandler } from "react";

import { cn } from "@/lib/cn";

const chipStyles =
  "kit-focus inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 t-small no-underline transition-colors duration-(--dur) ease-(--ease)";
const restStyles = "border-line-strong bg-paper text-fg hover:border-fg";
const selectedStyles = "border-fg bg-fg text-paper";

export interface ChipProps {
  /** The topic, category or filter, a word or two, sentence case: “Mixes well”. */
  label: string;
  /** How many items it covers (reviews that mention it), in tabular figures. */
  count?: number;
  /** A link chip: where it goes (a category, a topic page). */
  href?: string;
  /** A toggle chip: called when the reader picks it; pair with `selected`. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** A toggle chip that is on: ink with white type, announced as pressed. */
  selected?: boolean;
  /** An applied-filter chip: called when the reader removes it; shows a cross. */
  onRemove?: MouseEventHandler<HTMLButtonElement>;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A small rounded tag in one of four uses, set by its props: a link
 * (`href`), a filter the reader toggles (`onClick` + `selected`), an applied
 * filter the reader removes (`onRemove`), or a plain tag (none). 40px tall.
 *
 * **Use it for** topics reviewers mention, related categories, quick links,
 * and the row of filters applied above a list. **Not for** a status or
 * result (`Badge`), an award (`Award`), or an action (`Button`).
 *
 * @summary A rounded tag: a link, a toggled filter, a removable applied filter.
 * @import import { Chip } from "@/kit/ui";
 */
export function Chip({ label, count, href, onClick, selected, onRemove, className }: ChipProps) {
  const figure =
    count !== undefined ? (
      <span data-numeric className={cn("t-caption", selected ? "text-paper/80" : "text-fg-muted")}>
        {count.toLocaleString("en-US")}
      </span>
    ) : null;

  if (onRemove) {
    return (
      <button type="button" onClick={onRemove} aria-label={`Remove filter: ${label}`} className={cn(chipStyles, "cursor-pointer pr-2.5", selectedStyles, className)}>
        {label}
        <X aria-hidden="true" size={14} strokeWidth={2.25} />
      </button>
    );
  }
  if (href) {
    return (
      <a href={href} className={cn(chipStyles, restStyles, className)}>
        {label}
        {figure}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={Boolean(selected)} className={cn(chipStyles, "cursor-pointer", selected ? selectedStyles : restStyles, className)}>
        {label}
        {figure}
      </button>
    );
  }
  return (
    <span className={cn(chipStyles, "border-line bg-paper text-fg", className)}>
      {label}
      {figure}
    </span>
  );
}
