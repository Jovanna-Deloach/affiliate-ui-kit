import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { creatineFaq } from "@/fixtures/kit/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { Faq } from "./faq";

const meta = {
  title: "Blocks/FAQ",
  component: Faq,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { items: creatineFaq, heading: "What readers ask about creatine" },
} satisfies Meta<typeof Faq>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Five questions about creatine, each opening to its answer; the page carries them as FAQPage
 * structured data, which the check parses.
 * @summary Five questions about creatine, with structured data.
 */
export const Creatine: Story = {
  play: async (context) => {
    const script = context.canvasElement.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script?.textContent ?? "{}") as { "@type"?: string; mainEntity?: unknown[] };
    await expect(data["@type"]).toBe("FAQPage");
    await expect(data.mainEntity).toHaveLength(creatineFaq.length);
    await assertKitPage(context);
  },
};
