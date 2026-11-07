import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, userEvent, within } from "storybook/test";

import { soldOutSummary } from "@/fixtures/kit/discovery";
import { creatineGuide } from "@/fixtures/kit/creatine";
import { assertKitPage } from "@/kit/testing/page-checks";

import { PriceAlert } from "./price-alert";

const meta = {
  title: "Components/Price alert",
  component: PriceAlert,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { product: creatineGuide.picks[0]!.product, privacyHref: "#privacy", onSubmit: fn() },
} satisfies Meta<typeof PriceAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A reader without an account: today’s lowest price, a target 10% under it, and an email address.
 * @summary A price to drop below, with an email address.
 */
export const DropsBelow: Story = {};

/**
 * A signed-in reader: no email address asked.
 * @summary Signed in: the price alone.
 */
export const SignedIn: Story = { args: { askEmail: false } };

/**
 * Sold out everywhere: tell me when it’s back.
 * @summary Back in stock, for a sold-out product.
 */
export const BackInStock: Story = { args: { product: soldOutSummary.product } };

/**
 * A target above today’s price is refused, with the reason.
 * @summary A target above today’s price, refused.
 */
export const TargetTooHigh: Story = {
  args: { askEmail: false },
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const field = canvas.getByLabelText(/Tell me when it drops below/);
    await userEvent.clear(field);
    await userEvent.type(field, "30");
    await userEvent.click(canvas.getByRole("button", { name: "Set price alert" }));
    await assertKitPage(context);
  },
};
