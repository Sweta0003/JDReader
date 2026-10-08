import { describe, it, expect } from "vitest";
import { isScrapeUrlAllowed } from "@/lib/job/urlSafety";

describe("isScrapeUrlAllowed", () => {
  it("allows public https URLs", () => {
    const r = isScrapeUrlAllowed("https://www.linkedin.com/jobs/view/123");
    expect(r.ok).toBe(true);
  });

  it("blocks non-https", () => {
    const r = isScrapeUrlAllowed("http://example.com/job");
    expect(r.ok).toBe(false);
  });

  it("blocks localhost", () => {
    const r = isScrapeUrlAllowed("https://localhost/job");
    expect(r.ok).toBe(false);
  });
});
