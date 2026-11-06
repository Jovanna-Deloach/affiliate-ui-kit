import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { Specimen, State } from "@/kit/testing/specimen";
import type { Pick } from "@/kit/types";
import { Award } from "@/kit/ui";

import { PickMedia } from "./pick-media";
import { AssayBadge } from "./telemetry";

/**
 * Every state on one sheet, in both themes, for people reviewing the
 * system. Not in the agent manifest: agents read the use-case stories.
 */
const meta = {
  title: "Specimen sheets/Components/Pick media",
  tags: ["!manifest"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
} satisfies Meta;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "A pick’s photograph at three detail levels: the review frame (4 : 4.2) with its award and, for supplements, the lab’s badge; a card well; a thumbnail.";

/** The review frame: award pinned top-left, the lab badge bottom-left for supplements. */
function Frame({ pick }: { pick: Pick }) {
  const m = pick.measurements;
  return (
    <figure className="@container m-0">
      <PickMedia pick={pick} detail="full" sizes="(min-width: 768px) 30vw, 90vw">
        <Award className="absolute top-4 left-4">{pick.award}</Award>
        {m.kind === "assay" && <AssayBadge measurements={m} className="absolute bottom-4 left-4" />}
      </PickMedia>
    </figure>
  );
}

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => {
    const [meridian, ardent, sato, okada, brennan] = watchesGuide.picks;
    return (
      <Specimen kind="Component" title="Pick media" description={DESCRIPTION} columns={3}>
        <State label="Review frame">
          <Frame pick={meridian!} />
        </State>
        <State label="Review frame, a dress watch">
          <Frame pick={ardent!} />
        </State>
        <State label="Card well (fills its box)">
          <div className="relative h-72 overflow-hidden rounded-media">
            <div className="absolute inset-0">
              <PickMedia pick={sato!} detail="card" sizes="24rem" />
            </div>
          </div>
        </State>
        <State label="Thumbnails">
          <div className="grid grid-cols-4 gap-3">
            {[meridian!, okada!, brennan!].map((p) => (
              <PickMedia key={p.product.id} pick={p} detail="thumb" sizes="5rem" />
            ))}
          </div>
        </State>
      </Specimen>
    );
  },
};

export const Assay: Story = {
  name: "Assay: the lab badge",
  parameters: { theme: "assay" },
  render: () => {
    const [peak, ironhouse] = creatineGuide.picks;
    return (
      <Specimen kind="Component" title="Pick media" description={DESCRIPTION} columns={3} category="supplements">
        <State label="Review frame with the lab badge">
          <Frame pick={peak!} />
        </State>
        <State label="Narrow frame: accreditation left to screen readers" className="max-w-64">
          <Frame pick={ironhouse!} />
        </State>
        <State label="Running: a wide object">
          <div data-category="running">
            <Frame pick={runningGuide.picks[0]!} />
          </div>
        </State>
      </Specimen>
    );
  },
};
