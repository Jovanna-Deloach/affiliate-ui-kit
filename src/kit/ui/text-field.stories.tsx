import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { TextField } from "./field";

const meta = {
  title: "Primitives/Text field",
  component: TextField,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { label: "Title", name: "title", placeholder: "Mixes clear in cold water" },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A review’s title: one line, with an example in the placeholder.
 * @summary A review title field.
 */
export const ReviewTitle: Story = {};

/**
 * An email address for a price alert, with a hint that says what it is
 * used for, and the browser’s autofill.
 * @summary An email field for an alert, with a hint and autofill.
 */
export const EmailForAlert: Story = {
  args: { label: "Email", name: "email", type: "email", autoComplete: "email", placeholder: undefined, hint: "Only for this alert. We never share it." },
};

/**
 * A field the reader can skip, marked “(optional)”; every other field is
 * required.
 * @summary An optional field.
 */
export const Optional: Story = {
  args: { label: "Where you bought it", name: "retailer", optional: true, placeholder: "Northlane" },
};

/**
 * An answer that cannot be sent as it is: the error says how to fix it.
 * @summary A field with an error.
 */
export const WithError: Story = {
  args: { label: "Email", name: "email", type: "email", defaultValue: "dana@", placeholder: undefined, error: "Enter an email address like name@example.com." },
};
