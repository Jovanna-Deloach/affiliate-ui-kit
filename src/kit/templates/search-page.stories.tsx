import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineSummaries, searchSuggestions } from "@/fixtures/kit/discovery";
import { creatineHits, creatineQuery, emptyQuery } from "@/fixtures/kit/pages";
import { provingGroundSite } from "@/fixtures/kit/sites";
import { assertKitPage } from "@/kit/testing/page-checks";

import { SearchPage } from "./search-page";

// The search results page. Every story runs the kit page checks.
const meta = {
  title: "Templates/Search page",
  component: SearchPage,
  tags: ["new"],
  parameters: { layout: "fullscreen", kit: true, frame: "none", theme: "assay" },
  play: assertKitPage,
  args: { site: provingGroundSite, query: creatineQuery, hits: creatineHits },
} satisfies Meta<typeof SearchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A search for creatine: products, brands, ingredients, guides and categories, grouped.
 * @summary Grouped results for “creatine”.
 */
export const Results: Story = {};

/**
 * A search that finds nothing: what to try, and what readers are looking at.
 * @summary Nothing found, with searches to try.
 */
export const NothingFound: Story = { args: { query: emptyQuery, hits: [], suggestions: searchSuggestions, popular: creatineSummaries } };
