import React from "react";
import { Select, Separator } from "storybook/internal/components";
import { useGlobals, useGlobalTypes, useParameter } from "storybook/manager-api";

/**
 * The toolbar shows only the switches that change what is on screen. Kit
 * pages get one, the theme; the legacy library keeps its own four (vertical,
 * shape, elevation, stage). Both read their items from the globalTypes in
 * preview.tsx, so the values live in one place; Storybook's own globals
 * toolbar is hidden in manager.tsx.
 */

type Item = { value: string; title: string };

function itemsOf(toolbar: { items?: unknown[] } | undefined): Item[] {
  return (toolbar?.items ?? []).flatMap((item) => {
    if (typeof item === "string") return [{ value: item, title: item }];
    if (item && typeof item === "object" && "value" in item) {
      const { value, title, type } = item as { value: string; title?: string; type?: string };
      return type === "reset" ? [] : [{ value, title: title ?? value }];
    }
    return [];
  });
}

/** One global as a select, like Storybook's own, with an optional fixed value from the story. */
function GlobalSelect({ id, fixed, fixedReason }: { id: string; fixed?: string; fixedReason?: string }) {
  const globalTypes = useGlobalTypes();
  const [globals, updateGlobals, storyGlobals] = useGlobals();
  const type = globalTypes[id] as { description?: string; toolbar?: { title?: string; items?: unknown[] } } | undefined;
  const items = itemsOf(type?.toolbar);
  if (!type?.toolbar || items.length === 0) return null;

  const value = fixed ?? (globals[id] as string | undefined);
  const label = type.toolbar.title ?? id;
  const locked = fixed !== undefined || id in storyGlobals;
  return (
    <Select
      key={`${id}:${value}:${locked}`}
      ariaLabel={label}
      tooltip={locked ? (fixedReason ?? `${label} is set by this story`) : (type.description ?? label)}
      size="small"
      padding="small"
      options={items}
      defaultOptions={value === undefined ? [] : [value]}
      disabled={locked}
      onSelect={(next) => updateGlobals({ [id]: next })}
    >
      {label}
    </Select>
  );
}

const THEME_NAMES: Record<string, string> = { atelier: "Atelier", assay: "Assay" };

/** Kit parts and the Playground: the theme. A story that is set in one theme shows it, locked. */
export function ThemeTool() {
  const pinned = useParameter<string | undefined>("theme", undefined);
  const isKit = useParameter<boolean>("kit", false);
  return (
    <>
      <Separator />
      <GlobalSelect
        id="theme"
        fixed={isKit && pinned ? pinned : undefined}
        fixedReason={pinned ? `This story is set in ${THEME_NAMES[pinned] ?? pinned}` : undefined}
      />
    </>
  );
}

/** The legacy library's switches, only on its own stories. */
export function LegacyTools() {
  return (
    <>
      <Separator />
      <GlobalSelect id="vertical" />
      <GlobalSelect id="shape" />
      <GlobalSelect id="elevation" />
      <GlobalSelect id="stage" />
    </>
  );
}
