import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { runningGuide } from "@/fixtures/kit/running";
import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { EditorialArticleHeader } from "./editorial-article-header";

const meta = {
  title: "Kit/Blocks/Editorial article header",
  component: EditorialArticleHeader,
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof EditorialArticleHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  args: { guide: watchesGuide, notice: { text: caliberSite.disclosureNotice, href: caliberSite.disclosureHref } },
};

export const AssayRunning: Story = {
  name: "Assay, running section",
  parameters: { theme: "assay" },
  decorators: [(Story) => <div data-category="running"><Story /></div>],
  args: { guide: runningGuide, notice: { text: provingGroundSite.disclosureNotice, href: provingGroundSite.disclosureHref } },
};
