import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";

import { assertKitPage } from "@/kit/testing/page-checks";
import { Button, Checkbox, ChoiceGroup, Radio } from "@/kit/ui";

import { Drawer, DrawerClose } from "./drawer";

/** Opens the drawer the way a reader would, then runs the kit checks on it. */
const openThenCheck = (name: string): Meta["play"] =>
  async function play(context) {
    await userEvent.click(within(context.canvasElement).getByRole("button", { name }));
    await assertKitPage(context);
  };

const meta = {
  title: "Primitives/Drawer",
  component: Drawer,
  subcomponents: { DrawerClose },
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  args: { title: "Filter reviews", children: null },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Review filters on a phone: a sheet from the bottom with the choices, and
 * the result count on the button that closes it.
 * @summary Review filters in a bottom sheet, closed by “Show 48 reviews”.
 */
export const ReviewFilters: Story = {
  play: openThenCheck("Filters"),
  render: () => (
    <Drawer
      title="Filter reviews"
      trigger={<Button>Filters</Button>}
      footer={
        <>
          <Button>Clear all</Button>
          <DrawerClose>
            <Button emphasis="primary">Show 48 reviews</Button>
          </DrawerClose>
        </>
      }
    >
      <div className="grid gap-6">
        <ChoiceGroup legend="Rating">
          <Checkbox name="stars" value="5" label="5 stars" count={706} />
          <Checkbox name="stars" value="4" label="4 stars" count={321} />
          <Checkbox name="stars" value="3" label="3 stars" count={128} />
          <Checkbox name="stars" value="2" label="2 stars" count={51} />
          <Checkbox name="stars" value="1" label="1 star" count={78} />
        </ChoiceGroup>
        <ChoiceGroup legend="Date posted">
          <Radio name="date" value="all" label="All reviews" defaultChecked />
          <Radio name="date" value="30" label="Last 30 days" />
          <Radio name="date" value="365" label="Last 12 months" />
        </ChoiceGroup>
      </div>
    </Drawer>
  ),
};

/**
 * On a wide screen the same filters slide in from the right (`side="right"`),
 * keeping the list in view.
 * @summary Filters in a panel from the right, for wide screens.
 */
export const FromTheRight: Story = {
  play: openThenCheck("All filters"),
  render: () => (
    <Drawer side="right" title="All filters" trigger={<Button>All filters</Button>}>
      <ChoiceGroup legend="Reviewer">
        <Checkbox name="verified" label="Verified purchases only" count={912} />
        <Checkbox name="replies" label="With a reply from the brand" count={64} />
      </ChoiceGroup>
    </Drawer>
  ),
};
