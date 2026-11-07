import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, userEvent, within } from "storybook/test";

import { assertKitPage } from "@/kit/testing/page-checks";

import { WriteReview } from "./write-review";

const meta = {
  title: "Blocks/Write review",
  component: WriteReview,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "card" },
  play: assertKitPage,
  args: { product: "Peak Supply Creatine Monohydrate", guidelinesHref: "#guidelines", onSubmit: fn() },
} satisfies Meta<typeof WriteReview>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A reader without an account: the form asks for an email address to
 * confirm the review.
 * @summary The review form for a reader without an account.
 */
export const WithoutAnAccount: Story = {};

/**
 * A signed-in reader: no email address asked.
 * @summary The review form for a signed-in reader.
 */
export const SignedIn: Story = { args: { askEmail: false } };

/**
 * Sent empty: each field that needs an answer says what is missing.
 * @summary The form’s errors, after sending it empty.
 */
export const WithErrors: Story = {
  play: async (context) => {
    await userEvent.click(within(context.canvasElement).getByRole("button", { name: "Submit review" }));
    await assertKitPage(context);
  },
};
