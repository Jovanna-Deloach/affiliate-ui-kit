import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Specimen } from "@/stories/specimen";
import { VerticalCompare } from "@/stories/vertical-compare";

import { NumberStepper } from "./number-stepper";

const meta = {
  title: "Tier 0 · Shared Controls/NumberStepper",
  component: NumberStepper,
  parameters: { layout: "fullscreen" },
  args: { label: "Target price", defaultValue: 170, step: 5, min: 0, prefix: "$", width: "figure" },
  argTypes: { width: { control: "inline-radio", options: ["figure", "full"] } },
} satisfies Meta<typeof NumberStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-section">
      <Specimen caption="Price on the 120px figure keyline">
        <NumberStepper label="Target price" defaultValue={170} step={5} min={0} prefix="$" />
      </Specimen>
      <Specimen caption="With a unit suffix, clamped 1–10">
        <NumberStepper label="Servings per day" defaultValue={2} min={1} max={10} suffix="/ day" />
      </Specimen>
      <Specimen caption="Full width, disabled">
        <div className="max-w-xs">
          <NumberStepper label="Quantity" defaultValue={1} width="full" disabled />
        </div>
      </Specimen>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <NumberStepper label="Target price" defaultValue={170} step={5} min={0} prefix="$" />
    </VerticalCompare>
  ),
};
