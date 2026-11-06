import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { ResultMark } from "./badge";

const meta = {
  title: "Kit/Primitives/Result mark",
  component: ResultMark,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements" },
  play: assertKitPage,
  args: { status: "pass", children: "Pass" },
} satisfies Meta<typeof ResultMark>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A test the product passed, with a tick: the comparison prints it in the
 * measurement’s cell.
 * @summary A passed test, with a tick.
 */
export const Pass: Story = {};

/**
 * A failed test, with a cross. In a comparison it sits beside the failing
 * figure, which is printed in the fail colour too.
 * @summary A failed test, with a cross.
 */
export const Fail: Story = {
  args: { status: "fail", children: "Fail" },
};

/**
 * A result inside the limit but close to it, with a warning sign.
 * @summary A result near its limit, with a warning sign.
 */
export const NearLimit: Story = {
  args: { status: "caution", children: "Near limit" },
};
