import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Award, FlaskConical, Sparkles } from "lucide-react";

import { bestPrice, directoryProducts, productCreatine, productShoe01, productShoe02, productWatch } from "@/fixtures/products";
import { formatScore } from "@/lib/format";
import { AwardBadge } from "@/primitives/award-badge";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { ProductMediaFrame } from "./product-media-frame";

const TREATMENTS = ["cover", "contain", "blend"] as const;
const HOVERS = ["none", "subtle-zoom", "secondary-angle-swap"] as const;
const TREATMENT_NAMES = { cover: "Cover — edge to edge", contain: "Contain — packshot on its backdrop", blend: "Blend — true-white packshot" } as const;
const HOVER_NAMES = { none: "No hover", "subtle-zoom": "Subtle zoom", "secondary-angle-swap": "Secondary angle swap" } as const;

const meta = {
  title: "Tier 3 · Surface & Media/ProductMediaFrame",
  component: ProductMediaFrame,
  parameters: { layout: "fullscreen" },
  args: { media: productShoe01.media, treatment: "cover", hover: "secondary-angle-swap", showCaption: true, priority: true },
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

const shoeCaption = { eyebrow: productShoe01.brand, name: productShoe01.name, price: bestPrice(productShoe01) };

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <ProductMediaFrame
        {...args}
        badge={<AwardBadge surface="glass" badge={productShoe01.awardBadge} rank={productShoe01.rank} icon={Award} />}
        metric={<AwardBadge surface="glass">{formatScore(productShoe01.overallScore!)}</AwardBadge>}
        caption={shoeCaption}
      />
    </div>
  ),
};

export const Treatments: Story = {
  render: () => (
    <div className="grid grid-cols-1 items-start gap-grid sm:grid-cols-3">
      {TREATMENTS.map((treatment) => {
        const p = treatment === "blend" ? productShoe02 : treatment === "contain" ? productCreatine : productShoe01;
        return (
          <Specimen key={treatment} caption={TREATMENT_NAMES[treatment]}>
            <ProductMediaFrame
              media={p.media}
              treatment={treatment}
              hover="subtle-zoom"
              badge={<AwardBadge surface="glass" badge={p.awardBadge} rank={p.rank} />}
              caption={{ eyebrow: p.brand, name: p.name, price: bestPrice(p) }}
            />
          </Specimen>
        );
      })}
    </div>
  ),
};

export const Hovers: Story = {
  name: "Hover physics (hover each frame)",
  render: () => (
    <div className="grid grid-cols-1 items-start gap-grid sm:grid-cols-3">
      {HOVERS.map((hover) => (
        <Specimen key={hover} caption={HOVER_NAMES[hover]}>
          <ProductMediaFrame media={productShoe01.media} hover={hover} caption={shoeCaption} />
        </Specimen>
      ))}
    </div>
  ),
};

export const SafeZones: Story = {
  name: "Overlay safe zones — accolade top-left, metric bottom-right",
  render: () => (
    <div className="grid grid-cols-2 items-start gap-grid lg:grid-cols-4">
      {[productShoe01, productWatch, productCreatine, productShoe02].map((p, i) => (
        <ProductMediaFrame
          key={p.id}
          media={p.media}
          treatment={i === 2 ? "contain" : "cover"}
          badge={
            i === 0 ? (
              // Over-long label: truncates inside the safe zone instead of colliding.
              <AwardBadge rank={1} icon={Award}>
                Best Overall Daily Trainer For Most Runners
              </AwardBadge>
            ) : (
              <AwardBadge surface={i % 2 ? "glass" : "inverse"} badge={p.awardBadge} rank={p.rank} icon={i === 2 ? FlaskConical : Sparkles} />
            )
          }
          metric={<AwardBadge surface="glass">{formatScore(p.overallScore!)}</AwardBadge>}
          caption={{ eyebrow: p.brand, name: p.name, price: bestPrice(p) }}
        />
      ))}
    </div>
  ),
};

export const CaptionLockups: Story = {
  name: "Caption lockups",
  render: () => (
    <div className="grid grid-cols-2 items-start gap-grid lg:grid-cols-4">
      <Specimen caption="Eyebrow · name · price">
        <ProductMediaFrame media={productWatch.media} caption={{ eyebrow: productWatch.brand, name: productWatch.name, price: bestPrice(productWatch) }} />
      </Specimen>
      <Specimen caption="Eyebrow · name">
        <ProductMediaFrame media={productWatch.media} caption={{ eyebrow: productWatch.brand, name: productWatch.name }} />
      </Specimen>
      <Specimen caption="Name only">
        <ProductMediaFrame media={productWatch.media} caption={{ name: productWatch.name }} />
      </Specimen>
      <Specimen caption="Caption data kept, lockup hidden">
        <ProductMediaFrame media={productWatch.media} caption={{ eyebrow: productWatch.brand, name: productWatch.name }} showCaption={false} />
      </Specimen>
    </div>
  ),
};

export const DirectoryLoop30: Story = {
  name: "30-item grid (zero JS, zero CLS)",
  render: () => (
    <ul className="m-0 grid list-none grid-cols-2 items-start gap-grid p-0 md:grid-cols-4 xl:grid-cols-6">
      {directoryProducts.map((p) => (
        <li key={p.id}>
          <ProductMediaFrame
            as="div"
            media={p.media}
            hover="secondary-angle-swap"
            badge={p.awardBadge ? <AwardBadge badge={p.awardBadge} rank={p.rank} size="sm" /> : undefined}
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
      <div className="grid grid-cols-2 items-start gap-grid">
        <ProductMediaFrame
          media={productShoe01.media}
          hover="secondary-angle-swap"
          badge={<AwardBadge surface="glass" badge={productShoe01.awardBadge} rank={productShoe01.rank} icon={Award} />}
          metric={<AwardBadge surface="glass">{formatScore(productShoe01.overallScore!)}</AwardBadge>}
          caption={shoeCaption}
          priority
        />
        <ProductMediaFrame
          media={productCreatine.media}
          treatment="contain"
          badge={<AwardBadge badge={productCreatine.awardBadge} icon={FlaskConical} />}
          caption={{ eyebrow: productCreatine.brand, name: productCreatine.name, price: bestPrice(productCreatine) }}
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
        <div className={`${grid} items-start`}>
          {directoryProducts.slice(0, 4).map((p) => (
            <ProductMediaFrame
              key={p.id}
              media={p.media}
              badge={p.awardBadge ? <AwardBadge surface="glass" badge={p.awardBadge} rank={p.rank} size="sm" /> : undefined}
              metric={
                <AwardBadge surface="glass" size="sm">
                  {formatScore(p.overallScore!)}
                </AwardBadge>
              }
              caption={{ eyebrow: p.brand, name: p.name, price: bestPrice(p) }}
            />
          ))}
        </div>
      )}
    />
  ),
};
