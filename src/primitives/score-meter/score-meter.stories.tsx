import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { labAssays } from "@/fixtures/lab-assays";
import { directoryProducts, productCreatine, productShoe01, productWatch } from "@/fixtures/products";
import { SurfaceCard } from "@/primitives/surface-card";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { MicroMeter } from "./micro-meter";
import { ScoreMeter } from "./score-meter";

const VISUALS = ["scorecard", "radial", "inline-bar", "compact"] as const;
const NAMES = { scorecard: "Scorecard — verdict zone over evidence zone", radial: "Radial", "inline-bar": "Inline bar", compact: "Compact" } as const;

const meta = {
  title: "Tier 2 · Evaluation & E-E-A-T/ScoreMeter",
  component: ScoreMeter,
  parameters: { layout: "fullscreen" },
  args: {
    score: productShoe01.overallScore!,
    maxScore: 10,
    label: "Overall score",
    subScores: productShoe01.subScores,
    visual: "scorecard",
    showWeights: false,
    segments: 10,
    decimals: 1,
  },
  argTypes: {
    visual: { control: "select", options: VISUALS },
    subScores: { control: false },
    verdict: { control: "text" },
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

export const Visuals: Story = {
  render: (args) => (
    <div className="grid items-start gap-grid md:grid-cols-2">
      {VISUALS.map((visual) => (
        <Specimen key={visual} caption={NAMES[visual]}>
          {visual === "scorecard" ? (
            <ScoreMeter {...args} visual={visual} />
          ) : (
            <SurfaceCard as="section">
              <ScoreMeter {...args} visual={visual} />
            </SurfaceCard>
          )}
        </Specimen>
      ))}
    </div>
  ),
};

export const WeightedBreakdown: Story = {
  name: "Weighted sub-scores",
  render: () => (
    <div className="max-w-md">
      <ScoreMeter score={productCreatine.overallScore!} label="Lab score" subScores={productCreatine.subScores} showWeights />
    </div>
  ),
};

export const CompositeOnly: Story = {
  name: "Composite only · custom scales · whole numbers still read 9.0",
  render: () => (
    <div className="grid items-start gap-grid md:grid-cols-2 xl:grid-cols-4">
      <Specimen caption="Radial · editor score">
        <ScoreMeter score={productWatch.overallScore!} visual="radial" label="Editor score" />
      </Specimen>
      <Specimen caption="Compact · reader rating out of 5">
        <ScoreMeter score={4.6} maxScore={5} visual="compact" label="Reader rating" />
      </Specimen>
      <Specimen caption="Whole number · 9 renders as 9.0">
        <ScoreMeter score={9} visual="compact" label="Build quality" />
      </Specimen>
      <Specimen caption="Lab index out of 100 · twenty blocks">
        <ScoreMeter score={87} maxScore={100} decimals={0} segments={20} label="Lab index" verdict="Excellent · Top 15%" />
      </Specimen>
    </div>
  ),
};

export const ThresholdTracks: Story = {
  name: "MicroMeter — measured value + threshold track",
  render: () => (
    <ul className="m-0 flex max-w-xl list-none flex-col divide-y divide-hairline border-y border-hairline p-0">
      {labAssays.slice(0, 6).map((a) => (
        <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-stack py-row">
          <span className="flex min-w-0 flex-col gap-hairline">
            <span className="truncate text-body-sm font-medium text-ink">{a.analyte}</span>
            <span className="truncate text-caption text-ink-tertiary">{a.reference}</span>
          </span>
          <MicroMeter value={a.result} pct={a.gauge.pct} caption={a.gauge.caption} tone={a.status === "pass" ? "positive" : a.status === "watch" ? "caution" : "negative"} />
        </li>
      ))}
    </ul>
  ),
};

export const RankedList: Story = {
  name: "Ranked list with inline proportion bars",
  render: () => (
    <ol className="m-0 max-w-2xl list-none divide-y divide-hairline border-y border-hairline p-0">
      {directoryProducts.slice(0, 10).map((p) => (
        <li key={p.id} className="grid grid-cols-[var(--keyline-rank)_minmax(0,1fr)_auto] items-center gap-x-stack py-row">
          <span className="type-mono text-ink-tertiary">{String(p.rank).padStart(2, "0")}</span>
          <span className="flex min-w-0 flex-col gap-hairline">
            <span className="truncate text-body-sm font-medium text-ink">
              {p.brand} {p.name}
            </span>
            <span className="truncate text-caption text-ink-tertiary">{p.eyebrow}</span>
          </span>
          <ScoreMeter score={p.overallScore!} visual="inline-bar" label={null} />
        </li>
      ))}
    </ol>
  ),
};

export const DirectoryLoop30: Story = {
  name: "30 meters in a directory (zero JS)",
  render: () => (
    <ul className="m-0 grid list-none grid-cols-2 items-start gap-grid p-0 md:grid-cols-3 xl:grid-cols-5">
      {directoryProducts.map((p) => (
        <SurfaceCard key={p.id} as="li" density="compact">
          <span className="type-mono text-ink-tertiary">{String(p.rank).padStart(2, "0")}</span>
          <ScoreMeter score={p.overallScore!} visual="radial" label={p.name} />
        </SurfaceCard>
      ))}
    </ul>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="grid gap-grid">
        <ScoreMeter score={productShoe01.overallScore!} subScores={productShoe01.subScores} />
        <ScoreMeter score={productShoe01.overallScore!} visual="radial" />
        <ScoreMeter score={productShoe01.overallScore!} visual="inline-bar" label="Overall" />
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: () => (
    <ViewportFrames render={() => <ScoreMeter score={productShoe01.overallScore!} subScores={productShoe01.subScores} showWeights />} />
  ),
};
