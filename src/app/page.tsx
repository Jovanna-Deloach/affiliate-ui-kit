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
    <main className="mx-auto flex max-w-5xl flex-col gap-section-gap p-card-pad">
      <header className="flex flex-col gap-cluster-gap">
        <p className="type-eyebrow text-muted">Affiliate UI Kit</p>
        <h1 className="type-display">Twenty primitives. Two verticals. One codebase.</h1>
        <p className="max-w-prose text-muted">
          Every component binds its geometry, density, typography and motion to the
          token contract in <code>src/styles/tokens.css</code>. Run{" "}
          <code>bun run storybook</code> to switch profiles live.
        </p>
      </header>

      <section className="grid gap-grid-gap sm:grid-cols-2">
        {VERTICALS.map((v) => (
          <div
            key={v.id}
            data-vertical={v.id}
            className="rounded-surface border-surface-w border-border bg-surface p-card-pad shadow-surface"
          >
            <p className="type-eyebrow text-muted">{v.id}</p>
            <h2 className="type-display-sm mt-cluster-gap">{v.label}</h2>
            <p className="mt-cluster-gap text-muted">{v.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-grid-gap md:grid-cols-2">
        {TIERS.map((tier, i) => (
          <div key={tier.title} className="border-t-surface-w border-border pt-row-pad">
            <p className="type-eyebrow text-muted">Tier {i + 1}</p>
            <h2 className="type-display-sm mt-cluster-gap">{tier.title}</h2>
            <ul className="mt-row-pad flex flex-wrap gap-cluster-gap">
              {tier.items.map((item) => (
                <li
                  key={item}
                  className="rounded-badge border-interactive-w border-border px-cluster-gap py-1 font-metric text-sm"
                >
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
