import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Award } from "lucide-react";

import { bestPrice, directoryProducts, productShoe01 } from "@/fixtures/products";
import { formatScore } from "@/lib/format";
import { AffiliateAction } from "@/primitives/affiliate-action";
import { AwardBadge } from "@/primitives/award-badge";
import { ProductMediaFrame } from "@/primitives/product-media-frame";
import { ScoreMeter } from "@/primitives/score-meter";
import { Labeled } from "@/stories/story-label";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import {
  SurfaceCard,
  SurfaceCardDivider,
  SurfaceCardFooter,
  SurfaceCardMedia,
} from "./surface-card";

const CHROMINGS = ["bordered", "hairline-divide", "elevated", "spotlight-hover", "ghost"] as const;
const DENSITIES = ["compact", "default", "spacious"] as const;
const FOOTERS = ["inline", "hairline-bar", "action-bar"] as const;

const best = productShoe01.offers[0]!;
const retailerCount = productShoe01.offers.length;

const meta = {
  title: "Tier 3 · Surface & Media/SurfaceCard",
  component: SurfaceCard,
  parameters: { layout: "fullscreen" },
  args: {
    chroming: "bordered",
    density: "default",
    interactive: false,
  },
  argTypes: {
    chroming: { control: "select", options: CHROMINGS },
    density: { control: "select", options: DENSITIES },
    as: { control: "select", options: ["div", "article", "section", "li", "aside"] },
  },
} satisfies Meta<typeof SurfaceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Price + "Compare N retailers →" — the recessed action well at the foot of a scorecard. */
function CompareFooter({ variant = "action-bar" }: { variant?: (typeof FOOTERS)[number] }) {
  return (
    <SurfaceCardFooter variant={variant}>
      <span className="flex items-baseline gap-[0.4em]">
        <span className="type-price text-base text-foreground">{bestPrice(productShoe01)}</span>
        <span className="text-xs text-muted">from {best.merchantName}</span>
      </span>
      <AffiliateAction
        href={best.affiliateUrl}
        intent="inline-editorial"
        size="sm"
        tracking={{ merchant: best.merchantName, offerId: best.id, productId: productShoe01.id, placement: "card-footer" }}
        className="text-sm"
      >
        Compare {retailerCount} retailers
      </AffiliateAction>
    </SurfaceCardFooter>
  );
}

