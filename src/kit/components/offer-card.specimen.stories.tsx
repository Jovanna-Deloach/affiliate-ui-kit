import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { offer } from "@/fixtures/kit/build";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { Specimen, State } from "@/kit/testing/specimen";

import { OfferCard } from "./offer-card";

/**
 * Every state on one sheet, in both themes, for people reviewing the
 * system. Not in the agent manifest: agents read the use-case stories.
 */
const meta = {
  title: "Specimen sheets/Components/Offer card",
  tags: ["!manifest"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
} satisfies Meta;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const w = watchesGuide.picks.map((p) => p.product);

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => (
    <Specimen kind="Component" title="Offer card" description="The lead offer: merchant and terms on the left; price, list price and Best price on the right; one full-width 44px button.">
      <State label="With a competitor (Best price)">
        <OfferCard offer={w[0]!.offers[0]!} productId="oc-1" verifiedAt="2026-10-28T08:00:00Z" best placement="story" />
      </State>
      <State label="Discounted">
        <OfferCard offer={offer("oc-verra", "Verra", 1650, { originalPrice: 1895, shippingNote: "Free shipping over $500" })} productId="oc-2" verifiedAt="2026-10-28T08:00:00Z" best placement="story" />
      </State>
      <State label="No shipping note or date">
        <OfferCard offer={offer("oc-plain", "Watchstore", 420)} productId="oc-3" placement="story" />
      </State>
      <State label="Long merchant name, custom label">
        <OfferCard
          offer={offer("oc-long", "Bergström & Lindqvist Horlogerie", 4850, { shippingNote: "Insured delivery in 3 days" })}
          productId="oc-4"
          verifiedAt="2026-10-28T08:00:00Z"
          placement="story"
          ctaLabel="Buy at Bergström & Lindqvist"
        />
      </State>
      <State label="In a narrow column" className="max-w-sm">
        <OfferCard offer={offer("oc-narrow", "Haus & Field", 4850, { shippingNote: "Free 2-day shipping" })} productId="oc-5" verifiedAt="2026-10-28T08:00:00Z" best placement="story" />
      </State>
    </Specimen>
  ),
};

export const Assay: Story = {
  name: "Assay, supplements",
  parameters: { theme: "assay" },
  render: () => (
    <Specimen kind="Component" title="Offer card" description="The same card in the lab theme: obsidian action, emerald accents for the section." category="supplements">
      <State label="Discounted, with a competitor">
        <OfferCard offer={offer("oc-peak", "Peak Supply", 21, { originalPrice: 26, shippingNote: "Free shipping over $35" })} productId="oc-6" verifiedAt="2026-10-29T08:00:00Z" best placement="story" />
      </State>
      <State label="One retailer">
        <OfferCard offer={offer("oc-nl", "Northlane", 32, { shippingNote: "Free 2-day shipping" })} productId="oc-7" verifiedAt="2026-10-29T08:00:00Z" placement="story" />
      </State>
    </Specimen>
  ),
};
