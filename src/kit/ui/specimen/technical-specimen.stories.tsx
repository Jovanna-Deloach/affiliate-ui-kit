import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import type { Pick, Specimen } from "@/kit/types";
import { assertKitPage } from "@/kit/testing/page-checks";

import { TechnicalSpecimen } from "./index";

/**
 * Parametric technical drawings. Each SKU is drawn from its own
 * measurements: no two products share artwork, and the watches are drawn
 * at one millimetre scale, so sizes compare honestly.
 */
const meta = {
  title: "Kit/Parts/Technical specimen",
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const extras: { id: string; name: string; specimen: Specimen }[] = [
  { id: "c-volt-gummies", name: "Volt Labs Creatine Gummies", specimen: { kind: "supplement", formFactor: "gummy-jar", netWeight: 240, assayScore: 62, impurities: [0.05, 0.03, 0.02] } },
  { id: "r-volt-stride-2", name: "Volt Stride 2", specimen: { kind: "shoe", heelStackMm: 35, forefootStackMm: 27, weightOz: 9.1, plate: "carbon", rocker: 0.3, upper: "engineered" } },
];

function Sheet({ picks, extra = [], category }: { picks: Pick[]; extra?: typeof extras; category?: string }) {
  const items = [...picks.map((p) => ({ id: p.product.id, name: `${p.product.brand} ${p.product.name}`, specimen: p.specimen! })), ...extra];
  return (
    <div data-category={category} className="kit-well py-12">
      <ul className="m-0 grid list-none gap-x-8 gap-y-12 p-0 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-3">
            <TechnicalSpecimen specimen={item.specimen} productId={item.id} name={item.name} />
            <div className="flex items-start gap-3">
              <div className="w-20 shrink-0">
                <TechnicalSpecimen specimen={item.specimen} productId={item.id} name={item.name} detail="thumb" />
              </div>
              <div className="min-w-0 flex-1">
                <TechnicalSpecimen specimen={item.specimen} productId={item.id} name={item.name} detail="card" />
              </div>
            </div>
            <p className="m-0 t-ui text-fg">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Watches: Story = { parameters: { theme: "atelier" }, render: () => <Sheet picks={watchesGuide.picks} /> };
export const Supplements: Story = {
  parameters: { theme: "assay" },
  render: () => <Sheet picks={creatineGuide.picks} extra={extras.slice(0, 1)} category="supplements" />,
};
export const RunningShoes: Story = {
  name: "Running shoes",
  parameters: { theme: "assay" },
  render: () => <Sheet picks={runningGuide.picks} extra={extras.slice(1)} category="running" />,
};
