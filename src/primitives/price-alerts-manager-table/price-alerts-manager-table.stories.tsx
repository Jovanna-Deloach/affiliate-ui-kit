import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { priceAlerts } from "@/fixtures/account";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { PriceAlertsManagerTable } from "./price-alerts-manager-table";

const meta = {
  title: "Tier 15 · Account & Personalization/PriceAlertsManagerTable",
  component: PriceAlertsManagerTable,
  parameters: { layout: "fullscreen" },
  args: { defaultAlerts: priceAlerts, step: 5 },
  argTypes: { defaultAlerts: { control: false }, alerts: { control: false } },
} satisfies Meta<typeof PriceAlertsManagerTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-4xl">
      <PriceAlertsManagerTable {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: { defaultAlerts: [] },
  render: (args) => (
    <div className="max-w-4xl">
      <PriceAlertsManagerTable {...args} />
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: (args) => <VerticalCompare render={() => <PriceAlertsManagerTable {...args} />} />,
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: (args) => <ViewportFrames render={() => <PriceAlertsManagerTable {...args} />} />,
};
