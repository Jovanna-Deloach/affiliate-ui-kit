import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Button } from "./button";

const meta = {
  title: "Kit/Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: { children: "Compare all six" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default: an outlined action that does not compete with the buy
 * button in view.
 * @summary The outlined button, for most in-page actions.
 */
export const Secondary: Story = {};

/**
 * The accent fill, for the one action that matters on a screen that has no
 * buy button, such as a sign-up step. Never beside a primary buy button.
 * @summary The filled button: at most one per viewport, never beside a primary buy button.
 */
export const Primary: Story = {
  args: { emphasis: "primary", children: "Save this guide" },
};

/**
 * An underlined text action for something minor: reset a filter, show
 * less.
 * @summary A quiet text action for minor controls.
 */
export const Quiet: Story = {
  args: { emphasis: "quiet", children: "Reset filters" },
};

/**
 * A disabled button keeps its label, so the reader can see what is not
 * available, at half opacity.
 * @summary A disabled button.
 */
export const Disabled: Story = {
  args: { disabled: true, children: "Sold out" },
};

/**
 * With `asChild` the button’s look goes on its one child, a link to another
 * part of the site. Not for retailers: those are `Buy*` links.
 * @summary A link that looks like a button (asChild), for links within the site.
 */
export const AsLink: Story = {
  render: () => (
    <Button asChild>
      <a href="#compare">See the comparison</a>
    </Button>
  ),
};