function CardContent({ footer = "action-bar" }: { footer?: (typeof FOOTERS)[number] }) {
  return (
    <>
      <p className="type-eyebrow text-muted">{productShoe01.eyebrow}</p>
      <h3 className="type-display-sm">
        {productShoe01.brand} {productShoe01.name}
      </h3>
      <p className="text-muted">{productShoe01.verdictSummary}</p>
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

export const AllChromings: Story = {
  name: "Variants · chroming",
  render: () => (
    <div className="grid items-start gap-grid-gap md:grid-cols-2 xl:grid-cols-3">
      {CHROMINGS.map((chroming) => (
        <Labeled key={chroming} label={`chroming="${chroming}"`}>
          <SurfaceCard chroming={chroming} as="article">
            <CardContent footer={chroming === "hairline-divide" || chroming === "ghost" ? "inline" : "action-bar"} />
          </SurfaceCard>
        </Labeled>
      ))}
    </div>
  ),
};

export const AllDensities: Story = {
  name: "Variants · density",
  render: () => (
    <div className="grid items-start gap-grid-gap md:grid-cols-3">
      {DENSITIES.map((density) => (
        <Labeled key={density} label={`density="${density}"`}>
          <SurfaceCard density={density} as="article">
            <CardContent />
          </SurfaceCard>
        </Labeled>
      ))}
    </div>
  ),
};

export const FooterVariants: Story = {
  name: "Slots · footer (inline · hairline-bar · action-bar)",
  render: () => (
    <div className="grid items-start gap-grid-gap md:grid-cols-3">
      {FOOTERS.map((footer) => (
        <Labeled key={footer} label={`<SurfaceCardFooter variant="${footer}">`}>
          <SurfaceCard as="article">
            <CardContent footer={footer} />
          </SurfaceCard>
        </Labeled>
      ))}
    </div>
  ),
};

export const WithBleedMedia: Story = {
  name: "Slots · media bleed + action-bar footer",
  render: () => (
    <div className="grid items-start gap-grid-gap md:grid-cols-3">
      {DENSITIES.map((density) => (
        <Labeled key={density} label={`density="${density}"`}>
          <SurfaceCard density={density} as="article" interactive>
            <SurfaceCardMedia>
              <ProductMediaFrame
                as="div"
                media={productShoe01.media}
                hover="secondary-angle-swap"
                badge={<AwardBadge shape="glass-pill" badge={productShoe01.awardBadge} icon={Award} />}
              />
            </SurfaceCardMedia>
            <CardContent />
          </SurfaceCard>
        </Labeled>
      ))}
    </div>
  ),
};

export const HairlineStack: Story = {
  name: "Pattern · hairline-divide ranked list",
  render: () => (
    <ol className="max-w-2xl border-b-surface-w border-border">
      {directoryProducts.slice(0, 6).map((p) => (
        <SurfaceCard key={p.id} as="li" chroming="hairline-divide" density="compact">
          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-cluster-gap">
            <span className="type-label-mono text-muted">{String(p.rank).padStart(2, "0")}</span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground">
                {p.brand} {p.name}
              </span>
              <span className="truncate text-xs text-muted">{p.eyebrow}</span>
            </span>
            <ScoreMeter score={p.overallScore!} visual="inline-bar" label={null} />
          </div>
        </SurfaceCard>
      ))}
    </ol>
  ),
};

export const DirectoryLoop30: Story = {
  name: "Perf · 30-item directory loop (zero JS)",
  render: () => (
    <ul className="grid grid-cols-2 items-start gap-grid-gap md:grid-cols-3 xl:grid-cols-5">
      {directoryProducts.map((p) => (
        <SurfaceCard key={p.id} as="li" chroming="spotlight-hover" density="compact" interactive>
          <SurfaceCardMedia>
            <ProductMediaFrame as="div" media={p.media} hover="subtle-zoom" />
          </SurfaceCardMedia>
          <p className="type-label-mono text-muted">{String(p.rank).padStart(2, "0")}</p>
          <p className="type-display-sm">{p.name}</p>
          <p className="truncate text-xs text-muted">{p.brand}</p>
          <SurfaceCardFooter variant="hairline-bar">
            <span className="type-price text-sm text-foreground">{bestPrice(p)}</span>
            <span className="type-price text-sm text-foreground">{formatScore(p.overallScore!)}</span>
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
      <div className="grid items-start gap-grid-gap sm:grid-cols-2">
        <SurfaceCard as="article" chroming="bordered">
          <CardContent />
        </SurfaceCard>
        <SurfaceCard as="article" chroming="spotlight-hover" interactive>
          <SurfaceCardMedia>
            <ProductMediaFrame
              as="div"
              media={productShoe01.media}
              badge={<AwardBadge shape="glass-pill" badge={productShoe01.awardBadge} icon={Award} />}
            />
          </SurfaceCardMedia>
          <CardContent />
        </SurfaceCard>
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 (2-col) vs 1280 (4-col)",
  render: () => (
    <ViewportFrames
      render={({ grid }) => (
        <div className={`${grid} items-start`}>
          {directoryProducts.slice(0, 4).map((p) => (
            <SurfaceCard key={p.id} as="article" density="compact">
              <SurfaceCardMedia>
                <ProductMediaFrame as="div" media={p.media} />
              </SurfaceCardMedia>
              <p className="type-label-mono text-muted">{String(p.rank).padStart(2, "0")}</p>
              <p className="type-display-sm">{p.name}</p>
              <SurfaceCardFooter variant="hairline-bar">
                <span className="type-price text-sm text-foreground">{bestPrice(p)}</span>
                <span className="type-price text-sm text-foreground">{formatScore(p.overallScore!)}</span>
              </SurfaceCardFooter>
            </SurfaceCard>
          ))}
        </div>
      )}
    />
  ),
};
