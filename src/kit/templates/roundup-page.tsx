import { PickHero, PicksTable, ReviewEntry, ArticleHeader, Methodology, SiteFooter, SiteHeader } from "@/kit/blocks";
import type { RoundupGuide, SiteChrome } from "@/kit/types";
import type { AffiliateAttribution } from "@/types/affiliate";

/**
 * A buying guide ("The best X"), the kit's reference composition.
 *
 *   lead "pick"    — answer first with the object large, then the
 *                    comparison, then each pick. Craft categories.
 *   lead "results" — a compact verdict, then the results table straight
 *                    away, then each pick with its evidence first.
 *                    Categories bought on measurements.
 *
 * Copy this composition; do not wrap blocks in extra cards or add labels
 * above headings (docs/DESIGN.md).
 */
export interface RoundupPageProps {
  site: SiteChrome;
  guide: RoundupGuide;
  lead?: "pick" | "results";
  attribution?: AffiliateAttribution;
}

export function RoundupPage({ site, guide, lead = "pick", attribution }: RoundupPageProps) {
  const disclosure = { text: "We may earn a commission when you buy through these links.", href: site.disclosureHref };
  const resultsLed = lead === "results";
  return (
    <div className="min-h-dvh bg-paper text-fg">
      <SiteHeader site={site} />
      <main>
        <ArticleHeader guide={guide} />
        <PickHero picks={guide.picks} layout={resultsLed ? "strip" : "feature"} disclosure={disclosure} attribution={attribution} className={resultsLed ? "mt-10 md:mt-12" : "mt-12 md:mt-16"} />
        <PicksTable
          heading={resultsLed ? "The results" : "Compare our picks"}
          intro={resultsLed ? "Every product, the same tests. Products that failed are listed so you know which to avoid." : undefined}
          metrics={guide.metrics}
          picks={guide.picks}
          notRecommended={guide.notRecommended}
          attribution={attribution}
          className={resultsLed ? "mt-12 md:mt-16" : "mt-chapter"}
        />
        {guide.picks.map((pick, i) => (
          <ReviewEntry
            key={pick.product.id}
            pick={pick}
            emphasis={resultsLed ? "evidence" : "object"}
            continuesHero={!resultsLed && i === 0}
            disclosure={disclosure}
            attribution={attribution}
            className="mt-chapter"
          />
        ))}
        <Methodology body={guide.methodology.body} facts={guide.methodology.facts} className="mt-chapter" />
      </main>
      <SiteFooter site={site} />
    </div>
  );
}
