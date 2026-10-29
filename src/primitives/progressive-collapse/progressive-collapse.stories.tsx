import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FlaskConical, Ruler, ShieldCheck } from "lucide-react";

import { methodologyClinical } from "@/fixtures/authors";
import { labAssays, type LabAssay } from "@/fixtures/lab-assays";
import { directoryProducts, productShoe01 } from "@/fixtures/products";
import { formatScore } from "@/lib/format";
import { SpecList } from "@/primitives/spec-list";
import { StatusPill } from "@/primitives/status-pill";
import { SurfaceCard } from "@/primitives/surface-card";
import { Labeled } from "@/stories/story-label";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { ProgressiveCollapse, ProgressiveCollapseGroup } from "./progressive-collapse";

const TRIGGERS = ["minimal-underline", "button-pill", "hairline-row"] as const;

const ASSAY_TONE = { pass: "positive", watch: "caution", fail: "negative" } as const;
const ASSAY_LABEL = { pass: "Pass", watch: "Watch", fail: "Fail" } as const;

/** "5.02 g · 100.4% of claim" — never repeats the result when the summary already carries it. */
function assayPreviewText(a: LabAssay) {
  const lead = a.result.split(" ")[0]!.toLowerCase();
  return a.summary.toLowerCase().startsWith(lead) ? a.summary : `${a.result} · ${a.summary}`;
}

/** One assay as a hairline row: analyte · method ⟶ result preview + PASS pill ⟶ +/− */
function AssayRow({ assay, defaultOpen = false }: { assay: LabAssay; defaultOpen?: boolean }) {
  return (
    <ProgressiveCollapse
      title={assay.analyte}
      summary={assay.method}
      headingLevel={4}
      defaultOpen={defaultOpen}
      preview={
        <>
          <span className="hidden @sm:inline">{assayPreviewText(assay)}</span>
          <StatusPill tone={ASSAY_TONE[assay.status]}>{ASSAY_LABEL[assay.status]}</StatusPill>
        </>
      }
    >
      <div className="flex flex-col gap-row-pad">
        <SpecList
          density="compact"
          specs={[
            { label: "Result", value: assay.result },
            { label: "Reference", value: assay.reference },
            { label: "Method", value: assay.method },
          ]}
        />
        <p className="m-0">{assay.detail}</p>
      </div>
    </ProgressiveCollapse>
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
    children: <SpecList specs={productShoe01.specs} density="compact" />,
  },
  argTypes: {
    children: { control: false },
    preview: { control: false },
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
        <ProgressiveCollapse {...args} />
      </ProgressiveCollapseGroup>
    </div>
  ),
};

export const AllTriggerStyles: Story = {
  name: "Variants · triggerStyle (first open, rest closed)",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-section-gap">
      {TRIGGERS.map((triggerStyle, i) => (
        <Labeled key={triggerStyle} label={`triggerStyle="${triggerStyle}"`}>
          {triggerStyle === "hairline-row" ? (
            <ProgressiveCollapseGroup>
              <ProgressiveCollapse title="Methodology" summary="412 miles · 4 testers" triggerStyle={triggerStyle} defaultOpen={i === 0}>
                {methodologyClinical.summary}
              </ProgressiveCollapse>
            </ProgressiveCollapseGroup>
          ) : (
            <ProgressiveCollapse title="Methodology" triggerStyle={triggerStyle} defaultOpen={i === 0}>
              {methodologyClinical.summary}
            </ProgressiveCollapse>
          )}
        </Labeled>
      ))}
    </div>
  ),
};

export const LabAssayPanel: Story = {
  name: "Pattern · lab assay panel (preview + PASS pill before the +/−)",
  render: () => (
    <SurfaceCard as="section" className="max-w-2xl">
      <div className="flex flex-wrap items-baseline justify-between gap-cluster-gap">
        <p className="type-eyebrow text-muted">Certificate of analysis · batch 2214</p>
        <span className="type-label-mono text-muted">ISO 17025 lab</span>
      </div>
      <ProgressiveCollapseGroup>
        {labAssays.slice(0, 6).map((assay, i) => (
          <AssayRow key={assay.id} assay={assay} defaultOpen={i === 0} />
        ))}
      </ProgressiveCollapseGroup>
    </SurfaceCard>
  ),
};

