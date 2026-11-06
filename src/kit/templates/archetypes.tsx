import type { ReactNode } from "react";

import {
  AlsoGreatRail,
  ComparisonMatrix,
  EditorialArticleHeader,
  MethodologyAccordion,
  ProductDeepDiveCard,
  QuickVerdictBento,
  SiteFooter,
  SiteHeader,
} from "@/kit/blocks";
import { typesetDeep } from "@/kit/lib/typeset";
import type { RoundupGuide, SiteChrome } from "@/kit/types";
import type { AffiliateAttribution } from "@/types/affiliate";

/**
 * The other page archetypes, composed from the same eight macro-primitives
 * as the roundup. Each takes the same guide contract, so an agent can move
 * a guide between archetypes without rewriting it.
 */
export interface ArchetypeProps {
  /** The publication: masthead, footer, and the two disclosures (the byline notice and the footer statement). */
  site: SiteChrome;
  /** The page’s content: the same `RoundupGuide` contract as the roundup. Plain text; the template typesets it. */
  guide: RoundupGuide;
  /** Campaign attribution added to every buy link. */
  attribution?: AffiliateAttribution;
}

function Shell({ site, guide, children }: { site: SiteChrome; guide: RoundupGuide; children: ReactNode }) {
  return (
    <div data-category={guide.category} className="min-h-dvh bg-ground text-fg">
      <SiteHeader site={site} category={guide.category} />
      <main>
        <EditorialArticleHeader guide={guide} notice={{ text: site.disclosureNotice, href: site.disclosureHref }} />
        {children}
        <MethodologyAccordion methodology={guide.methodology} className="mt-chapter" />
      </main>
      <SiteFooter site={site} />
    </div>
  );
}

/**
 * A head-to-head, “X vs. Y”: the two picks’ verdict cards side by side,
 * the two-row comparison, both deep dives, the method. Uses the first two
 * picks of the guide.
 *
 * **Use it for** a decision between two products. **Not for** three or more
 * (`RoundupPage`) or one (`LabAssayPage`).
 *
 * @summary The head-to-head page (“X vs. Y”): two verdict cards, a two-row comparison, two deep dives.
 * @import import { VersusPage } from "@/kit/templates";
 */
export function VersusPage({ site, guide: input, attribution }: ArchetypeProps) {
  const guide = typesetDeep(input);
  const pair = guide.picks.slice(0, 2);
  return (
    <Shell site={site} guide={guide}>
      <div className="kit-well mt-12 md:mt-16">
        <QuickVerdictBento picks={pair} jumpLabel={guide.jumpLabel} attribution={attribution} heading="The verdict" />
      </div>
      <div className="kit-well mt-chapter">
        <ComparisonMatrix heading={guide.compare.heading} intro={guide.compare.intro} metrics={guide.metrics} picks={pair} attribution={attribution} />
      </div>
      <div className="kit-well mt-chapter flex flex-col gap-10">
        {pair.map((pick) => (
          <ProductDeepDiveCard key={pick.product.id} pick={pick} disclosureHref={site.disclosureHref} attribution={attribution} />
        ))}
      </div>
    </Shell>
  );
}

/**
 * A single-product review: one verdict card across the width, then the
 * product’s full review and the method. For a supplement, the review carries
 * the lab’s stamp and the heavy metals. Uses the guide’s first pick.
 *
 * **Use it for** one product tested in depth, such as a lab assay.
 * **Not for** a comparison between products (`VersusPage`, `RoundupPage`).
 *
 * @summary The single-product page: one wide verdict card, then the full (lab) review.
 * @import import { LabAssayPage } from "@/kit/templates";
 */
export function LabAssayPage({ site, guide: input, attribution }: ArchetypeProps) {
  const guide = typesetDeep(input);
  const [pick] = guide.picks;
  if (!pick) return null;
  return (
    <Shell site={site} guide={guide}>
      <div className="kit-well mt-12 md:mt-16">
        <QuickVerdictBento picks={[pick]} jumpLabel={guide.jumpLabel} attribution={attribution} heading="The verdict" />
      </div>
      <div className="kit-well mt-chapter">
        <ProductDeepDiveCard pick={pick} disclosureHref={site.disclosureHref} attribution={attribution} />
      </div>
    </Shell>
  );
}

/**
 * A collector’s guide: a catalog of every piece as peers, then each piece
 * in full, then the method. No verdict and no ranking table. The catalog’s
 * heading is the guide’s `railHeading`.
 *
 * **Use it for** a curated set of products that are not ranked against each
 * other. **Not for** a ranking (`RoundupPage`).
 *
 * @summary The collector’s guide page: a catalog of every piece, then each one in full, unranked.
 * @import import { CollectorsGuidePage } from "@/kit/templates";
 */
export function CollectorsGuidePage({ site, guide: input, attribution }: ArchetypeProps) {
  const guide = typesetDeep(input);
  return (
    <Shell site={site} guide={guide}>
      <div className="kit-well mt-12 md:mt-16">
        <AlsoGreatRail picks={guide.picks} heading={guide.railHeading ?? "In this guide"} jumpLabel={guide.jumpLabel} attribution={attribution} />
      </div>
      <div className="kit-well mt-chapter flex flex-col gap-10">
        {guide.picks.map((pick) => (
          <ProductDeepDiveCard key={pick.product.id} pick={pick} disclosureHref={site.disclosureHref} attribution={attribution} />
        ))}
      </div>
    </Shell>
  );
}
