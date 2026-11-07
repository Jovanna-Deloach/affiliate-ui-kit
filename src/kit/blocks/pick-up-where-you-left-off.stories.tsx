import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { DISCOVERY_NOW, viewedItems } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";
import { seedDevice } from "@/kit/testing/device";

import { PickUpWhereYouLeftOff } from "./pick-up-where-you-left-off";

const meta = {
  title: "Blocks/Pick up where you left off",
  component: PickUpWhereYouLeftOff,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "well" },
  play: assertKitPage,
  args: { now: DISCOVERY_NOW, historyHref: "#history" },
} satisfies Meta<typeof PickUpWhereYouLeftOff>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A reader without an account: two guides they did not finish, with how far they got, and the
 * four products they looked at, all from this device. A finished guide is left out.
 * @summary From this device: unfinished guides and recently viewed products.
 */
export const OnThisDevice: Story = { beforeEach: () => seedDevice("viewed", viewedItems) };

/**
 * A signed-in reader: the account’s history, with Clear history and removing one item
 * handled by the site.
 * @summary From an account, with Clear history.
 */
export const FromAnAccount: Story = { args: { items: viewedItems, onClear: fn(), onRemove: fn() } };
