import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";

import { productCreatine, productShoe01, productShoe02, productWatch } from "@/fixtures/products";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { InlineProductMention } from "./inline-product-mention";

const meta = {
  title: "Tier 6 · Editorial & Visual Proof/InlineProductMention",
  component: InlineProductMention,
  parameters: { layout: "fullscreen" },
  args: { product: productShoe01, variant: "block", ctaLabel: "View", placement: "story" },
  argTypes: {
    variant: { control: "inline-radio", options: ["block", "inline"] },
    product: { control: false },
    offer: { control: false },
    attribution: { control: false },
  },
} satisfies Meta<typeof InlineProductMention>;

export default meta;
type Story = StoryObj<typeof meta>;

function Prose({ children }: { children: ReactNode }) {
  return <div className="flex max-w-prose flex-col gap-stack text-body leading-body text-ink-secondary">{children}</div>;
}

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <InlineProductMention {...args} />
    </div>
  ),
};

export const InProse: Story = {
  name: "Inside an article — block bar between paragraphs, chip inside a sentence",
  render: () => (
    <Prose>
      <p className="m-0">
        After 412 logged miles across four testers, the Aerolite 3 delivered the most consistent energy return of any shoe in
        this round-up. The stack is tall, but the platform is wide enough that none of our testers reported the instability
        that usually comes with 38 mm of foam.
      </p>
      <InlineProductMention product={productShoe01} placement="article-body" />
      <p className="m-0">
        If you want the same midsole with a firmer ride, the{" "}
        <InlineProductMention variant="inline" product={productShoe02} placement="article-inline" /> is the shoe we reach for
        on tempo days — lighter, flatter, and noticeably less forgiving over 10 miles.
      </p>
    </Prose>
  ),
};

export const Payloads: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-section">
      <Specimen caption="Running shoe — best in-stock offer">
        <InlineProductMention product={productShoe01} />
      </Specimen>
      <Specimen caption="Luxury watch — long price, custom label">
        <InlineProductMention product={productWatch} ctaLabel="Enquire" />
      </Specimen>
      <Specimen caption="Supplement — contain-fit thumbnail on its backdrop">
        <InlineProductMention product={productCreatine} ctaLabel="Shop" />
      </Specimen>
      <Specimen caption="Inline chip">
        <p className="m-0 max-w-prose text-body leading-body text-ink-secondary">
          Pair it with the <InlineProductMention variant="inline" product={productCreatine} /> for the full protocol.
        </p>
      </Specimen>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="flex flex-col gap-stack">
        <InlineProductMention product={productShoe01} />
        <p className="m-0 max-w-prose text-body leading-body text-ink-secondary">
          The <InlineProductMention variant="inline" product={productShoe02} /> is the tempo-day alternative.
        </p>
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 (CTA on its own row) vs 1280",
  render: () => <ViewportFrames render={() => <InlineProductMention product={productShoe01} />} />,
};
