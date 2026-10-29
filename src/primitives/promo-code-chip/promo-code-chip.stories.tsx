import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { productCreatine, productShoe01, productShoe03 } from "@/fixtures/products";
import { MerchantOfferRow } from "@/primitives/merchant-offer-row";
import { SurfaceCard } from "@/primitives/surface-card";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { PromoCodeChip } from "./promo-code-chip";

const CHROMINGS = ["ticket", "recessed", "inline"] as const;
const NAMES = { ticket: "Perforated ticket", recessed: "Recessed chip", inline: "Inline" } as const;
const offer = productShoe01.offers[0]!;

const meta = {
  title: "Tier 1 · Monetization/PromoCodeChip",
  component: PromoCodeChip,
  parameters: { layout: "fullscreen" },
  args: {
    code: offer.promoCode!,
    description: offer.promoDescription,
    chroming: "ticket",
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

export const Chromings: Story = {
  name: "Chroming (click Copy to see the morph)",
  render: (args) => (
    <div className="flex flex-col gap-section">
      {CHROMINGS.map((chroming) => (
        <Specimen key={chroming} caption={`${NAMES[chroming]} · with outbound, copy only, small`}>
          <div className="flex flex-wrap items-center gap-cluster">
            <PromoCodeChip {...args} chroming={chroming} />
            <PromoCodeChip {...args} chroming={chroming} href={undefined} description={undefined} />
            <PromoCodeChip {...args} chroming={chroming} size="sm" href={undefined} />
          </div>
        </Specimen>
      ))}
    </div>
  ),
};

export const WithoutOutbound: Story = {
  name: "Copy only · long description truncates",
  render: (args) => (
    <div className="flex max-w-sm flex-col items-start gap-cluster">
      <PromoCodeChip {...args} href={undefined} description="Extra 10% at checkout on orders over $120, excludes sale items" />
      <PromoCodeChip {...args} href={undefined} code={productShoe03.offers[0]!.promoCode!} description={productShoe03.offers[0]!.promoDescription} chroming="recessed" />
    </div>
  ),
};

export const InOfferContext: Story = {
  name: "Beside a MerchantOfferRow",
  render: (args) => (
    <SurfaceCard as="section" className="max-w-2xl">
      <p className="type-eyebrow m-0 text-ink-tertiary">Best price today</p>
      <ul className="m-0 list-none border-y border-hairline p-0">
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
      <div className="flex flex-col items-start gap-cluster">
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
        <div className="flex flex-col items-start gap-cluster">
          <PromoCodeChip {...args} className="max-w-full" />
          <PromoCodeChip {...args} chroming="recessed" href={undefined} />
        </div>
      )}
    />
  ),
};
