import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FlaskConical, Ruler, ShieldCheck } from "lucide-react";

import { methodologyClinical } from "@/fixtures/authors";
import { productCreatine, productShoe01 } from "@/fixtures/products";
import { SurfaceCard } from "@/primitives/surface-card";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { ProgressiveCollapse, ProgressiveCollapseGroup } from "./progressive-collapse";

const TRIGGERS = ["minimal-underline", "button-pill", "hairline-row"] as const;

function SpecsBody() {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-row-pad gap-y-[0.4em]">
      {productShoe01.specs.map((s) => (
        <div key={s.label} className="contents">
          <dt className="text-muted">{s.label}</dt>
          <dd className="m-0 font-mono text-foreground tabular-nums">
            {s.value}
            {s.unit ? ` ${s.unit}` : ""}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const meta = {
  title: "Tier 4 · Comparison & Discovery/ProgressiveCollapse",
  component: ProgressiveCollapse,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Full specifications",
    summary: `${productShoe01.specs.length} measurements · lab verified`,
    triggerStyle: "hairline-row",
    defaultOpen: false,
    headingLevel: 3,
    children: <SpecsBody />,
  },
  argTypes: {
    children: { control: false },
    triggerStyle: { control: "inline-radio", options: TRIGGERS },
    headingLevel: { control: "inline-radio", options: [2, 3, 4] },
    icon: { control: false },
  },
} satisfies Meta<typeof ProgressiveCollapse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <ProgressiveCollapseGroup>
        <ProgressiveCollapse {...args}>
          <SpecsBody />
        </ProgressiveCollapse>
      </ProgressiveCollapseGroup>
    </div>
  ),
};

export const AllTriggerStyles: Story = {
  name: "Variants · triggerStyle (first open, rest closed)",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-section-gap">
      {TRIGGERS.map((triggerStyle, i) => (
        <div key={triggerStyle} className="flex flex-col gap-cluster-gap">
          <code className="type-label-mono text-muted">triggerStyle=&quot;{triggerStyle}&quot;</code>
          <ProgressiveCollapse title="Methodology" triggerStyle={triggerStyle} defaultOpen={i === 0}>
            {methodologyClinical.summary}
          </ProgressiveCollapse>
        </div>
      ))}
    </div>
  ),
};

export const SpecAccordion: Story = {
  name: "Pattern · spec accordion (SEO: all panels in the DOM)",
  render: () => (
    <SurfaceCard as="section" className="max-w-2xl">
      <p className="type-eyebrow text-muted">Deep specs</p>
      <ProgressiveCollapseGroup>
        <ProgressiveCollapse title="Measurements" summary="Weight, stack, drop" icon={Ruler} headingLevel={3} defaultOpen>
          <SpecsBody />
        </ProgressiveCollapse>
        <ProgressiveCollapse title="How we tested" summary="412 miles · 4 testers" icon={FlaskConical} headingLevel={3}>
          {methodologyClinical.summary}
        </ProgressiveCollapse>
        <ProgressiveCollapse title="Warranty & returns" summary="30-day trial" icon={ShieldCheck} headingLevel={3}>
          Free returns within 30 days of delivery when the outsole shows no wear beyond test miles. Warranty claims route through the retailer you purchased from.
        </ProgressiveCollapse>
      </ProgressiveCollapseGroup>
    </SurfaceCard>
  ),
};

export const Loop30: Story = {
  name: "Perf · 30 collapsibles (forceMount, zero animation JS)",
  render: () => (
    <div className="grid max-w-5xl gap-grid-gap md:grid-cols-2">
      {Array.from({ length: 30 }, (_, i) => (
        <ProgressiveCollapseGroup key={i}>
          <ProgressiveCollapse title={`${productCreatine.specs[i % productCreatine.specs.length]!.label} — batch ${2200 + i}`} triggerStyle="hairline-row" headingLevel={4}>
            {methodologyClinical.summary}
          </ProgressiveCollapse>
        </ProgressiveCollapseGroup>
      ))}
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <ProgressiveCollapseGroup>
        <ProgressiveCollapse title="Measurements" summary="Weight, stack, drop" headingLevel={3} defaultOpen>
          <SpecsBody />
        </ProgressiveCollapse>
        <ProgressiveCollapse title="How we tested" headingLevel={3}>
          {methodologyClinical.summary}
        </ProgressiveCollapse>
      </ProgressiveCollapseGroup>
      <div className="mt-row-pad flex flex-wrap gap-cluster-gap">
        <ProgressiveCollapse title="Fine print" triggerStyle="button-pill">
          Prices verified weekly. Commissions never affect rankings.
        </ProgressiveCollapse>
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: () => (
    <ViewportFrames
      render={() => (
        <ProgressiveCollapseGroup>
          <ProgressiveCollapse title="Measurements" summary="Weight, stack, drop, upper, midsole, outsole" headingLevel={3} defaultOpen>
            <SpecsBody />
          </ProgressiveCollapse>
          <ProgressiveCollapse title="How we tested" headingLevel={3}>
            {methodologyClinical.summary}
          </ProgressiveCollapse>
        </ProgressiveCollapseGroup>
      )}
    />
  ),
};
