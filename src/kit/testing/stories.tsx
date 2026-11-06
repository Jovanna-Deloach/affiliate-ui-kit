import type { Decorator } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";

import { PickMedia } from "@/kit/components/pick-media";
import type { Category, Pick } from "@/kit/types";

/**
 * How a kit story is framed, set with story parameters rather than wrapper
 * markup, so the code an agent copies from a story shows only the part:
 *
 *   parameters: { kit: true, theme: "assay", category: "running", frame: "card" }
 *
 *   well         the page well: the 1200px column, its gutters, 48px of air (default)
 *   column       a 42rem column in the well, about a bento column or a deep dive’s story
 *   card         a paper card (48rem) in the well, for parts that live inside cards
 *   narrow       a 24rem column, a phone-width container for container-query layouts
 *   narrow-card  a paper card in a 24rem column
 *   none         no frame (only the category): blocks that bring their own well,
 *                templates and specimen sheets
 *
 * `.storybook/preview.tsx` applies it inside the theme (`data-theme`).
 */
export type Frame = "well" | "column" | "card" | "narrow" | "narrow-card" | "none";

export interface KitStoryParameters {
  /** Marks a kit story: rendered full-bleed inside a theme. */
  kit: true;
  /** Pins the theme; otherwise the toolbar’s Theme decides. */
  theme?: "atelier" | "assay";
  /** The publication section, for the category accent. */
  category?: Category;
  frame?: Frame;
}

export function KitFrame({ frame = "well", category, children }: { frame?: Frame; category?: Category; children: ReactNode }) {
  if (frame === "none") return category ? <div data-category={category}>{children}</div> : children;
  const card = frame === "card" || frame === "narrow-card";
  const width = frame === "narrow" || frame === "narrow-card" ? "max-w-sm" : frame === "column" ? "max-w-2xl" : card ? "max-w-3xl" : undefined;
  return (
    <div data-category={category} className="kit-well py-12">
      <div className={width}>{card ? <div className="@container kit-card p-5 md:p-8">{children}</div> : children}</div>
    </div>
  );
}

/**
 * A story decorator that sets the story on a pick’s review photograph, as an
 * overlay: for parts that live on a photograph (the lab’s stamp). Defined
 * here, outside the stories file, so the photograph stays out of the story’s
 * code snippet.
 */
export function onPhotograph(pick: Pick, width: "md" | "narrow" = "md"): Decorator {
  function OnPhotograph(Story: Parameters<Decorator>[0]) {
    return (
      <figure className={width === "narrow" ? "@container m-0 max-w-64" : "@container m-0 max-w-md"}>
        <PickMedia pick={pick} detail="full" sizes={width === "narrow" ? "16rem" : "28rem"}>
          <Story />
        </PickMedia>
      </figure>
    );
  }
  return OnPhotograph;
}
