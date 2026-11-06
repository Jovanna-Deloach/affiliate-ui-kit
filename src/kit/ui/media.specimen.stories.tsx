import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { Specimen, State } from "@/kit/testing/specimen";

import { Avatar } from "./avatar";
import { ProductImage } from "./product-image";

/**
 * Every state on one sheet, in both themes, for people reviewing the
 * system. Not in the agent manifest: agents read the use-case stories.
 */
const meta = {
  title: "Kit/Specimen sheets/Primitives/Product image and avatar",
  tags: ["!manifest"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
} satisfies Meta;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "Studio photography on the theme’s radial well: background-free cut-outs, contain-fit inside an inset, with a soft contact shadow. Nothing is cropped.";

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => {
    const [meridian, ardent, sato] = watchesGuide.picks;
    return (
      <Specimen kind="Primitive" title="Product image and avatar" description={DESCRIPTION} columns={3}>
        <State label="Portrait, 4 : 4.2 (review frame)">
          <ProductImage image={meridian!.product.image} productId={meridian!.product.id} ratio="portrait" pad="lg" sizes="24rem" />
        </State>
        <State label="Landscape, 4 : 3">
          <ProductImage image={ardent!.product.image} productId={ardent!.product.id} ratio="landscape" pad="md" sizes="24rem" />
        </State>
        <State label="Square thumbnails">
          <div className="grid grid-cols-3 gap-3">
            {watchesGuide.picks.slice(2).map((p) => (
              <ProductImage key={p.product.id} image={p.product.image} productId={p.product.id} ratio="square" pad="sm" sizes="6rem" />
            ))}
          </div>
        </State>
        <State label="Fill: takes its box (verdict cards)">
          <div className="relative h-56 overflow-hidden rounded-media">
            <div className="absolute inset-0">
              <ProductImage image={sato!.product.image} productId={sato!.product.id} ratio="fill" pad="md" sizes="24rem" />
            </div>
          </div>
        </State>
        <State label="Avatars">
          <div className="flex items-center gap-4">
            <Avatar person={watchesGuide.author} />
            <Avatar person={watchesGuide.author} size="sm" />
            <Avatar person={{ name: "Henrik Aalto" }} />
            <Avatar person={{ name: "Mara Lindgren" }} size="sm" />
          </div>
        </State>
      </Specimen>
    );
  },
};

export const Assay: Story = {
  parameters: { theme: "assay" },
  render: () => {
    const [aerolite, tempo] = runningGuide.picks;
    const [peak, ironhouse] = creatineGuide.picks;
    return (
      <Specimen kind="Primitive" title="Product image and avatar" description={DESCRIPTION} columns={3} category="supplements">
        <State label="Wide object, landscape frame">
          <ProductImage image={aerolite!.product.image} productId={aerolite!.product.id} ratio="landscape" pad="md" sizes="24rem" />
        </State>
        <State label="Tall object, portrait frame">
          <ProductImage image={ironhouse!.product.image} productId={ironhouse!.product.id} ratio="portrait" pad="lg" sizes="24rem" />
        </State>
        <State label="Square thumbnails">
          <div className="grid grid-cols-3 gap-3">
            {[peak!, tempo!].map((p) => (
              <ProductImage key={p.product.id} image={p.product.image} productId={p.product.id} ratio="square" pad="sm" sizes="6rem" />
            ))}
          </div>
        </State>
      </Specimen>
    );
  },
};
