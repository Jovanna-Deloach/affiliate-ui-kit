import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { ReadingProgress } from "./reading-progress";

const meta = {
  title: "Primitives/Reading progress",
  component: ReadingProgress,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
} satisfies Meta<typeof ReadingProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A long guide: scroll the page and the bar along the top of the window
 * fills in the section color. CSS draws it; there is no script.
 * @summary The bar over a long guide; scroll to fill it.
 */
export const OnALongGuide: Story = {
  render: () => (
    <article className="grid gap-6">
      <ReadingProgress />
      <h1 className="m-0 t-headline text-fg">The best creatine, tested in a lab</h1>
      {[
        "We bought eighteen creatine supplements at retail and sent them, blinded, to an accredited lab. Each batch was assayed twice, for the creatine on its label and for the metals and by-products that should not be there.",
        "Four contain what the label says and nothing they should not. Fourteen failed at least one test: most by a few percent of their claim, two by a margin that should worry anyone who takes them daily.",
        "Plain monohydrate is the form with the research behind it. Micronized monohydrate dissolves more easily, and costs more for the same dose; capsules cost more again.",
        "The cheapest creatine we tested was also among the purest. Price told us little about quality, and the label told us less.",
        "Every product we tested is listed below, the failures with them, so you know which to avoid as well as which to buy.",
        "We retest every certified product once a year, from a new batch bought at retail. A certification lapses when we have not.",
      ].map((text) => (
        <p key={text.slice(0, 24)} className="m-0 t-body text-fg-body">
          {text}
        </p>
      ))}
    </article>
  ),
};
