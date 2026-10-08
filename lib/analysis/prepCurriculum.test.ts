import { describe, it, expect } from "vitest";
import {
  buildPrepCurriculum,
  detectJobRole,
} from "@/lib/analysis/prepCurriculum";

describe("detectJobRole", () => {
  it("detects mobile from Android JD", () => {
    expect(
      detectJobRole("Android engineer building Kotlin apps with battery optimizations")
    ).toBe("mobile");
  });
});

describe("buildPrepCurriculum", () => {
  it("maps battery wording to mobile performance subtopics, not a raw 'battery life' topic", () => {
    const jd = `
Android Software Engineer
Improve battery life and reduce ANRs.
Kotlin, Jetpack, networking.
`.repeat(2);
    const topics = buildPrepCurriculum(jd, "Java developer");
    const titles = topics.map((t) => t.topic.toLowerCase());
    expect(titles.some((t) => t.includes("battery life"))).toBe(false);
    expect(titles.some((t) => t.includes("mobile performance"))).toBe(true);
    const perf = topics.find((t) => t.topic.toLowerCase().includes("performance"));
    expect(perf?.subtopics.some((s) => /battery/i.test(s))).toBe(true);
  });

  it("does not treat generic 'scripting' as its own prep topic", () => {
    const jd = `
Frontend Engineer using React and TypeScript.
Write clear documentation and pair with designers.
`.repeat(3);
    const topics = buildPrepCurriculum(jd, "");
    expect(topics.some((t) => /scripting/i.test(t.topic))).toBe(false);
    expect(topics.some((t) => /react/i.test(t.topic))).toBe(true);
    expect(topics.every((t) => t.subtopics.length > 0)).toBe(true);
  });
});
