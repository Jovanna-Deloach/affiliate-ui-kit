import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { SearchField } from "./search-field";

const meta = {
  title: "Primitives/Search field",
  component: SearchField,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { label: "Search reviews", name: "q" },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Searching within one product’s reviews, already holding a term: the
 * cross clears it. In a form with `role="search"`, Enter submits.
 * @summary Search a product’s reviews; the cross clears the term.
 */
export const SearchReviews: Story = {
  args: { defaultValue: "mixes" },
};

/**
 * The site’s search, with the key that opens it shown while it is empty.
 * The page binds the key.
 * @summary Site search with a ⌘K hint.
 */
export const SiteSearch: Story = {
  args: { label: "Search supplements, brands and guides", placeholder: "Search supplements, brands, guides", shortcut: "⌘K" },
};
