import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { productCreatine, productShoe01, productWatch } from "@/fixtures/products";
import { ProgressiveCollapse, ProgressiveCollapseGroup } from "@/primitives/progressive-collapse";
import { SurfaceCard } from "@/primitives/surface-card";
import { Labeled } from "@/stories/story-label";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { SpecList } from "./spec-list";

const PRESENTATIONS = ["two-col-grid", "striped-rows", "dotted-leader", "metric-chips"] as const;

const meta = {
  title: "Tier 4 · Comparison & Discovery/SpecList",
  component: SpecList,
  parameters: { layout: "fullscreen" },
  args: {
    specs: productShoe01.specs,
    presentation: "two-col-grid",
    density: "comfortable",
    highlightFirst: false,
  },
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

export const AllPresentations: Story = {
  name: "Variants · presentation",
  render: (args) => (
    <div className="grid items-start gap-grid-gap md:grid-cols-2">
      {PRESENTATIONS.map((presentation) => (
        <Labeled key={presentation} label={`presentation="${presentation}"`}>
          <SurfaceCard as="section">
            <p className="type-eyebrow text-muted">Specifications</p>
            <SpecList {...args} presentation={presentation} highlightFirst={presentation === "metric-chips"} />
          </SurfaceCard>
        </Labeled>
      ))}
    </div>
  ),
};

export const Density: Story = {
  name: "Variants · density · highlightFirst · limit",
  render: () => (
    <div className="grid items-start gap-grid-gap md:grid-cols-3">
      <Labeled label='density="compact"'>
        <SpecList specs={productShoe01.specs} density="compact" />
      </Labeled>
      <Labeled label="highlightFirst (Key pills float to the top)">
        <SpecList specs={productShoe01.specs} highlightFirst />
      </Labeled>
      <Labeled label="limit={4} inside a ProgressiveCollapse for the rest">
        <div className="flex flex-col">
          <SpecList specs={productShoe01.specs} limit={4} />
          <ProgressiveCollapseGroup className="border-t-0">
            <ProgressiveCollapse title={`${productShoe01.specs.length - 4} more specifications`} headingLevel={4}>
              <SpecList specs={productShoe01.specs.slice(4)} density="compact" />
            </ProgressiveCollapse>
          </ProgressiveCollapseGroup>
        </div>
      </Labeled>
    </div>
  ),
};

export const Payloads: Story = {
  name: "Data · prose values, tooltips, mixed units",
  render: () => (
    <div className="grid items-start gap-grid-gap md:grid-cols-2">
      <Labeled label="luxury watch payload (prose values + tooltip)">
        <SurfaceCard as="section">
          <p className="type-eyebrow text-muted">{productWatch.brand} {productWatch.name}</p>
          <SpecList specs={productWatch.specs} presentation="dotted-leader" />
        </SurfaceCard>
      </Labeled>
      <Labeled label="clinical payload (metric chips for highlights)">
        <SurfaceCard as="section">
          <p className="type-eyebrow text-muted">{productCreatine.brand} {productCreatine.name}</p>
          <SpecList specs={productCreatine.specs} presentation="metric-chips" />
        </SurfaceCard>
      </Labeled>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <SurfaceCard as="section">
        <p className="type-eyebrow text-muted">Specifications</p>
        <SpecList specs={productShoe01.specs} presentation="metric-chips" />
      </SurfaceCard>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 (2 chips per row) vs 1280 (3)",
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
