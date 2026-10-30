import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { savedProducts } from "@/fixtures/account";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare } from "@/stories/vertical-compare";

import { Sparkline } from "./sparkline";

const drop = savedProducts[0]!.priceHistory!;
const rise = savedProducts[2]!.priceHistory!;
const flat = savedProducts[3]!.priceHistory!;

const meta = {
  title: "Tier 0 · Shared Controls/Sparkline",
  component: Sparkline,
  parameters: { layout: "fullscreen" },
  args: { values: drop, tone: "auto", label: "30-day price trend" },
  argTypes: { values: { control: false }, tone: { control: "inline-radio", options: ["auto", "positive", "caution", "neutral"] } },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Directions: Story = {
  render: () => (
    <div className="flex flex-col gap-section">
      <Specimen caption="Tone follows direction: a fall is positive ink, a rise caution, flat tertiary">
        <div className="flex flex-wrap items-center gap-grid">
          <Sparkline values={drop} label="Dropped" />
          <Sparkline values={rise} label="Risen" />
          <Sparkline values={flat} label="Unchanged" />
        </div>
      </Specimen>
      <Specimen caption="Stretched to a tile's width (preserveAspectRatio none keeps the stroke hairline-true)">
        <div className="max-w-xs rounded-container border border-hairline p-card-compact">
          <Sparkline values={drop} label="Dropped" className="w-full" />
        </div>
      </Specimen>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="flex flex-wrap items-center gap-grid">
        <Sparkline values={drop} label="Dropped" />
        <Sparkline values={rise} label="Risen" />
        <Sparkline values={flat} label="Unchanged" />
      </div>
    </VerticalCompare>
  ),
};
