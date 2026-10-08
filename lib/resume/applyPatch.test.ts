import { describe, it, expect } from "vitest";
import { applyPatch } from "@/lib/resume/applyPatch";

describe("applyPatch", () => {
  const base = "Summary\nLine one\n\nExperience\n• Old bullet";

  it("inserts after heading when section exists", () => {
    const result = applyPatch(base, {
      type: "insert_after_heading",
      heading: "Experience",
      content: "\n• New bullet",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.text).toContain("• New bullet");
      expect(result.text.indexOf("• New bullet")).toBeLessThan(
        result.text.indexOf("• Old bullet")
      );
    }
  });

  it("creates section when heading missing", () => {
    const result = applyPatch("Hello world", {
      type: "append_section",
      section: "Skills",
      content: "React, TypeScript",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.text).toContain("Skills");
      expect(result.text).toContain("React");
    }
  });

  it("replaces phrase when found", () => {
    const result = applyPatch("I know JavaScript well", {
      type: "replace_phrase",
      find: "JavaScript",
      replace: "TypeScript",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.text).toContain("TypeScript");
  });
});
