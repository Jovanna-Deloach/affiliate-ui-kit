import { ConsumerWarning, EditorialArticleHeader, Faq, MethodologyAccordion, PeopleAlsoLookedAt, ProductDeepDiveCard, ReviewsSection, SiteFooter, SiteHeader } from "@/kit/blocks";
import {
  AssayTable,
  CertificationNotice,
  EvidenceTable,
  HealthDisclaimer,
  KeyFindings,
  PriceAlert,
  PriceHistory,
  reviewId,
  StickyBuyBar,
  TrustSignals,
  WatchlistIngredients,
} from "@/kit/components";
import { toReaderItem } from "@/kit/lib/discovery";
import { RememberVisit } from "@/kit/lib/reader";
import { summarize } from "@/kit/lib/reviews";
import { typesetDeep } from "@/kit/lib/typeset";
import { underWarning, warningId } from "@/kit/lib/warnings";
import type { PriceAlertRequest, ProductReport, ProductWarning, SiteChrome } from "@/kit/types";
import { Banner, Button, GradeScale } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

/** What the banner at the top of a warned product’s page says, by kind of warning. */
const BANNER: Record<ProductWarning["kind"], string> = {
  recall: "This product is under a recall.",
  regulator: "A regulator has warned about this product.",
  "failed-test": "This product failed our safety test.",
  "fake-reviews": "This brand was caught faking reviews.",
};

export interface ProductPageProps {
  /** The publication: masthead, footer, and the two disclosures (the byline notice and the footer statement). */
  site: SiteChrome;
  /** The whole page’s content: the `ProductReport` contract. Plain text; the template typesets it. */
  report: ProductReport;
  /** Campaign attribution added to every buy link. */
  attribution?: AffiliateAttribution;
  /** Sets a price alert (a Server Action). */
  onPriceAlert?: (request: PriceAlertRequest) => void | Promise<void>;
  /** Ask for an email address in the price alert (default true); leave it off for a signed-in reader. */
  askEmail?: boolean;
  /** Where readers write a review of the product: shown as “Write a review” beside the reviews. */
  writeReviewHref?: string;
  /** Where the site explains its review labels, and how a reader reports a review. */
  reviewLinks?: { labels?: string; report?: string };
  /** The moment relative dates count from (“2 weeks ago”); pin it in stories and tests (default: now). */
  now?: string;
}

/**
 * A product’s own page: a lab report and readers’ reviews on one page. The
 * masthead; the article header with the reviewer and the disclosure notice;
 * the review (photograph, score, buy box, narrative, pros and cons); the lab
 * report (the grade on its scale, key findings, every result, the watchlist,
 * the certification and every batch); the research on its main ingredient;
 * its price over 90 days with a price alert; readers’ reviews; what other
 * readers looked at; questions; the method; the health disclaimer; the
 * footer. A sticky buy bar follows the buy box; the page remembers the visit
 * on the reader’s device, and carries the readers’ rating as structured data.
 *
 * Under an active warning the page leads with a banner and the full
 * warning, and drops the grade, the certification, the price, the buy links
 * and the structured data; the lab results and reviews stay.
 *
 * **Use it for** one product’s page. **Not for** a guide to several
 * (`RoundupPage`), a product inside a roundup (`ProductDeepDiveCard`), or
 * the research on an ingredient (`IngredientPage`).
 *
 * @summary A product’s page: review, lab report, evidence, price, readers’ reviews.
 * @import import { ProductPage } from "@/kit/templates";
 */
