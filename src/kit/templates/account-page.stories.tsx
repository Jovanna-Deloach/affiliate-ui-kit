import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { DISCOVERY_NOW, reader, savedItems, viewedItems } from "@/fixtures/kit/discovery";
import { priceAlerts } from "@/fixtures/kit/safety";
import { provingGroundSite } from "@/fixtures/kit/sites";
import { assertKitPage } from "@/kit/testing/page-checks";

import { AccountPage } from "./account-page";

// A signed-in reader’s account. Every story runs the kit page checks.
const meta = {
  title: "Templates/Account page",
  component: AccountPage,
  tags: ["new"],
  parameters: { layout: "fullscreen", kit: true, frame: "none", theme: "assay" },
  play: assertKitPage,
  args: {
    site: provingGroundSite,
    reader,
    view: "saved",
    hrefs: { saved: "#saved", alerts: "#alerts", history: "#history" },
    saved: savedItems,
    alerts: priceAlerts,
    history: viewedItems,
    onRemove: fn(),
    onNote: fn(),
    onPause: fn(),
    onDelete: fn(),
    onClear: fn(),
    now: DISCOVERY_NOW,
  },
} satisfies Meta<typeof AccountPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The Saved tab: products and guides the reader kept, with their notes.
 * @summary Saved products and guides.
 */
export const Saved: Story = {};

/**
 * The Price alerts tab: alerts still watching, then the ones met.
 * @summary Price alerts, watching and met.
 */
export const PriceAlerts: Story = { args: { view: "alerts" } };

/**
 * The History tab: guides the reader started and products they looked at, with Clear history.
 * @summary Recently viewed, with Clear history.
 */
export const History: Story = { args: { view: "history" } };
