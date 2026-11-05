import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { inNarrowColumn, inWell } from "@/kit/testing/stories";

import { ProductDeepDiveCard } from "./product-deep-dive-card";

const meta = {
  title: "Kit/Blocks/Product deep dive card",
  component: ProductDeepDiveCard,
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof ProductDeepDiveCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Watch: Story = {
  name: "Atelier, watch",
  parameters: { theme: "atelier" },
  decorators: [inWell()],
  args: { pick: watchesGuide.picks[0]!, disclosureHref: caliberSite.disclosureHref },
};

export const Supplement: Story = {
  name: "Assay, lab results",
  parameters: { theme: "assay" },
  decorators: [inWell("supplements")],
  args: { pick: creatineGuide.picks[0]!, disclosureHref: provingGroundSite.disclosureHref },
};

/** The $149 retailer leads; the $160 partner sits below it. */
export const LowestPriceFirst: Story = {
  name: "Assay, running: lowest price first",
  parameters: { theme: "assay" },
  decorators: [inWell("running")],
  args: { pick: runningGuide.picks[1]!, disclosureHref: provingGroundSite.disclosureHref },
};

export const NarrowContainer: Story = {
  name: "Narrow container (one reading order)",
  parameters: { theme: "atelier" },
  decorators: [inNarrowColumn()],
  args: { pick: watchesGuide.picks[1]!, disclosureHref: caliberSite.disclosureHref },
};
