"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/cn";

import { describedBy, Field, inputStyles } from "./field";

export interface TextAreaProps extends Omit<ComponentProps<"textarea">, "tw" | "children"> {
  /** What to write, sentence case: “Your review”. */
  label: ReactNode;
  /** Help under the label: what a useful answer covers. */
  hint?: ReactNode;
  /** What went wrong and how to fix it; marks the text area invalid. */
  error?: ReactNode;
  /** Marks the field “(optional)”. */
  optional?: boolean;
  /** Visible lines before it scrolls (default 5). */
  rows?: number;
  /** With `maxLength`, shows “120 of 2,000 characters” under it as the reader types. */
  showCount?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A multi-line text input with its label, hint, error and, if asked, a
 * character count: the body of a review, a reply, a note on a saved product.
 *
 * **Use it for** answers longer than a line. **Not for** a title or an email
 * address (`TextField`).
 *
 * @summary A multi-line text input with label, hint, error and character count.
 * @import import { TextArea } from "@/kit/ui";
 */
export function TextArea({ label, hint, error, optional, id, rows = 5, showCount, maxLength, className, onChange, value, defaultValue, ...textarea }: TextAreaProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  const [length, setLength] = useState(String(value ?? defaultValue ?? "").length);
  const count = showCount && maxLength ? `${fieldId}-count` : undefined;
  return (
    <Field id={fieldId} label={label} hint={hint} error={error} optional={optional} className={className}>
      <textarea
        id={fieldId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        aria-describedby={[describedBy(fieldId, hint, error), count].filter(Boolean).join(" ") || undefined}
        aria-invalid={error ? true : undefined}
        required={!optional}
        onChange={(event) => {
          setLength(event.target.value.length);
          onChange?.(event);
        }}
        className={cn(inputStyles, "min-h-24 resize-y px-3 py-2.5 t-body")}
        {...textarea}
      />
      {count ? (
        <p id={count} data-numeric className="m-0 -mt-1 t-caption text-fg-muted">
          {length.toLocaleString("en-US")} of {maxLength!.toLocaleString("en-US")} characters
        </p>
      ) : null}
    </Field>
  );
}
