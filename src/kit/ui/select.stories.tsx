import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Select } from "./select";

const meta = {
  title: "Primitives/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: {
    label: "Sort by",
    name: "sort",
    inline: true,
    options: [
      { value: "recent", label: "Most recent" },
      { value: "relevant", label: "Most relevant" },
      { value: "highest", label: "Highest rated" },
      { value: "lowest", label: "Lowest rated" },
    ],
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The sort above a review list, label beside the menu. Most recent comes
 * first: a reader should never have to ask for the newest reviews.
 * @summary Sort reviews: label beside the menu, Most recent first.
 */
export const SortReviews: Story = {};

/**
 * A ranking’s sort, by what the lab found or by value for money.
 * @summary Sort a category ranking: quality, value, certified, A to Z.
 */
export const SortRanking: Story = {
  args: {
    name: "rank",
    options: [
      { value: "quality", label: "Quality" },
      { value: "value", label: "Value" },
      { value: "certified", label: "Certified first" },
      { value: "name", label: "A to Z" },
    ],
  },
};

/**
 * A form question with its label above, as in a review form.
 * @summary A select in a form, label above.
 */
export const InAForm: Story = {
  args: {
    label: "Form",
    name: "form",
    inline: false,
    hint: "As it says on the label.",
    options: [
      { value: "powder", label: "Powder" },
      { value: "capsules", label: "Capsules" },
      { value: "gummies", label: "Gummies" },
      { value: "liquid", label: "Liquid" },
      { value: "tablets", label: "Tablets" },
    ],
  },
};
