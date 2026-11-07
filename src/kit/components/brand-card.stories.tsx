import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { supplementBrands } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";

import { BrandCard } from "./brand-card";

const meta = {
  title: "Components/Brand card",
  component: BrandCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { brand: supplementBrands[0]! },
} satisfies Meta<typeof BrandCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A brand readers rate well, with three products tested; no logo file, so its initials.
 * @summary A brand with its stars, review count and products tested.
 */
export const Reviewed: Story = {};

/**
 * A new brand: no reviews and nothing tested yet, said in words.
 * @summary A brand with no reviews and nothing tested.
 */
export const NewBrand: Story = { args: { brand: { slug: "harbor", name: "Harbor & Pine", href: "#brand-harbor", website: "harborpine.example" } } };
