import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { offer } from "@/fixtures/kit/build";
import { assertKitPage } from "@/kit/testing/page-checks";
import { OnCard, Specimen, State } from "@/kit/testing/specimen";

import { Button } from "./button";
import { BuyButton, BuyLink, BuyPill, BuyRow } from "./buy";
import { JumpLink } from "./jump-link";

/**
 * Every state on one sheet, in both themes, for people reviewing the
 * system. Not in the agent manifest: agents read the use-case stories.
 */
const meta = {
  title: "Specimen sheets/Primitives/Buttons and links",
  tags: ["!manifest"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
} satisfies Meta;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION =
  "Every action and every monetized link. Buy links are built on AffiliateAction (sponsored rel, attribution, click tracking); one filled button per product in view.";

/** One button per product: each state gets its own product, as on a page. */
const atelier = {
  hf: offer("story-hf", "Haus & Field", 3950),
  verra: offer("story-verra", "Verra", 3990),
  ws: offer("story-ws", "Watchstore", 420),
  long: offer("story-long", "Bergström & Lindqvist Horlogerie", 4850),
  sold: offer("story-sold", "Watchstore", 4100, { inStock: false }),
};

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => (
    <Specimen kind="Primitive" title="Buttons and links" description={DESCRIPTION}>
      <State label="Buy button: primary, the pick in view">
        <div className="flex flex-col items-start gap-3">
          <BuyButton offer={atelier.hf} productId="story-a" placement="story" icon />
          <BuyButton offer={atelier.hf} productId="story-b" placement="story" icon fullWidth>
            View deal at Haus & Field
          </BuyButton>
        </div>
      </State>
      <State label="Buy button: secondary, every other card">
        <div className="flex flex-col items-start gap-3">
          <BuyButton offer={atelier.ws} productId="story-c" placement="story" emphasis="secondary" icon />
          <BuyButton offer={atelier.long} productId="story-d" placement="story" emphasis="secondary" icon />
        </div>
      </State>
      <State label="Buy pill: tables and catalog cards">
        <div className="flex flex-wrap items-center gap-3">
          <BuyPill offer={atelier.hf} productId="story-e" placement="story" filled />
          <BuyPill offer={atelier.verra} productId="story-f" placement="story" />
          <BuyPill offer={atelier.ws} productId="story-g" placement="story">
            Buy at Watchstore
          </BuyPill>
        </div>
      </State>
      <State label="Retailer rows (the whole row is the link)">
        <OnCard className="px-0 py-0">
          <ul className="@container m-0 list-none p-0">
            {[
              { o: atelier.verra, best: 3950 },
              { o: atelier.long, best: 3950 },
              { o: atelier.sold, best: 3950 },
            ].map(({ o, best }) => (
              <li key={o.id} className="border-b border-line last:border-0">
                <BuyRow offer={o} productId="story-h" placement="story" best={best} className="px-5" />
              </li>
            ))}
          </ul>
        </OnCard>
      </State>
      <State label="Text links">
        <div className="flex flex-col items-start gap-3">
          <p className="m-0 t-body text-fg-body">
            Our pick is <BuyLink offer={atelier.hf} productId="story-i" placement="story">$3,950 at Haus & Field</BuyLink>, the lowest we found.
          </p>
          <JumpLink href="#review">Read the full review</JumpLink>
        </div>
      </State>
      <State label="Plain buttons (no link)">
        <div className="flex flex-wrap items-center gap-3">
          <Button emphasis="primary">Save this guide</Button>
          <Button emphasis="secondary">Compare</Button>
          <Button emphasis="quiet">Reset</Button>
          <Button emphasis="secondary" disabled>
            Sold out
          </Button>
        </div>
      </State>
    </Specimen>
  ),
};

const assay = {
  nl: offer("story-nl", "Northlane", 189, { originalPrice: 220 }),
  hf: offer("story-hf2", "Haus & Field", 199),
  ps: offer("story-ps", "Peak Supply", 205, { inStock: false }),
};

export const Assay: Story = {
  name: "Assay, running",
  parameters: { theme: "assay" },
  render: () => (
    <Specimen kind="Primitive" title="Buttons and links" description={DESCRIPTION} category="running">
      <State label="Buy button: primary and secondary">
        <div className="flex flex-col items-start gap-3">
          <BuyButton offer={assay.nl} productId="story-j" placement="story" icon />
          <BuyButton offer={assay.hf} productId="story-k" placement="story" emphasis="secondary" icon />
        </div>
      </State>
      <State label="Buy pill">
        <div className="flex flex-wrap items-center gap-3">
          <BuyPill offer={assay.nl} productId="story-l" placement="story" filled />
          <BuyPill offer={assay.hf} productId="story-m" placement="story" />
        </div>
      </State>
      <State label="Retailer rows in a narrow box: the View pill keeps only its arrow">
        <div className="max-w-xs">
          <OnCard className="px-0 py-0">
            <ul className="@container m-0 list-none p-0">
              {[assay.hf, assay.ps].map((o) => (
                <li key={o.id} className="border-b border-line last:border-0">
                  <BuyRow offer={o} productId="story-n" placement="story" best={189} className="px-5" />
                </li>
              ))}
            </ul>
          </OnCard>
        </div>
      </State>
    </Specimen>
  ),
};
