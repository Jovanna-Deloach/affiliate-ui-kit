import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, userEvent, within } from "storybook/test";

import { reader, savedItems } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";
import { seedDevice } from "@/kit/testing/device";

import { AccountMenu } from "./account-menu";

/** Opens the menu the way a reader would, then runs the kit checks on it. */
const openThenCheck: Meta["play"] = async (context) => {
  await userEvent.click(within(context.canvasElement).getByRole("button", { name: /Account/ }));
  await assertKitPage(context);
};

const meta = {
  title: "Components/Account menu",
  component: AccountMenu,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: openThenCheck,
  args: { links: { saved: "#saved", history: "#history", alerts: "#alerts", settings: "#settings" } },
} satisfies Meta<typeof AccountMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A signed-in reader: Saved and Price alerts with their counts, History, Settings, Sign out.
 * @summary Signed in: Saved, Price alerts, History, Settings, Sign out.
 */
export const SignedIn: Story = { args: { person: reader, counts: { saved: 12, alerts: 2 }, onSignOut: fn() } };

/**
 * A reader without an account: the menu says the lists stay on this device, counts the
 * saved items there, and offers Sign in.
 * @summary No account: device lists and Sign in.
 */
export const NoAccount: Story = {
  args: { signInHref: "#sign-in" },
  beforeEach: () => seedDevice("saved", savedItems),
};
