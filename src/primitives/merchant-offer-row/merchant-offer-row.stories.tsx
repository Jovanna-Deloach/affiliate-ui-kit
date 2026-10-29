import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { productCreatine, productShoe01, productWatch } from "@/fixtures/products";
import { SurfaceCard } from "@/primitives/surface-card";
import { Specimen } from "@/stories/specimen";
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
    <ul className="m-0 max-w-2xl list-none border-y border-hairline p-0">
      <MerchantOfferRow {...args} />
    </ul>
  ),
};

export const ComparisonList: Story = {
  name: "Comparison list — five keylines",
  render: () => (
    <div className="max-w-2xl">
      <MerchantOfferList offers={offers} rowProps={{ productId: productShoe01.id, placement: "offer-list" }} />
    </div>
  ),
};

export const DensityAndHighlight: Story = {
  name: "Density × highlight",
  render: () => (
    <div className="grid items-start gap-grid lg:grid-cols-2">
      {(["comfortable", "compact"] as const).map((density) => (
        <Specimen key={density} caption={density === "compact" ? "Compact rows" : "Comfortable rows"}>
          <ul className="m-0 list-none divide-y divide-hairline border-y border-hairline p-0">
            <MerchantOfferRow offer={bestOffer} referencePrice={reference} density={density} highlight="best-price" />
            <MerchantOfferRow offer={partnerOffer} referencePrice={reference} density={density} highlight="primary-partner" />
            <MerchantOfferRow offer={plainOffer} referencePrice={reference} density={density} highlight="none" />
            <MerchantOfferRow offer={outOfStockOffer} referencePrice={reference} density={density} highlight="none" />
          </ul>
        </Specimen>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-section">
      <Specimen caption="Out of stock — dimmed, struck price, ghost action">
        <ul className="m-0 list-none border-y border-hairline p-0">
          <MerchantOfferRow offer={outOfStockOffer} referencePrice={reference} />
        </ul>
      </Specimen>
      <Specimen caption="Was-price, promo and shipping note">
        <ul className="m-0 list-none border-y border-hairline p-0">
          <MerchantOfferRow offer={bestOffer} referencePrice={reference} highlight="none" />
        </ul>
      </Specimen>
      <Specimen caption="No reference price — no delta subtitle">
        <ul className="m-0 list-none border-y border-hairline p-0">
          <MerchantOfferRow offer={productCreatine.offers[0]!} />
        </ul>
      </Specimen>
      <Specimen caption="Custom action label">
        <ul className="m-0 list-none border-y border-hairline p-0">
          <MerchantOfferRow offer={productWatch.offers[0]!} ctaLabel="Enquire" />
        </ul>
      </Specimen>
    </div>
  ),
};

export const InsideSurfaceCard: Story = {
  name: "Inside a card and a sidebar",
  render: () => (
    <div className="grid items-start gap-grid lg:grid-cols-[minmax(0,1fr)_22rem]">
      <SurfaceCard as="section">
        <p className="type-eyebrow m-0 text-ink-tertiary">Where to buy</p>
        <MerchantOfferList offers={offers} rowProps={{ productId: productShoe01.id }} />
      </SurfaceCard>
      <SurfaceCard as="aside" density="compact">
        <p className="type-eyebrow m-0 text-ink-tertiary">Best prices</p>
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
  name: "Responsive · 375 vs 1280",
  render: () => (
    <ViewportFrames render={() => <MerchantOfferList offers={offers} rowProps={{ productId: productShoe01.id }} />} />
  ),
};
