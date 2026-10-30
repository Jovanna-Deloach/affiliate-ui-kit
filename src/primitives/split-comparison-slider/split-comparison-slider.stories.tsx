import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { aeroliteWearComparison } from "@/fixtures/gallery";
import { SurfaceCard } from "@/primitives/surface-card";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { SplitComparisonSlider } from "./split-comparison-slider";

const cmp = aeroliteWearComparison;

const meta = {
  title: "Tier 6 · Editorial & Visual Proof/SplitComparisonSlider",
  component: SplitComparisonSlider,
  parameters: { layout: "fullscreen" },
  args: {
    before: cmp.before,
    after: cmp.after,
    beforeLabel: cmp.beforeLabel,
    afterLabel: cmp.afterLabel,
    label: "Meridian Aerolite 3 — out of box vs. 400 miles",
    defaultValue: 50,
    caption: cmp.caption,
  },
  argTypes: {
    before: { control: false },
    after: { control: false },
    defaultValue: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
} satisfies Meta<typeof SplitComparisonSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <SplitComparisonSlider {...args} />
    </div>
  ),
};

export const RevealPositions: Story = {
  name: "Reveal positions",
  render: (args) => (
    <div className="grid items-start gap-grid md:grid-cols-3">
      {[15, 50, 85].map((v) => (
        <Specimen key={v} caption={`${v}% before · ${100 - v}% after`}>
          <SplitComparisonSlider {...args} defaultValue={v} caption={undefined} />
        </Specimen>
      ))}
    </div>
  ),
};

export const InsideScorecard: Story = {
  name: "Inside a scorecard — wear report",
  render: (args) => (
    <SurfaceCard as="section" className="max-w-2xl">
      <div className="flex flex-col gap-hairline">
        <p className="type-eyebrow m-0 text-ink-tertiary">Wear report</p>
        <h3 className="type-title m-0">Upper and midsole after 400 miles</h3>
      </div>
      <SplitComparisonSlider {...args} />
    </SurfaceCard>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: (args) => <VerticalCompare render={() => <SplitComparisonSlider {...args} defaultValue={40} />} />,
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: (args) => <ViewportFrames render={() => <SplitComparisonSlider {...args} />} />,
};
