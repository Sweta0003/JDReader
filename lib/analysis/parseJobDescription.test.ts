import { describe, it, expect } from "vitest";
import {
  extractJobSections,
  normalizeJobText,
} from "@/lib/analysis/parseJobDescription";
import { buildJobUnderstanding } from "@/lib/analysis/mergeJobTerms";

const SAMPLE = `
Senior Backend Engineer

Responsibilities
• Design distributed systems on AWS
• Lead code reviews and mentor junior engineers

Minimum Qualifications
• 5+ years experience with Python and PostgreSQL
• Experience with Kubernetes and Docker
• Strong communication skills

Nice to have
• GraphQL, Kafka
`.trim();

describe("normalizeJobText", () => {
  it("collapses noise and keeps structure", () => {
    const out = normalizeJobText("  Hello   \n\n\n  World  ");
    expect(out).toContain("Hello");
    expect(out).toContain("World");
  });
});

describe("extractJobSections", () => {
  it("splits responsibilities and requirements", () => {
    const sections = extractJobSections(SAMPLE);
    expect(sections.responsibilities.length).toBeGreaterThanOrEqual(2);
    expect(sections.requirements.length).toBeGreaterThanOrEqual(2);
    expect(sections.niceToHave.length).toBeGreaterThanOrEqual(1);
  });
});

describe("buildJobUnderstanding", () => {
  it("finds dictionary and keyword terms from full JD", () => {
    const { rankedTerms, insights } = buildJobUnderstanding(SAMPLE);
    expect(insights.termsFromJob.length).toBeGreaterThan(0);
    const lower = rankedTerms.map((t) => t.term.toLowerCase());
    expect(lower.some((t) => t.includes("python") || t === "python")).toBe(true);
    expect(lower.some((t) => t.includes("kubernetes"))).toBe(true);
  });
});
