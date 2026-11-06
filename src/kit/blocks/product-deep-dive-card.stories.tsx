import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { ProductDeepDiveCard } from "./product-deep-dive-card";

const meta = {
  title: "Blocks/Product deep dive card",
  component: ProductDeepDiveCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: { pick: watchesGuide.picks[0]!, disclosureHref: "#disclosure" },
} satisfies Meta<typeof ProductDeepDiveCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A pick’s full review, with the same geometry as every other on the page:
 * the photograph and the score on the left, the argument and the buy box on
 * the right, the specifications across the foot.
 * @summary One pick’s full review (a watch, Atelier).
 */
export const Review: Story = {};

/**
 * A supplement’s review: the lab’s stamp on the photograph and the heavy
 * metals under the score.
 * @summary A lab-tested supplement’s full review (Assay).
 */
export const LabReview: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { pick: creatineGuide.picks[0]! },
};

/**
 * The partner retailer charges $160 and an independent $149: the buy box
 * leads with $149. The deep dive never moves a partner up.
 * @summary Lowest price first in the buy box, even above a partner (running).
 */
export const LowestPriceFirst: Story = {
  parameters: { theme: "assay", category: "running" },
  args: { pick: runningGuide.picks[1]! },
};

/**
 * In a narrow container the two columns become one reading order:
 * photograph, story, score, specifications.
 * @summary The review in a phone-width container: one reading order.
 */
export const NarrowContainer: Story = {
  parameters: { frame: "narrow" },
  args: { pick: watchesGuide.picks[1]! },
};
