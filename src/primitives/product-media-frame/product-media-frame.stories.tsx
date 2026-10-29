import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Award, FlaskConical, Sparkles } from "lucide-react";

import {
  bestPrice,
  directoryProducts,
  productCreatine,
  productShoe01,
  productShoe02,
  productWatch,
} from "@/fixtures/products";
import { AwardBadge } from "@/primitives/award-badge";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { ProductMediaFrame } from "./product-media-frame";

const TREATMENTS = ["auto", "full-bleed-editorial", "padded-pedestal", "studio-cutout-blend"] as const;
const HOVERS = ["none", "subtle-zoom", "secondary-angle-swap"] as const;

const meta = {
  title: "Tier 3 · Surface & Media/ProductMediaFrame",
  component: ProductMediaFrame,
  parameters: { layout: "fullscreen" },
  args: {
    media: productShoe01.media,
    treatment: "auto",
    hover: "secondary-angle-swap",
    showCaption: true,
    priority: true,
  },
  argTypes: {
    treatment: { control: "select", options: TREATMENTS },
    hover: { control: "select", options: HOVERS },
    media: { control: false },
    badge: { control: false },
    metric: { control: false },
    caption: { control: false },
  },
} satisfies Meta<typeof ProductMediaFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

const shoeCaption = {
  eyebrow: productShoe01.brand,
  name: productShoe01.name,
  price: bestPrice(productShoe01),
};

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <ProductMediaFrame
        {...args}
        badge={<AwardBadge shape="glass-pill" badge={productShoe01.awardBadge} icon={Award} />}
        metric={<AwardBadge shape="glass-pill" tier="callout">Score {productShoe01.overallScore}</AwardBadge>}
        caption={shoeCaption}
      />
    </div>
  ),
};

export const TokenDrivenAuto: Story = {
  name: "★ treatment=auto resolves per vertical (full-bleed ↔ pedestal)",
  render: () => (
    <VerticalCompare>
      <div className="grid grid-cols-2 gap-grid-gap">
        <ProductMediaFrame
          media={productShoe01.media}
          badge={<AwardBadge shape="glass-pill" badge={productShoe01.awardBadge} icon={Award} />}
          caption={shoeCaption}
          priority
        />
        <ProductMediaFrame
          media={productCreatine.media}
          badge={<AwardBadge shape="glass-pill" badge={productCreatine.awardBadge} icon={FlaskConical} />}
          metric={<AwardBadge shape="glass-pill" tier="callout">{productCreatine.overallScore}</AwardBadge>}
          caption={{ eyebrow: productCreatine.brand, name: productCreatine.name, price: bestPrice(productCreatine) }}
        />
      </div>
    </VerticalCompare>
  ),
};

export const AllTreatments: Story = {
  name: "Variants · treatment",
  render: () => (
    <div className="grid grid-cols-2 gap-grid-gap lg:grid-cols-4">
      {TREATMENTS.map((treatment) => (
        <ProductMediaFrame
          key={treatment}
          media={treatment === "studio-cutout-blend" ? productShoe02.media : productShoe01.media}
          treatment={treatment}
          hover="subtle-zoom"
          badge={<AwardBadge shape="glass-pill" badge={productShoe01.awardBadge} icon={Award} />}
          caption={{ eyebrow: `treatment`, name: treatment }}
        />
      ))}
    </div>
  ),
};

export const AllHovers: Story = {
  name: "Variants · hover (hover each frame)",
  render: () => (
    <div className="grid grid-cols-3 gap-grid-gap">
      {HOVERS.map((hover) => (
        <ProductMediaFrame
          key={hover}
          media={productShoe01.media}
          hover={hover}
          caption={{ eyebrow: "hover", name: hover }}
        />
      ))}
    </div>
  ),
};

export const SafeZones: Story = {
  name: "Slots · badge top-left, metric bottom-right (never one track)",
  render: () => (
    <div className="grid grid-cols-2 gap-grid-gap lg:grid-cols-4">
      {[productShoe01, productWatch, productCreatine, productShoe02].map((p, i) => (
        <ProductMediaFrame
          key={p.id}
          media={p.media}
          badge={
            i === 0 ? (
              // Over-long label: truncates inside the safe zone instead of colliding.
              <AwardBadge shape="architectural-flag" icon={Award}>
                Best Overall Daily Trainer For Most Runners
              </AwardBadge>
            ) : (
              <AwardBadge shape={i % 2 ? "glass-pill" : "architectural-flag"} badge={p.awardBadge} icon={i === 2 ? FlaskConical : Sparkles} />
            )
          }
          metric={<AwardBadge shape="glass-pill" tier="callout">Score {p.overallScore}</AwardBadge>}
          caption={{ eyebrow: p.brand, name: p.name, price: bestPrice(p) }}
        />
      ))}
    </div>
  ),
};

export const CaptionLockups: Story = {
  name: "Caption · eyebrow / name / price lockup, showCaption",
  render: () => (
    <div className="grid grid-cols-2 gap-grid-gap lg:grid-cols-4">
      <ProductMediaFrame media={productWatch.media} caption={{ eyebrow: productWatch.brand, name: productWatch.name, price: bestPrice(productWatch) }} />
      <ProductMediaFrame media={productWatch.media} caption={{ eyebrow: productWatch.brand, name: productWatch.name }} />
      <ProductMediaFrame media={productWatch.media} caption={{ name: productWatch.name }} />
      <ProductMediaFrame media={productWatch.media} caption={{ eyebrow: productWatch.brand, name: productWatch.name }} showCaption={false} />
    </div>
  ),
};

export const DirectoryLoop30: Story = {
  name: "Perf · 30-item grid (zero JS, zero CLS)",
  render: () => (
    <ul className="grid grid-cols-2 gap-grid-gap md:grid-cols-4 xl:grid-cols-6">
      {directoryProducts.map((p) => (
        <li key={p.id}>
          <ProductMediaFrame
            as="div"
            media={p.media}
            hover="secondary-angle-swap"
            badge={p.awardBadge ? <AwardBadge shape="glass-pill" badge={p.awardBadge} size="sm" /> : undefined}
            caption={{ eyebrow: p.brand, name: p.name, price: bestPrice(p) }}
          />
        </li>
      ))}
    </ul>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="grid grid-cols-2 gap-grid-gap">
        <ProductMediaFrame
          media={productShoe01.media}
          hover="secondary-angle-swap"
          badge={<AwardBadge shape="glass-pill" badge={productShoe01.awardBadge} icon={Award} />}
          metric={<AwardBadge shape="glass-pill" tier="callout">Score {productShoe01.overallScore}</AwardBadge>}
          caption={shoeCaption}
          priority
        />
        <ProductMediaFrame
          media={productWatch.media}
          badge={<AwardBadge shape="architectural-flag" badge={productWatch.awardBadge} />}
          caption={{ eyebrow: productWatch.brand, name: productWatch.name, price: bestPrice(productWatch) }}
        />
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
            <ProductMediaFrame
              key={p.id}
              media={p.media}
              badge={p.awardBadge ? <AwardBadge shape="glass-pill" badge={p.awardBadge} size="sm" /> : undefined}
              metric={<AwardBadge shape="glass-pill" tier="callout" size="sm">{p.overallScore}</AwardBadge>}
              caption={{ eyebrow: p.brand, name: p.name, price: bestPrice(p) }}
            />
          ))}
        </div>
      )}
    />
  ),
};
