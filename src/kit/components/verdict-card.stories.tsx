import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { soldOutPick } from "@/fixtures/kit/cases";
import { creatineGuide } from "@/fixtures/kit/creatine";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { VerdictCard } from "./verdict-card";

const meta = {
  title: "Components/Verdict card",
  component: VerdictCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "column" },
  play: assertKitPage,
  args: { pick: watchesGuide.picks[0]!, jumpLabel: "Read the full review" },
} satisfies Meta<typeof VerdictCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The lead pick above the fold: why it wins, in two lines, its price and
 * the page’s one filled button, beside its photograph.
 * @summary The feature card for the page’s lead pick, with the one filled button.
 */
export const Feature: Story = {};

/**
 * Picks two and three: who each is for, its price and an outlined button,
 * so the lead pick keeps the only filled action.
 * @summary A compact card for picks 2 and 3: who it is for, price, outlined button.
 */
export const Compact: Story = {
  args: { pick: watchesGuide.picks[1]!, variant: "compact" },
};

/**
 * A single-pick page: the feature card spans the width with a 4 : 3 well,
 * so the photograph is not left small in a wide card.
 * @summary The feature card spanning a single-pick page.
 */
export const Wide: Story = {
  parameters: { theme: "assay", category: "supplements", frame: "well" },
  args: { pick: creatineGuide.picks[0]!, wide: true },
};

/**
 * One compact card beside the feature card stands as tall as it, with the
 * photograph on top.
 * @summary A compact card with its photograph on top, beside a feature card.
 */
export const Stacked: Story = {
  parameters: { frame: "narrow" },
  args: { pick: watchesGuide.picks[3]!, variant: "compact", stacked: true },
};

/**
 * On a phone the compact card keeps its photograph beside the name and
 * gives the price and the button the full width beneath.
 * @summary A compact card in a phone-width container.
 */
export const CompactOnAPhone: Story = {
  parameters: { frame: "narrow" },
  args: { pick: watchesGuide.picks[4]!, variant: "compact" },
};

/**
 * A pick that every retailer has sold out: the price line says so and the
 * button goes; the jump to the review stays.
 * @summary A pick sold out everywhere: no price, no button.
 */
export const SoldOut: Story = {
  args: { pick: soldOutPick, variant: "compact" },
};
