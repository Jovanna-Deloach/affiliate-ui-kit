import {
  AlsoGreatRail,
  ComparisonMatrix,
  DisqualifiedSubTable,
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
 * ROUNDUP — “The best X”, the kit’s reference composition.
 *
 *   header      title, dek, byline, disclosure notice │ testing summary card
 *   verdict     2–3 tiles: who each pick is for, price, one button, jump
 *   rail        the remaining picks, quietly
 *   compare     every pick on the same columns (+ what failed)
 *   deep dives  one per pick, identical geometry
 *   method      the protocol
 *
 * Every macro-primitive is container-driven, so the same blocks recompose
 * into the other archetypes (src/kit/templates/archetypes.tsx). Copy this
 * composition; do not wrap blocks in extra cards or add labels above
 * headings (docs/DESIGN.md).
 */
export interface RoundupPageProps {
  site: SiteChrome;
  guide: RoundupGuide;
  attribution?: AffiliateAttribution;
}

export function RoundupPage({ site, guide: input, attribution }: RoundupPageProps) {
  const guide = typesetDeep(input);
  const bentoCount = guide.bentoCount ?? 3;
  const verdict = guide.picks.slice(0, bentoCount);
  const rail = guide.picks.slice(bentoCount);
  return (
    <div data-category={guide.category} className="min-h-dvh bg-paper text-fg">
      <SiteHeader site={site} category={guide.category} />
      <main>
        <EditorialArticleHeader guide={guide} notice={{ text: site.disclosureNotice, href: site.disclosureHref }} />
        <div className="kit-well mt-12 md:mt-16">
          <QuickVerdictBento picks={verdict} jumpLabel={guide.jumpLabel} attribution={attribution} />
          {rail.length > 0 && <AlsoGreatRail picks={rail} heading={guide.railHeading ?? "Also great"} attribution={attribution} className="mt-12" />}
        </div>
        <div className="kit-well mt-chapter">
          <ComparisonMatrix heading={guide.compare.heading} intro={guide.compare.intro} metrics={guide.metrics} picks={guide.picks} attribution={attribution}>
            {guide.notRecommended && <DisqualifiedSubTable items={guide.notRecommended} metrics={guide.metrics} />}
          </ComparisonMatrix>
        </div>
        <div className="kit-well">
          {guide.picks.map((pick) => (
            <ProductDeepDiveCard key={pick.product.id} pick={pick} disclosureHref={site.disclosureHref} attribution={attribution} className="mt-chapter" />
          ))}
        </div>
        <MethodologyAccordion methodology={guide.methodology} className="mt-chapter" />
      </main>
      <SiteFooter site={site} />
    </div>
  );
}
