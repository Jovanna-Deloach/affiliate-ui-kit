import { CircleAlert } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/** The text input’s look, shared by `TextField`, `TextArea`, `Select` and `SearchField`. */
export const inputStyles =
  "kit-focus w-full rounded-ctl border border-line-strong bg-paper t-ui text-fg transition-colors duration-(--dur) ease-(--ease) placeholder:text-fg-muted hover:border-fg aria-invalid:border-fail disabled:cursor-default disabled:opacity-50";

/** The ids a control points at with `aria-describedby`: its hint, then its error. */
export function describedBy(id: string, hint?: ReactNode, error?: ReactNode): string | undefined {
  return [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
}

export interface FieldProps {
  /** The control’s `id`: the label points at it, and the hint and error take `{id}-hint` and `{id}-error`. */
  id: string;
  /** What to enter, sentence case: “Your review”. */
  label: ReactNode;
  /** Help under the label: what makes a good answer, or the format. */
  hint?: ReactNode;
  /** What went wrong and how to fix it, under the control, in the fail tone with an icon. */
  error?: ReactNode;
  /** Marks the field “(optional)”; fields are required unless they say so. */
  optional?: boolean;
  /** Label beside the control instead of above it, for a compact sort or filter (“Sort by”). */
  inline?: boolean;
  /** The control, carrying `id={id}` and `aria-describedby={describedBy(id, hint, error)}`. */
  children: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A label, an optional hint and an error around one control, wired for
 * assistive technology. `TextField`, `TextArea` and `Select` already include
 * it; use it directly only for a control the kit composes itself.
 *
 * **Use it for** a custom control that needs a label, hint and error (a
 * star rating in a form). **Not for** a text input, text area or select
 * (they carry their own), or a group of checkboxes or radios (`ChoiceGroup`).
 *
 * @summary Label, hint and error around one control, wired for screen readers.
 * @import import { Field } from "@/kit/ui";
 */
export function Field({ id, label, hint, error, optional, inline, children, className }: FieldProps) {
  return (
    <div className={cn(inline ? "flex flex-wrap items-center gap-x-3 gap-y-1" : "grid gap-2", className)}>
      <label htmlFor={id} className={cn("t-ui", inline ? "text-fg-muted" : "font-semibold text-fg")}>
        {label}
        {optional ? <span className="font-normal text-fg-muted"> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="m-0 -mt-1 t-small text-fg-muted">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="m-0 flex items-start gap-1.5 t-small text-fail">
          <CircleAlert aria-hidden="true" size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface TextFieldProps extends Omit<ComponentProps<"input">, "tw" | "size" | "children"> {
  /** What to enter, sentence case: “Review title”. */
  label: ReactNode;
  /** Help under the label: what makes a good answer, or the format. */
  hint?: ReactNode;
  /** What went wrong and how to fix it; marks the input invalid. */
  error?: ReactNode;
  /** Marks the field “(optional)”. */
  optional?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A one-line text input with its label, hint and error: a review title, an
 * email address for an alert, a name. 44px tall. Every native input
 * attribute (`type`, `name`, `autoComplete`, `required`) passes through.
 *
 * **Use it for** short answers in a form. **Not for** a review or other
 * long text (`TextArea`), a search box (`SearchField`), or a choice from a
 * fixed list (`Select`, `ChoiceGroup`).
 *
 * @summary A one-line text input with its label, hint and error.
 * @import import { TextField } from "@/kit/ui";
 */
export function TextField({ label, hint, error, optional, id, className, ...input }: TextFieldProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field id={fieldId} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input
        id={fieldId}
        aria-describedby={describedBy(fieldId, hint, error)}
        aria-invalid={error ? true : undefined}
        required={!optional}
        className={cn(inputStyles, "h-11 px-3")}
        {...input}
      />
    </Field>
  );
}
