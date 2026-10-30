import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Specimen } from "@/stories/specimen";
import { VerticalCompare } from "@/stories/vertical-compare";

import { Switch } from "./switch";

const meta = {
  title: "Tier 0 · Shared Controls/Switch",
  component: Switch,
  parameters: { layout: "fullscreen" },
  args: { label: "Highlight matches", defaultChecked: true, size: "md" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md"] } },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-section">
      <Specimen caption="On and off, two sizes, with and without labels">
        <div className="flex flex-wrap items-center gap-grid">
          <Switch defaultChecked aria-label="On" />
          <Switch aria-label="Off" />
          <Switch size="sm" defaultChecked aria-label="Small on" />
          <Switch size="sm" aria-label="Small off" />
          <Switch defaultChecked label="ISO 17025 certified only" description="Hide products without an accredited assay" />
          <Switch disabled aria-label="Disabled" />
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
        <Switch defaultChecked label="Highlight matches" />
        <Switch label="Price alerts" />
      </div>
    </VerticalCompare>
  ),
};
