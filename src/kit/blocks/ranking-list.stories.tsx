import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineRanking } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";
import { seedDevice } from "@/kit/testing/device";

import { RankingList } from "./ranking-list";

const meta = {
  title: "Blocks/Ranking list",
  component: RankingList,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "well" },
  play: assertKitPage,
  args: { heading: "Creatine, ranked by lab results", products: creatineRanking, disclosureHref: "#disclosure" },
  beforeEach: () => seedDevice("compare", []),
} satisfies Meta<typeof RankingList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The certified creatine ranked on its lab results: grade and score, certification, a line on how
 * each tested, readers’ stars, the lowest price with the cost of 5 g, and a buy pill.
 * @summary A category ranked by lab results.
 */
export const ByQuality: Story = {};

/**
 * The same products by cost per serving: the cheapest first, whatever its grade.
 * @summary Ranked by value: cost per serving.
 */
export const ByValue: Story = { args: { defaultSort: "value" } };

/**
 * A Compare box on every row, for a page with the compare tray.
 * @summary With Compare boxes.
 */
export const WithCompare: Story = { args: { compare: true } };

/**
 * Two at a time, the rest behind Show more.
 * @summary Two at a time, with Show more.
 */
export const ShowMore: Story = { args: { pageSize: 2 } };
