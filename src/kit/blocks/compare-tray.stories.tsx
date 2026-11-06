import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";

import { compareItems } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";
import { seedDevice } from "@/kit/testing/device";

import { CompareTray } from "./compare-tray";

const meta = {
  title: "Blocks/Compare tray",
  component: CompareTray,
  tags: ["autodocs", "new"],
  parameters: {
    layout: "fullscreen",
    kit: true,
    theme: "assay",
    category: "supplements",
    frame: "none",
    docs: { story: { inline: false, iframeHeight: 360 } },
  },
  play: assertKitPage,
  args: { compareHref: "/compare" },
  beforeEach: () => seedDevice("compare", compareItems),
} satisfies Meta<typeof CompareTray>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Three products chosen while browsing, along the bottom of the window, with a place for a fourth.
 * @summary Three products in the tray, ready to compare.
 */
export const ThreeChosen: Story = {};

/**
 * Compare opens them side by side, with a link to the full comparison.
 * @summary The three side by side.
 */
export const SideBySide: Story = {
  play: async (context) => {
    await userEvent.click(within(context.canvasElement.ownerDocument.body).getByRole("button", { name: "Compare 3" }));
    await assertKitPage(context);
  },
};

/**
 * One product so far: it asks for another before Compare appears.
 * @summary One product: choose one more.
 */
export const OneChosen: Story = { beforeEach: () => seedDevice("compare", compareItems.slice(0, 1)) };
