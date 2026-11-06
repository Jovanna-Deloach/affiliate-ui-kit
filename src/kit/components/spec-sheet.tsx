import { cn } from "@/lib/cn";
import { Disclosure, DisclosureIcon, DisclosureSummary, Eyebrow } from "@/kit/ui";

/**
 * Specifications, label and value, in two columns between hairlines
 * (one in a container under 42rem). Values set tabular figures.
 *
 *   drawer  a card footer: a closed native <details> across the card,
 *           “Full specifications · 5 details” in micro-caps with a framed
 *           plus/minus; the sheet opens inside it. Its side padding
 *           matches the card’s (20px, 32px from 42rem). Closed content
 *           stays in the document for search engines.
 *   sheet   the list on its own, always open
 */
export interface SpecSheetProps {
  facts: { label: string; value: string }[];
  variant?: "drawer" | "sheet";
  title?: string;
  /** Opens the drawer on load. */
  defaultOpen?: boolean;
  id?: string;
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
