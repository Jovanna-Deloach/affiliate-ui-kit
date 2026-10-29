import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { productShoe01 } from "@/fixtures/products";
import { formatPrice } from "@/lib/format";
import { Labeled } from "@/stories/story-label";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { AffiliateAction } from "./affiliate-action";

const INTENTS = ["primary-cta", "merchant-outline", "price-pill", "inline-editorial"] as const;
const MOTIONS = ["arrow-nudge", "shimmer", "flat"] as const;
const offer = productShoe01.offers[0]!;

const attribution = {
  source: "kit",
  medium: "affiliate",
  campaign: "best-daily-trainers-2026",
  content: "scorecard-cta",
  subId: `${productShoe01.id}|pos-1`,
};

const meta = {
  title: "Tier 1 · Monetization/AffiliateAction",
  component: AffiliateAction,
  parameters: { layout: "fullscreen" },
  args: {
    href: offer.affiliateUrl,
    attribution,
    tracking: { merchant: offer.merchantName, offerId: offer.id, productId: productShoe01.id, placement: "story" },
    onTrack: fn(),
    children: `Shop at ${offer.merchantName}`,
    intent: "primary-cta",
    motion: "arrow-nudge",
    size: "md",
    newTab: true,
    arrow: true,
  },
  argTypes: {
    intent: { control: "select", options: INTENTS },
    motion: { control: "inline-radio", options: MOTIONS },
    size: { control: "inline-radio", options: ["sm", "md"] },
  },
} satisfies Meta<typeof AffiliateAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const IntentByMotionMatrix: Story = {
  name: "Variants · intent × motion",
  render: (args) => (
    <div className="grid gap-section-gap">
      {INTENTS.map((intent) => (
        <Labeled key={intent} label={`intent="${intent}" · motion = ${MOTIONS.join(" | ")}`}>
          <div className="flex flex-wrap items-center gap-cluster-gap">
            {MOTIONS.map((motion) => (
              <AffiliateAction key={motion} {...args} intent={intent} motion={motion}>
                {intent === "price-pill" ? formatPrice(offer.price) : intent === "inline-editorial" ? `${offer.merchantName} · ${formatPrice(offer.price)}` : `Shop at ${offer.merchantName}`}
              </AffiliateAction>
            ))}
          </div>
        </Labeled>
      ))}
    </div>
  ),
};

export const Compliance: Story = {
  name: "Compliance · rel / target / UTM injection (inspect the DOM)",
  render: (args) => (
    <div className="flex max-w-2xl flex-col gap-row-pad">
      <AffiliateAction {...args} rel="noreferrer" />
      <dl className="grid grid-cols-[auto_1fr] gap-x-row-pad gap-y-[0.4em] text-xs text-foreground">
        <dt className="type-label-mono text-muted">rel</dt>
        <dd>sponsored nofollow noopener noreferrer — consumer rel merged, mandatory tokens never dropped</dd>
        <dt className="type-label-mono text-muted">target</dt>
        <dd>_blank + visually-hidden &quot;(opens in a new tab)&quot;</dd>
        <dt className="type-label-mono text-muted">href</dt>
        <dd className="break-all">{offer.affiliateUrl}&amp;utm_source=kit&amp;utm_medium=affiliate&amp;utm_campaign=…&amp;subId=…</dd>
        <dt className="type-label-mono text-muted">tracking</dt>
        <dd>onClick (primary) + onAuxClick button 1 (middle-click) → onTrack + window affiliate:click</dd>
      </dl>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Variants · size + fullWidth",
  render: (args) => (
    <div className="flex max-w-sm flex-col items-start gap-section-gap">
      <Labeled label='size="sm"'>
        <AffiliateAction {...args} size="sm">Shop at {offer.merchantName}</AffiliateAction>
      </Labeled>
      <Labeled label='size="md"'>
        <AffiliateAction {...args} size="md">Shop at {offer.merchantName}</AffiliateAction>
      </Labeled>
      <Labeled label="fullWidth">
        <AffiliateAction {...args} fullWidth>Shop at {offer.merchantName}</AffiliateAction>
      </Labeled>
      <Labeled label='intent="merchant-outline" · motion="flat" · arrow={false}'>
        <AffiliateAction {...args} intent="merchant-outline" fullWidth motion="flat" arrow={false}>Compare {productShoe01.offers.length} retailers</AffiliateAction>
      </Labeled>
    </div>
  ),
};

export const AsChild: Story = {
  name: "Polymorphic · asChild (compliance applied to the child)",
  render: (args) => (
    <AffiliateAction {...args} asChild intent="inline-editorial">
      <a href="ignored-by-slot" data-testid="custom-anchor">
        Read the full retailer breakdown
      </a>
    </AffiliateAction>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: (args) => (
    <VerticalCompare>
      <div className="flex flex-wrap items-center gap-cluster-gap">
        {INTENTS.map((intent) => (
          <AffiliateAction key={intent} {...args} intent={intent}>
            {intent === "price-pill" ? formatPrice(offer.price) : `Shop at ${offer.merchantName}`}
          </AffiliateAction>
        ))}
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: (args) => (
    <ViewportFrames
      render={({ width }) => (
        <div className={width === 375 ? "flex flex-col gap-3" : "flex flex-wrap gap-6"}>
          <AffiliateAction {...args} fullWidth={width === 375}>Shop at {offer.merchantName}</AffiliateAction>
          <AffiliateAction {...args} intent="merchant-outline" fullWidth={width === 375}>Compare 4 retailers</AffiliateAction>
          <AffiliateAction {...args} intent="price-pill">{formatPrice(offer.price)}</AffiliateAction>
        </div>
      )}
    />
  ),
};
