import { describe, expect, test } from "bun:test";

import { AFFILIATE_REL, buildAffiliateHref, mergeRel } from "./affiliate";

describe("buildAffiliateHref", () => {
  test("appends UTM and subId parameters", () => {
    const href = buildAffiliateHref("https://shop.test/p/1", {
      source: "kit",
      medium: "affiliate",
      campaign: "best-trainers",
      content: "scorecard-cta",
      subId: "prod-1|pos-1",
    });
    const u = new URL(href);
    expect(u.searchParams.get("utm_source")).toBe("kit");
    expect(u.searchParams.get("utm_medium")).toBe("affiliate");
    expect(u.searchParams.get("utm_campaign")).toBe("best-trainers");
    expect(u.searchParams.get("utm_content")).toBe("scorecard-cta");
    expect(u.searchParams.get("subId")).toBe("prod-1|pos-1");
  });

  test("respects a custom sub-id parameter name", () => {
    const href = buildAffiliateHref("https://shop.test/p/1", { subId: "abc", subIdParam: "clickref" });
    expect(new URL(href).searchParams.get("clickref")).toBe("abc");
    expect(new URL(href).searchParams.has("subId")).toBe(false);
  });

  test("preserves existing merchant parameters unless overwrite is set", () => {
    const base = "https://shop.test/p/1?utm_source=merchant&ref=x";
    expect(new URL(buildAffiliateHref(base, { source: "kit" })).searchParams.get("utm_source")).toBe("merchant");
    expect(new URL(buildAffiliateHref(base, { source: "kit" }, { overwrite: true })).searchParams.get("utm_source")).toBe("kit");
    expect(new URL(buildAffiliateHref(base, { source: "kit" })).searchParams.get("ref")).toBe("x");
  });

  test("returns relative or malformed hrefs untouched", () => {
    expect(buildAffiliateHref("/go/merchant", { source: "kit" })).toBe("/go/merchant");
    expect(buildAffiliateHref("not a url", { source: "kit" })).toBe("not a url");
  });

  test("is a no-op without attribution", () => {
    expect(buildAffiliateHref("https://shop.test/p/1")).toBe("https://shop.test/p/1");
  });
});

describe("mergeRel", () => {
  test("always contains the mandatory relation", () => {
    expect(mergeRel()).toBe(AFFILIATE_REL);
    const merged = mergeRel("noreferrer nofollow");
    for (const t of AFFILIATE_REL.split(" ")) expect(merged.split(" ")).toContain(t);
    expect(merged.split(" ")).toContain("noreferrer");
    expect(merged.split(" ").filter((t) => t === "nofollow")).toHaveLength(1);
  });
});
