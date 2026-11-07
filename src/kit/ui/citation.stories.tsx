import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineReferences } from "@/fixtures/kit/evidence";
import { ReferenceList } from "@/kit/components";
import { assertKitPage } from "@/kit/testing/page-checks";

import { Citation } from "./citation";

const meta = {
  title: "Primitives/Citation",
  component: Citation,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { n: 1, to: "okafor-2024" },
  render: (args) => (
    <div className="grid gap-10">
      <p className="m-0 max-w-measure t-body text-fg-body">
        Taken with training, creatine adds about 8% to strength gains
        <Citation {...args} />, older adults gain more lean mass with it than without
        <Citation n={2} to="brennan-2023" />, and trained cyclists hold their sprint power for longer
        <Citation n={3} to="sato-2025" />.
      </p>
      <ReferenceList references={creatineReferences.slice(0, 3)} cited={["okafor-2024", "brennan-2023", "sato-2025"]} as="h3" />
    </div>
  ),
} satisfies Meta<typeof Citation>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Three claims, each followed by its citation; each citation jumps to its source in the list,
 * and each source links back.
 * @summary Citations in a paragraph, with the reference list they jump to.
 */
export const InAParagraph: Story = {};
