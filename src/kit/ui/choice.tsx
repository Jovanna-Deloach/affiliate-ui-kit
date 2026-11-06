import { Check, CircleAlert } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type NativeChoice = Omit<ComponentProps<"input">, "tw" | "type" | "size" | "children">;

export interface ChoiceProps extends NativeChoice {
  /** The option, sentence case: “Verified purchases only”. */
  label: ReactNode;
  /** One line under the label. */
  hint?: ReactNode;
  /** How many items the option holds (reviews with five stars), set at the row’s end in tabular figures. */
  count?: number;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/** A choice row: the box and its label share one 44px target. */
function ChoiceRow({ kind, label, hint, count, id, className, ...input }: ChoiceProps & { kind: "checkbox" | "radio" }) {
  const auto = useId();
  const inputId = id ?? auto;
  const round = kind === "radio";
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <span className="relative mt-3 grid size-5 shrink-0 place-items-center">
        <input
          type={kind}
          id={inputId}
          aria-describedby={hint ? `${inputId}-hint` : undefined}
          className={cn(
            "peer kit-focus size-5 cursor-pointer appearance-none border border-fg-muted bg-paper transition-colors duration-(--dur) ease-(--ease) checked:border-fg checked:bg-fg hover:border-fg disabled:cursor-default disabled:opacity-50",
            round ? "rounded-full" : "rounded-ctl",
          )}
          {...input}
        />
        {round ? (
          <span aria-hidden="true" className="pointer-events-none absolute size-2 rounded-full bg-paper opacity-0 peer-checked:opacity-100" />
        ) : (
          <Check aria-hidden="true" size={14} strokeWidth={3} className="pointer-events-none absolute text-paper opacity-0 peer-checked:opacity-100" />
        )}
      </span>
      <label htmlFor={inputId} className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 py-2.5">
        <span className="grid gap-0.5">
          <span className="t-ui text-fg">{label}</span>
          {hint ? (
            <span id={`${inputId}-hint`} className="t-small text-fg-muted">
              {hint}
            </span>
          ) : null}
        </span>
        {count !== undefined ? (
          <span data-numeric className="t-caption text-fg-muted">
            {count.toLocaleString("en-US")}
          </span>
        ) : null}
      </label>
    </div>
  );
}

/**
 * A box the reader ticks, with its label and an optional count, the whole
 * row a 44px target. A native checkbox, so it works in a plain form with no
 * script; pass `checked` and `onChange` to keep its state in the page.
 *
 * **Use it for** independent options and multi-select filters (5 stars,
 * 4 stars; Verified purchases only), inside a `ChoiceGroup`. **Not for** one
 * choice out of several (`Radio`), a setting that applies at once (`Switch`),
 * or picking a view (`SegmentedControl`).
 *
 * @summary A checkbox row with label and count; a 44px target, native, no script.
 * @import import { Checkbox } from "@/kit/ui";
 */
export function Checkbox(props: ChoiceProps) {
  return <ChoiceRow kind="checkbox" {...props} />;
}

/**
 * One option of a set the reader picks one from, with its label and an
 * optional count. Radios that share a `name` form the set; put them in a
 * `ChoiceGroup`.
 *
 * **Use it for** one choice out of a few, all visible: a date range, a
 * minimum rating. **Not for** several choices at once (`Checkbox`), a long
 * list (`Select`), or switching views (`SegmentedControl`).
 *
 * @summary A radio row with label and count: one choice of a few, all visible.
 * @import import { Radio } from "@/kit/ui";
 */
export function Radio(props: ChoiceProps) {
  return <ChoiceRow kind="radio" {...props} />;
}

export interface ChoiceGroupProps {
  /** What the options decide, as a heading: “Rating”, “Date posted”. */
  legend: ReactNode;
  /** One line under the legend. */
  hint?: ReactNode;
  /** What went wrong, under the options, in the fail tone. */
  error?: ReactNode;
  /** Hide the legend visually (screen readers still hear it) when a heading already says it. */
  hideLegend?: boolean;
  /** The `Checkbox`es or `Radio`s. */
  children: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A set of checkboxes or radios under one heading: a native fieldset, so a
 * screen reader names the set with each option.
 *
 * **Use it for** every group of `Checkbox`es or `Radio`s: a filter, a form
 * question. **Not for** a single checkbox (it needs no group).
 *
 * @summary A fieldset of checkboxes or radios under one heading.
 * @import import { ChoiceGroup } from "@/kit/ui";
 */
export function ChoiceGroup({ legend, hint, error, hideLegend, children, className }: ChoiceGroupProps) {
  return (
    <fieldset className={cn("m-0 min-w-0 border-0 p-0", className)}>
      <legend className={cn("p-0 t-ui font-semibold text-fg", hideLegend && "sr-only")}>{legend}</legend>
      {hint ? <p className="m-0 mt-1 t-small text-fg-muted">{hint}</p> : null}
      <div className="mt-1 grid">{children}</div>
      {error ? (
        <p className="m-0 mt-1 flex items-start gap-1.5 t-small text-fail">
          <CircleAlert aria-hidden="true" size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export interface SwitchProps extends NativeChoice {
  /** The setting, sentence case: “Email me when the price drops”. */
  label: ReactNode;
  /** One line under the label: what changes. */
  hint?: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A setting that takes effect the moment it is flipped: on is an ink track
 * with a white knob, off an outlined track with a gray knob. A native checkbox with the switch role, so it works without script.
 *
 * **Use it for** turning one thing on or off at once: email alerts, show
 * verified reviews only. **Not for** an answer submitted with a form
 * (`Checkbox`) or choosing between two named options (`SegmentedControl`).
 *
 * @summary An on/off setting that applies at once; native, with the switch role.
 * @import import { Switch } from "@/kit/ui";
 */
export function Switch({ label, hint, id, className, ...input }: SwitchProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className={cn("flex min-h-11 items-center justify-between gap-4", className)}>
      <label htmlFor={inputId} className="grid cursor-pointer gap-0.5 py-2.5">
        <span className="t-ui text-fg">{label}</span>
        {hint ? (
          <span id={`${inputId}-hint`} className="t-small text-fg-muted">
            {hint}
          </span>
        ) : null}
      </label>
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          role="switch"
          id={inputId}
          aria-describedby={hint ? `${inputId}-hint` : undefined}
          className="peer kit-focus h-6 w-10 cursor-pointer appearance-none rounded-full border border-fg-muted bg-paper transition-colors duration-(--dur) ease-(--ease) checked:border-fg checked:bg-fg disabled:cursor-default disabled:opacity-50"
          {...input}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1 left-1 size-4 rounded-full bg-fg-muted transition-[translate,background-color] duration-(--dur) ease-(--ease) peer-checked:translate-x-4 peer-checked:bg-paper"
        />
      </span>
    </div>
  );
}
