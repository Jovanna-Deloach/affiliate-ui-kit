import { CategoryReport, EditorialArticleHeader, Faq, MethodologyAccordion, RankingList, SiteFooter, SiteHeader, SuggestAProduct } from "@/kit/blocks";
import { HealthDisclaimer, ReferenceList } from "@/kit/components";
import { typesetDeep } from "@/kit/lib/typeset";
import type { CategoryGuide, ProductSuggestion, SiteChrome } from "@/kit/types";
import type { AffiliateAttribution } from "@/types/affiliate";

export interface CategoryPageProps {
  /** The publication: masthead, footer, and the two disclosures (the byline notice and the footer statement). */
  site: SiteChrome;
  /** The whole page’s content: the `CategoryGuide` contract. Plain text; the template typesets it. */
  guide: CategoryGuide;
  /** Campaign attribution added to every buy link. */
  attribution?: AffiliateAttribution;
  /** Sends a reader’s suggestion of a product to test (a Server Action). */
  onSuggest?: (suggestion: ProductSuggestion) => void | Promise<void>;
  /** The privacy page, linked under Suggest it. */
  privacyHref?: string;
}

/**
 * A category’s page: the article header with the testing card; the ranking,
 * ordered by quality, value, certification or name; how the whole category
 * tested, every product on one accuracy scale; the questions readers ask,
 * beside the sources behind the answers; the method; Suggest a product;
 * and, for supplements, the health disclaimer.
 *
 * **Use it for** a category’s hub: “Creatine”, “Fish oil”. **Not for** a
 * guide that reviews each pick in full (`RoundupPage`), one product
 * (`ProductPage`), or the research on an ingredient (`IngredientPage`).
 *
 * @summary A category’s page: the ranking, the category report, questions, sources.
 * @import import { CategoryPage } from "@/kit/templates";
 */
export function CategoryPage({ site, guide: input, attribution, onSuggest, privacyHref }: CategoryPageProps) {
  const guide = typesetDeep(input);
  return (
    <div data-category={guide.category} className="min-h-dvh bg-ground text-fg">
      <SiteHeader site={site} category={guide.category} />
      <main>
        <EditorialArticleHeader guide={guide} notice={{ text: site.disclosureNotice, href: site.disclosureHref }} methodHref={guide.methodology ? "#methodology" : "#category-report"} />
        <div className="kit-well mt-12 md:mt-16">
          <RankingList heading={guide.ranking.heading} summary={guide.ranking.summary} products={guide.ranking.products} disclosureHref={site.disclosureHref} attribution={attribution} />
        </div>
        <div className="kit-well mt-chapter">
          <CategoryReport results={guide.results} />
        </div>
        <div className="kit-well mt-chapter grid items-start gap-chapter lg:grid-cols-12 lg:gap-x-12">
          <Faq items={guide.faq} heading={`What readers ask about ${guide.noun}`} className="lg:col-span-7" />
          {guide.references?.length ? <ReferenceList references={guide.references} heading="Sources" className="lg:col-span-5" /> : null}
        </div>
        {guide.methodology ? <MethodologyAccordion methodology={guide.methodology} className="mt-chapter" /> : null}
        <div className="kit-well mt-chapter">
          <SuggestAProduct category={guide.noun} onSubmit={onSuggest} privacyHref={privacyHref} className="max-w-3xl" />
        </div>
        {guide.category === "supplements" ? (
          <div className="kit-well mt-chapter">
            <HealthDisclaimer plural />
          </div>
        ) : null}
      </main>
      <SiteFooter site={site} />
    </div>
  );
}
