import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { DISCOVERY_NOW } from "@/fixtures/kit/discovery";
import { priceAlerts } from "@/fixtures/kit/safety";
import { assertKitPage } from "@/kit/testing/page-checks";

import { AlertsManager } from "./alerts-manager";

const meta = {
  title: "Blocks/Alerts manager",
  component: AlertsManager,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { alerts: priceAlerts, now: DISCOVERY_NOW, onPause: fn(), onDelete: fn() },
} satisfies Meta<typeof AlertsManager>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A reader’s alerts: two still watching (one paused), two met with the price, retailer and day.
 * @summary Watching and met alerts, with pause and delete.
 */
export const Alerts: Story = {};

/**
 * None yet: how to set one.
 * @summary No alerts yet.
 */
export const NoneYet: Story = { args: { alerts: [] } };
