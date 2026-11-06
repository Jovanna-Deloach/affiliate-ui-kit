import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { runningGuide } from "@/fixtures/kit/running";
import { assertKitPage } from "@/kit/testing/page-checks";

import { Gallery } from "./gallery";

const meta = {
  title: "Components/Gallery",
  component: Gallery,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "running", frame: "narrow" },
  play: assertKitPage,
  args: {
    productId: runningGuide.picks[0]!.product.id,
    name: "Meridian Aerolite 3",
    images: [
      runningGuide.picks[0]!.product.image,
      { src: "/fixtures/shoe-aerolite-03-midsole.jpg", alt: "The midsole foam in close-up", width: 640, height: 800 },
      { src: "/fixtures/shoe-aerolite-04-upper.jpg", alt: "The knit upper in close-up", width: 640, height: 800 },
      { src: "/fixtures/shoe-aerolite-02-worn.jpg", alt: "The outsole after 300 miles", width: 1600, height: 1280 },
    ],
  },
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The studio cut-out first, then detail photographs edge to edge: the foam,
 * the upper, the wear after testing. (The kit’s supplements have one
 * photograph each, so this story shows a running shoe; on a supplement page
 * the details are the label and the powder.)
 * @summary The cut-out first, then three detail photographs, with thumbnails.
 */
export const WithDetails: Story = {};

/**
 * One photograph needs no thumbnails: the gallery shows the cut-out alone.
 * @summary A single photograph, without thumbnails.
 */
export const OnePhotograph: Story = {
  args: { images: [runningGuide.picks[0]!.product.image] },
};
