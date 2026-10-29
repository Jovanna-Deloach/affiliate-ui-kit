import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Award } from "lucide-react";

import { bestPrice, directoryProducts, productShoe01 } from "@/fixtures/products";
import { formatScore } from "@/lib/format";
import { AffiliateAction } from "@/primitives/affiliate-action";
import { AwardBadge } from "@/primitives/award-badge";
import { ProductMediaFrame } from "@/primitives/product-media-frame";
import { ScoreMeter } from "@/primitives/score-meter";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { SurfaceCard, SurfaceCardDivider, SurfaceCardFooter, SurfaceCardMedia } from "./surface-card";

const CHROMINGS = ["bordered", "elevated", "recessed", "spotlight", "hairline-divide", "ghost"] as const;
const DENSITIES = ["compact", "default", "spacious"] as const;
const FOOTERS = ["inline", "hairline-bar", "action-bar"] as const;
const NAMES = {
  bordered: "Bordered",
  elevated: "Elevated",
  recessed: "Recessed well",
  spotlight: "Spotlight hover",
  "hairline-divide": "Hairline divide",
  ghost: "Ghost",
  compact: "Compact · 16px",
  default: "Default · 24px",
  spacious: "Spacious · 32px",
  inline: "Inline footer",
  "hairline-bar": "Hairline bar",
  "action-bar": "Recessed action bar",
} as const;

const best = productShoe01.offers[0]!;
const retailerCount = productShoe01.offers.length;

const meta = {
  title: "Tier 3 · Surface & Media/SurfaceCard",
  component: SurfaceCard,
  parameters: { layout: "fullscreen" },
  args: { chroming: "bordered", density: "default", interactive: false },
  argTypes: {
    chroming: { control: "select", options: CHROMINGS },
    density: { control: "select", options: DENSITIES },
    as: { control: "select", options: ["div", "article", "section", "li", "aside"] },
  },
} satisfies Meta<typeof SurfaceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Price + "Compare N retailers →" — the recessed bar that anchors a scorecard. */
function CompareFooter({ variant = "action-bar" }: { variant?: (typeof FOOTERS)[number] }) {
  return (
    <SurfaceCardFooter variant={variant}>
      <span className="flex items-baseline gap-cluster">
        <span className="type-metric text-body text-ink">{bestPrice(productShoe01)}</span>
        <span className="text-caption text-ink-tertiary">from {best.merchantName}</span>
      </span>
      <AffiliateAction
        href={best.affiliateUrl}
        intent="inline"
        tracking={{ merchant: best.merchantName, offerId: best.id, productId: productShoe01.id, placement: "card-footer" }}
        className="text-body-sm"
      >
        Compare {retailerCount} retailers
      </AffiliateAction>
    </SurfaceCardFooter>
  );
}

function CardContent({ footer = "action-bar" }: { footer?: (typeof FOOTERS)[number] }) {
  return (
    <>
      <div className="flex flex-col gap-hairline">
        <p className="type-eyebrow m-0 text-ink-tertiary">{productShoe01.eyebrow}</p>
        <h3 className="type-title m-0">
          {productShoe01.brand} {productShoe01.name}
        </h3>
      </div>
      <p className="m-0 max-w-prose text-body-sm leading-body text-ink-secondary">{productShoe01.verdictSummary}</p>
      {footer === "inline" && <SurfaceCardDivider />}
      <CompareFooter variant={footer} />
    </>
  );
}

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-md">
      <SurfaceCard {...args}>
        <CardContent />
      </SurfaceCard>
    </div>
  ),
};

export const Chromings: Story = {
  name: "Chroming",
  render: () => (
    <div className="grid items-start gap-grid md:grid-cols-2 xl:grid-cols-3">
      {CHROMINGS.map((chroming) => (
        <Specimen key={chroming} caption={NAMES[chroming]}>
          <SurfaceCard chroming={chroming} as="article">
            <CardContent footer={chroming === "hairline-divide" || chroming === "ghost" || chroming === "recessed" ? "inline" : "action-bar"} />
          </SurfaceCard>
        </Specimen>
      ))}
    </div>
  ),
};

export const Densities: Story = {
  name: "Density",
  render: () => (
    <div className="grid items-start gap-grid md:grid-cols-3">
      {DENSITIES.map((density) => (
        <Specimen key={density} caption={NAMES[density]}>
          <SurfaceCard density={density} as="article">
            <CardContent />
          </SurfaceCard>
        </Specimen>
      ))}
    </div>
  ),
};

