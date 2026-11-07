import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, userEvent, within } from "storybook/test";

import { assertKitPage } from "@/kit/testing/page-checks";

import { SuggestAProduct } from "./suggest-a-product";

const meta = {
  title: "Blocks/Suggest a product",
  component: SuggestAProduct,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { category: "creatine", privacyHref: "#privacy", onSubmit: fn() },
} satisfies Meta<typeof SuggestAProduct>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Under a creatine ranking: the product, where to buy it, and an optional email address.
 * @summary Suggest a creatine for testing.
 */
export const Creatine: Story = {};

/**
 * A signed-in reader: no email address asked.
 * @summary Signed in: no email field.
 */
export const SignedIn: Story = { args: { askEmail: false } };

/**
 * Sent with no product named: the field says what it needs.
 * @summary Sent empty: the product field explains.
 */
export const MissingProduct: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Suggest it" }));
    await assertKitPage(context);
  },
};

/**
 * Sent: thanks in place of the form.
 * @summary Sent: thanks in place.
 */
export const Sent: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await userEvent.type(canvas.getByLabelText(/Product and brand/), "Harbor Nutrition Pure Creatine");
    await userEvent.click(canvas.getByRole("button", { name: "Suggest it" }));
    await canvas.findByText("Thanks, it’s on our list");
    await assertKitPage(context);
  },
};
