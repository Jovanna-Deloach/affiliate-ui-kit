import {
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
 *   verdict     asymmetric bento: hero pick (7) + two compact cards (5),
 *               picks 4+ in an integrated row beneath
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
  return (
    <div data-category={guide.category} className="min-h-dvh bg-ground text-fg">
      <SiteHeader site={site} category={guide.category} />
      <main>
        <EditorialArticleHeader guide={guide} notice={{ text: site.disclosureNotice, href: site.disclosureHref }} />
        <div className="kit-well mt-12 md:mt-16">
          <QuickVerdictBento picks={guide.picks} jumpLabel={guide.jumpLabel} attribution={attribution} moreHeading={guide.railHeading} />
        </div>
        <div className="kit-well mt-chapter">
          <ComparisonMatrix heading={guide.compare.heading} intro={guide.compare.intro} metrics={guide.metrics} picks={guide.picks} attribution={attribution}>
            {guide.notRecommended && <DisqualifiedSubTable items={guide.notRecommended} metrics={guide.metrics} />}
          </ComparisonMatrix>
        </div>
        <div className="kit-well mt-chapter flex flex-col gap-10">
          {guide.picks.map((pick) => (
            <ProductDeepDiveCard key={pick.product.id} pick={pick} disclosureHref={site.disclosureHref} attribution={attribution} />
          ))}
        </div>
        <MethodologyAccordion methodology={guide.methodology} className="mt-chapter" />
      </main>
      <SiteFooter site={site} />
    </div>
  );
}
