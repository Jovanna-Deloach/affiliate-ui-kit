import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { Award } from "@/kit/ui";

import { PickMedia } from "./pick-media";

const meta = {
  title: "Components/Pick media",
  component: PickMedia,
  subcomponents: { Award },
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "narrow" },
  play: assertKitPage,
  args: { pick: watchesGuide.picks[0]!, detail: "full", sizes: "24rem" },
} satisfies Meta<typeof PickMedia>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The review frame: the largest view of a pick, at the head of its deep
 * dive.
 * @summary A pick’s review frame (4 : 4.2).
 */
export const ReviewFrame: Story = {};

/**
 * The review frame carries the pick’s award in its top-left corner, as an
 * overlay positioned by the caller.
 * @summary The review frame with the pick’s award as an overlay.
 */
export const WithAward: Story = {
  args: { children: <Award className="absolute top-4 left-4">Our pick</Award> },
};

/**
 * In a verdict card the photograph fills the card’s well, so the card sets
 * the size and the photograph never sets the card’s height.
 * @summary The photograph filling a card’s well (a positioned parent with a size).
 */
export const CardWell: Story = {
  args: { detail: "card" },
  decorators: [
    (Story) => (
      <div className="relative h-64 overflow-hidden rounded-media">
        <div className="absolute inset-0">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * A square thumbnail for a table row or a catalog entry.
 * @summary A square thumbnail of a pick.
 */
export const Thumbnail: Story = {
  parameters: { theme: "assay", category: "running" },
  args: { pick: runningGuide.picks[0]!, detail: "thumb", sizes: "5rem", className: "max-w-20" },
};
