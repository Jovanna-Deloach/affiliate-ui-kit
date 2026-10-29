import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { productShoe01 } from "@/fixtures/products";
import { formatPrice } from "@/lib/format";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { AffiliateAction } from "./affiliate-action";

const INTENTS = ["primary", "outline", "ghost", "price", "inline"] as const;
const MOTIONS = ["arrow-nudge", "shimmer", "flat"] as const;
const INTENT_NAMES = { primary: "Primary — inverse", outline: "Outline", ghost: "Ghost", price: "Price chip", inline: "Inline link" } as const;
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
    intent: "primary",
    motion: "arrow-nudge",
    size: "md",
    width: "auto",
    newTab: true,
    arrow: true,
  },
  argTypes: {
    intent: { control: "select", options: INTENTS },
    motion: { control: "inline-radio", options: MOTIONS },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    width: { control: "inline-radio", options: ["auto", "cta", "full"] },
  },
} satisfies Meta<typeof AffiliateAction>;

export default meta;
type Story = StoryObj<typeof meta>;

function labelFor(intent: (typeof INTENTS)[number]) {
  if (intent === "price") return formatPrice(offer.price);
  if (intent === "inline") return `${offer.merchantName} · ${formatPrice(offer.price)}`;
  if (intent === "ghost") return "Check stock";
  return `Shop at ${offer.merchantName}`;
}

export const Playground: Story = {};

export const IntentByMotion: Story = {
  name: "Intent × motion",
  render: (args) => (
    <div className="grid gap-section">
      {INTENTS.map((intent) => (
        <Specimen key={intent} caption={`${INTENT_NAMES[intent]} · arrow nudge, shimmer, flat`}>
          <div className="flex flex-wrap items-center gap-cluster">
            {MOTIONS.map((motion) => (
              <AffiliateAction key={motion} {...args} intent={intent} motion={motion} arrow={intent !== "ghost"}>
                {labelFor(intent)}
              </AffiliateAction>
            ))}
          </div>
        </Specimen>
      ))}
    </div>
  ),
};

export const Keylines: Story = {
  name: "Fixed 148px CTA keyline — labels never shift the column",
  render: (args) => (
    <ul className="m-0 flex max-w-sm list-none flex-col divide-y divide-hairline border-y border-hairline p-0">
      {(
        [
          ["primary", "View deal"],
          ["outline", "View deal"],
          ["outline", "Enquire"],
          ["ghost", "Check stock"],
        ] as const
      ).map(([intent, label], i) => (
        <li key={i} className="grid grid-cols-[minmax(0,1fr)_var(--keyline-cta)] items-center gap-x-stack py-row">
          <span className="type-metric text-body text-ink">{formatPrice(189 + i * 10)}</span>
          <AffiliateAction {...args} intent={intent} width="cta" arrow={intent !== "ghost"}>
            {label}
          </AffiliateAction>
        </li>
      ))}
    </ul>
  ),
};

export const Compliance: Story = {
  name: "Compliance · rel / target / UTM injection (inspect the DOM)",
  render: (args) => (
    <div className="flex max-w-2xl flex-col gap-stack">
      <AffiliateAction {...args} rel="noreferrer" />
      <dl className="m-0 grid grid-cols-[var(--keyline-label)_minmax(0,1fr)] gap-x-stack gap-y-cluster text-body-sm text-ink">
        <dt className="type-mono text-ink-tertiary">rel</dt>
        <dd className="m-0">sponsored nofollow noopener noreferrer — consumer rel merged, mandatory tokens never dropped</dd>
        <dt className="type-mono text-ink-tertiary">target</dt>
        <dd className="m-0">_blank + visually-hidden &quot;(opens in a new tab)&quot;</dd>
        <dt className="type-mono text-ink-tertiary">href</dt>
        <dd className="m-0 break-all">{offer.affiliateUrl}&amp;utm_source=kit&amp;utm_medium=affiliate&amp;utm_campaign=…&amp;subId=…</dd>
        <dt className="type-mono text-ink-tertiary">tracking</dt>
        <dd className="m-0">onClick (primary) + onAuxClick button 1 (middle-click) → onTrack + window affiliate:click</dd>
      </dl>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes and widths",
  render: (args) => (
    <div className="flex max-w-sm flex-col items-start gap-section">
      <Specimen caption="Small · 28px">
        <AffiliateAction {...args} size="sm">
          Shop at {offer.merchantName}
        </AffiliateAction>
      </Specimen>
      <Specimen caption="Medium · 36px">
        <AffiliateAction {...args} size="md">
          Shop at {offer.merchantName}
        </AffiliateAction>
      </Specimen>
      <Specimen caption="Large · 44px, full width">
        <AffiliateAction {...args} size="lg" width="full">
          Shop at {offer.merchantName}
        </AffiliateAction>
      </Specimen>
      <Specimen caption="Outline · flat · no arrow">
        <AffiliateAction {...args} intent="outline" width="full" motion="flat" arrow={false}>
          Compare {productShoe01.offers.length} retailers
        </AffiliateAction>
      </Specimen>
    </div>
  ),
};

export const AsChild: Story = {
  name: "Polymorphic · asChild (compliance applied to the child)",
  render: (args) => (
    <AffiliateAction {...args} asChild intent="inline">
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
      <div className="flex flex-wrap items-center gap-cluster">
        {INTENTS.map((intent) => (
          <AffiliateAction key={intent} {...args} intent={intent} arrow={intent !== "ghost"}>
            {labelFor(intent)}
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
          <AffiliateAction {...args} width={width === 375 ? "full" : "cta"}>
            View deal
          </AffiliateAction>
          <AffiliateAction {...args} intent="outline" width={width === 375 ? "full" : "cta"}>
            Compare 4 retailers
          </AffiliateAction>
          <AffiliateAction {...args} intent="price">
            {formatPrice(offer.price)}
          </AffiliateAction>
        </div>
      )}
    />
  ),
};
