import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BadgeCheck, FlaskConical, Truck } from "lucide-react";

import { labAssays } from "@/fixtures/lab-assays";
import { Labeled } from "@/stories/story-label";
import { VerticalCompare } from "@/stories/vertical-compare";

import { StatusPill } from "./status-pill";

const TONES = ["positive", "caution", "negative", "neutral", "accent", "outline"] as const;
const TONE_COPY = {
  positive: "Best price",
  caution: "Low stock",
  negative: "Out of stock",
  neutral: "Our partner",
  accent: "Editor's pick",
  outline: "ISO 17025",
} as const;

const meta = {
  title: "Tier 2 · Evaluation & E-E-A-T/StatusPill",
  component: StatusPill,
  parameters: { layout: "fullscreen" },
  args: {
    children: "Best price",
    tone: "positive",
    size: "md",
  },
  argTypes: {
    tone: { control: "select", options: TONES },
    size: { control: "inline-radio", options: ["sm", "md"] },
    icon: { control: false },
  },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllTones: Story = {
  name: "Variants · tone × size",
  render: () => (
    <div className="flex flex-col gap-section-gap">
      {(["md", "sm"] as const).map((size) => (
        <Labeled key={size} label={`size="${size}" · tone = ${TONES.join(" | ")}`}>
          <div className="flex flex-wrap items-center gap-cluster-gap">
            {TONES.map((tone) => (
              <StatusPill key={tone} tone={tone} size={size}>
                {TONE_COPY[tone]}
              </StatusPill>
            ))}
          </div>
        </Labeled>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  name: "Variants · lucide icon",
  render: () => (
    <div className="flex flex-wrap items-center gap-cluster-gap">
      <StatusPill tone="positive" icon={BadgeCheck}>Verified</StatusPill>
      <StatusPill tone="neutral" icon={Truck}>Free 2-day shipping</StatusPill>
      <StatusPill tone="outline" icon={FlaskConical}>Lab tested</StatusPill>
    </div>
  ),
};

export const AssayVerdicts: Story = {
  name: "Data · assay verdicts from the lab fixture",
  render: () => (
    <ul className="flex max-w-xl flex-col divide-y divide-border-soft border-y-[length:var(--border-width-surface)] border-border-soft">
      {labAssays.slice(0, 6).map((a) => (
        <li key={a.id} className="flex items-center justify-between gap-cluster-gap py-[calc(var(--space-row-pad)*0.6)]">
          <span className="min-w-0 truncate text-sm text-foreground">{a.analyte}</span>
          <span className="flex shrink-0 items-center gap-cluster-gap">
            <span className="type-price text-sm text-foreground">{a.result}</span>
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
    <StatusPill asChild tone="outline" icon={FlaskConical}>
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
      <div className="flex flex-wrap items-center gap-cluster-gap">
        {TONES.map((tone) => (
          <StatusPill key={tone} tone={tone}>
            {TONE_COPY[tone]}
          </StatusPill>
        ))}
      </div>
    </VerticalCompare>
  ),
};
