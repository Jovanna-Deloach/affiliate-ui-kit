import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, userEvent, within } from "storybook/test";

import { DISCOVERY_NOW, savedItems } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";
import { seedDevice } from "@/kit/testing/device";

import { SavedItems } from "./saved-items";

const meta = {
  title: "Blocks/Saved items",
  component: SavedItems,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { now: DISCOVERY_NOW, signInHref: "#sign-in" },
} satisfies Meta<typeof SavedItems>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Saved on this device: two products and two guides, two with the reader’s notes, and Sign in to
 * keep them everywhere.
 * @summary Saved on this device, with notes and Sign in.
 */
export const OnThisDevice: Story = { beforeEach: () => seedDevice("saved", savedItems) };

/**
 * A signed-in reader’s list, kept by the account.
 * @summary Saved in an account.
 */
export const FromAnAccount: Story = { args: { items: savedItems, onRemove: fn(), onNote: fn() } };

/**
 * Writing a note on a saved product, in place.
 * @summary Adding a note to a saved product.
 */
export const AddingANote: Story = {
  args: { items: savedItems, onRemove: fn(), onNote: fn() },
  play: async (context) => {
    await userEvent.click(within(context.canvasElement).getByRole("button", { name: /Add a note on Northlane Basics/ }));
    await assertKitPage(context);
  },
};

/**
 * Nothing saved yet: how to save.
 * @summary Nothing saved yet.
 */
export const NothingSaved: Story = { args: { items: [] } };
