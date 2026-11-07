"use client";

import { useState, type ReactNode } from "react";

import { LB_PER_KG } from "@/kit/lib/evidence";
import type { Dosage } from "@/kit/types";
import { SegmentedControl, TextField } from "@/kit/ui";
import { cn } from "@/lib/cn";

type Unit = "lb" | "kg";

const RANGE: Record<Unit, [number, number]> = { lb: [60, 700], kg: [27, 320] };
const NBSP = " ";
const UNIT_OPTIONS = [
  { value: "lb", label: "lb" },
  { value: "kg", label: "kg" },
];

/** A dose rounded the way people measure it: whole grams from 10 g up, tenths below; tens of milligrams from 100 mg up. */
function amount(value: number, unit: "g" | "mg"): string {
  const rounded = unit === "g" ? (value >= 10 ? Math.round(value) : Math.round(value * 10) / 10) : value >= 100 ? Math.round(value / 10) * 10 : Math.round(value);
  return `${rounded.toLocaleString("en-US")}${NBSP}${unit}`;
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="-mt-px grid gap-1 border-y border-line py-3 @xl:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] @xl:gap-4">
      <dt className="t-small text-fg-muted">{label}</dt>
      <dd className="m-0 max-w-measure t-small text-fg">{children}</dd>
    </div>
  );
}

export interface DosageCardProps {
  /** How to take it: the dose, when, which form, a loading phase if any, and the doses that scale with body weight. */
  dosage: Dosage;
  /** The supplement, lowercase, for the worked example: “creatine”. */
  name: string;
  /** The heading (default “How to take it”). */
  heading?: string;
  /** The unit the worked example starts in: `lb` (default) or `kg`. */
  defaultUnit?: Unit;
  /** The body weight the worked example starts at, in `defaultUnit` (default 180 lb, or 82 kg). */
  defaultWeight?: number;
  /** The heading’s level: `h2` (default), or `h3` inside a section. */
  as?: "h2" | "h3";
  /** An anchor, unique on the page (default `dosage`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * How to take a supplement, from the doses the research used: the everyday
 * dose, when to take it, which form to buy and any loading phase, between
 * hairlines. When doses scale with body weight, a worked example follows:
 * readers type their weight in pounds or kilograms (180 lb to start) and see
 * each dose for that weight, with the dose per kilogram beside it.
 *
 * **Use it for** the dosage section of a supplement’s page. **Not for** who
 * should not take it (`SafetyPanel`), what a product’s serving contains
 * (`KeyFindings`), or prescribing: the card says the doses come from the
 * research.
 *
 * @summary Dose, timing, form, loading phase, and a worked example by body weight.
 * @import import { DosageCard } from "@/kit/components";
 */
export function DosageCard({ dosage, name, heading = "How to take it", defaultUnit = "lb", defaultWeight, as: Heading = "h2", id = "dosage", className }: DosageCardProps) {
  const [unit, setUnit] = useState<Unit>(defaultUnit);
  const [weight, setWeight] = useState(String(defaultWeight ?? (defaultUnit === "lb" ? 180 : 82)));
  const value = Number(weight.replace(/,/g, ""));
  const [low, high] = RANGE[unit];
  const valid = weight.trim() !== "" && Number.isFinite(value) && value >= low && value <= high;
  const kg = unit === "lb" ? value / LB_PER_KG : value;

  const switchUnit = (next: string) => {
    const to = next as Unit;
    if (to === unit) return;
    if (valid) setWeight(String(Math.round(to === "kg" ? value / LB_PER_KG : value * LB_PER_KG)));
    setUnit(to);
  };

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("@container kit-card grid scroll-mt-8 gap-5 p-5 sm:p-6", className)}>
      <Heading id={`${id}-heading`} className="m-0 t-title text-fg">
        {heading}
      </Heading>
      <dl className="m-0 grid">
        <Fact label="Dose">{dosage.dose}</Fact>
        <Fact label="When">{dosage.timing}</Fact>
        <Fact label="Form">{dosage.form}</Fact>
        {dosage.loading ? <Fact label="Loading phase">{dosage.loading}</Fact> : null}
      </dl>
      {dosage.byWeight?.length ? (
        <div className="grid gap-4 rounded-box bg-well p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="m-0 t-ui font-semibold text-fg">Worked example</h3>
            <SegmentedControl legend="Unit" options={UNIT_OPTIONS} value={unit} onValueChange={switchUnit} />
          </div>
          <TextField
            label={`Body weight, in ${unit === "lb" ? "pounds" : "kilograms"}`}
            inputMode="decimal"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            error={valid || weight.trim() === "" ? undefined : `Enter a weight from ${low} to ${high} ${unit}.`}
            className="max-w-xs"
          />
          <output aria-live="polite" className="grid gap-2">
            {valid ? (
              <>
                <p className="m-0 t-small text-fg-body">
                  For someone who weighs{" "}
                  <span data-numeric>
                    {Math.round(value).toLocaleString("en-US")}
                    {NBSP}
                    {unit}
                    {unit === "lb" ? ` (${Math.round(kg)}${NBSP}kg)` : ""}
                  </span>
                  , the {name} studies used:
                </p>
                <ul className="m-0 grid list-none gap-1 p-0">
                  {dosage.byWeight.map((dose) => (
                    <li key={dose.label} className="flex flex-wrap items-baseline gap-x-2 t-ui text-fg">
                      <span>{dose.label}:</span>
                      <strong data-numeric className="font-semibold">
                        about {amount(dose.perKg * kg, dose.unit)} a day
                      </strong>
                      <span data-numeric className="t-caption text-fg-muted">
                        ({dose.perKg}
                        {NBSP}
                        {dose.unit} per kg)
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </output>
        </div>
      ) : null}
      <p className="m-0 t-caption text-fg-muted">The doses the research used, not a prescription for you.</p>
    </section>
  );
}
