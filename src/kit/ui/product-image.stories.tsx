import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { ProductImage } from "./product-image";

const meta = {
  title: "Kit/Primitives/Product image",
  component: ProductImage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "narrow" },
  play: assertKitPage,
  args: {
    image: {
      src: "/fixtures/kit/watch-meridian.webp",
      alt: "Halden Meridian 40 GMT, steel case and bracelet with a red and blue bezel",
      width: 686,
      height: 1023,
    },
    productId: "w-halden-meridian-40",
    sizes: "24rem",
  },
} satisfies Meta<typeof ProductImage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The review frame, 4 : 4.2: tall enough for a watch on its bracelet,
 * with 9% of air around the object on the studio well.
 * @summary The review frame (portrait, 4 : 4.2), the largest view of a product.
 */
export const ReviewFrame: Story = {};

/**
 * A wide object (a running shoe) in a 4 : 3 frame, so it is not set small
 * in a tall box.
 * @summary A landscape frame (4 : 3) for wide objects.
 */
export const Landscape: Story = {
  parameters: { theme: "assay", category: "running" },
  args: {
    image: { src: "/fixtures/kit/shoe-aerolite.webp", alt: "Meridian Aerolite 3, white upper with an orange midsole", width: 736, height: 716 },
    productId: "r-meridian-aerolite-3",
    ratio: "landscape",
    pad: "md",
  },
};

/**
 * A square thumbnail for a table row or a catalogue card, with less air so
 * the object stays legible small.
 * @summary A square thumbnail for tables and catalogue cards.
 */
export const Thumbnail: Story = {
  args: {
    image: { src: "/fixtures/kit/watch-okada.webp", alt: "Okada Tide 40 Diver, black dial and bezel on a steel bracelet", width: 644, height: 1200 },
    productId: "w-okada-tide-40",
    ratio: "square",
    pad: "sm",
    sizes: "6rem",
    className: "max-w-24",
  },
};

/**
 * `fill` takes the size of a positioned parent, so a card sets the frame and
 * the photograph never sets the card’s height (verdict-card wells).
 * @summary A photograph that fills its positioned parent (card wells).
 */
export const FillsItsParent: Story = {
  decorators: [
    (Story) => (
      <div className="relative h-72 overflow-hidden rounded-media">
        <div className="absolute inset-0">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    image: { src: "/fixtures/kit/watch-sato.webp", alt: "Sato Marine 38, black dive bezel on an orange rubber strap", width: 867, height: 1069 },
    productId: "w-sato-marine-38",
    ratio: "fill",
    pad: "md",
  },
};
