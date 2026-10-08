import { describe, it, expect } from "vitest";
import { analyzeJobResume } from "@/lib/analysis/analyzeJobResume";

const SAMPLE_JD = `
Senior Software Engineer — We use React, TypeScript, AWS, and Kubernetes daily.
You will lead system design discussions and mentor engineers. 5+ years experience required.
`.repeat(2);

describe("analyzeJobResume", () => {
  it("throws when job text is too short", () => {
    expect(() => analyzeJobResume("short", "resume")).toThrow(/too short/i);
  });

  it("returns prep topics and suggestions for skill gaps", () => {
    const resume = "Summary\nExperience\n• Built internal tools with JavaScript.";
    const result = analyzeJobResume(SAMPLE_JD, resume);
    expect(result.prepTopics.length).toBeGreaterThan(0);
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.jobInsights.termsFromJob.length).toBeGreaterThan(0);
    const topics = result.prepTopics.map((t) => t.topic);
    expect(
      topics.some((t) =>
        /system design|kubernetes|cloud|typescript|javascript/i.test(t)
      )
    ).toBe(true);
    expect(result.prepTopics.every((t) => t.subtopics.length > 0)).toBe(true);
    expect(result.courses.length).toBeGreaterThan(0);
    expect(result.projects.length).toBeGreaterThan(0);
    expect(result.projects[0].deliverables.length).toBeGreaterThan(0);
  });

  it("includes role-specific scenarios from responsibilities", () => {
    const jd = `
Software Engineer
Responsibilities
• Build APIs with TypeScript and Node.js for payment workflows
• Own on-call rotation for production services
Minimum Qualifications
• 3+ years backend experience
`.repeat(2);
    const result = analyzeJobResume(jd, "Summary\nSkills\nJava only");
    expect(
      result.prepTopics.some((p) =>
        p.topic.toLowerCase().includes("role-specific")
      )
    ).toBe(true);
  });
});
