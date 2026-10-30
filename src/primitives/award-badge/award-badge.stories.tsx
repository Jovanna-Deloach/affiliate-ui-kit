import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Award, FlaskConical, Sparkles } from "lucide-react";

import { directoryProducts, productShoe01, productWatch } from "@/fixtures/products";
import { formatScore } from "@/lib/format";
import { ProductMediaFrame } from "@/primitives/product-media-frame";
import { StatusPill } from "@/primitives/status-pill";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { AWARD_BADGE_SURFACES, AwardBadge } from "./award-badge";

const SURFACE_NAMES = { inverse: "Inverse — the accolade", glass: "Glass — over photography", outline: "Outline — secondary callout" } as const;

const meta = {
  title: "Tier 2 · Evaluation & E-E-A-T/AwardBadge",
  component: AwardBadge,
  parameters: { layout: "fullscreen" },
  args: { children: "Best Overall", surface: "inverse", tier: "winner", size: "md" },
  argTypes: {
    surface: { control: "inline-radio", options: AWARD_BADGE_SURFACES },
    tier: { control: "inline-radio", options: ["winner", "runner-up", "callout"] },
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

export const Surfaces: Story = {
  name: "One silhouette, three surfaces",
  render: () => (
    <div className="grid gap-section">
      {AWARD_BADGE_SURFACES.map((surface) => (
        <Specimen key={surface} caption={SURFACE_NAMES[surface]}>
          <div className="flex flex-wrap items-center gap-cluster">
            <AwardBadge surface={surface} icon={Award}>
              Best Overall
            </AwardBadge>
            <AwardBadge surface={surface} tier="runner-up" icon={Sparkles}>
              Editor&apos;s Pick
            </AwardBadge>
            <AwardBadge surface={surface} tier="callout" icon={FlaskConical}>
              Lab Tested
            </AwardBadge>
            <AwardBadge surface={surface}>Best for Speed Work</AwardBadge>
          </div>
        </Specimen>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes and icons",
  render: () => (
    <div className="flex flex-col gap-section">
      <Specimen caption="Small · medium · large">
        <div className="flex flex-wrap items-center gap-cluster">
          <AwardBadge size="sm">
            Best Overall
          </AwardBadge>
          <AwardBadge size="md">
            Best Overall
          </AwardBadge>
          <AwardBadge size="lg">
            Best Overall
          </AwardBadge>
        </div>
      </Specimen>
      <Specimen caption="Plain, with a lucide icon, long label truncates in a narrow slot">
        <div className="flex flex-wrap items-center gap-cluster">
          <AwardBadge>Best Overall</AwardBadge>
          <AwardBadge icon={Award}>Best Overall</AwardBadge>
          <AwardBadge className="max-w-[9rem]">Best Overall Daily Trainer For Most Runners</AwardBadge>
        </div>
      </Specimen>
    </div>
  ),
};

export const Semantics: Story = {
  name: "Accolade vs status vs credential",
  render: () => (
    <div className="flex flex-wrap items-center gap-cluster">
      <AwardBadge>Best Overall</AwardBadge>
      <StatusPill tone="positive">Best price</StatusPill>
      <StatusPill tone="caution">Low stock</StatusPill>
      <StatusPill kind="technical">ISO 17025</StatusPill>
    </div>
  ),
};

export const GlassOverPhotography: Story = {
  name: "Over photography — safe zones",
  render: () => (
    <div className="grid grid-cols-2 items-start gap-grid md:grid-cols-3">
      {[productShoe01, productWatch].map((p) => (
        <ProductMediaFrame
          key={p.id}
          media={p.media}
          badge={<AwardBadge surface="glass" badge={p.awardBadge} />}
          metric={<AwardBadge surface="glass">{formatScore(p.overallScore!)}</AwardBadge>}
          caption={{ eyebrow: p.brand, name: p.name }}
        />
      ))}
    </div>
  ),
};

export const FromCanonicalPayload: Story = {
  name: "From the AffiliateProductEntity badge slice",
  render: () => (
    <div className="flex flex-wrap items-center gap-cluster">
      {directoryProducts.slice(0, 3).map((p) => (
        <AwardBadge key={p.id} badge={p.awardBadge} />
      ))}
    </div>
  ),
};

export const AsLink: Story = {
  name: "Polymorphic · asChild link",
  render: () => (
    <AwardBadge asChild surface="outline" tier="callout" icon={FlaskConical}>
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
      <div className="flex flex-col gap-cluster">
        {AWARD_BADGE_SURFACES.map((surface) => (
          <div key={surface} className="flex flex-wrap items-center gap-cluster">
            <AwardBadge surface={surface} icon={Award}>
              Best Overall
            </AwardBadge>
            <AwardBadge surface={surface} tier="runner-up">
              Editor&apos;s Pick
            </AwardBadge>
            <AwardBadge surface={surface} tier="callout" icon={FlaskConical}>
              Lab Tested
            </AwardBadge>
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
        <div className={`${grid} items-start`}>
          {directoryProducts.slice(0, 4).map((p, i) => (
            <ProductMediaFrame
              key={p.id}
              media={p.media}
              badge={
                <AwardBadge surface={i % 2 ? "glass" : "inverse"} size="sm">
                  {i === 1 ? "Best Overall Daily Trainer" : p.eyebrow}
                </AwardBadge>
              }
              metric={
                <AwardBadge surface="glass" size="sm">
                  {formatScore(p.overallScore!)}
                </AwardBadge>
              }
              caption={{ eyebrow: p.brand, name: p.name }}
            />
          ))}
        </div>
      )}
    />
  ),
};
