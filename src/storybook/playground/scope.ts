import * as blocks from "@/kit/blocks";
import * as components from "@/kit/components";
import * as templates from "@/kit/templates";
import * as ui from "@/kit/ui";
import { assayGuide, collectorsGuide, versusGuide } from "@/fixtures/kit/archetypes";
import { ironhouseAssay, peakAssay, singleRetailerProduct, soldOutPick, soldOutProduct } from "@/fixtures/kit/cases";
import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { watchesGuide } from "@/fixtures/kit/watches";

import type { SAMPLE_DATA } from "./shared";

const sampleData = {
  watchesGuide,
  creatineGuide,
  runningGuide,
  versusGuide,
  assayGuide,
  collectorsGuide,
  caliberSite,
  provingGroundSite,
  soldOutProduct,
  soldOutPick,
  singleRetailerProduct,
  peakAssay,
  ironhouseAssay,
} satisfies Record<(typeof SAMPLE_DATA)[number], unknown>;

/** Everything the Playground's code can name without importing it: every kit part, and the sample data. */
export const scope: Record<string, unknown> = { ...ui, ...components, ...blocks, ...templates, ...sampleData };
