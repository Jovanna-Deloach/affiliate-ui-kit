import { EditorialArticleHeader, Faq, RankingList, ResearchFeed, SiteFooter, SiteHeader } from "@/kit/blocks";
import { AlsoKnownAs, DosageCard, EvidenceTable, HealthDisclaimer, ReferenceList, SafetyPanel, TableOfContents } from "@/kit/components";
import { typesetDeep } from "@/kit/lib/typeset";
import type { IngredientGuide, SiteChrome } from "@/kit/types";
import { Citation } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

export interface IngredientPageProps {
  /** The publication: masthead, footer, and the two disclosures (the byline notice and the footer statement). */
  site: SiteChrome;
  /** The whole page’s content: the `IngredientGuide` contract. Plain text; the template typesets it. */
  guide: IngredientGuide;
  /** Campaign attribution added to every buy link. */
  attribution?: AffiliateAttribution;
}

/**
 * A supplement’s research page, as Examine sets one out: the article
 * header with the reviewer; then, beside a table of contents that follows
 * the reader, what it is (its other names, and paragraphs with numbered
 * citations), what the research says outcome by outcome, how to take it,
 * who should not, the studies, the products the site tested that contain
 * it, the questions readers ask, every source, and the health disclaimer.
 * Sources are numbered in the order the text first cites them.
 *
 * **Use it for** a supplement’s or ingredient’s page: “Creatine”,
 * “Magnesium”. **Not for** a product (`ProductPage`), a ranking
 * (`CategoryPage`), or a buying guide (`RoundupPage`).
 *
 * @summary A supplement’s research page: evidence, dose, safety, studies, products, sources.
 * @import import { IngredientPage } from "@/kit/templates";
 */
export function IngredientPage({ site, guide: input, attribution }: IngredientPageProps) {
  const guide = typesetDeep(input);
  const lower = guide.name.toLowerCase();
  // Number the sources in the order the overview first cites them; the rest follow in their own order.
  const cited = [...new Set(guide.overview.flatMap((p) => p.cites ?? []))];
  const references = [...cited.map((id) => guide.references.find((r) => r.id === id)!).filter(Boolean), ...guide.references.filter((r) => !cited.includes(r.id))];
  const number = (id: string) => references.findIndex((r) => r.id === id) + 1;
  const seen = new Map<string, number>();
  const toc = [
    { id: "overview", label: `What ${lower} is` },
    { id: "evidence", label: "What the research says" },
    { id: "dosage", label: "How to take it" },
    { id: "safety", label: "Safety" },
    { id: "research", label: "The studies" },
    { id: "products", label: "Products we tested" },
    { id: "faq", label: "Questions" },
    { id: "references", label: "Sources" },
  ];

  return (
    <div data-category={guide.category} className="min-h-dvh bg-ground text-fg">
      <SiteHeader site={site} category={guide.category} />
      <main>
        <EditorialArticleHeader guide={guide} notice={{ text: site.disclosureNotice, href: site.disclosureHref }} />
        <div className="kit-well mt-12 grid items-start gap-x-12 gap-y-8 md:mt-16 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <TableOfContents items={toc} className="lg:sticky lg:top-8" />
          <div className="grid min-w-0 gap-chapter">
            <section id="overview" aria-labelledby="overview-heading" className="grid scroll-mt-8 gap-6">
              <h2 id="overview-heading" className="m-0 t-headline text-fg">
                What {lower} is
              </h2>
              <AlsoKnownAs names={guide.names} notConfusedWith={guide.notConfusedWith} />
              <div className="grid max-w-measure gap-4">
                {guide.overview.map((paragraph) => (
                  <p key={paragraph.text} className="m-0 t-body text-fg-body">
                    {paragraph.text}
                    {(paragraph.cites ?? []).map((id) => {
                      const occurrence = (seen.get(id) ?? 0) + 1;
                      seen.set(id, occurrence);
                      return <Citation key={`${id}-${occurrence}`} n={number(id)} to={id} occurrence={occurrence} />;
                    })}
                  </p>
                ))}
              </div>
            </section>
            <EvidenceTable outcomes={guide.outcomes} />
            <DosageCard dosage={guide.dosage} name={lower} />
            <SafetyPanel notes={guide.safety.notes} summary={guide.safety.summary} heading={`Is ${lower} safe?`} />
            <ResearchFeed studies={guide.studies} outcomes={guide.outcomes} />
            <RankingList heading={`${guide.name} we tested`} products={guide.products} disclosureHref={site.disclosureHref} attribution={attribution} id="products" />
            <Faq items={guide.faq} heading={`Questions about ${lower}`} />
            <ReferenceList references={references} cited={cited} heading="Sources" />
            <HealthDisclaimer plural />
          </div>
        </div>
      </main>
      <SiteFooter site={site} />
    </div>
  );
}
