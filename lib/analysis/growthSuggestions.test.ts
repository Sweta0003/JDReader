import { describe, it, expect } from "vitest";
import { buildGrowthSuggestions } from "@/lib/analysis/growthSuggestions";

describe("buildGrowthSuggestions", () => {
  it("returns Android-oriented courses and projects for a mobile role", () => {
    const { courses, projects } = buildGrowthSuggestions(
      "Android engineer Kotlin Jetpack battery",
      "mobile"
    );
    expect(courses.some((c) => /android/i.test(c.title))).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.some((p) => p.deliverables.length > 0)).toBe(true);
  });

  it("adds Next.js extras when the JD mentions React/Next", () => {
    const { courses } = buildGrowthSuggestions(
      "Frontend React Next.js TypeScript",
      "frontend"
    );
    expect(courses.some((c) => /next/i.test(c.title))).toBe(true);
  });
});
