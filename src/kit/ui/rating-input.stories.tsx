import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { RatingInput } from "./rating-input";

const meta = {
  title: "Primitives/Rating input",
  component: RatingInput,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
} satisfies Meta<typeof RatingInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The first question of a review form, already answered with four stars:
 * the picked star and every star before it are ink.
 * @summary Four of five stars picked, in a review form.
 */
export const Picked: Story = { args: { defaultValue: 4 } };

/**
 * Nothing picked yet: five gray stars, each a 44px target.
 * @summary No rating picked yet.
 */
export const Empty: Story = {};

/**
 * Sent without a rating: the error says what to do.
 * @summary A missing rating, with its error.
 */
export const WithError: Story = { args: { error: "Pick a rating from 1 to 5 stars." } };
