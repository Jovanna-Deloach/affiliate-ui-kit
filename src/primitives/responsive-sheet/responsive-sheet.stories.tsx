import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { authorEditorial, methodologyEditorial } from "@/fixtures/authors";
import { bestPrice, productShoe01, productWatch } from "@/fixtures/products";
import { AffiliateAction } from "@/primitives/affiliate-action";
import { AuthorityByline } from "@/primitives/authority-byline";
import { AwardBadge } from "@/primitives/award-badge";
import { MerchantOfferList } from "@/primitives/merchant-offer-row";
import { ProductMediaFrame } from "@/primitives/product-media-frame";
import { ScoreMeter } from "@/primitives/score-meter";
import { VerticalCompare } from "@/stories/vertical-compare";

import { ResponsiveSheet } from "./responsive-sheet";

const SIZES = ["compact-offer-sheet", "half-screen-dossier"] as const;
const best = productShoe01.offers[0]!;

function OpenButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="focus-ring inline-flex h-control cursor-pointer items-center gap-[0.5em] rounded-interactive border-interactive-w border-border-strong bg-surface px-[calc(var(--space-badge-x)*1.8)] type-eyebrow leading-none text-foreground transition-colors duration-interactive ease-spring hover:border-foreground hover:bg-accent-soft"
    >
      {label}
    </button>
  );
}

function OffersBody() {
  return (
    <div className="flex flex-col gap-row-pad">
      <p className="text-sm text-muted">
        Prices verified {new Date(productShoe01.lastVerifiedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}. Commissions never affect rankings.
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
    trigger: <OpenButton label="View all retailers" />,
    footer: (
      <AffiliateAction href={best.affiliateUrl} fullWidth tracking={{ merchant: best.merchantName, offerId: best.id, productId: productShoe01.id, placement: "offer-sheet-footer" }}>
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
    <div className="flex flex-col gap-cluster-gap">
      <p className="text-sm text-muted">Resize below 768px to get the vaul bottom sheet; above it, the Radix slide-over.</p>
      <div>
        <ResponsiveSheet {...args} />
      </div>
    </div>
  ),
};

export const OpenCompactOfferSheet: Story = {
  name: "Open · compact-offer-sheet (desktop slide-over / mobile bottom sheet)",
  args: { defaultOpen: true },
  render: (args) => (
    <div className="min-h-[60dvh]">
      <ResponsiveSheet {...args} />
    </div>
  ),
};

export const OpenHalfScreenDossier: Story = {
  name: "Open · half-screen-dossier (snap 55% → 100% on mobile)",
  args: {
    defaultOpen: true,
    size: "half-screen-dossier",
    title: `${productWatch.brand} ${productWatch.name}`,
    description: productWatch.eyebrow,
    trigger: <OpenButton label="Open dossier" />,
    footer: (
      <AffiliateAction href={productWatch.offers[0]!.affiliateUrl} fullWidth tracking={{ merchant: productWatch.offers[0]!.merchantName, productId: productWatch.id, placement: "dossier-footer" }}>
        Shop at {productWatch.offers[0]!.merchantName} · {bestPrice(productWatch)}
      </AffiliateAction>
    ),
    children: (
      <div className="flex flex-col gap-row-pad">
        <ProductMediaFrame media={productWatch.media} badge={<AwardBadge shape="glass-pill" badge={productWatch.awardBadge} />} />
        <ScoreMeter score={productWatch.overallScore!} subScores={productWatch.subScores} visual="tabular-row" label="Editor score" />
        <p className="text-sm leading-relaxed text-muted">{productWatch.verdictSummary}</p>
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
  name: "Variants · side=left (desktop)",
  args: { defaultOpen: true, side: "left" },
  render: (args) => (
    <div className="min-h-[60dvh]">
      <ResponsiveSheet {...args} />
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side (triggers; open one to compare)",
  render: (args) => (
    <VerticalCompare render={() => <ResponsiveSheet {...args} />} />
  ),
};
