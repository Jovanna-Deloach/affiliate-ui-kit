import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { MethodologyAccordion } from "./methodology-accordion";

const meta = {
  title: "Blocks/Methodology accordion",
  component: MethodologyAccordion,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
  args: { methodology: watchesGuide.methodology },
} satisfies Meta<typeof MethodologyAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Near the end of the page, the method in full: what was done, in order,
 * the first step open. Its heading says what was tested.
 * @summary The method section with numbered steps, the first open (Atelier).
 */
export const Method: Story = {};

/**
 * The lab publication’s protocol, in the Assay theme.
 * @summary The method section in the Assay theme.
 */
export const LabProtocol: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { methodology: creatineGuide.methodology },
};
