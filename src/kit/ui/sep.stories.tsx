import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Sep } from "./marks";

const meta = {
  title: "Kit/Primitives/Sep",
  component: Sep,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof Sep>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * An offer’s terms in one muted line: the dot is decorative, so a screen
 * reader hears “Free 2-day shipping, Verified Oct 28” as two phrases with no
 * stray punctuation.
 * @summary The decorative dot between two parts of a muted line.
 */
export const BetweenTerms: Story = {
  render: () => (
    <p className="m-0 t-caption text-fg-muted">
      Free 2-day shipping
      <Sep />
      Verified Oct 28
    </p>
  ),
};
