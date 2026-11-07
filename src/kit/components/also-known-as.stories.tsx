import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineNames } from "@/fixtures/kit/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { AlsoKnownAs } from "./also-known-as";

const meta = {
  title: "Components/Also known as",
  component: AlsoKnownAs,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { names: creatineNames.names, notConfusedWith: creatineNames.notConfusedWith },
} satisfies Meta<typeof AlsoKnownAs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Creatine’s other names, and the two things it is most often confused with.
 * @summary Creatine’s other names, and what it isn’t.
 */
export const Creatine: Story = {};
