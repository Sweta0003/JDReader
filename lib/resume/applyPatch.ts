import type { ResumePatch } from "@/lib/types/analysis";

export type ApplyPatchResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

function findHeadingIndex(text: string, heading: string): number {
  const lines = text.split(/\r?\n/);
  const target = heading.trim().toLowerCase();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase();
    if (line === target || line.startsWith(`${target}:`)) {
      return i;
    }
  }
  return -1;
}

export function applyPatch(text: string, patch: ResumePatch): ApplyPatchResult {
  switch (patch.type) {
    case "replace_phrase": {
      if (!patch.find) {
        return { ok: false, error: "Find phrase is empty." };
      }
      if (!text.includes(patch.find)) {
        return {
          ok: false,
          error: `Could not find phrase to replace: "${patch.find.slice(0, 60)}..."`,
        };
      }
      return {
        ok: true,
        text: text.replace(patch.find, patch.replace),
      };
    }
    case "insert_after_heading": {
      const idx = findHeadingIndex(text, patch.heading);
      if (idx === -1) {
        const block = `\n\n${patch.heading}\n${patch.content.trim()}\n`;
        return { ok: true, text: text.trimEnd() + block };
      }
      const lines = text.split(/\r?\n/);
      lines.splice(idx + 1, 0, patch.content);
      return { ok: true, text: lines.join("\n") };
    }
    case "append_section": {
      const idx = findHeadingIndex(text, patch.section);
      if (idx === -1) {
        const block = `\n\n${patch.section}\n${patch.content.trim()}\n`;
        return { ok: true, text: text.trimEnd() + block };
      }
      const lines = text.split(/\r?\n/);
      let insertAt = lines.length;
      for (let i = idx + 1; i < lines.length; i++) {
        const t = lines[i].trim();
        if (t && /^[A-Z][A-Za-z\s/&]+$/.test(t) && t.length < 40 && !t.startsWith("•")) {
          insertAt = i;
          break;
        }
      }
      lines.splice(insertAt, 0, patch.content);
      return { ok: true, text: lines.join("\n") };
    }
    default:
      return { ok: false, error: "Unknown patch type." };
  }
}
