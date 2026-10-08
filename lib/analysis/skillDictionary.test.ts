import { describe, it, expect } from "vitest";
import {
  extractTermsFromText,
  termsMissingFromResume,
} from "@/lib/analysis/skillDictionary";

describe("extractTermsFromText", () => {
  it("finds known skills in job text", () => {
    const jd =
      "We need React and TypeScript experience. AWS is a plus. System design interviews.";
    const terms = extractTermsFromText(jd);
    expect(terms).toContain("React");
    expect(terms).toContain("TypeScript");
    expect(terms).toContain("AWS");
    expect(terms.map((t) => t.toLowerCase())).toContain("system design");
  });
});

describe("termsMissingFromResume", () => {
  it("returns JD terms absent from resume", () => {
    const missing = termsMissingFromResume(
      ["React", "AWS", "Python"],
      "Built apps with React and Node."
    );
    expect(missing).toContain("AWS");
    expect(missing).toContain("Python");
    expect(missing).not.toContain("React");
  });
});
