import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Switch } from "./choice";

const meta = {
  title: "Primitives/Switch",
  component: Switch,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { label: "Verified purchases only", name: "verified" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A setting that changes the list at once, no Apply button.
 * @summary Show only verified reviews, applied at once.
 */
export const VerifiedOnly: Story = { args: { defaultChecked: true } };

/**
 * An alert setting with a line on what it does.
 * @summary An email-alert setting with a hint.
 */
export const EmailAlerts: Story = {
  args: { label: "Email me when the price drops", hint: "Below $19 at any retailer we track.", name: "alerts" },
};
