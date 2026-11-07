import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { savedItems } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";
import { seedDevice } from "@/kit/testing/device";

import { SaveButton } from "./save-button";

const meta = {
  title: "Primitives/Save button",
  component: SaveButton,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { item: savedItems[2]! },
} satisfies Meta<typeof SaveButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * In a product’s header, for a reader without an account: saving keeps it on this device.
 * @summary Save, kept on the device.
 */
export const OnAProductPage: Story = {};

/**
 * Icon only, over a card’s photograph; named for its product for screen readers.
 * @summary The compact bookmark for a card’s corner.
 */
export const OnACard: Story = { args: { compact: true } };

/**
 * Already saved on this device: the bookmark is filled and the button is pressed.
 * @summary Saved on this device: filled and pressed.
 */
export const SavedOnThisDevice: Story = {
  args: { item: savedItems[0]! },
  beforeEach: () => seedDevice("saved", savedItems),
};

/**
 * A signed-in reader: the account keeps the list, so the page passes the state and hears the change.
 * @summary Saved in an account: the page keeps the state.
 */
export const InAnAccount: Story = { args: { saved: true, onSavedChange: fn() } };
