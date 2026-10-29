import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { directoryProducts, productCreatine, productShoe01, productWatch } from "@/fixtures/products";
import { SurfaceCard } from "@/primitives/surface-card";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { ScoreMeter } from "./score-meter";

const VISUALS = ["segmented-bar", "minimal-fraction", "radial-ring", "tabular-row"] as const;

const meta = {
  title: "Tier 2 · Evaluation & E-E-A-T/ScoreMeter",
  component: ScoreMeter,
  parameters: { layout: "fullscreen" },
  args: {
    score: productShoe01.overallScore!,
    maxScore: 10,
    label: "Overall",
    subScores: productShoe01.subScores,
    visual: "segmented-bar",
    showWeights: false,
    segments: 10,
    decimals: 1,
  },
  argTypes: {
    visual: { control: "select", options: VISUALS },
    subScores: { control: false },
  },
} satisfies Meta<typeof ScoreMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-md">
      <ScoreMeter {...args} />
    </div>
  ),
};

export const AllVisuals: Story = {
  name: "Variants · visual",
  render: (args) => (
    <div className="grid gap-grid-gap md:grid-cols-2">
      {VISUALS.map((visual) => (
        <SurfaceCard key={visual} as="section">
          <code className="type-label-mono text-muted">visual=&quot;{visual}&quot;</code>
          <ScoreMeter {...args} visual={visual} />
        </SurfaceCard>
      ))}
    </div>
  ),
};

export const WeightedBreakdown: Story = {
  name: "Data · weighted sub-scores (showWeights)",
  render: () => (
    <div className="max-w-md">
      <ScoreMeter
        score={productCreatine.overallScore!}
        label="Lab score"
        subScores={productCreatine.subScores}
        visual="tabular-row"
        showWeights
      />
    </div>
  ),
};

export const CompositeOnly: Story = {
  name: "Data · composite only, custom scale",
  render: () => (
    <div className="flex flex-wrap gap-grid-gap">
      <ScoreMeter score={productWatch.overallScore!} visual="radial-ring" label="Editor score" />
      <ScoreMeter score={4.6} maxScore={5} visual="minimal-fraction" label="Reader rating" />
      <ScoreMeter score={87} maxScore={100} decimals={0} visual="segmented-bar" segments={20} label="Lab index" className="w-64" />
    </div>
  ),
};

export const DirectoryLoop30: Story = {
  name: "Perf · 30 meters in a directory (zero JS)",
  render: () => (
    <ul className="grid grid-cols-2 gap-grid-gap md:grid-cols-3 xl:grid-cols-5">
      {directoryProducts.map((p) => (
        <SurfaceCard key={p.id} as="li" density="compact">
          <p className="type-label-mono text-muted">#{p.rank}</p>
          <ScoreMeter score={p.overallScore!} visual="radial-ring" label={p.name} />
        </SurfaceCard>
      ))}
    </ul>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="grid gap-grid-gap">
        <ScoreMeter score={productShoe01.overallScore!} subScores={productShoe01.subScores} visual="segmented-bar" />
        <ScoreMeter score={productShoe01.overallScore!} subScores={productShoe01.subScores} visual="radial-ring" />
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 (label over bar) vs 1280 (three columns)",
  render: () => (
    <ViewportFrames
      render={() => (
        <ScoreMeter score={productShoe01.overallScore!} subScores={productShoe01.subScores} visual="tabular-row" showWeights />
      )}
    />
  ),
};
