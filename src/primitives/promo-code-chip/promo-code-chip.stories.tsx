import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { productCreatine, productShoe01, productShoe03 } from "@/fixtures/products";
import { MerchantOfferRow } from "@/primitives/merchant-offer-row";
import { SurfaceCard } from "@/primitives/surface-card";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { PromoCodeChip } from "./promo-code-chip";

const CHROMINGS = ["dashed-ticket", "pill-badge", "minimal-inline"] as const;
const offer = productShoe01.offers[0]!;

const meta = {
  title: "Tier 1 · Monetization/PromoCodeChip",
  component: PromoCodeChip,
  parameters: { layout: "fullscreen" },
  args: {
    code: offer.promoCode!,
    description: offer.promoDescription,
    chroming: "dashed-ticket",
    size: "md",
    href: offer.affiliateUrl,
    outboundLabel: "Shop with code",
    tracking: { merchant: offer.merchantName, offerId: offer.id, productId: productShoe01.id, placement: "promo-chip" },
    onCopy: fn(),
    timeout: 2000,
  },
  argTypes: {
    chroming: { control: "inline-radio", options: CHROMINGS },
    size: { control: "inline-radio", options: ["sm", "md"] },
    attribution: { control: false },
    tracking: { control: false },
  },
} satisfies Meta<typeof PromoCodeChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllChromings: Story = {
  name: "Variants · chroming (click Copy to see the morph)",
  render: (args) => (
    <div className="flex flex-col gap-section-gap">
      {CHROMINGS.map((chroming) => (
        <div key={chroming} className="flex flex-col gap-cluster-gap">
          <code className="type-label-mono text-muted">chroming=&quot;{chroming}&quot;</code>
          <div className="flex flex-wrap items-center gap-cluster-gap">
            <PromoCodeChip {...args} chroming={chroming} />
            <PromoCodeChip {...args} chroming={chroming} href={undefined} description={undefined} />
            <PromoCodeChip {...args} chroming={chroming} size="sm" href={undefined} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const WithoutOutbound: Story = {
  name: "Data · copy only, long description truncates",
  render: (args) => (
    <div className="flex max-w-sm flex-col items-start gap-cluster-gap">
      <PromoCodeChip {...args} href={undefined} description="Extra 10% at checkout on orders over $120, excludes sale items" />
      <PromoCodeChip {...args} href={undefined} code={productShoe03.offers[0]!.promoCode!} description={productShoe03.offers[0]!.promoDescription} chroming="pill-badge" />
    </div>
  ),
};

export const InOfferContext: Story = {
  name: "Composition · beside a MerchantOfferRow",
  render: (args) => (
    <SurfaceCard as="section" className="max-w-2xl">
      <p className="type-eyebrow text-muted">Best price today</p>
      <ul className="border-b-surface-w border-border">
        <MerchantOfferRow offer={offer} referencePrice={offer.price} />
      </ul>
      <PromoCodeChip {...args} />
    </SurfaceCard>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: (args) => (
    <VerticalCompare>
      <div className="flex flex-col items-start gap-cluster-gap">
        {CHROMINGS.map((chroming) => (
          <PromoCodeChip key={chroming} {...args} chroming={chroming} code={productCreatine.offers[0]!.promoCode!} description={productCreatine.offers[0]!.promoDescription} />
        ))}
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: (args) => (
    <ViewportFrames
      render={() => (
        <div className="flex flex-col items-start gap-cluster-gap">
          <PromoCodeChip {...args} className="max-w-full" />
          <PromoCodeChip {...args} chroming="pill-badge" href={undefined} />
        </div>
      )}
    />
  ),
};
