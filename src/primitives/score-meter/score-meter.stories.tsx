import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { directoryProducts, productCreatine, productShoe01, productWatch } from "@/fixtures/products";
import { SurfaceCard } from "@/primitives/surface-card";
import { Labeled } from "@/stories/story-label";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { ScoreMeter } from "./score-meter";

const VISUALS = ["segmented-bar", "minimal-fraction", "radial-ring", "tabular-row", "inline-bar"] as const;

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
    <div className="grid items-start gap-grid-gap md:grid-cols-2">
      {VISUALS.map((visual) => (
        <Labeled key={visual} label={`visual="${visual}"`}>
          <SurfaceCard as="section">
            <ScoreMeter {...args} visual={visual} />
          </SurfaceCard>
        </Labeled>
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
  name: "Data · composite only · custom scales · whole numbers still read 9.0",
  render: () => (
    <div className="flex flex-wrap items-start gap-grid-gap">
      <Labeled label="radial-ring">
        <ScoreMeter score={productWatch.overallScore!} visual="radial-ring" label="Editor score" />
      </Labeled>
      <Labeled label="maxScore=5">
        <ScoreMeter score={4.6} maxScore={5} visual="minimal-fraction" label="Reader rating" />
      </Labeled>
      <Labeled label="score=9 → “9.0”">
        <ScoreMeter score={9} visual="minimal-fraction" label="Build quality" />
      </Labeled>
      <Labeled label="maxScore=100 · decimals=0 · segments=20">
        <ScoreMeter score={87} maxScore={100} decimals={0} visual="segmented-bar" segments={20} label="Lab index" className="w-64" />
      </Labeled>
    </div>
  ),
};

export const RankedList: Story = {
  name: "Pattern · ranked list with inline proportion bars",
  render: () => (
    <ol className="max-w-2xl border-y-[length:var(--border-width-surface)] border-border-soft divide-y divide-border-soft">
      {directoryProducts.slice(0, 10).map((p) => (
        <li key={p.id} className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-cluster-gap py-[calc(var(--space-row-pad)*0.75)]">
          <span className="type-label-mono text-muted">{String(p.rank).padStart(2, "0")}</span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {p.brand} {p.name}
            </span>
            <span className="truncate text-xs text-muted">{p.eyebrow}</span>
          </span>
          <ScoreMeter score={p.overallScore!} visual="inline-bar" label={null} />
        </li>
      ))}
    </ol>
  ),
};

export const DirectoryLoop30: Story = {
  name: "Perf · 30 meters in a directory (zero JS)",
  render: () => (
    <ul className="grid grid-cols-2 items-start gap-grid-gap md:grid-cols-3 xl:grid-cols-5">
      {directoryProducts.map((p) => (
        <SurfaceCard key={p.id} as="li" density="compact">
          <p className="type-label-mono text-muted">{String(p.rank).padStart(2, "0")}</p>
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
        <ScoreMeter score={productShoe01.overallScore!} visual="inline-bar" label="Overall" />
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
