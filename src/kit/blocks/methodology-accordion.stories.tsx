import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { MethodologyAccordion } from "./methodology-accordion";

const meta = {
  title: "Kit/Blocks/Methodology accordion",
  component: MethodologyAccordion,
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof MethodologyAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Atelier: Story = { parameters: { theme: "atelier" }, args: { methodology: watchesGuide.methodology } };
export const Assay: Story = {
  parameters: { theme: "assay" },
  decorators: [(Story) => <div data-category="supplements"><Story /></div>],
  args: { methodology: creatineGuide.methodology },
};
