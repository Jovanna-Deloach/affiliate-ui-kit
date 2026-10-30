import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { authorEditorial, methodologyEditorial } from "@/fixtures/authors";
import { bestPrice, productShoe01, productWatch } from "@/fixtures/products";
import { formatDate } from "@/lib/format";
import { AffiliateAction } from "@/primitives/affiliate-action";
import { AuthorityByline } from "@/primitives/authority-byline";
import { AwardBadge } from "@/primitives/award-badge";
import { Button } from "@/primitives/button";
import { MerchantOfferList } from "@/primitives/merchant-offer-row";
import { ProductMediaFrame } from "@/primitives/product-media-frame";
import { ScoreMeter } from "@/primitives/score-meter";
import { VerticalCompare } from "@/stories/vertical-compare";

import { ResponsiveSheet } from "./responsive-sheet";

const SIZES = ["compact-offer-sheet", "half-screen-dossier"] as const;
const best = productShoe01.offers[0]!;

function OffersBody() {
  return (
    <div className="flex flex-col gap-stack">
      <p className="m-0 text-body-sm text-ink-secondary">
        Prices verified {formatDate(productShoe01.lastVerifiedAt!)}. Commissions never affect rankings.
      </p>
      <MerchantOfferList offers={productShoe01.offers} rowProps={{ productId: productShoe01.id, placement: "offer-sheet", density: "compact" }} />
    </div>
  );
}

const meta = {
  title: "Tier 5 · Conversion & Tools/ResponsiveSheet",
  component: ResponsiveSheet,
  parameters: { layout: "fullscreen" },
  args: {
    title: `All retailers · ${productShoe01.name}`,
    description: `${productShoe01.offers.length} offers from ${bestPrice(productShoe01)}`,
    size: "compact-offer-sheet",
    side: "right",
    defaultOpen: false,
    children: <OffersBody />,
    trigger: <Button intent="outline">View all retailers</Button>,
    footer: (
      <AffiliateAction href={best.affiliateUrl} size="lg" width="full" tracking={{ merchant: best.merchantName, offerId: best.id, productId: productShoe01.id, placement: "offer-sheet-footer" }}>
        Shop best price · {bestPrice(productShoe01)}
      </AffiliateAction>
    ),
  },
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
    side: { control: "inline-radio", options: ["right", "left"] },
    children: { control: false },
    trigger: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof ResponsiveSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="flex flex-col gap-cluster">
      <p className="m-0 text-body-sm text-ink-secondary">Resize below 768px for the vaul bottom sheet; above it, the Radix slide-over.</p>
      <div>
        <ResponsiveSheet {...args} />
      </div>
    </div>
  ),
};

export const OpenCompactOfferSheet: Story = {
  name: "Open · compact offer sheet",
  args: { defaultOpen: true },
  render: (args) => (
    <div className="min-h-[60dvh]">
      <ResponsiveSheet {...args} />
    </div>
  ),
};

export const OpenHalfScreenDossier: Story = {
  name: "Open · half-screen dossier (snap 55% → 100% on mobile)",
  args: {
    defaultOpen: true,
    size: "half-screen-dossier",
    title: `${productWatch.brand} ${productWatch.name}`,
    description: productWatch.eyebrow,
    trigger: <Button intent="outline">Open dossier</Button>,
    footer: (
      <AffiliateAction href={productWatch.offers[0]!.affiliateUrl} size="lg" width="full" tracking={{ merchant: productWatch.offers[0]!.merchantName, productId: productWatch.id, placement: "dossier-footer" }}>
        Shop at {productWatch.offers[0]!.merchantName} · {bestPrice(productWatch)}
      </AffiliateAction>
    ),
    children: (
      <div className="flex flex-col gap-stack">
        <ProductMediaFrame media={productWatch.media} badge={<AwardBadge surface="glass" badge={productWatch.awardBadge} />} />
        <ScoreMeter score={productWatch.overallScore!} subScores={productWatch.subScores} label="Editor score" />
        <p className="m-0 text-body leading-body text-ink-secondary">{productWatch.verdictSummary}</p>
        <AuthorityByline author={authorEditorial} verifiedAt={productWatch.lastVerifiedAt} methodology={methodologyEditorial} variant="verified-strip" />
      </div>
    ),
  },
  render: (args) => (
    <div className="min-h-[60dvh]">
      <ResponsiveSheet {...args} />
    </div>
  ),
};

export const LeftSide: Story = {
  name: "Left side (desktop)",
  args: { defaultOpen: true, side: "left" },
  render: (args) => (
    <div className="min-h-[60dvh]">
      <ResponsiveSheet {...args} />
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side (triggers; open one to compare)",
  render: (args) => <VerticalCompare render={() => <ResponsiveSheet {...args} />} />,
};
