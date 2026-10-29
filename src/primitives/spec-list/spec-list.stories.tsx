import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { productCreatine, productShoe01, productWatch } from "@/fixtures/products";
import { ProgressiveCollapse, ProgressiveCollapseGroup } from "@/primitives/progressive-collapse";
import { SurfaceCard } from "@/primitives/surface-card";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { SpecList } from "./spec-list";

const PRESENTATIONS = ["keyline", "two-column", "leader", "metric-chips"] as const;
const NAMES = {
  keyline: "Keyline — 180px label column",
  "two-column": "Two columns of keyline rows",
  leader: "Dotted leader (narrow cells)",
  "metric-chips": "Metric chips + keyline rows",
} as const;

const meta = {
  title: "Tier 4 · Comparison & Discovery/SpecList",
  component: SpecList,
  parameters: { layout: "fullscreen" },
  args: { specs: productShoe01.specs, presentation: "keyline", density: "comfortable", highlightFirst: false },
  argTypes: {
    presentation: { control: "select", options: PRESENTATIONS },
    density: { control: "inline-radio", options: ["compact", "comfortable"] },
    specs: { control: false },
  },
} satisfies Meta<typeof SpecList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-md">
      <SpecList {...args} />
    </div>
  ),
};

export const Presentations: Story = {
  render: (args) => (
    <div className="grid items-start gap-grid md:grid-cols-2">
      {PRESENTATIONS.map((presentation) => (
        <Specimen key={presentation} caption={NAMES[presentation]} className={presentation === "two-column" ? "md:col-span-2" : undefined}>
          <SurfaceCard as="section">
            <p className="type-eyebrow m-0 text-ink-tertiary">Specifications</p>
            <SpecList {...args} presentation={presentation} highlightFirst={presentation === "metric-chips"} />
          </SurfaceCard>
        </Specimen>
      ))}
    </div>
  ),
};

export const DensityAndLimit: Story = {
  name: "Density · highlightFirst · limit",
  render: () => (
    <div className="grid items-start gap-grid md:grid-cols-3">
      <Specimen caption="Compact rows">
        <SpecList specs={productShoe01.specs} density="compact" />
      </Specimen>
      <Specimen caption="Highlights first">
        <SpecList specs={productShoe01.specs} highlightFirst />
      </Specimen>
      <Specimen caption="Four rows, the rest behind a disclosure">
        <div className="flex flex-col">
          <SpecList specs={productShoe01.specs} limit={4} />
          <ProgressiveCollapseGroup className="border-t-0">
            <ProgressiveCollapse title={`${productShoe01.specs.length - 4} more specifications`} headingLevel={4}>
              <SpecList specs={productShoe01.specs.slice(4)} density="compact" />
            </ProgressiveCollapse>
          </ProgressiveCollapseGroup>
        </div>
      </Specimen>
    </div>
  ),
};

export const Payloads: Story = {
  name: "Prose values, tooltips, mixed units",
  render: () => (
    <div className="grid items-start gap-grid md:grid-cols-2">
      <Specimen caption="Luxury watch — prose values and a tooltip">
        <SurfaceCard as="section">
          <p className="type-eyebrow m-0 text-ink-tertiary">
            {productWatch.brand} {productWatch.name}
          </p>
          <SpecList specs={productWatch.specs} />
        </SurfaceCard>
      </Specimen>
      <Specimen caption="Clinical — metric chips for the highlights">
        <SurfaceCard as="section">
          <p className="type-eyebrow m-0 text-ink-tertiary">
            {productCreatine.brand} {productCreatine.name}
          </p>
          <SpecList specs={productCreatine.specs} presentation="metric-chips" />
        </SurfaceCard>
      </Specimen>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <SurfaceCard as="section">
        <p className="type-eyebrow m-0 text-ink-tertiary">Specifications</p>
        <SpecList specs={productShoe01.specs} presentation="metric-chips" />
      </SurfaceCard>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 (38% label column) vs 1280 (180px)",
  render: () => (
    <ViewportFrames
      render={() => (
        <SurfaceCard as="section">
          <SpecList specs={productShoe01.specs} presentation="metric-chips" />
        </SurfaceCard>
      )}
    />
  ),
};
