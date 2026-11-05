import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/cn";
import type { Evidence, Pick } from "@/kit/types";
import { Award, ProductImage, ResultMark, ScoreBars } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { BuyPanel } from "./buy-panel";

/**
 * One pick, reviewed. Heading and verdict; the object and where to buy it;
 * the argument in prose with what we like and what to know; the facts and
 * the evidence in a narrow column beside it.
 *
 *   emphasis "object"   — large image (7 of 12 columns) beside the buy panel
 *                         and the specifications: craft categories
 *   emphasis "evidence" — smaller image; the evidence leads the side column:
 *                         categories bought on measurements
 *
 * `continuesHero` is for the pick the page hero already showed with its
 * image and buy panel: the entry skips that row and keeps a compact buy
 * panel at the top of the side column instead of repeating it.
 */
export interface ReviewEntryProps {
  pick: Pick;
  emphasis?: "object" | "evidence";
  continuesHero?: boolean;
  disclosure: { text: string; href: string };
  attribution?: AffiliateAttribution;
  className?: string;
}

export function ReviewEntry({ pick, emphasis = "object", continuesHero = false, disclosure, attribution, className }: ReviewEntryProps) {
  const { product } = pick;
  const name = `${product.brand} ${product.name}`;
  const facts = (
    <section aria-label={`${name} specifications`}>
      <h3 className="m-0 t-ui text-fg">Specifications</h3>
      <dl className="m-0 mt-3 border-t border-line">
        {pick.facts.map((f) => (
          <div key={f.label} className="grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)] gap-4 border-b border-line py-3">
            <dt className="t-small text-fg-muted">{f.label}</dt>
            <dd className="m-0 t-small text-fg">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
  const evidence = pick.evidence ? <EvidenceBlock evidence={pick.evidence} /> : null;

  return (
    <article id={product.slug} aria-labelledby={`${product.slug}-name`} className={cn("kit-well scroll-mt-24", className)}>
      <header className="flex max-w-[48rem] flex-col items-start">
        <Award>{pick.award}</Award>
        <h2 id={`${product.slug}-name`} className="m-0 mt-4 t-headline text-fg">
          {name}
        </h2>
        <p className="m-0 mt-4 t-lead text-fg-muted">{pick.verdict}</p>
      </header>

      {!continuesHero && (
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
          <ProductImage
            image={product.media.primaryImage}
            ratio="landscape"
            sizes="(min-width: 1024px) 700px, 100vw"
            className={emphasis === "object" ? "lg:col-span-7" : "lg:col-span-6"}
          />
          {/* Always columns 8–12: the side column below starts on the same keyline. */}
          <div className="flex flex-col gap-10 lg:col-span-5 lg:col-start-8">
            <BuyPanel product={product} placement="review" disclosure={disclosure} attribution={attribution} />
            {emphasis === "object" && facts}
          </div>
        </div>
      )}

      <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-7">
          {pick.body.map((p, i) => (
            <p key={i} className="m-0 max-w-measure t-body text-fg">
              {p}
            </p>
          ))}
          <div className="mt-4 grid gap-8 sm:grid-cols-2">
            <Points heading="What we like" items={pick.likes} kind="like" />
            <Points heading="What to know" items={pick.caveats} kind="caveat" />
          </div>
          {pick.quote && (
            <figure className="m-0 mt-6 max-w-measure">
              <blockquote className="m-0 t-title text-fg italic">“{pick.quote.text}”</blockquote>
              <figcaption className="mt-4 t-small text-fg-muted">
                <span className="text-fg">{pick.quote.person.name}</span>, {pick.quote.person.role?.toLowerCase()}
              </figcaption>
            </figure>
          )}
        </div>
        <aside className="flex flex-col gap-10 lg:col-span-5 lg:col-start-8">
          {continuesHero && <BuyPanel product={product} placement="review" disclosure={disclosure} attribution={attribution} othersVisible={false} />}
          {evidence}
          {(continuesHero || emphasis === "evidence") && facts}
        </aside>
      </div>
    </article>
  );
}

function Points({ heading, items, kind }: { heading: string; items: string[]; kind: "like" | "caveat" }) {
  const Icon = kind === "like" ? Check : Minus;
  return (
    <section>
      <h3 className="m-0 t-ui text-fg">{heading}</h3>
      <ul className="m-0 mt-3 flex list-none flex-col gap-2.5 p-0">
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-2 t-small text-fg">
            <Icon size={16} strokeWidth={2} aria-hidden="true" className={cn("mt-0.5", kind === "like" ? "text-pass" : "text-fg-muted")} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EvidenceBlock({ evidence }: { evidence: Evidence }) {
  if (evidence.kind === "scores") {
    return (
      <section>
        <h3 className="m-0 t-ui text-fg">{evidence.heading}</h3>
        <ScoreBars items={evidence.items} className="mt-4" />
      </section>
    );
  }
  return (
    <section>
      <h3 className="m-0 t-ui text-fg">{evidence.heading}</h3>
      <table className="mt-3 w-full border-collapse text-left">
        <thead className="sr-only">
          <tr>
            <th scope="col">Test</th>
            <th scope="col">Result</th>
            <th scope="col">Limit</th>
          </tr>
        </thead>
        <tbody className="border-t border-line">
          {evidence.items.map((r) => (
            <tr key={r.label} className="border-b border-line">
              <th scope="row" className="py-3 pr-3 font-normal">
                <span className="flex flex-col">
                  <span className="t-small text-fg">{r.label}</span>
                  <span className="t-caption text-fg-muted">Limit {r.limit}</span>
                </span>
              </th>
              <td className="py-3 text-right align-middle">
                <span className="inline-flex items-center gap-2">
                  <span className="t-figure t-small text-fg">{r.value}</span>
                  <ResultMark status={r.status}>{r.status === "pass" ? "Pass" : r.status === "fail" ? "Fail" : "Near limit"}</ResultMark>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
