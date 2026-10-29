"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Drawer } from "vaul";

import { cn } from "@/lib/cn";
import { useInheritedVertical } from "@/lib/use-inherited-vertical";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/use-media-query";

/**
 * <ResponsiveSheet />
 * ---------------------------------------------------------------------------
 * Desktop: Radix Dialog slide-over (focus trap, ARIA, Esc, scroll lock).
 * Mobile:  vaul bottom sheet (drag to dismiss, snap points, handle).
 * Same API, same title / body / footer slots — "View all retailers",
 * "Shop the look", any secondary surface.
 *
 *   --size-sheet-compact / --size-sheet-dossier   desktop panel width
 *   --radius-container                            bottom-sheet top corners
 *   --scrim / --shadow-overlay                    backdrop · panel elevation
 *   --inset-card / --inset-bar-*                  header + body · recessed footer bar
 *   --duration-reveal / --ease-standard           enter · --duration-interactive / --ease-exit  exit
 *
 * Mobbin anatomy (hers / sweetgreen / lululemon slide-overs, Fable & Tabby
 * bottom sheets): title top-left with ✕ top-right, scrollable body, footer
 * pinned with the primary action, hairline between regions. Half-screen
 * dossiers open at 55 % and expand to full height on drag.
 *
 * 21st.dev physics (Credenza): one media query chooses the engine; the
 * engine switch happens at the root, so children never know which they are
 * in. Enter/exit are token-bound keyframes (`sheet-panel-*`, `sheet-scrim`)
 * that Radix Presence waits for before unmounting.
 */

const panelVariants = cva(
  ["fixed z-50 flex max-h-dvh flex-col bg-surface text-ink shadow-overlay outline-none"],
  {
    variants: {
      size: {
        "compact-offer-sheet": "w-[min(100vw,var(--size-sheet-compact))]",
        "half-screen-dossier": "w-[min(100vw,var(--size-sheet-dossier))]",
      },
      side: {
        right: "inset-y-0 right-0 sheet-panel-right border-l border-hairline",
        left: "inset-y-0 left-0 sheet-panel-left border-r border-hairline",
      },
    },
    defaultVariants: { size: "compact-offer-sheet", side: "right" },
  },
);

export interface ResponsiveSheetProps extends VariantProps<typeof panelVariants> {
  /** The element that opens the sheet (rendered via asChild). */
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** Pinned footer (primary action lives here). */
  footer?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Media query that selects the desktop slide-over (default ≥ 768px). */
  desktopQuery?: string;
  className?: string;
}

export function ResponsiveSheet({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  defaultOpen,
  onOpenChange,
  size = "compact-offer-sheet",
  side = "right",
  desktopQuery = DESKTOP_QUERY,
  className,
}: ResponsiveSheetProps) {
  const isDesktop = useMediaQuery(desktopQuery);
  const resolvedSize = size ?? "compact-offer-sheet";
  // The portal lives outside the vertical's subtree; stamp the inherited
  // profile on the surface so tokens resolve identically to the trigger.
  const [anchorRef, vertical] = useInheritedVertical();
  const anchor = <span ref={anchorRef} hidden data-slot="sheet-anchor" />;
  // Land focus on the panel (tabIndex -1), not on the ✕ — a pointer-less open
  // would otherwise paint a focus ring on the close control.
  const panelRef = useRef<HTMLDivElement>(null);

  const header = (TitleComp: typeof Dialog.Title, DescComp: typeof Dialog.Description, CloseComp: typeof Dialog.Close) => (
    <header
      data-slot="sheet-header"
      className="grid grid-cols-[minmax(0,1fr)_var(--size-control)] items-start gap-x-stack border-b border-hairline px-card py-stack"
    >
      <div className="flex min-w-0 flex-col gap-hairline">
        <TitleComp className="type-title m-0">{title}</TitleComp>
        {description ? (
          <DescComp className="m-0 text-body-sm text-ink-secondary">{description}</DescComp>
        ) : (
          <DescComp className="sr-only">{typeof title === "string" ? title : "Sheet"}</DescComp>
        )}
      </div>
      <CloseComp
        aria-label="Close"
        className="focus-ring -mr-cluster -mt-cluster flex size-control shrink-0 cursor-pointer items-center justify-center rounded-inner text-ink-secondary transition-colors duration-interactive ease-standard hover:bg-recessed hover:text-ink"
      >
        <X size="1.25em" strokeWidth={1.5} aria-hidden="true" />
      </CloseComp>
    </header>
  );

  const body = (
    <div data-slot="sheet-body" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-card py-stack">
      {children}
    </div>
  );

  const foot = footer ? (
    <footer
      data-slot="sheet-footer"
      className="mt-auto flex flex-col gap-cluster border-t border-hairline bg-recessed px-bar-x py-bar-y pb-[max(var(--inset-bar-y),env(safe-area-inset-bottom))]"
    >
      {footer}
    </footer>
  ) : null;

  if (isDesktop) {
    return (
      <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        {anchor}
        {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
        <Dialog.Portal>
          <Dialog.Overlay className="sheet-scrim fixed inset-0 z-50" />
          <Dialog.Content
            ref={panelRef}
            tabIndex={-1}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              panelRef.current?.focus();
            }}
            data-slot="responsive-sheet"
            data-engine="dialog"
            data-vertical={vertical}
            className={cn(panelVariants({ size: resolvedSize, side }), className)}
          >
            {header(Dialog.Title, Dialog.Description, Dialog.Close)}
            {body}
            {foot}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  const dossier = resolvedSize === "half-screen-dossier";
  // vaul's props are a discriminated union: snapPoints + fadeFromIndex together or neither.
  const snapProps: { snapPoints: (number | string)[]; fadeFromIndex: number } | { snapPoints?: undefined; fadeFromIndex?: undefined } =
    dossier ? { snapPoints: [0.55, 1], fadeFromIndex: 0 } : {};

  return (
    <Drawer.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      shouldScaleBackground={false}
      {...snapProps}
    >
      {anchor}
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="sheet-scrim fixed inset-0 z-50" />
        <Drawer.Content
          data-slot="responsive-sheet"
          data-engine="drawer"
          data-vertical={vertical}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex flex-col bg-surface text-ink shadow-overlay outline-none",
            "rounded-t-container border-t border-hairline",
            dossier ? "h-[92dvh]" : "max-h-[92dvh]",
            className,
          )}
        >
          <Drawer.Handle className="mt-cluster !h-[var(--border-width-emphasis)] !w-[calc(var(--size-control)*1.2)] !bg-strong" />
          {header(Drawer.Title, Drawer.Description, Drawer.Close)}
          {body}
          {foot}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export { panelVariants as responsiveSheetPanelVariants };
