import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { AffiliateAction } from "./affiliate-action";

const attribution = { source: "kit", medium: "affiliate", campaign: "test" };

describe("<AffiliateAction /> guardrail #3", () => {
  test("renders a sponsored, attributed anchor", () => {
    const html = renderToStaticMarkup(
      <AffiliateAction href="https://merchant.test/p?x=1" attribution={attribution}>
        View deal
      </AffiliateAction>,
    );
    expect(html).toContain('rel="sponsored nofollow noopener"');
    expect(html).toContain("utm_campaign=test");
    expect(html).toContain("x=1");
    expect(html).toContain('target="_blank"');
    expect(html).toContain("(opens in a new tab)");
  });

  test("asChild: compliance wins over the child's own href and rel, classes and children merge", () => {
    const html = renderToStaticMarkup(
      <AffiliateAction asChild href="https://merchant.test/p" attribution={attribution} intent="inline">
        <a href="https://raw.test/untracked" rel="noreferrer" className="consumer-class" data-testid="custom">
          Read more
        </a>
      </AffiliateAction>,
    );
    expect(html).not.toContain("raw.test");
    expect(html).toContain("https://merchant.test/p?utm_source=kit");
    expect(html).toMatch(/rel="sponsored nofollow noopener noreferrer"/);
    expect(html).toContain("consumer-class");
    expect(html).toContain('data-testid="custom"');
    expect(html).toContain('data-slot="affiliate-action"');
    expect(html).toContain('data-intent="inline"');
    expect(html).toContain("Read more");
    expect(html).toContain('data-slot="action-arrow"');
    // Exactly one anchor: the child was cloned, not wrapped.
    expect(html.match(/<a /g)?.length).toBe(1);
  });

  test("asChild: the consumer's rel is merged, never trusted alone", () => {
    const html = renderToStaticMarkup(
      <AffiliateAction asChild href="https://merchant.test/p" rel="me" newTab={false}>
        <a rel="author">Author link</a>
      </AffiliateAction>,
    );
    for (const token of ["sponsored", "nofollow", "noopener", "author", "me"]) expect(html).toContain(token);
    expect(html).not.toContain("target=");
  });
});
