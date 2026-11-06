import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { versusGuide } from "@/fixtures/kit/archetypes";
import { watchesGuide } from "@/fixtures/kit/watches";
// Parts used inside args come from the layer’s entry point: the import agents copy.
import { DisqualifiedSubTable } from "@/kit/blocks";
import { assertKitPage } from "@/kit/testing/page-checks";

import { ComparisonMatrix } from "./comparison-matrix";

const meta = {
  title: "Blocks/Comparison matrix",
  component: ComparisonMatrix,
  subcomponents: { DisqualifiedSubTable },
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: { heading: watchesGuide.compare.heading, metrics: watchesGuide.metrics, picks: watchesGuide.picks },
} satisfies Meta<typeof ComparisonMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every pick on the same columns: the reader can check the verdict against
 * the measurements and buy any pick from its lowest price.
 * @summary Every pick on the same columns, our pick first and tinted.
 */
export const AllPicks: Story = {};

/**
 * A lab comparison ends honestly: what we tested and would not buy sits in
 * the same card, on the same columns, unlinked.
 * @summary The comparison with the products that failed, on shared columns (Assay).
 */
export const WithWhatFailed: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: {
    heading: creatineGuide.compare.heading,
    intro: creatineGuide.compare.intro,
    metrics: creatineGuide.metrics,
    picks: creatineGuide.picks,
    children: <DisqualifiedSubTable items={creatineGuide.notRecommended ?? []} metrics={creatineGuide.metrics} />,
  },
};

/**
 * Two picks make a two-row table: the head-to-head’s comparison.
 * @summary A two-row comparison for a head-to-head.
 */
export const HeadToHead: Story = {
  args: { heading: versusGuide.compare.heading, intro: versusGuide.compare.intro, metrics: versusGuide.metrics, picks: versusGuide.picks },
};

/**
 * In a narrow container each pick becomes a small card: its name, three
 * key measurements as pills, and its price with the Buy pill.
 * @summary The comparison in a phone-width container: rows become cards.
 */
export const NarrowContainer: Story = {
  parameters: { theme: "assay", category: "supplements", frame: "narrow" },
  args: { heading: creatineGuide.compare.heading, metrics: creatineGuide.metrics, picks: creatineGuide.picks.slice(0, 2) },
};
