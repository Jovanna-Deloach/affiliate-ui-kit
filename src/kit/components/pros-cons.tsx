import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/cn";
import { Eyebrow } from "@/kit/ui";

export interface ProsConsProps {
  /** What we like: short, specific points, each a fact a reader can check (“Keeps time within +2 s/day”). */
  pros: string[];
  /** What to know: the honest caveats, in the same voice. May be empty. */
  cons: string[];
  /** Base for the headings’ ids; must be unique on the page. */
  id: string;
  /** The first heading. Default “What we like”. */
  prosLabel?: string;
  /** The second heading. Default “What to know”. */
  consLabel?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

function List({ id, label, items, tone }: { id: string; label: string; items: string[]; tone: "pass" | "warn" }) {
  const Icon = tone === "pass" ? Check : Minus;
  return (
    <section aria-labelledby={id}>
      <Eyebrow as="h3" id={id}>
        {label}
      </Eyebrow>
      <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[1rem_minmax(0,1fr)] items-start gap-3 t-small text-fg-body">
            <Icon size={15} strokeWidth={2.25} aria-hidden="true" className={cn("mt-0.5", tone === "pass" ? "text-pass" : "text-warn")} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * What we like and what to know: two lists under micro-caps headings, each
 * point with an icon in the pass or warning tone (colour is never the only
 * signal). No boxes and no rules. In a container under 36rem the lists
 * stack; an empty list is left out.
 *
 * **Use it for** a review’s verdict in points, inside a deep dive or a
 * product page. **Not for** specifications (`SpecSheet`), measured results
 * (`Scorecard`, `Telemetry`) or a comparison between products
 * (`ComparisonMatrix`).
 *
 * @summary What we like and what to know, as two unboxed lists with icons.
 * @import import { ProsCons } from "@/kit/components";
 */
export function ProsCons({ pros, cons, id, prosLabel = "What we like", consLabel = "What to know", className }: ProsConsProps) {
  const both = pros.length > 0 && cons.length > 0;
  return (
    <div data-slot="pros-cons" className={cn("@container", className)}>
      <div className={cn("grid gap-8", both && "@xl:grid-cols-2 @xl:gap-10")}>
        {pros.length > 0 && <List id={`${id}-pros`} label={prosLabel} items={pros} tone="pass" />}
        {cons.length > 0 && <List id={`${id}-cons`} label={consLabel} items={cons} tone="warn" />}
      </div>
    </div>
  );
}
