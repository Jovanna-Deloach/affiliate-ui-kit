import { ChevronDown } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/cn";

import { describedBy, Field, inputStyles } from "./field";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<ComponentProps<"select">, "tw" | "size" | "children"> {
  /** What the choice is, sentence case: “Sort by”. */
  label: ReactNode;
  /** The options, in the order a reader scans them. */
  options: SelectOption[];
  /** Help under the label. */
  hint?: ReactNode;
  /** What went wrong and how to fix it; marks the select invalid. */
  error?: ReactNode;
  /** Label beside the select, for a compact sort (“Sort by Most recent”). */
  inline?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A choice from a list, as the browser’s own select: on a phone it opens the
 * system picker, and it works in a plain form with no script. A chevron in
 * place of the browser’s arrow; 44px tall.
 *
 * **Use it for** sort orders and choices from more than four options:
 * Most recent, Most relevant, Highest rated. **Not for** two to four options
 * a reader should see at once (`SegmentedControl`, `Radio`), or filters that
 * combine (`Checkbox`).
 *
 * @summary A native select with label: sort orders and longer lists of choices.
 * @import import { Select } from "@/kit/ui";
 */
export function Select({ label, options, hint, error, inline, id, className, ...select }: SelectProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field id={fieldId} label={label} hint={hint} error={error} inline={inline} className={className}>
      <span className={cn("relative", inline ? "inline-flex" : "flex")}>
        <select
          id={fieldId}
          aria-describedby={describedBy(fieldId, hint, error)}
          aria-invalid={error ? true : undefined}
          className={cn(inputStyles, "h-11 cursor-pointer appearance-none pr-10 pl-3", inline && "w-auto")}
          {...select}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" size={16} strokeWidth={2} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-fg-muted" />
      </span>
    </Field>
  );
}
