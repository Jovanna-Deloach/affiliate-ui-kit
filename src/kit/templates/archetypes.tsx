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
interface ArchetypeProps {
  site: SiteChrome;
  guide: RoundupGuide;
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

/** HEAD-TO-HEAD — two picks: verdict tiles side by side, the two-row comparison, both deep dives. */
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

/** SINGLE-PRODUCT LAB ASSAY — one product: a single verdict tile, then its full lab review. */
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

/** COLLECTOR’S GUIDE — a catalogue index of every piece, then each piece in full. No ranking table. */
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
