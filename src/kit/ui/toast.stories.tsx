import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Toast, ToastProvider } from "./toast";

const meta = {
  title: "Primitives/Toast",
  component: Toast,
  subcomponents: { ToastProvider },
  tags: ["autodocs", "new"],
  // A toast is fixed to the screen’s bottom edge: each story gets a frame of its own in the docs.
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "none", docs: { story: { inline: false, iframeHeight: 160 } } },
  play: assertKitPage,
  args: { open: true, onOpenChange: fn(), title: "Saved" },
  render: (args) => (
    <ToastProvider>
      <Toast {...args} />
    </ToastProvider>
  ),
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Confirms a price alert the reader just set, with the detail that matters.
 * @summary “Price alert set”, with the price it watches for.
 */
export const AlertSet: Story = {
  args: { title: "Price alert set", description: "We’ll email you when it drops below $19." },
};

/**
 * Confirms a save, with one way to undo it.
 * @summary “Saved”, with Undo.
 */
export const SavedWithUndo: Story = {
  args: { title: "Saved to your list", action: { label: "Undo", onClick: fn() } },
};

/**
 * Something the reader tried did not work and can be tried again.
 * @summary An error toast: the review could not be sent.
 */
export const CouldNotSend: Story = {
  args: { tone: "error", title: "Your review wasn’t sent", description: "Check your connection and try again." },
};
