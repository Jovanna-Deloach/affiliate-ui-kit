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
 *   verdict     asymmetric bento: hero pick (7) + two compact cards (5);
 *               picks 4+ appear in the comparison only
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
  /** The publication: masthead, footer, and the two disclosures (the byline notice and the footer statement). */
  site: SiteChrome;
  /** The whole page’s content: the `RoundupGuide` contract. Plain text; the template typesets it. */
  guide: RoundupGuide;
  /** Campaign attribution added to every buy link: `{ source, medium: "affiliate", campaign: guide.id }`. */
  attribution?: AffiliateAttribution;
}

/**
 * A roundup, “The best X”: the kit’s reference composition. Masthead; the
 * article header with the disclosure notice and the testing card; the quick
 * verdict (up to three picks); the comparison with what failed; one deep
 * dive per pick, in order; the method; the footer. The template sets the
 * page’s `data-category` and typesets the copy.
 *
 * **Use it for** a guide that ranks three or more products tested on the
 * same measurements. **Not for** two products (`VersusPage`), one product
 * (`LabAssayPage`) or a catalogue of peers with no ranking
 * (`CollectorsGuidePage`). To make a different page, compose the blocks the
 * same way rather than wrapping them in new cards.
 *
 * @summary The roundup page (“The best X”): verdict, comparison, a deep dive per pick, method.
 * @import import { RoundupPage } from "@/kit/templates";
 */
export function RoundupPage({ site, guide: input, attribution }: RoundupPageProps) {
  const guide = typesetDeep(input);
  return (
    <div data-category={guide.category} className="min-h-dvh bg-ground text-fg">
      <SiteHeader site={site} category={guide.category} />
      <main>
        <EditorialArticleHeader guide={guide} notice={{ text: site.disclosureNotice, href: site.disclosureHref }} />
        <div className="kit-well mt-12 md:mt-16">
          <QuickVerdictBento picks={guide.picks} jumpLabel={guide.jumpLabel} attribution={attribution} />
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
