import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";

import { compareItems, viewedItems } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";
import { seedDevice } from "@/kit/testing/device";

import { CompareButton } from "./compare-button";

const meta = {
  title: "Primitives/Compare button",
  component: CompareButton,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { item: compareItems[0]! },
  beforeEach: () => seedDevice("compare", []),
} satisfies Meta<typeof CompareButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Not in the tray yet: tick it to add the product.
 * @summary Compare, not ticked.
 */
export const NotInTheTray: Story = {};

/**
 * Already in the tray on this device: ticked.
 * @summary Ticked: the product is in the tray.
 */
export const InTheTray: Story = { beforeEach: () => seedDevice("compare", compareItems) };

/**
 * The tray already holds four: ticking a fifth is refused, and a line says why.
 * @summary A fifth product refused, with the reason.
 */
export const TrayFull: Story = {
  args: { item: { kind: "product", id: "c-tidewell-mono", brand: "Tidewell", title: "Creatine Monohydrate", href: "#report-tidewell" } },
  beforeEach: () => seedDevice("compare", [...compareItems, viewedItems[4]!]),
  play: async (context) => {
    await userEvent.click(within(context.canvasElement).getByRole("checkbox", { name: /Compare/ }));
    await assertKitPage(context);
  },
};
