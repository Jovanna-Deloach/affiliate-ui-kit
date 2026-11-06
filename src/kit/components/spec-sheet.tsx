import { cn } from "@/lib/cn";
import { Disclosure, DisclosureIcon, DisclosureSummary, Eyebrow } from "@/kit/ui";

export interface SpecSheetProps {
  /** Specifications as label and value: `{ label: "Case", value: "40 mm steel" }`. Units in the value. */
  facts: { label: string; value: string }[];
  /** `drawer` a closed card footer that opens to the sheet (default) · `sheet` the list on its own, always open. */
  variant?: "drawer" | "sheet";
  /** The drawer’s label. Default “Full specifications”. */
  title?: string;
  /** Opens the drawer on load. */
  defaultOpen?: boolean;
  /** An anchor, unique on the page. */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

function Sheet({ facts, className }: { facts: SpecSheetProps["facts"]; className?: string }) {
  return (
    <dl className={cn("m-0 grid @2xl:grid-cols-2 @2xl:gap-x-12", className)}>
      {facts.map((f) => (
        <div key={f.label} className="-mt-px grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-4 border-y border-line py-3">
          <dt className="t-small text-fg-muted">{f.label}</dt>
          <dd data-numeric className="m-0 t-small text-fg">
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Specifications, label and value, in two columns between hairlines (one in
 * a container under 42rem), values in tabular figures. As a `drawer` it is a
 * card’s footer: a native `<details>` across the card, “Full specifications
 * · 5 details” with a framed plus, its side padding matching the card’s.
 * Closed content stays in the document for search engines.
 *
 * **Use it for** the full specifications of one product, at the foot of its
 * review. **Not for** the three numbers that decide a purchase (put those in
 * the comparison or the scorecard) or a comparison across products
 * (`ComparisonMatrix`).
 *
 * @summary Full specifications as a card-footer drawer, or an always-open sheet.
 * @import import { SpecSheet } from "@/kit/components";
 */
export function SpecSheet({ facts, variant = "drawer", title = "Full specifications", defaultOpen, id, className }: SpecSheetProps) {
  if (variant === "sheet")
    return (
      <div data-slot="specs" id={id} className={cn("@container", className)}>
        <Sheet facts={facts} />
      </div>
    );
  return (
    <Disclosure data-slot="specs" id={id} open={defaultOpen} className={cn("@container scroll-mt-8 border-t border-line", className)}>
      <DisclosureSummary className="min-h-14 rounded-b-box px-5 @2xl:px-8">
        <Eyebrow as="span" tone="default" items={[title, <span key="count" className="text-fg-muted">{`${facts.length} details`}</span>]} />
        <DisclosureIcon framed />
      </DisclosureSummary>
      <Sheet facts={facts} className="px-5 pb-6 @2xl:px-8" />
    </Disclosure>
  );
}
