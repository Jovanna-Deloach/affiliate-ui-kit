import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Award } from "lucide-react";

import { bestPrice, directoryProducts, productShoe01 } from "@/fixtures/products";
import { AwardBadge } from "@/primitives/award-badge";
import { ProductMediaFrame } from "@/primitives/product-media-frame";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import {
  SurfaceCard,
  SurfaceCardDivider,
  SurfaceCardFooter,
  SurfaceCardMedia,
} from "./surface-card";

const CHROMINGS = ["bordered", "hairline-divide", "elevated", "spotlight-hover", "ghost"] as const;
const DENSITIES = ["compact", "default", "spacious"] as const;

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

function CardContent() {
  return (
    <>
      <p className="type-eyebrow text-muted">{productShoe01.eyebrow}</p>
      <h3 className="type-display-sm">
        {productShoe01.brand} {productShoe01.name}
      </h3>
      <p className="text-muted">{productShoe01.verdictSummary}</p>
      <SurfaceCardDivider />
      <SurfaceCardFooter>
        <span className="type-metric">{bestPrice(productShoe01)}</span>
        <span className="type-label-mono text-muted">4 retailers</span>
      </SurfaceCardFooter>
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
    <div className="grid gap-grid-gap md:grid-cols-2 xl:grid-cols-3">
      {CHROMINGS.map((chroming) => (
        <SurfaceCard key={chroming} chroming={chroming} as="article">
          <code className="type-label-mono text-muted">chroming=&quot;{chroming}&quot;</code>
          <CardContent />
        </SurfaceCard>
      ))}
    </div>
  ),
};

export const AllDensities: Story = {
  name: "Variants · density",
  render: () => (
    <div className="grid gap-grid-gap md:grid-cols-3">
      {DENSITIES.map((density) => (
        <SurfaceCard key={density} density={density} as="article">
          <code className="type-label-mono text-muted">density=&quot;{density}&quot;</code>
          <CardContent />
        </SurfaceCard>
      ))}
    </div>
  ),
};

export const WithBleedMedia: Story = {
  name: "Slots · media bleed + divider + footer",
  render: () => (
    <div className="grid gap-grid-gap md:grid-cols-3">
      {DENSITIES.map((density) => (
        <SurfaceCard key={density} density={density} as="article" interactive>
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
      ))}
    </div>
  ),
};

export const HairlineStack: Story = {
  name: "Pattern · hairline-divide list",
  render: () => (
    <ul className="max-w-2xl border-b-surface-w border-border">
      {directoryProducts.slice(0, 5).map((p) => (
        <SurfaceCard key={p.id} as="li" chroming="hairline-divide" density="compact">
          <div className="flex items-baseline justify-between gap-cluster-gap">
            <span className="type-display-sm">
              {p.rank}. {p.brand} {p.name}
            </span>
            <span className="type-metric">{p.overallScore}</span>
          </div>
        </SurfaceCard>
      ))}
    </ul>
  ),
};

export const DirectoryLoop30: Story = {
  name: "Perf · 30-item directory loop (zero JS)",
  render: () => (
    <ul className="grid grid-cols-2 gap-grid-gap md:grid-cols-3 xl:grid-cols-5">
      {directoryProducts.map((p) => (
        <SurfaceCard key={p.id} as="li" chroming="spotlight-hover" density="compact" interactive>
          <SurfaceCardMedia>
            <ProductMediaFrame as="div" media={p.media} hover="subtle-zoom" />
          </SurfaceCardMedia>
          <p className="type-label-mono text-muted">#{p.rank}</p>
          <p className="type-display-sm">{p.name}</p>
          <SurfaceCardFooter>
            <span className="type-metric">{p.overallScore}</span>
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
      <div className="grid gap-grid-gap sm:grid-cols-2">
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
        <div className={grid}>
          {directoryProducts.slice(0, 4).map((p) => (
            <SurfaceCard key={p.id} as="article" density="compact">
              <SurfaceCardMedia>
                <ProductMediaFrame as="div" media={p.media} />
              </SurfaceCardMedia>
              <p className="type-label-mono text-muted">#{p.rank}</p>
              <p className="type-display-sm">{p.name}</p>
            </SurfaceCard>
          ))}
        </div>
      )}
    />
  ),
};
