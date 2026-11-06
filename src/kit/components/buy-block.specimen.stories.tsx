import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { Specimen, State } from "@/kit/testing/specimen";
import type { KitProduct } from "@/kit/types";

import { BuyBlock } from "./buy-block";

/**
 * The buy box: OfferCard + RetailerList + the inline disclosure. Every state
 * uses a different product, as on a page: one button per product, lowest
 * price first.
 *
 * Every state on one sheet, in both themes, for people reviewing the
 * system. Not in the agent manifest: agents read the use-case stories.
 */
const meta = {
  title: "Kit/Specimen sheets/Components/Buy box",
  tags: ["!manifest"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
} satisfies Meta;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "The lowest in-stock offer as an offer card, every other retailer as a 44px row, then the inline disclosure. Partners never move up.";

const soldOutEverywhere = (p: KitProduct): KitProduct => ({ ...p, id: `${p.id}-sold-out`, offers: p.offers.map((o) => ({ ...o, inStock: false })) });

const w = watchesGuide.picks.map((p) => p.product);
const c = creatineGuide.picks.map((p) => p.product);
const r = runningGuide.picks.map((p) => p.product);

export const Atelier: Story = {
  name: "Atelier: buy box states",
  parameters: { theme: "atelier" },
  render: () => (
    <Specimen kind="Component" title="Buy box" description={DESCRIPTION}>
      <State label="Lead offer, a competitor and a sold-out retailer">
        <BuyBlock product={w[0]!} placement="story" disclosureHref={caliberSite.disclosureHref} />
      </State>
      <State label="One retailer: no Best price, no rows">
        <BuyBlock product={w[4]!.offers.length > 1 ? { ...w[4]!, offers: [w[4]!.offers[0]!] } : w[4]!} placement="story" disclosureHref={caliberSite.disclosureHref} />
      </State>
      <State label="The only other retailer is sold out">
        <BuyBlock product={w[1]!} placement="story" disclosureHref={caliberSite.disclosureHref} />
      </State>
      <State label="Sold out everywhere">
        <BuyBlock product={soldOutEverywhere(w[2]!)} placement="story" disclosureHref={caliberSite.disclosureHref} />
      </State>
    </Specimen>
  ),
};

export const Assay: Story = {
  name: "Assay: lowest price first, discounts",
  parameters: { theme: "assay" },
  render: () => (
    <Specimen kind="Component" title="Buy box" description={DESCRIPTION} category="running">
      <State label="The $149 retailer leads; the $160 partner sits below">
        <BuyBlock product={r[1]!} placement="story" disclosureHref={provingGroundSite.disclosureHref} />
      </State>
      <State label="Discounted lead, three more retailers">
        <BuyBlock product={r[0]!} placement="story" disclosureHref={provingGroundSite.disclosureHref} />
      </State>
      <State label="Supplements: discounted, two competitors">
        <div data-category="supplements">
          <BuyBlock product={c[0]!} placement="story" disclosureHref={provingGroundSite.disclosureHref} />
        </div>
      </State>
      <State label="Supplements: one retailer">
        <div data-category="supplements">
          <BuyBlock product={c[2]!} placement="story" disclosureHref={provingGroundSite.disclosureHref} />
        </div>
      </State>
    </Specimen>
  ),
};
