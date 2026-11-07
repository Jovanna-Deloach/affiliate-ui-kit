import { ConsumerWarning, PeopleAlsoLookedAt, ReviewsSection, SiteFooter, SiteHeader } from "@/kit/blocks";
import { HealthDisclaimer, TrustSignals } from "@/kit/components";
import { summarize } from "@/kit/lib/reviews";
import { typesetDeep } from "@/kit/lib/typeset";
import { underWarning } from "@/kit/lib/warnings";
import type { BrandProfile, SiteChrome } from "@/kit/types";
import { Breadcrumb, StarRating } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

export interface BrandPageProps {
  /** The publication: masthead, footer, and the two disclosures (the byline notice and the footer statement). */
  site: SiteChrome;
  /** The whole page’s content: the `BrandProfile` contract. Plain text; the template typesets it. */
  profile: BrandProfile;
  /** Campaign attribution added to every buy link. */
  attribution?: AffiliateAttribution;
  /** The moment relative dates count from (“2 weeks ago”); pin it in stories and tests (default: now). */
  now?: string;
}

/**
 * A brand’s page: the brand’s name and what it makes, how many of its
 * products the site tested and certified, readers’ rating (from the reviews
 * the page shows, when it shows them), how the brand
 * handles reviews, and the disclosure notice; any warning about the brand;
 * its products, every one photographed, with their lowest price; readers’
 * reviews of its products; similar brands; and, for supplements, the
 * health disclaimer.
 *
 * **Use it for** a brand’s own page, linked from its products and brand
 * cards. **Not for** one product (`ProductPage`), a list of brands
 * (`PeopleAlsoLookedAt` with `brands`), or a category (`CategoryPage`).
 *
 * @summary A brand’s page: what it makes, how it handles reviews, its products, readers’ reviews.
 * @import import { BrandPage } from "@/kit/templates";
 */
export function BrandPage({ site, profile: input, attribution, now }: BrandPageProps) {
  const profile = typesetDeep(input);
  const { brand, products } = profile;
  const certified = products.filter((p) => p.certification?.status === "certified" && !underWarning(p.product)).length;
  // The header’s rating counts the same reviews the page shows, so the two numbers agree.
  const rating = profile.reviews?.items.length ? summarize(profile.reviews.items, now) : brand.rating;
  return (
    <div data-category={profile.category} className="min-h-dvh bg-ground text-fg">
      <SiteHeader site={site} category={profile.category} />
      <main>
        <header className="kit-well @container pt-8 md:pt-12">
          <Breadcrumb items={profile.crumbs} />
          <div className="mt-6 grid items-start gap-10 @4xl:grid-cols-12 @4xl:gap-x-12">
            <div className="@4xl:col-span-7">
              <h1 className="m-0 mt-1 t-display text-fg">{brand.name}</h1>
              <p className="m-0 mt-6 max-w-[38rem] t-lead text-fg-body">{profile.dek}</p>
              <dl className="m-0 mt-8 flex flex-wrap gap-x-10 gap-y-4">
                <div className="grid gap-1">
                  <dt className="t-small text-fg-muted">Products tested</dt>
                  <dd data-numeric className="m-0 t-figure text-fg">
                    {products.length}
                  </dd>
                </div>
                <div className="grid gap-1">
                  <dt className="t-small text-fg-muted">Certified</dt>
                  <dd data-numeric className="m-0 t-figure text-fg">
                    {certified}
                  </dd>
                </div>
                {rating ? (
                  <div className="grid gap-1">
                    <dt className="t-small text-fg-muted">Readers’ rating</dt>
                    <dd className="m-0 flex items-center gap-2">
                      <StarRating value={rating.average} />
                      <span data-numeric className="t-small text-fg">
                        {rating.average.toFixed(1)} from {rating.count.toLocaleString("en-US")} {rating.count === 1 ? "review" : "reviews"}
                      </span>
                    </dd>
                  </div>
                ) : null}
              </dl>
              <p data-slot="disclosure-notice" className="m-0 mt-8 max-w-[38rem] t-small text-fg-muted">
                {site.disclosureNotice}{" "}
                <a href={site.disclosureHref} className="kit-focus kit-link rounded-ctl text-fg">
                  How we make money
                </a>
              </p>
            </div>
            <TrustSignals brand={brand.name} signals={profile.trust} className="@4xl:col-span-5" />
          </div>
        </header>
        {profile.warning ? (
          <div className="kit-well mt-12">
            <ConsumerWarning warning={profile.warning} subject={brand.name} />
          </div>
        ) : null}
        <div className="kit-well mt-chapter">
          <PeopleAlsoLookedAt products={products} heading={`${brand.name} products we tested`} buy attribution={attribution} id="products" />
        </div>
        {profile.reviews?.items.length ? (
          <div className="kit-well mt-chapter">
            <ReviewsSection heading={`What readers say about ${brand.name}`} reviews={profile.reviews.items} topics={profile.reviews.topics} aiSummary={profile.reviews.aiSummary} now={now} />
          </div>
        ) : null}
        {profile.similar?.length ? (
          <div className="kit-well mt-chapter">
            <PeopleAlsoLookedAt brands={profile.similar} heading="Similar brands" id="similar" />
          </div>
        ) : null}
        {profile.category === "supplements" ? (
          <div className="kit-well mt-chapter">
            <HealthDisclaimer plural />
          </div>
        ) : null}
      </main>
      <SiteFooter site={site} />
    </div>
  );
}
