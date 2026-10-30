"use client";

import { SlidersHorizontal, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Button } from "@/primitives/button";
import { StatusPill } from "@/primitives/status-pill";
import { Switch } from "@/primitives/switch";
import type { PersonalizationProfile } from "@/types/account";

/**
 * <PersonalizationPresetBar />
 * ---------------------------------------------------------------------------
 * The recessed profile strip above a directory:
 *
 *   ┌ auto ──────────┬ minmax(0,1fr) ───────────────────┬ auto ──────────────┐
 *   │ ◉ ACTIVE PROFILE│ Keto · ≤ 2 G NET CARBS · THIRD-… │ (●) Highlight  Edit│
 *   └─────────────────┴──────────────────────────────────┴────────────────────┘
 *
 *   --surface-recessed / --border-hairline / --radius-inner   the strip
 *   --inset-cell-x / --inset-compact                          inset (16 × 12)
 *   --gap-stack                                               cell gap
 *
 * The parameters are technical chips (mono voice) so they read as data,
 * not prose. The highlight switch is the one piece of state; it tells the
 * host directory to mark matching products. Below a 36rem container the
 * controls drop under the parameters.
 */

export interface PersonalizationPresetBarProps {
  profile: PersonalizationProfile;
  highlight?: boolean;
  defaultHighlight?: boolean;
  onHighlightChange?: (highlight: boolean) => void;
  /** "Edit presets" target — a link, or a handler for a sheet. */
  editHref?: string;
  onEdit?: () => void;
  /** Override the leading label ("Runner profile"). */
  label?: ReactNode;
  className?: string;
}

export function PersonalizationPresetBar({
  profile,
  highlight,
  defaultHighlight = false,
  onHighlightChange,
  editHref,
  onEdit,
  label,
  className,
}: PersonalizationPresetBarProps) {
  const [internal, setInternal] = useState(defaultHighlight);
  const on = highlight ?? internal;
  const setOn = (next: boolean) => {
    if (highlight === undefined) setInternal(next);
    onHighlightChange?.(next);
  };

  return (
    <div data-slot="personalization-preset-bar" data-highlight={on} className={cn("@container w-full min-w-0", className)}>
      <div className="grid grid-cols-1 items-center gap-y-cluster gap-x-stack rounded-inner border border-hairline bg-recessed px-cell-x py-compact @xl:grid-cols-[auto_minmax(0,1fr)_auto]">
        <p className="m-0 flex items-center gap-cluster">
          <UserRound size="1.1em" strokeWidth={1.5} aria-hidden="true" className="text-ink-secondary" />
          <span className="type-eyebrow text-ink-tertiary">{label ?? "Active profile"}</span>
          <span className="text-body-sm font-medium text-ink">{profile.name}</span>
        </p>
        <ul className="m-0 flex min-w-0 list-none flex-wrap items-center gap-cluster p-0" aria-label="Profile parameters">
          {profile.parameters.map((parameter) => (
            <li key={parameter}>
              <StatusPill kind="technical" size="sm">
                {parameter}
              </StatusPill>
            </li>
          ))}
          {profile.matchCount !== undefined && (
            <li className="text-caption tabular-nums text-ink-tertiary">{profile.matchCount} matches</li>
          )}
        </ul>
        <div className="flex flex-wrap items-center gap-stack @xl:justify-self-end">
          <Switch size="sm" checked={on} onCheckedChange={setOn} label="Highlight matches" />
          {editHref ? (
            <Button asChild intent="outline" size="sm">
              <a href={editHref}>
                <SlidersHorizontal size="1em" strokeWidth={1.5} aria-hidden="true" />
                Edit presets
              </a>
            </Button>
          ) : (
            <Button intent="outline" size="sm" onClick={onEdit}>
              <SlidersHorizontal size="1em" strokeWidth={1.5} aria-hidden="true" />
              Edit presets
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
