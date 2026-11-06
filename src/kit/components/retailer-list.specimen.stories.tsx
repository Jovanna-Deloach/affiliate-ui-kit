import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { offer } from "@/fixtures/kit/build";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { rankOffers } from "@/kit/lib/offers";
import { assertKitPage } from "@/kit/testing/page-checks";
import { Specimen, State } from "@/kit/testing/specimen";

import { RetailerList } from "./retailer-list";

/**
 * Every state on one sheet, in both themes, for people reviewing the
 * system. Not in the agent manifest: agents read the use-case stories.
 */
const meta = {
  title: "Specimen sheets/Components/Retailer list",
  tags: ["!manifest"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
} satisfies Meta;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const r = runningGuide.picks.map((p) => p.product);

export const Assay: Story = {
  name: "Assay, running",
  parameters: { theme: "assay" },
  render: () => {
    const aerolite = rankOffers(r[0]!.offers);
    return (
      <Specimen kind="Component" title="Retailer list" description="Every other retailer as a 44px row on a hairline: price, how far above the best price, a View pill. Sold-out rows are not links." category="running">
        <State label="In stock and sold out">
          <RetailerList offers={aerolite.slice(1)} best={aerolite[0]!.price} productId="rl-1" placement="story" />
        </State>
        <State label="One row">
          <RetailerList offers={[offer("rl-verra", "Verra", 215)]} best={189} productId="rl-2" placement="story" />
        </State>
        <State label="All sold out">
          <RetailerList offers={[offer("rl-a", "Northlane", 160, { inStock: false }), offer("rl-b", "Verra", 175, { inStock: false })]} productId="rl-3" placement="story" />
        </State>
        <State label="Narrow: the View pill keeps its arrow" className="max-w-xs">
          <RetailerList offers={[offer("rl-c", "Haus & Field", 207), offer("rl-d", "Northlane", 212, { inStock: false })]} best={189} productId="rl-4" placement="story" />
        </State>
      </Specimen>
    );
  },
};

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => {
    const meridian = rankOffers(watchesGuide.picks[0]!.product.offers);
    return (
      <Specimen kind="Component" title="Retailer list" description="The rows under the offer card, in the watch magazine’s theme.">
        <State label="A competitor and a sold-out retailer">
          <RetailerList offers={meridian.slice(1)} best={meridian[0]!.price} productId="rl-5" placement="story" />
        </State>
        <State label="Long merchant name">
          <RetailerList offers={[offer("rl-long", "Bergström & Lindqvist Horlogerie", 4990)]} best={4850} productId="rl-6" placement="story" />
        </State>
      </Specimen>
    );
  },
};
