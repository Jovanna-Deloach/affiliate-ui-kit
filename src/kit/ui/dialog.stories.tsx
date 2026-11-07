import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";

import { assertKitPage } from "@/kit/testing/page-checks";
import { Button, TextArea, TextField } from "@/kit/ui";

import { Dialog, DialogClose } from "./dialog";

/** Opens the dialog the way a reader would, then runs the kit checks on it. */
const openThenCheck = (name: string): Meta["play"] =>
  async function play(context) {
    await userEvent.click(within(context.canvasElement).getByRole("button", { name }));
    await assertKitPage(context);
  };

const meta = {
  title: "Primitives/Dialog",
  component: Dialog,
  subcomponents: { DialogClose },
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  args: { title: "Write a review", children: null },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Writing a review: the form needs the reader’s whole attention, so it opens
 * over the page. Cancel closes it (`DialogClose`); the main action submits.
 * @summary A review form over the page: title, review, Cancel and Submit.
 */
export const WriteAReview: Story = {
  play: openThenCheck("Write a review"),
  render: () => (
    <Dialog
      title="Write a review"
      description="Peak Supply Creatine Monohydrate"
      trigger={<Button emphasis="primary">Write a review</Button>}
      footer={
        <>
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <Button emphasis="primary" type="submit" form="review">
            Submit review
          </Button>
        </>
      }
    >
      <form id="review" className="grid gap-5">
        <TextField label="Title" name="title" placeholder="Mixes clear in cold water" />
        <TextArea label="Your review" name="body" hint="What you used it for, for how long, and what changed." maxLength={2000} showCount />
      </form>
    </Dialog>
  ),
};

/**
 * A price alert: one field and one action, in the small size.
 * @summary A small dialog with one field: set a price alert.
 */
export const PriceAlert: Story = {
  play: openThenCheck("Alert me"),
  render: () => (
    <Dialog
      size="sm"
      title="Alert me when it drops"
      description="We’ll email you once, when Peak Supply Creatine falls below your price."
      trigger={<Button>Alert me</Button>}
      footer={
        <Button emphasis="primary" type="submit" form="alert">
          Set alert
        </Button>
      }
    >
      <form id="alert" className="grid gap-5">
        <TextField label="Alert me below" name="target" inputMode="decimal" defaultValue="19" hint="In US dollars. Today’s lowest price is $21." />
        <TextField label="Email" name="email" type="email" autoComplete="email" />
      </form>
    </Dialog>
  ),
};
