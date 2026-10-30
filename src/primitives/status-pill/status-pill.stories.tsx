import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FlaskConical, Truck } from "lucide-react";

import { labAssays } from "@/fixtures/lab-assays";
import { AwardBadge } from "@/primitives/award-badge";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare } from "@/stories/vertical-compare";

import { StatusPill } from "./status-pill";

const TONES = ["positive", "caution", "negative", "neutral"] as const;
const TONE_COPY = { positive: "In stock", caution: "Low stock", negative: "Out of stock", neutral: "Our partner" } as const;

const meta = {
  title: "Tier 2 · Evaluation & E-E-A-T/StatusPill",
  component: StatusPill,
  parameters: { layout: "fullscreen" },
  args: { children: "Best price", kind: "status", tone: "positive", size: "md" },
  argTypes: {
    kind: { control: "inline-radio", options: ["status", "technical"] },
    tone: { control: "select", options: TONES },
    size: { control: "inline-radio", options: ["sm", "md"] },
    icon: { control: false },
  },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ThreeSilhouettes: Story = {
  name: "Three silhouettes, three meanings",
  render: () => (
    <div className="flex flex-col gap-section">
      <Specimen caption="Inventory & commercial state — pill with a status dot">
        <div className="flex flex-wrap items-center gap-cluster">
          {TONES.map((tone) => (
            <StatusPill key={tone} tone={tone}>
              {TONE_COPY[tone]}
            </StatusPill>
          ))}
          <StatusPill tone="positive">Best price</StatusPill>
          <StatusPill tone="caution">15% off first order</StatusPill>
        </div>
      </Specimen>
      <Specimen caption="Technical / lab credentials — recessed mono chip">
        <div className="flex flex-wrap items-center gap-cluster">
          <StatusPill kind="technical">ISO 17025</StatusPill>
          <StatusPill kind="technical">HPLC / ICP-MS</StatusPill>
          <StatusPill kind="technical">Batch 2214</StatusPill>
          <StatusPill kind="technical" icon={FlaskConical}>
            Lab tested
          </StatusPill>
        </div>
      </Specimen>
      <Specimen caption="Editorial accolade — inverse tag (AwardBadge, never a pill)">
        <div className="flex flex-wrap items-center gap-cluster">
          <AwardBadge>Best Overall</AwardBadge>
          <AwardBadge>Editor&apos;s Pick</AwardBadge>
          <AwardBadge surface="outline" tier="callout">
            Lab tested
          </AwardBadge>
        </div>
      </Specimen>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes and icons",
  render: () => (
    <div className="flex flex-col gap-section">
      <Specimen caption="Small — inside offer rows">
        <div className="flex flex-wrap items-center gap-cluster">
          {TONES.map((tone) => (
            <StatusPill key={tone} tone={tone} size="sm">
              {TONE_COPY[tone]}
            </StatusPill>
          ))}
          <StatusPill kind="technical" size="sm">
            ISO 17025
          </StatusPill>
        </div>
      </Specimen>
      <Specimen caption="Icon in place of the dot">
        <div className="flex flex-wrap items-center gap-cluster">
          <StatusPill tone="neutral" icon={Truck}>
            Free 2-day shipping
          </StatusPill>
        </div>
      </Specimen>
    </div>
  ),
};

export const AssayVerdicts: Story = {
  name: "Assay verdicts on a status keyline",
  render: () => (
    <ul className="m-0 flex max-w-xl list-none flex-col divide-y divide-hairline border-y border-hairline p-0">
      {labAssays.slice(0, 6).map((a) => (
        <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_var(--keyline-price)_var(--keyline-status)] items-center gap-x-stack py-row-compact">
          <span className="min-w-0 truncate text-body-sm text-ink">{a.analyte}</span>
          <span className="type-metric text-right text-body-sm text-ink">{a.result}</span>
          <span className="flex justify-end">
            <StatusPill tone={a.status === "pass" ? "positive" : a.status === "watch" ? "caution" : "negative"}>
              {a.status === "pass" ? "Pass" : a.status === "watch" ? "Watch" : "Fail"}
            </StatusPill>
          </span>
        </li>
      ))}
    </ul>
  ),
};

export const AsLink: Story = {
  name: "Polymorphic · asChild anchor",
  render: () => (
    <StatusPill asChild kind="technical" icon={FlaskConical}>
      <a href="#methodology" className="focus-ring">
        Lab methodology
      </a>
    </StatusPill>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="flex flex-wrap items-center gap-cluster">
        {TONES.map((tone) => (
          <StatusPill key={tone} tone={tone}>
            {TONE_COPY[tone]}
          </StatusPill>
        ))}
        <StatusPill kind="technical">ISO 17025</StatusPill>
        <AwardBadge>Best Overall</AwardBadge>
      </div>
    </VerticalCompare>
  ),
};
