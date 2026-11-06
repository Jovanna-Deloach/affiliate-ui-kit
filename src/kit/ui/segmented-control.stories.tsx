import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { SegmentedControl } from "./segmented-control";

const meta = {
  title: "Primitives/Segmented control",
  component: SegmentedControl,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: {
    legend: "Rank by",
    showLegend: true,
    defaultValue: "quality",
    options: [
      { value: "quality", label: "Quality" },
      { value: "value", label: "Value" },
    ],
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A ranking ordered by what the lab found, or by value for money: the same
 * list, two orders.
 * @summary Rank by Quality or Value.
 */
export const QualityOrValue: Story = {};

/**
 * A dose shown by body weight, in pounds or kilograms. The legend is for
 * screen readers only; the options say enough.
 * @summary Pounds or kilograms for a dose by body weight.
 */
export const Units: Story = {
  args: {
    legend: "Body weight in",
    showLegend: false,
    defaultValue: "lb",
    options: [
      { value: "lb", label: "lb" },
      { value: "kg", label: "kg" },
    ],
  },
};