export const Footers: Story = {
  name: "Footer slot",
  render: () => (
    <div className="grid items-start gap-grid md:grid-cols-3">
      {FOOTERS.map((footer) => (
        <Specimen key={footer} caption={NAMES[footer]}>
          <SurfaceCard as="article">
            <CardContent footer={footer} />
          </SurfaceCard>
        </Specimen>
      ))}
    </div>
  ),
};

export const WithBleedMedia: Story = {
  name: "Media bleed + action bar",
  render: () => (
    <div className="grid items-start gap-grid md:grid-cols-3">
      {DENSITIES.map((density) => (
        <Specimen key={density} caption={NAMES[density]}>
          <SurfaceCard density={density} as="article" interactive>
            <SurfaceCardMedia>
              <ProductMediaFrame
                as="div"
                media={productShoe01.media}
                hover="secondary-angle-swap"
                badge={<AwardBadge surface="glass" badge={productShoe01.awardBadge} icon={Award} />}
              />
            </SurfaceCardMedia>
            <CardContent />
          </SurfaceCard>
        </Specimen>
      ))}
    </div>
  ),
};

export const HairlineStack: Story = {
  name: "Ranked list (hairline-divide rows)",
  render: () => (
    <ol className="m-0 max-w-2xl list-none border-b border-hairline p-0">
      {directoryProducts.slice(0, 6).map((p) => (
        <SurfaceCard key={p.id} as="li" chroming="hairline-divide" density="compact" className="py-row">
          <div className="grid grid-cols-[var(--keyline-rank)_minmax(0,1fr)_auto] items-center gap-x-stack">
            <span className="type-mono text-ink-tertiary">{String(p.rank).padStart(2, "0")}</span>
            <span className="flex min-w-0 flex-col gap-hairline">
              <span className="truncate text-body-sm font-medium text-ink">
                {p.brand} {p.name}
              </span>
              <span className="truncate text-caption text-ink-tertiary">{p.eyebrow}</span>
            </span>
            <ScoreMeter score={p.overallScore!} visual="inline-bar" label={null} />
          </div>
        </SurfaceCard>
      ))}
    </ol>
  ),
};

export const DirectoryLoop30: Story = {
  name: "30-item directory loop (zero JS)",
  render: () => (
    <ul className="m-0 grid list-none grid-cols-2 items-start gap-grid p-0 md:grid-cols-3 xl:grid-cols-5">
      {directoryProducts.map((p) => (
        <SurfaceCard key={p.id} as="li" chroming="spotlight" density="compact" interactive>
          <SurfaceCardMedia>
            <ProductMediaFrame as="div" media={p.media} hover="subtle-zoom" />
          </SurfaceCardMedia>
          <div className="flex flex-col gap-hairline">
            <span className="type-mono text-ink-tertiary">{String(p.rank).padStart(2, "0")}</span>
            <span className="type-title">{p.name}</span>
            <span className="truncate text-caption text-ink-tertiary">{p.brand}</span>
          </div>
          <SurfaceCardFooter variant="hairline-bar">
            <span className="type-metric text-body-sm text-ink">{bestPrice(p)}</span>
            <span className="type-metric text-body-sm text-ink">{formatScore(p.overallScore!)}</span>
          </SurfaceCardFooter>
        </SurfaceCard>
      ))}
    </ul>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="grid items-start gap-grid sm:grid-cols-2">
        <SurfaceCard as="article" chroming="bordered">
          <CardContent />
        </SurfaceCard>
        <SurfaceCard as="article" chroming="spotlight" interactive>
          <SurfaceCardMedia>
            <ProductMediaFrame
              as="div"
              media={productShoe01.media}
              badge={<AwardBadge surface="glass" badge={productShoe01.awardBadge} icon={Award} />}
            />
          </SurfaceCardMedia>
          <CardContent />
        </SurfaceCard>
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: () => (
    <ViewportFrames
      render={({ grid }) => (
        <div className={`${grid} items-start`}>
          {directoryProducts.slice(0, 4).map((p) => (
            <SurfaceCard key={p.id} as="article" density="compact">
              <SurfaceCardMedia>
                <ProductMediaFrame as="div" media={p.media} />
              </SurfaceCardMedia>
              <div className="flex flex-col gap-hairline">
                <span className="type-mono text-ink-tertiary">{String(p.rank).padStart(2, "0")}</span>
                <span className="type-title">{p.name}</span>
              </div>
              <SurfaceCardFooter variant="hairline-bar">
                <span className="type-metric text-body-sm text-ink">{bestPrice(p)}</span>
                <span className="type-metric text-body-sm text-ink">{formatScore(p.overallScore!)}</span>
              </SurfaceCardFooter>
            </SurfaceCard>
          ))}
        </div>
      )}
    />
  ),
};
