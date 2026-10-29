import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FlaskConical, Ruler, ShieldCheck } from "lucide-react";

import { methodologyClinical } from "@/fixtures/authors";
import { labAssays, type LabAssay } from "@/fixtures/lab-assays";
import { directoryProducts, productShoe01 } from "@/fixtures/products";
import { formatScore } from "@/lib/format";
import { MicroMeter } from "@/primitives/score-meter";
import { SpecList } from "@/primitives/spec-list";
import { StatusPill } from "@/primitives/status-pill";
import { SurfaceCard } from "@/primitives/surface-card";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { ProgressiveCollapse, ProgressiveCollapseGroup } from "./progressive-collapse";

const TRIGGERS = ["row", "button", "inline"] as const;
const TRIGGER_NAMES = { row: "Keyline row", button: "Outline button", inline: "Inline link" } as const;

const ASSAY_TONE = { pass: "positive", watch: "caution", fail: "negative" } as const;
const ASSAY_LABEL = { pass: "Pass", watch: "Watch", fail: "Fail" } as const;

/** One assay on the four keylines: analyte · method │ value + threshold track │ status │ +/− */
function AssayRow({ assay, defaultOpen = false }: { assay: LabAssay; defaultOpen?: boolean }) {
  return (
    <ProgressiveCollapse
      layout="assay"
      title={assay.analyte}
      subtitle={assay.method}
      headingLevel={4}
      defaultOpen={defaultOpen}
      preview={<MicroMeter value={assay.result} pct={assay.gauge.pct} caption={assay.gauge.caption} tone={ASSAY_TONE[assay.status]} />}
      status={<StatusPill tone={ASSAY_TONE[assay.status]}>{ASSAY_LABEL[assay.status]}</StatusPill>}
    >
      <div className="flex flex-col gap-stack">
        <SpecList
          density="compact"
          specs={[
            { label: "Result", value: assay.result },
            { label: "Reference", value: assay.reference },
            { label: "Method", value: assay.method },
          ]}
        />
        <p className="m-0 max-w-prose">{assay.detail}</p>
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
    subtitle: `${productShoe01.specs.length} measurements · lab verified`,
    triggerStyle: "row",
    layout: "simple",
    defaultOpen: false,
    headingLevel: 3,
    children: <SpecList specs={productShoe01.specs} density="compact" />,
  },
  argTypes: {
    children: { control: false },
    preview: { control: false },
    status: { control: false },
    triggerStyle: { control: "inline-radio", options: TRIGGERS },
    layout: { control: "inline-radio", options: ["simple", "assay"] },
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

export const TriggerStyles: Story = {
  name: "Trigger styles",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-section">
      {TRIGGERS.map((triggerStyle, i) => (
        <Specimen key={triggerStyle} caption={TRIGGER_NAMES[triggerStyle]}>
          {triggerStyle === "row" ? (
            <ProgressiveCollapseGroup>
              <ProgressiveCollapse title="Methodology" subtitle="412 miles · 4 testers" preview={<span>Updated weekly</span>} defaultOpen={i === 0}>
                {methodologyClinical.summary}
              </ProgressiveCollapse>
            </ProgressiveCollapseGroup>
          ) : (
            <ProgressiveCollapse title="Methodology" triggerStyle={triggerStyle} defaultOpen={i === 0}>
              {methodologyClinical.summary}
            </ProgressiveCollapse>
          )}
        </Specimen>
      ))}
    </div>
  ),
};

export const LabAssayPanel: Story = {
  name: "Certificate of analysis — assay keylines",
  render: () => (
    <SurfaceCard as="section" className="max-w-2xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-stack">
        <p className="type-eyebrow m-0 text-ink-tertiary">Certificate of analysis</p>
        <StatusPill kind="technical">Batch 2214 · ISO 17025</StatusPill>
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
  name: "Spec accordion (framed, all panels in the DOM)",
  render: () => (
    <div className="max-w-2xl">
      <ProgressiveCollapseGroup framed>
        <ProgressiveCollapse
          title="Measurements"
          subtitle="Weight, stack, drop"
          icon={Ruler}
          headingLevel={3}
          defaultOpen
          preview={<span>{productShoe01.specs.length} rows</span>}
        >
          <SpecList specs={productShoe01.specs} density="compact" highlightFirst />
        </ProgressiveCollapse>
        <ProgressiveCollapse
          title="How we tested"
          subtitle="412 miles · 4 testers"
          icon={FlaskConical}
          headingLevel={3}
          preview={<StatusPill kind="technical">Updated weekly</StatusPill>}
        >
          {methodologyClinical.summary}
        </ProgressiveCollapse>
        <ProgressiveCollapse title="Warranty & returns" subtitle="30-day trial" icon={ShieldCheck} headingLevel={3} preview={<span>Free returns</span>}>
          Free returns within 30 days of delivery when the outsole shows no wear beyond test miles. Warranty claims route through the retailer you purchased from.
        </ProgressiveCollapse>
      </ProgressiveCollapseGroup>
    </div>
  ),
};

export const Loop30: Story = {
  name: "30 collapsibles — 16 assays + 14 spec sheets (forceMount, zero animation JS)",
  render: () => (
    <div className="grid max-w-5xl items-start gap-grid md:grid-cols-2">
      <div className="flex flex-col gap-cluster">
        <p className="type-eyebrow m-0 text-ink-tertiary">Certificate of analysis</p>
        <ProgressiveCollapseGroup>
          {labAssays.map((assay) => (
            <AssayRow key={assay.id} assay={assay} />
          ))}
        </ProgressiveCollapseGroup>
      </div>
      <div className="flex flex-col gap-cluster">
        <p className="type-eyebrow m-0 text-ink-tertiary">Spec sheets</p>
        <ProgressiveCollapseGroup>
          {directoryProducts.slice(0, 14).map((p) => (
            <ProgressiveCollapse
              key={p.id}
              title={`${p.brand} ${p.name}`}
              subtitle={p.eyebrow}
              headingLevel={4}
              preview={<span className="type-metric text-ink">{formatScore(p.overallScore!)}</span>}
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
        {labAssays.slice(0, 4).map((assay, i) => (
          <AssayRow key={assay.id} assay={assay} defaultOpen={i === 0} />
        ))}
      </ProgressiveCollapseGroup>
      <div className="mt-stack flex flex-wrap gap-cluster">
        <ProgressiveCollapse title="Fine print" triggerStyle="button">
          Prices verified weekly. Commissions never affect rankings.
        </ProgressiveCollapse>
        <ProgressiveCollapse title="Methodology" triggerStyle="inline">
          {methodologyClinical.summary}
        </ProgressiveCollapse>
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 (meter column hides) vs 1280",
  render: () => (
    <ViewportFrames
      render={() => (
        <ProgressiveCollapseGroup>
          <ProgressiveCollapse title="Measurements" subtitle="Weight, stack, drop, upper, midsole, outsole" headingLevel={3} defaultOpen>
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
