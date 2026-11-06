import { useId } from "react";

import { cn } from "@/lib/cn";

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  /** What the options switch, for screen readers (and shown with `showLegend`): “Rank by”. */
  legend: string;
  /** Two to four views of the same thing: Quality and Value; lb and kg. */
  options: SegmentedOption[];
  /** The radios' shared name, for a plain form. */
  name?: string;
  /** The option picked, when the page keeps the state (with `onValueChange`). */
  value?: string;
  /** The option picked first, when the control keeps its own state. */
  defaultValue?: string;
  /** Called with the option the reader picks. */
  onValueChange?: (value: string) => void;
  /** Show the legend before the control. */
  showLegend?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Two to four views of the same thing, side by side in one frame: the one
 * picked is ink with white type. Native radios underneath, so arrow keys move
 * between options and it works in a plain form with no script.
 *
 * **Use it for** switching what a list or figure shows: Quality or Value
 * ranking, lb or kg in a dose. **Not for** navigation between pages
 * (`TabLinks`), panels of content (`Tabs`), filters that combine
 * (`Checkbox`) or more than four options (`Select`).
 *
 * @summary Two to four views of one thing, side by side: Quality or Value, lb or kg.
 * @import import { SegmentedControl } from "@/kit/ui";
 */
export function SegmentedControl({ legend, options, name, value, defaultValue, onValueChange, showLegend, className }: SegmentedControlProps) {
  const auto = useId();
  const group = name ?? auto;
  return (
    <fieldset className={cn("m-0 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 border-0 p-0", className)}>
      <legend className={cn("float-left p-0 t-ui text-fg-muted", !showLegend && "sr-only")}>{legend}</legend>
      <div className="inline-flex rounded-ctl border border-line-strong bg-paper p-0.5">
        {options.map((option) => (
          <label key={option.value} className="relative flex">
            <input
              type="radio"
              name={group}
              value={option.value}
              {...(value === undefined ? { defaultChecked: option.value === defaultValue } : { checked: option.value === value })}
              onChange={onValueChange ? () => onValueChange(option.value) : undefined}
              className="peer sr-only"
            />
            <span className="flex min-h-10 cursor-pointer items-center rounded-ctl px-4 t-ui text-fg-muted transition-colors duration-(--dur) ease-(--ease) peer-checked:bg-fg peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:text-fg peer-checked:hover:text-paper">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
