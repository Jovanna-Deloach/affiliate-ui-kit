import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { ReadMore } from "./read-more";

const meta = {
  title: "Primitives/Read more",
  component: ReadMore,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: {
    text: "I followed the loading phase on the tub, 20\u00a0g a day, and felt bloated the whole week. I dropped to 5\u00a0g a day and it settled within three days.\n\nAfter two months at 5\u00a0g, my strength on the main lifts is up a little, though that is also two months of training. It dissolves well in warm water and less well in cold milk, where it leaves a fine grit at the bottom of the glass. I would skip the loading phase and buy it again for the price.",
  },
} satisfies Meta<typeof ReadMore>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A long review cut to four lines, with See more; the whole text is in the
 * page.
 * @summary A long review cut to four lines.
 */
export const LongReview: Story = {};

/**
 * A short review is shown whole, with no button.
 * @summary Short text, shown whole.
 */
export const ShortText: Story = { args: { text: "I add it to coffee every morning and cannot taste it. That is all I needed." } };
