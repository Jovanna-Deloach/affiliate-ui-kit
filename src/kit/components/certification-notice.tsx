import { CircleHelp, FlaskConical, ShieldCheck, TriangleAlert, type LucideIcon } from "lucide-react";

import type { Certification } from "@/kit/types";
import { CertificationStatus, GradeBadge } from "@/kit/ui";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";

const monthYear = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

const WORDS: Record<Certification["status"], { title: (date?: string) => string; body: string; icon: LucideIcon; tone: string }> = {
  certified: {
    title: (date) => (date ? `Certified until ${monthYear(date)}` : "Certified"),
    body: "The batch on sale passed our latest test. Every batch we tested is below.",
    icon: ShieldCheck,
    tone: "text-pass",
  },
  expired: {
    title: (date) => (date ? `This product’s certification expired in ${monthYear(date)}` : "This product’s certification has expired"),
    body: "We haven’t tested a newer batch, so we can’t say whether what’s on sale now matches the one we tested.",
    icon: TriangleAlert,
    tone: "text-warn",
  },
  upcoming: {
    title: (date) => (date ? `We’re testing a new batch: results by ${monthYear(date)}` : "We’re testing a new batch"),
    body: "Until the results are in, the grade is for the last batch we tested.",
    icon: FlaskConical,
    tone: "text-fg-muted",
  },
  untested: {
    title: () => "We haven’t tested this product",
    body: "It has no grade from us yet; readers’ reviews are all there is to go on.",
    icon: CircleHelp,
    tone: "text-fg-muted",
  },
};

export interface CertificationNoticeProps {
  /** The status, its date and every batch tested (`history`, newest first). */
  certification: Certification;
  /** The heading’s level: `h2` on a product’s page (default), `h3` inside a section. */
  as?: "h2" | "h3";
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Where the product stands with the testing program, in a sentence a reader
 * can act on (“This product’s certification expired in March 2026”), what
 * that means, and every batch tested: when, the batch number, the grade and
 * the result. An icon in the status’s tone sits beside the heading; the
 * words carry the meaning.
 *
 * **Use it for** a product’s page, near its grade, whenever its
 * certification is not simply current, and on a certified product to show
 * its record. **Not for** a recall or a safety warning (`ConsumerWarning`),
 * or a status in a row or card (`CertificationStatus`).
 *
 * @summary Certification expired, in testing or current, with every batch tested.
 * @import import { CertificationNotice } from "@/kit/components";
 */
export function CertificationNotice({ certification, as: Heading = "h2", className }: CertificationNoticeProps) {
  const words = WORDS[certification.status];
  const Icon = words.icon;
  const history = certification.history ?? [];
  return (
    <section aria-label="Certification" className={cn("grid gap-4 rounded-box border border-line bg-paper p-5", className)}>
      <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5">
        <Icon aria-hidden="true" size={22} strokeWidth={1.75} className={cn("mt-0.5", words.tone)} />
        <Heading className="m-0 t-name-sm text-fg">{words.title(certification.date)}</Heading>
        <p className="col-start-2 m-0 t-small text-fg-body">{words.body}</p>
      </div>
      {history.length ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left t-small">
            <caption className="sr-only">Every batch tested</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pr-4 t-micro font-normal text-fg-muted">
                  Tested
                </th>
                <th scope="col" className="py-2 pr-4 t-micro font-normal text-fg-muted">
                  Batch
                </th>
                <th scope="col" className="py-2 pr-4 t-micro font-normal text-fg-muted">
                  Grade
                </th>
                <th scope="col" className="py-2 t-micro font-normal text-fg-muted">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={`${record.batch}-${record.testedAt}`} className="border-b border-line last:border-0">
                  <td data-numeric className="py-2.5 pr-4 whitespace-nowrap text-fg">
                    {formatDate(record.testedAt)}
                  </td>
                  <td data-numeric className="py-2.5 pr-4 text-fg">
                    {record.batch}
                  </td>
                  <td className="py-1.5 pr-4">{record.grade ? <GradeBadge grade={record.grade} size="sm" /> : <span className="text-fg-muted">None</span>}</td>
                  <td className="py-2.5">
                    {record.passed ? (
                      <CertificationStatus certification={{ status: "certified", date: record.until }} />
                    ) : (
                      <span className="text-fail">Failed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
