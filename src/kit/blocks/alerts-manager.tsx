"use client";

import { BellRing } from "lucide-react";
import Image from "next/image";

import type { PriceAlert } from "@/kit/types";
import { Badge, Button, EmptyState, RelativeTime, Sep } from "@/kit/ui";
import { cn } from "@/lib/cn";
import { formatDate, formatPrice } from "@/lib/format";

const condition = (alert: PriceAlert) => (alert.kind === "below" && alert.price !== undefined ? `Below ${formatPrice(alert.price, alert.item.price?.currency)}` : "Back in stock");

function Row({ alert, now, onPause, onDelete }: { alert: PriceAlert; now?: string; onPause?: (id: string, paused: boolean) => void; onDelete?: (id: string) => void }) {
  const { item } = alert;
  const name = [item.brand, item.title].filter(Boolean).join(" ");
  return (
    <li className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3 border-t border-line py-4 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto]">
      <span aria-hidden="true" className="relative block size-14 overflow-hidden rounded-media kit-studio">
        {item.image ? <Image src={item.image.src} alt="" fill sizes="3.5rem" className="object-contain p-1.5" /> : null}
      </span>
      <div className="grid min-w-0 content-start gap-1">
        {item.brand ? <p className="m-0 t-micro text-fg-muted">{item.brand}</p> : null}
        <a href={item.href} data-name className="kit-focus justify-self-start rounded-ctl t-ui font-semibold text-fg no-underline hover:underline">
          {item.title}
        </a>
        <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 t-small text-fg-body">
          <span className="font-semibold text-fg">{condition(alert)}</span>
          {alert.status === "met" ? (
            <Badge variant="soft" tone="pass" size="sm">
              Met
            </Badge>
          ) : alert.status === "paused" ? (
            <Badge variant="soft" size="sm">
              Paused
            </Badge>
          ) : (
            <Badge variant="soft" size="sm">
              Watching
            </Badge>
          )}
        </p>
        <p className="m-0 t-caption text-fg-muted">
          {alert.met ? (
            <>
              <span data-numeric>
                {formatPrice(alert.met.price, item.price?.currency)} at {alert.met.merchant} on {formatDate(alert.met.at)}
              </span>
              <Sep />
              We emailed you
            </>
          ) : (
            <>
              Set <RelativeTime date={alert.createdAt} now={now} />
              {item.price ? (
                <>
                  <Sep />
                  <span data-numeric>{formatPrice(item.price.amount, item.price.currency)} when you set it</span>
                </>
              ) : null}
            </>
          )}
        </p>
      </div>
      <div className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-1 sm:col-start-auto">
        {alert.status !== "met" && onPause ? (
          <Button emphasis="quiet" onClick={() => onPause(alert.id, alert.status === "active")} className="t-small">
            {alert.status === "active" ? "Pause" : "Resume"}
            <span className="sr-only"> the alert for {name}</span>
          </Button>
        ) : null}
        {onDelete ? (
          <Button emphasis="quiet" onClick={() => onDelete(alert.id)} className="t-small">
            Delete
            <span className="sr-only"> the alert for {name}</span>
          </Button>
        ) : null}
      </div>
    </li>
  );
}

export interface AlertsManagerProps {
  /** The reader’s price alerts, newest first: each product, its condition and status. */
  alerts: PriceAlert[];
  /** Pauses (`true`) or resumes (`false`) an alert (a Server Action). */
  onPause?: (id: string, paused: boolean) => void;
  /** Deletes an alert (a Server Action). */
  onDelete?: (id: string) => void;
  /** The heading (default “Price alerts”). */
  heading?: string;
  /** The moment “set 2 weeks ago” counts from; pin it in stories and tests (default: now). */
  now?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A reader’s price alerts: the ones still watching (or paused) first, then
 * the ones met, each with its product, its condition (“Below $19”, “Back in
 * stock”) and status; met ones say the price, retailer and day. Pause,
 * resume or delete any of them. With none, it says how to set one.
 *
 * **Use it for** the Price alerts page of a reader’s account. **Not for**
 * setting an alert (`PriceAlert`), saved items (`SavedItems`), or a
 * product’s price over time (`PriceHistory`).
 *
 * @summary A reader’s price alerts: product, condition, status; pause or delete.
 * @import import { AlertsManager } from "@/kit/blocks";
 */
export function AlertsManager({ alerts, onPause, onDelete, heading = "Price alerts", now, className }: AlertsManagerProps) {
  const open = alerts.filter((alert) => alert.status !== "met");
  const met = alerts.filter((alert) => alert.status === "met");
  return (
    <section aria-labelledby="alerts-heading" className={cn("grid gap-6", className)}>
      <div className="grid gap-2">
        <h2 id="alerts-heading" className="m-0 t-headline text-fg">
          {heading}
        </h2>
        <p className="m-0 t-small text-fg-muted">One email when an alert is met, then it ends. Nothing else.</p>
      </div>
      {alerts.length ? (
        <>
          {open.length ? (
            <div className="grid gap-2">
              <h3 className="m-0 t-ui font-semibold text-fg">Watching</h3>
              <ul className="m-0 grid list-none border-b border-line p-0">
                {open.map((alert) => (
                  <Row key={alert.id} alert={alert} now={now} onPause={onPause} onDelete={onDelete} />
                ))}
              </ul>
            </div>
          ) : null}
          {met.length ? (
            <div className="grid gap-2">
              <h3 className="m-0 t-ui font-semibold text-fg">Met</h3>
              <ul className="m-0 grid list-none border-b border-line p-0">
                {met.map((alert) => (
                  <Row key={alert.id} alert={alert} now={now} onDelete={onDelete} />
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ) : (
        <EmptyState title="No price alerts" icon={BellRing} className="border-t border-line">
          <p>Set one from any product’s page, and we’ll email you once when it’s met.</p>
        </EmptyState>
      )}
    </section>
  );
}
