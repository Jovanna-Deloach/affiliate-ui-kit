import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { productCreatine, productShoe01, productWatch } from "@/fixtures/products";
import { SurfaceCard } from "@/primitives/surface-card";
import { Labeled } from "@/stories/story-label";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { MerchantOfferList, MerchantOfferRow } from "./merchant-offer-row";

const offers = productShoe01.offers;
const reference = Math.min(...offers.filter((o) => o.inStock).map((o) => o.price));
const [bestOffer, partnerOffer, outOfStockOffer, plainOffer] = offers as [
  (typeof offers)[number],
  (typeof offers)[number],
  (typeof offers)[number],
  (typeof offers)[number],
];

const meta = {
  title: "Tier 1 · Monetization/MerchantOfferRow",
  component: MerchantOfferRow,
  parameters: { layout: "fullscreen" },
  args: {
    offer: bestOffer,
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
    <ul className="max-w-2xl border-b-surface-w border-border-soft">
      <MerchantOfferRow {...args} />
    </ul>
  ),
};

export const ComparisonList: Story = {
  name: "Pattern · full comparison list (auto highlight, shipping / delta subtitles)",
  render: () => (
    <div className="max-w-2xl">
      <MerchantOfferList offers={offers} rowProps={{ productId: productShoe01.id, placement: "offer-list" }} />
    </div>
  ),
};

export const DensityAndHighlight: Story = {
  name: "Variants · density × highlight",
  render: () => (
    <div className="grid items-start gap-grid-gap lg:grid-cols-2">
      {(["comfortable", "compact"] as const).map((density) => (
        <Labeled key={density} label={`density="${density}"`}>
          <ul className="border-b-surface-w border-border-soft">
            <MerchantOfferRow offer={bestOffer} referencePrice={reference} density={density} highlight="best-price" />
            <MerchantOfferRow offer={partnerOffer} referencePrice={reference} density={density} highlight="primary-partner" />
            <MerchantOfferRow offer={plainOffer} referencePrice={reference} density={density} highlight="none" />
            <MerchantOfferRow offer={outOfStockOffer} referencePrice={reference} density={density} highlight="none" />
          </ul>
        </Labeled>
      ))}
    </div>
  ),
};

export const States: Story = {
  name: "States · out of stock · strikethrough + promo · no reference price · custom CTA",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-section-gap">
      <Labeled label="inStock=false → dimmed, struck price, ghost “Check stock”">
        <ul className="border-b-surface-w border-border-soft">
          <MerchantOfferRow offer={outOfStockOffer} referencePrice={reference} />
        </ul>
      </Labeled>
      <Labeled label="originalPrice + promoDescription + shippingNote">
        <ul className="border-b-surface-w border-border-soft">
          <MerchantOfferRow offer={bestOffer} referencePrice={reference} highlight="none" />
        </ul>
      </Labeled>
      <Labeled label="no referencePrice → no delta subtitle">
        <ul className="border-b-surface-w border-border-soft">
          <MerchantOfferRow offer={productCreatine.offers[0]!} />
        </ul>
      </Labeled>
      <Labeled label='ctaLabel="Enquire"'>
        <ul className="border-b-surface-w border-border-soft">
          <MerchantOfferRow offer={productWatch.offers[0]!} ctaLabel="Enquire" />
        </ul>
      </Labeled>
    </div>
  ),
};

export const InsideSurfaceCard: Story = {
  name: "Composition · inside SurfaceCard (sheet / sidebar width)",
  render: () => (
    <div className="grid items-start gap-grid-gap lg:grid-cols-[minmax(0,1fr)_22rem]">
      <SurfaceCard as="section">
        <p className="type-eyebrow text-muted">Where to buy</p>
        <MerchantOfferList offers={offers} rowProps={{ productId: productShoe01.id }} />
      </SurfaceCard>
      <SurfaceCard as="aside" density="compact">
        <p className="type-eyebrow text-muted">Best prices</p>
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
