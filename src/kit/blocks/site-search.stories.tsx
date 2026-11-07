import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";

import { searchIndex, searchSuggestions } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";
import { seedSearches } from "@/kit/testing/device";

import { SiteSearch } from "./site-search";

/** Types into the open search the way a reader would, then runs the kit checks. */
const typeThenCheck = (words: string): Meta["play"] =>
  async function play(context) {
    const body = within(context.canvasElement.ownerDocument.body);
    await userEvent.type(await body.findByRole("searchbox"), words);
    await assertKitPage(context);
  };

const meta = {
  title: "Blocks/Site search",
  component: SiteSearch,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    kit: true,
    theme: "assay",
    category: "supplements",
    frame: "well",
    docs: { story: { inline: false, iframeHeight: 640 } },
  },
  play: assertKitPage,
  args: { index: searchIndex, suggestions: searchSuggestions, resultsPath: "/search", defaultOpen: true },
  beforeEach: () => seedSearches([]),
} satisfies Meta<typeof SiteSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Opened before typing: suggestions to try. ⌘K, Ctrl K or “/” opens it anywhere on the page.
 * @summary Open, before typing: suggestions.
 */
export const BeforeTyping: Story = {};

/**
 * A returning reader: their last searches on this device, with Clear.
 * @summary Recent searches on this device, with Clear.
 */
export const RecentSearches: Story = { beforeEach: () => seedSearches(["creatine gummies", "magnesium glycinate", "vitamin D drops"]) };

/**
 * “creatine”: products, brands, ingredients, guides and categories, four of each, the word in bold.
 * Arrow keys move through them; Enter in the field opens every result.
 * @summary Results for “creatine”, grouped, the word in bold.
 */
export const Results: Story = { play: typeThenCheck("creatine") };

/**
 * Nothing matches: it says so, and what to try instead.
 * @summary No results, and what to try.
 */
export const NoResults: Story = { play: typeThenCheck("zinc carnosine") };

/**
 * Closed, as the masthead shows it: a field-shaped button with its shortcut; an icon on phones.
 * @summary Closed: the masthead’s search button.
 */
export const Closed: Story = { args: { defaultOpen: false }, parameters: { frame: "narrow", docs: { story: { inline: true } } } };
