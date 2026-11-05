import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { PickMedia, pickName } from "@/kit/blocks/pick-media";
import { assertKitPage } from "@/kit/testing/page-checks";
import type { Pick } from "@/kit/types";

import { BiomechMatrix, TimingStrip } from "../measurements";

/**
 * Product media. Studio photography when a site has it (running); a
 * drafting plate drawn from case geometry (watches); the certificate of
 * analysis (supplements). Each SKU’s graphic is generated from its own
 * numbers, never shared, at three detail levels: full (deep dive), thumb
 * (tables and rows) and card, which fills a verdict card's well — shown
 * here at a hero well (portrait) and a compact card's well.
 */
const meta = {
  title: "Kit/Parts/Product media",
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Sheet({ picks, category }: { picks: Pick[]; category?: string }) {
  return (
    <div data-category={category} className="kit-well py-12">
      <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-2 xl:grid-cols-3">
        {picks.map((pick) => (
          <li key={pick.product.id} className="kit-card flex flex-col gap-4 p-5">
            <p className="m-0 t-ui font-semibold text-fg">{pickName(pick)}</p>
            <PickMedia pick={pick} detail="full" className="max-h-(--media-max-h)" />
            <div className="grid grid-cols-[minmax(0,1fr)_7rem] items-start gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-media bg-well">
                <div className="absolute inset-0">
                  <PickMedia pick={pick} detail="card" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="relative h-44 overflow-hidden rounded-media bg-well">
                  <div className="absolute inset-0">
                    <PickMedia pick={pick} detail="card" />
                  </div>
                </div>
                <div className="rounded-media bg-well p-1">
                  <PickMedia pick={pick} detail="thumb" />
                </div>
              </div>
            </div>
            {pick.measurements.kind === "timing" && <TimingStrip m={pick.measurements} id={`${pick.product.id}-timing`} />}
            {pick.measurements.kind === "biomech" && <BiomechMatrix m={pick.measurements} id={`${pick.product.id}-biomech`} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Watches: Story = { parameters: { theme: "atelier" }, render: () => <Sheet picks={watchesGuide.picks} /> };
export const Supplements: Story = { parameters: { theme: "assay" }, render: () => <Sheet picks={creatineGuide.picks} category="supplements" /> };
export const RunningShoes: Story = { name: "Running shoes", parameters: { theme: "assay" }, render: () => <Sheet picks={runningGuide.picks} category="running" /> };