export const SpecAccordion: Story = {
  name: "Pattern · spec accordion (SEO: all panels in the DOM)",
  render: () => (
    <SurfaceCard as="section" className="max-w-2xl">
      <p className="type-eyebrow text-muted">Deep specs</p>
      <ProgressiveCollapseGroup>
        <ProgressiveCollapse
          title="Measurements"
          summary="Weight, stack, drop"
          icon={Ruler}
          headingLevel={3}
          defaultOpen
          preview={<span>{productShoe01.specs.length} rows</span>}
        >
          <SpecList specs={productShoe01.specs} density="compact" highlightFirst />
        </ProgressiveCollapse>
        <ProgressiveCollapse
          title="How we tested"
          summary="412 miles · 4 testers"
          icon={FlaskConical}
          headingLevel={3}
          preview={<StatusPill tone="neutral">Updated weekly</StatusPill>}
        >
          {methodologyClinical.summary}
        </ProgressiveCollapse>
        <ProgressiveCollapse
          title="Warranty & returns"
          summary="30-day trial"
          icon={ShieldCheck}
          headingLevel={3}
          preview={<span>Free returns</span>}
        >
          Free returns within 30 days of delivery when the outsole shows no wear beyond test miles. Warranty claims route through the retailer you purchased from.
        </ProgressiveCollapse>
      </ProgressiveCollapseGroup>
    </SurfaceCard>
  ),
};

export const Loop30: Story = {
  name: "Perf · 30 collapsibles (16 assays + 14 product spec sheets, forceMount, zero animation JS)",
  render: () => (
    <div className="grid max-w-5xl items-start gap-grid-gap md:grid-cols-2">
      <div className="flex flex-col gap-cluster-gap">
        <p className="type-eyebrow text-muted">Certificate of analysis</p>
        <ProgressiveCollapseGroup>
          {labAssays.map((assay) => (
            <AssayRow key={assay.id} assay={assay} />
          ))}
        </ProgressiveCollapseGroup>
      </div>
      <div className="flex flex-col gap-cluster-gap">
        <p className="type-eyebrow text-muted">Spec sheets</p>
        <ProgressiveCollapseGroup>
          {directoryProducts.slice(0, 14).map((p) => (
            <ProgressiveCollapse
              key={p.id}
              title={`${p.brand} ${p.name}`}
              summary={p.eyebrow}
              headingLevel={4}
              preview={<span className="type-price text-foreground">{formatScore(p.overallScore!)}</span>}
            >
              <SpecList specs={p.specs} density="compact" limit={5} />
            </ProgressiveCollapse>
          ))}
        </ProgressiveCollapseGroup>
      </div>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <ProgressiveCollapseGroup>
        <ProgressiveCollapse title="Measurements" summary="Weight, stack, drop" headingLevel={3} defaultOpen>
          <SpecList specs={productShoe01.specs} density="compact" limit={5} />
        </ProgressiveCollapse>
        {labAssays.slice(0, 3).map((assay) => (
          <AssayRow key={assay.id} assay={assay} />
        ))}
      </ProgressiveCollapseGroup>
      <div className="mt-row-pad flex flex-wrap gap-cluster-gap">
        <ProgressiveCollapse title="Fine print" triggerStyle="button-pill">
          Prices verified weekly. Commissions never affect rankings.
        </ProgressiveCollapse>
        <ProgressiveCollapse title="Methodology" triggerStyle="minimal-underline">
          {methodologyClinical.summary}
        </ProgressiveCollapse>
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 (preview text hides, pill stays) vs 1280",
  render: () => (
    <ViewportFrames
      render={() => (
        <ProgressiveCollapseGroup>
          <ProgressiveCollapse title="Measurements" summary="Weight, stack, drop, upper, midsole, outsole" headingLevel={3} defaultOpen>
            <SpecList specs={productShoe01.specs} density="compact" />
          </ProgressiveCollapse>
          {labAssays.slice(0, 4).map((assay) => (
            <AssayRow key={assay.id} assay={assay} />
          ))}
        </ProgressiveCollapseGroup>
      )}
    />
  ),
};
