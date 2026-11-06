import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { PickMedia, pickName } from "@/kit/blocks/pick-media";
import { assertKitPage } from "@/kit/testing/page-checks";
import type { Pick } from "@/kit/types";

import { AssayBadge, Award, Scorecard, Telemetry } from "./index";

/**
 * The deep dive’s left rail, part by part: studio photography on the
 * theme’s studio frame (4 : 4.2, radial sweep, contact shadow) with the
 * award pinned top-left and, for supplements, the lab badge; then the
 * scorecard (score / 10 in the display serif, ten segments, sub-scores)
 * with the category’s telemetry. Every product has its own photograph.
 */
const meta = {
  title: "Kit/Parts/Studio frame and scorecard",
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Rail({ pick }: { pick: Pick }) {
  const m = pick.measurements;
  return (
    <li className="kit-card flex flex-col gap-8 p-5">
      <figure className="@container m-0">
        <PickMedia pick={pick} detail="full" sizes="(min-width: 1280px) 22rem, (min-width: 768px) 45vw, 90vw">
          <Award className="absolute top-4 left-4">{pick.award}</Award>
          {m.kind === "assay" && <AssayBadge m={m} className="absolute bottom-4 left-4" />}
        </PickMedia>
        <figcaption data-name className="mt-3 t-small text-fg-muted">
          {pickName(pick)}
        </figcaption>
      </figure>
      <Scorecard rating={pick.rating} scores={pick.scores} id={`${pick.product.slug}-score`}>
        <Telemetry measurements={m} />
      </Scorecard>
    </li>
  );
}

function Sheet({ picks, category }: { picks: Pick[]; category?: string }) {
  return (
    <div data-category={category} className="kit-well py-12">
      <ul className="m-0 grid list-none items-start gap-6 p-0 md:grid-cols-2 xl:grid-cols-3">
        {picks.map((pick) => (
          <Rail key={pick.product.id} pick={pick} />
        ))}
      </ul>
    </div>
  );
}

export const Watches: Story = {
  name: "Atelier, watches: chronometer strip",
  parameters: { theme: "atelier" },
  render: () => <Sheet picks={watchesGuide.picks.slice(0, 3)} />,
};

export const Supplements: Story = {
  name: "Assay, supplements: lab badge and heavy metals",
  parameters: { theme: "assay" },
  render: () => <Sheet picks={creatineGuide.picks.slice(0, 3)} category="supplements" />,
};

export const Running: Story = {
  name: "Assay, running: bench tests",
  parameters: { theme: "assay" },
  render: () => <Sheet picks={runningGuide.picks} category="running" />,
};
