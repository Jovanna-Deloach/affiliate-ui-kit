import { VERTICALS } from "@/lib/verticals";

const TIERS = [
  {
    title: "Monetization & Attribution",
    items: ["AffiliateAction", "MerchantOfferRow", "PromoCodeChip", "DisclosureBanner"],
  },
  {
    title: "Evaluation, Scoring & E-E-A-T Proof",
    items: ["AwardBadge", "ScoreMeter", "ProsConsGrid", "SpecList", "AuthorityByline"],
  },
  {
    title: "Structural Surface & Media",
    items: ["SurfaceCard", "ProductMediaFrame", "HotspotCanvas", "EditorialHeading"],
  },
  {
    title: "Scannability, Comparison & Discovery",
    items: ["StickyMatrix", "QuickJumpBar", "FacetFilterBar", "ProgressiveCollapse"],
  },
  {
    title: "High-Intent Conversion & Interactive Tools",
    items: ["StickyBuyDock", "ResponsiveSheet", "ParametricInput"],
  },
];

export default function KitIndexPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-section p-card">
      <header className="flex max-w-heading flex-col gap-cluster">
        <p className="type-eyebrow m-0 text-ink-tertiary">Affiliate UI Kit</p>
        <h1 className="type-display m-0">Twenty primitives. Two tones. One structural spine.</h1>
        <p className="m-0 max-w-prose text-body leading-body text-ink-secondary">
          Every component binds its keylines, geometry, rhythm and motion to the shared
          contract in <code>src/styles/tokens.css</code>; a vertical only changes palette
          temperature and the display face. Run <code>bun run storybook</code> to switch tones live.
        </p>
      </header>

      <section className="grid gap-grid sm:grid-cols-2">
        {VERTICALS.map((v) => (
          <div key={v.id} data-vertical={v.id} className="flex flex-col gap-cluster rounded-container border border-hairline bg-surface p-card">
            <p className="type-eyebrow m-0 text-ink-tertiary">{v.id}</p>
            <h2 className="type-title m-0">{v.label}</h2>
            <p className="m-0 text-body-sm text-ink-secondary">{v.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-grid md:grid-cols-2">
        {TIERS.map((tier, i) => (
          <div key={tier.title} className="flex flex-col gap-cluster border-t border-hairline pt-stack">
            <p className="type-eyebrow m-0 text-ink-tertiary">Tier {i + 1}</p>
            <h2 className="type-title m-0">{tier.title}</h2>
            <ul className="m-0 flex list-none flex-wrap gap-cluster p-0 pt-cluster">
              {tier.items.map((item) => (
                <li key={item} className="rounded-tag border border-hairline bg-recessed px-tag-x py-tag-y text-caption font-medium text-ink-secondary">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
