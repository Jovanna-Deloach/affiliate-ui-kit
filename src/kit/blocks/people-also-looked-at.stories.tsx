import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineSummaries, supplementBrands } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";
import { seedDevice } from "@/kit/testing/device";

import { PeopleAlsoLookedAt } from "./people-also-looked-at";

const meta = {
  title: "Blocks/People also looked at",
  component: PeopleAlsoLookedAt,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "well" },
  play: assertKitPage,
  args: { products: creatineSummaries },
  beforeEach: () => seedDevice("compare", []),
} satisfies Meta<typeof PeopleAlsoLookedAt>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Four creatine products at the end of a product page, each with a Save bookmark; on a phone
 * they scroll sideways and snap into place.
 * @summary Four products with Save, sideways on phones.
 */
export const Products: Story = { args: { save: true } };

/**
 * On a ranking or search page with the compare tray: a Compare box on every card.
 * @summary Products with Compare boxes.
 */
export const WithCompare: Story = { args: { compare: true } };

/**
 * Brands like this one, on a brand’s page.
 * @summary Four brands, on a brand’s page.
 */
export const Brands: Story = { args: { products: undefined, brands: supplementBrands.slice(0, 4), heading: "Brands readers compare with Peak Supply" } };
