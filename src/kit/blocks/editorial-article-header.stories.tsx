import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { EditorialArticleHeader } from "./editorial-article-header";

const meta = {
  title: "Kit/Blocks/Editorial article header",
  component: EditorialArticleHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
  args: { guide: watchesGuide, notice: { text: caliberSite.disclosureNotice, href: caliberSite.disclosureHref } },
} satisfies Meta<typeof EditorialArticleHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The top of a review: where it sits, a title that says something, the
 * dek, who wrote it and when it was checked, the disclosure notice before
 * any buy link, and the testing card beside it.
 * @summary The review header with byline, disclosure notice and testing card (Atelier).
 */
export const Review: Story = {};

/**
 * A lab publication’s supplement guide: the same header in the Assay theme.
 * @summary The review header in the Assay theme (supplements).
 */
export const LabReview: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { guide: creatineGuide, notice: { text: provingGroundSite.disclosureNotice, href: provingGroundSite.disclosureHref } },
};

/**
 * The running section of the same publication: only the category accent
 * changes, in the testing card’s figures and the stamp.
 * @summary The review header on another section of the same publication (running).
 */
export const AnotherSection: Story = {
  parameters: { theme: "assay", category: "running" },
  args: { guide: runningGuide, notice: { text: provingGroundSite.disclosureNotice, href: provingGroundSite.disclosureHref } },
};
