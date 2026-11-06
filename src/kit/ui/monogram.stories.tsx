import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Monogram } from "./marks";

const meta = {
  title: "Primitives/Monogram",
  component: Monogram,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: { name: "Haus & Field" },
} satisfies Meta<typeof Monogram>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Two words, two letters: “Haus & Field” is HF (the ampersand is skipped).
 * Retailers never need a logo file.
 * @summary A two-word merchant as two letters.
 */
export const TwoWords: Story = {};

/**
 * A one-word merchant gets one letter.
 * @summary A one-word merchant as one letter.
 */
export const OneWord: Story = {
  args: { name: "Verra" },
};
