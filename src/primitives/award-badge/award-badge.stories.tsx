import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Award, FlaskConical, Sparkles } from "lucide-react";

import { directoryProducts, productShoe01, productWatch } from "@/fixtures/products";
import { formatScore } from "@/lib/format";
import { ProductMediaFrame } from "@/primitives/product-media-frame";
import { Labeled } from "@/stories/story-label";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { AWARD_BADGE_SHAPES, AwardBadge } from "./award-badge";

const TIERS = ["winner", "runner-up", "callout"] as const;
const LABELS = { winner: "Best Overall", "runner-up": "Editor's Pick", callout: "Lab Tested" } as const;
const ICONS = { winner: Award, "runner-up": Sparkles, callout: FlaskConical } as const;

const meta = {
  title: "Tier 2 · Evaluation & E-E-A-T/AwardBadge",
  component: AwardBadge,
  parameters: { layout: "fullscreen" },
  args: {
    children: "Best Overall",
    shape: "architectural-flag",
    tier: "winner",
    size: "md",
    rank: 1,
  },
  argTypes: {
    shape: { control: "select", options: AWARD_BADGE_SHAPES },
    tier: { control: "inline-radio", options: TIERS },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    icon: { control: false },
    badge: { control: false },
  },
} satisfies Meta<typeof AwardBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <AwardBadge {...args} icon={Award} />,
};

export const ShapeByTierMatrix: Story = {
  name: "Variants · shape × tier",
  render: () => (
    <div className="grid gap-section-gap">
      {AWARD_BADGE_SHAPES.map((shape) => (
        <Labeled key={shape} label={`shape="${shape}" · tier = ${TIERS.join(" | ")}`}>
          <div className="flex flex-wrap items-center gap-cluster-gap">
            {TIERS.map((tier, i) => (
              <AwardBadge key={tier} shape={shape} tier={tier} rank={i + 1} icon={ICONS[tier]}>
                {LABELS[tier]}
              </AwardBadge>
            ))}
          </div>
        </Labeled>
      ))}
    </div>
  ),
};

export const Iconography: Story = {
  name: "Variants · lucide icons, rank numerals, sizes",
  render: () => (
    <div className="flex flex-col gap-section-gap">
      <Labeled label="size = sm | md | lg">
        <div className="flex flex-wrap items-center gap-cluster-gap">
          <AwardBadge size="sm" icon={Award}>Best Overall</AwardBadge>
          <AwardBadge size="md" icon={Award}>Best Overall</AwardBadge>
          <AwardBadge size="lg" icon={Award}>Best Overall</AwardBadge>
        </div>
      </Labeled>
      <Labeled label='shape="split-rank" · rank numerals'>
        <div className="flex flex-wrap items-center gap-cluster-gap">
          <AwardBadge shape="split-rank" rank={1}>Best Overall</AwardBadge>
          <AwardBadge shape="split-rank" rank={2} tier="runner-up">Editor&apos;s Pick</AwardBadge>
          <AwardBadge shape="split-rank" rank={3} tier="callout" icon={FlaskConical}>Lab Tested</AwardBadge>
        </div>
      </Labeled>
      <Labeled label='shape="editorial-seal"'>
        <div className="flex flex-wrap items-center gap-cluster-gap">
          <AwardBadge shape="editorial-seal" rank={1}>Best Overall</AwardBadge>
          <AwardBadge shape="editorial-seal" tier="runner-up" icon={Sparkles}>Editor&apos;s Pick</AwardBadge>
          <AwardBadge shape="editorial-seal" tier="callout" icon={FlaskConical} size="lg">Lab Tested</AwardBadge>
        </div>
      </Labeled>
    </div>
  ),
};

export const GlassOverPhotography: Story = {
  name: "Context · glass-pill over full-bleed photography",
  render: () => (
    <div className="grid grid-cols-2 items-start gap-grid-gap md:grid-cols-3">
      {[productShoe01, productWatch].map((p) => (
        <ProductMediaFrame
          key={p.id}
          media={p.media}
          treatment="full-bleed-editorial"
          badge={<AwardBadge shape="glass-pill" badge={p.awardBadge} icon={Award} />}
          metric={<AwardBadge shape="glass-pill" tier="callout">Score {formatScore(p.overallScore!)}</AwardBadge>}
          caption={{ eyebrow: p.brand, name: p.name }}
        />
      ))}
    </div>
  ),
};

export const FromCanonicalPayload: Story = {
  name: "Data · badge prop from AffiliateProductEntity",
  render: () => (
    <div className="flex flex-wrap items-center gap-cluster-gap">
      {directoryProducts.slice(0, 3).map((p) => (
        <AwardBadge key={p.id} badge={p.awardBadge} shape="split-rank" rank={p.rank} />
      ))}
    </div>
  ),
};

export const AsLink: Story = {
  name: "Polymorphic · asChild link to methodology",
  render: () => (
    <AwardBadge asChild tier="callout" icon={FlaskConical}>
      <a href="#methodology" className="focus-ring">
        How we test
      </a>
    </AwardBadge>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="flex flex-col gap-cluster-gap">
        {AWARD_BADGE_SHAPES.map((shape) => (
          <div key={shape} className="flex flex-wrap items-center gap-cluster-gap">
            {TIERS.map((tier, i) => (
              <AwardBadge key={tier} shape={shape} tier={tier} rank={i + 1} icon={ICONS[tier]}>
                {LABELS[tier]}
              </AwardBadge>
            ))}
          </div>
        ))}
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280 (docked in safe zones)",
  render: () => (
    <ViewportFrames
      render={({ grid }) => (
        <div className={grid}>
          {directoryProducts.slice(0, 4).map((p, i) => (
            <ProductMediaFrame
              key={p.id}
              media={p.media}
              badge={
                <AwardBadge shape={i % 2 ? "glass-pill" : "architectural-flag"} tier={TIERS[i % 3]} size="sm" icon={ICONS[TIERS[i % 3]!]}>
                  {i === 1 ? "Best Overall Daily Trainer" : LABELS[TIERS[i % 3]!]}
                </AwardBadge>
              }
              metric={<AwardBadge shape="glass-pill" tier="callout" size="sm">{formatScore(p.overallScore!)}</AwardBadge>}
              caption={{ eyebrow: p.brand, name: p.name }}
            />
          ))}
        </div>
      )}
    />
  ),
};
