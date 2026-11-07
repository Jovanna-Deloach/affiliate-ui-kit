import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Chip } from "./chip";

const meta = {
  title: "Primitives/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { label: "Mixes well" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * What reviewers mention, as filters: each topic toggles the list to the
 * reviews that mention it, with how many there are.
 * @summary Review topics as toggle filters, with counts.
 */
export const ReviewTopics: Story = {
  render: () => (
    <ul aria-label="Topics in reviews" className="m-0 flex list-none flex-wrap gap-2 p-0">
      <li>
        <Chip label="Mixes well" count={214} onClick={fn()} selected />
      </li>
      <li>
        <Chip label="Taste" count={160} onClick={fn()} />
      </li>
      <li>
        <Chip label="Bloating" count={41} onClick={fn()} />
      </li>
      <li>
        <Chip label="Price" count={97} onClick={fn()} />
      </li>
      <li>
        <Chip label="Scoop size" count={38} onClick={fn()} />
      </li>
    </ul>
  ),
};

/**
 * The filters in force, above the list, each removable on its own.
 * @summary Applied filters, each with a cross to remove it.
 */
export const AppliedFilters: Story = {
  render: () => (
    <ul aria-label="Filters applied" className="m-0 flex list-none flex-wrap gap-2 p-0">
      <li>
        <Chip label="4 stars" onRemove={fn()} />
      </li>
      <li>
        <Chip label="Verified only" onRemove={fn()} />
      </li>
      <li>
        <Chip label="Last 12 months" onRemove={fn()} />
      </li>
    </ul>
  ),
};

/**
 * Related categories as links, at the end of a ranking.
 * @summary Related categories as link chips.
 */
export const RelatedCategories: Story = {
  render: () => (
    <ul aria-label="Related categories" className="m-0 flex list-none flex-wrap gap-2 p-0">
      <li>
        <Chip label="Protein powder" href="#protein" />
      </li>
      <li>
        <Chip label="Electrolytes" href="#electrolytes" />
      </li>
      <li>
        <Chip label="Beta-alanine" href="#beta-alanine" />
      </li>
    </ul>
  ),
};