export function ProductPage({ site, report: input, attribution, onPriceAlert, askEmail = true, writeReviewHref, reviewLinks, now }: ProductPageProps) {
  const report = typesetDeep(input);
  const { pick, lab } = report;
  const { product } = pick;
  const name = `${product.brand} ${product.name}`;
  const warning = underWarning(product) ? product.warning : undefined;
  const summary = { product, href: report.href, grade: report.grade, score: pick.rating.score, certification: report.certification };
  const numbers = report.reviews?.items.length ? summarize(report.reviews.items, now) : undefined;
  const structured =
    numbers && !warning
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name,
          brand: { "@type": "Brand", name: product.brand },
          image: product.image.src,
          aggregateRating: { "@type": "AggregateRating", ratingValue: numbers.average.toFixed(1), reviewCount: numbers.count, bestRating: 5, worstRating: 1 },
        }
      : undefined;

  return (
    <div data-category={report.category} className="min-h-dvh bg-ground text-fg">
      <SiteHeader site={site} category={report.category} />
      {warning ? (
        <Banner
          tone="danger"
          title={BANNER[warning.kind]}
          action={
            <a href={`#${warningId(product)}`} className="kit-focus kit-link rounded-ctl">
              Read the warning
            </a>
          }
        />
      ) : null}
      <main>
        <EditorialArticleHeader guide={report} notice={{ text: site.disclosureNotice, href: site.disclosureHref }} methodHref={report.methodology ? "#methodology" : "#lab-report"} />
        {warning ? (
          <div className="kit-well mt-12">
            <ConsumerWarning warning={warning} subject={name} id={warningId(product)} />
          </div>
        ) : null}
        <div className="kit-well mt-12 md:mt-16">
          <ProductDeepDiveCard pick={pick} disclosureHref={site.disclosureHref} attribution={attribution} />
        </div>

        <section id="lab-report" aria-labelledby="lab-report-heading" className="kit-well mt-chapter scroll-mt-8">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            <h2 id="lab-report-heading" className="m-0 t-headline text-fg">
              The lab report
            </h2>
            {warning ? null : <GradeScale grade={report.grade} className="w-full" />}
          </div>
          <div className="mt-8 grid items-start gap-10 lg:grid-cols-12">
            <div className="grid min-w-0 gap-10 lg:col-span-7">
              <KeyFindings report={lab} as="h3" />
              <AssayTable report={lab} as="h3" />
            </div>
            <div className="grid min-w-0 gap-10 lg:col-span-5">
              <WatchlistIngredients items={lab.watchlist} />
              {warning ? null : <CertificationNotice certification={report.certification} as="h3" />}
            </div>
          </div>
        </section>

        {report.evidence ? (
          <div className="kit-well mt-chapter grid gap-4">
            <EvidenceTable outcomes={report.evidence.outcomes} heading={`What the research says about ${report.evidence.ingredient}`} />
            <a href={report.evidence.href} className="kit-focus kit-link justify-self-start rounded-ctl t-ui">
              All the research on {report.evidence.ingredient}
            </a>
          </div>
        ) : null}

        {report.priceHistory && !warning ? (
          <section id="price" aria-labelledby="price-heading" className="kit-well mt-chapter scroll-mt-8">
            <h2 id="price-heading" className="m-0 t-headline text-fg">
              Price
            </h2>
            <div className="mt-8 grid items-start gap-10 lg:grid-cols-12">
              <PriceHistory points={report.priceHistory} className="lg:col-span-7" />
              <div className="kit-card grid gap-4 p-5 sm:p-6 lg:col-span-5">
                <h3 className="m-0 t-name-sm text-fg">Get a price alert</h3>
                <PriceAlert product={product} onSubmit={onPriceAlert} askEmail={askEmail} />
              </div>
            </div>
          </section>
        ) : null}

        {report.reviews?.items.length ? (
          <div className="kit-well mt-chapter">
            <ReviewsSection
              heading={`What readers say about ${name}`}
              reviews={report.reviews.items}
              topics={report.reviews.topics}
              aiSummary={report.reviews.aiSummary}
              aside={report.reviews.trust ? <TrustSignals brand={product.brand} signals={report.reviews.trust} /> : undefined}
              writeAction={
                writeReviewHref ? (
                  <Button asChild>
                    <a href={writeReviewHref}>Write a review</a>
                  </Button>
                ) : undefined
              }
              labelsHref={reviewLinks?.labels}
              reportHref={reviewLinks?.report}
              now={now}
            />
          </div>
        ) : null}

        {report.alsoLookedAt?.length ? (
          <div className="kit-well mt-chapter">
            <PeopleAlsoLookedAt products={report.alsoLookedAt} />
          </div>
        ) : null}
        {report.faq?.length ? (
          <div className="kit-well mt-chapter">
            <Faq items={report.faq} heading={`Questions about ${product.name.toLowerCase()}`} />
          </div>
        ) : null}
        {report.methodology ? <MethodologyAccordion methodology={report.methodology} className="mt-chapter" /> : null}
        <div className="kit-well mt-chapter">
          <HealthDisclaimer />
        </div>
      </main>
      <SiteFooter site={site} />
      {warning ? null : <StickyBuyBar product={product} watch={`${reviewId(pick)}-buy`} disclosureHref={site.disclosureHref} />}
      <RememberVisit item={toReaderItem(summary)} />
      {structured ? (
        <script
          type="application/ld+json"
          // The site’s own copy; escaping “<” keeps it from closing the script.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }}
        />
      ) : null}
    </div>
  );
}
