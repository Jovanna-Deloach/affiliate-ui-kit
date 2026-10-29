import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { productCreatine, productShoe01, productWatch } from "@/fixtures/products";
import { SurfaceCard } from "@/primitives/surface-card";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { MerchantOfferList, MerchantOfferRow } from "./merchant-offer-row";

const offers = productShoe01.offers;
const reference = Math.min(...offers.filter((o) => o.inStock).map((o) => o.price));

const meta = {
  title: "Tier 1 · Monetization/MerchantOfferRow",
  component: MerchantOfferRow,
  parameters: { layout: "fullscreen" },
  args: {
    offer: offers[0]!,
    referencePrice: reference,
    density: "comfortable",
    highlight: "auto",
    productId: productShoe01.id,
    placement: "story",
    attribution: { source: "kit", medium: "affiliate", campaign: "best-daily-trainers-2026" },
  },
  argTypes: {
    density: { control: "inline-radio", options: ["compact", "comfortable"] },
    highlight: { control: "inline-radio", options: ["auto", "best-price", "primary-partner", "none"] },
    offer: { control: false },
    attribution: { control: false },
  },
} satisfies Meta<typeof MerchantOfferRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ul className="max-w-2xl border-b-surface-w border-border">
      <MerchantOfferRow {...args} />
    </ul>
  ),
};

export const ComparisonList: Story = {
  name: "Pattern · full comparison list (auto highlight, deltas)",
  render: () => (
    <div className="max-w-2xl">
      <MerchantOfferList offers={offers} rowProps={{ productId: productShoe01.id, placement: "offer-list" }} />
    </div>
  ),
};

export const DensityAndHighlight: Story = {
  name: "Variants · density × highlight",
  render: () => (
    <div className="grid gap-grid-gap lg:grid-cols-2">
      {(["comfortable", "compact"] as const).map((density) => (
        <div key={density}>
          <code className="type-label-mono text-muted">density=&quot;{density}&quot;</code>
          <ul className="mt-cluster-gap border-b-surface-w border-border">
            <MerchantOfferRow offer={offers[0]!} referencePrice={reference} density={density} highlight="best-price" />
            <MerchantOfferRow offer={offers[1]!} referencePrice={reference} density={density} highlight="primary-partner" />
            <MerchantOfferRow offer={offers[3]!} referencePrice={reference} density={density} highlight="none" />
            <MerchantOfferRow offer={offers[2]!} referencePrice={reference} density={density} highlight="none" />
          </ul>
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  name: "States · out of stock, no logo, promo, no reference price",
  render: () => (
    <ul className="max-w-2xl border-b-surface-w border-border">
      <MerchantOfferRow offer={offers[2]!} referencePrice={reference} />
      <MerchantOfferRow offer={offers[1]!} referencePrice={reference} showLogo={false} />
      <MerchantOfferRow offer={productCreatine.offers[0]!} />
      <MerchantOfferRow offer={productWatch.offers[0]!} ctaLabel="Enquire" />
    </ul>
  ),
};

export const InsideSurfaceCard: Story = {
  name: "Composition · inside SurfaceCard (sheet / sidebar width)",
  render: () => (
    <div className="grid gap-grid-gap lg:grid-cols-[minmax(0,1fr)_22rem]">
      <SurfaceCard as="section">
        <p className="type-eyebrow text-muted">Where to buy</p>
        <MerchantOfferList offers={offers} rowProps={{ productId: productShoe01.id }} />
      </SurfaceCard>
      <SurfaceCard as="aside" density="compact">
        <p className="type-eyebrow text-muted">Narrow container → CTA wraps</p>
        <MerchantOfferList offers={offers.slice(0, 3)} rowProps={{ density: "compact" }} />
      </SurfaceCard>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <MerchantOfferList offers={offers} rowProps={{ productId: productShoe01.id }} />
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 (stacked CTA) vs 1280 (single line)",
  render: () => (
    <ViewportFrames
      render={() => <MerchantOfferList offers={offers} rowProps={{ productId: productShoe01.id }} />}
    />
  ),
};
