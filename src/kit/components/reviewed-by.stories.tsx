import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineReview } from "@/fixtures/kit/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { ReviewedBy } from "./reviewed-by";

const meta = {
  title: "Components/Reviewed by",
  component: ReviewedBy,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { review: creatineReview },
} satisfies Meta<typeof ReviewedBy>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A registered dietitian with a PhD checked the creatine guide; no portrait, so her initials.
 * @summary The reviewer, credentials and date.
 */
export const Dietitian: Story = {};
