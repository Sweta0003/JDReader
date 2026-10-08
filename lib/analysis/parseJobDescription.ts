/** Normalize pasted or scraped JD text for parsing. */
export function normalizeJobText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\u2022/g, "•")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\t/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter((line, i, arr) => line.length > 0 || (arr[i + 1]?.length ?? 0) > 0)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const SECTION_ALIASES: Record<string, RegExp> = {
  requirements: /^(minimum\s+)?qualifications?|requirements?|must\s+have|what\s+you('ll|\s+will)\s+need|skills?\s*(and|&)\s*experience/i,
  responsibilities: /^(key\s+)?responsibilities|what\s+you('ll|\s+will)\s+do|the\s+role|about\s+the\s+job|job\s+description/i,
  niceToHave: /nice\s+to\s+have|preferred|bonus|pluses?/i,
};

export type JobSections = {
  requirements: string[];
  responsibilities: string[];
  niceToHave: string[];
  otherLines: string[];
};

function isBulletLine(line: string): boolean {
  return /^([•\-*–]|\d+[.)])\s+/.test(line);
}

function stripBullet(line: string): string {
  return line.replace(/^([•\-*–]|\d+[.)])\s+/, "").trim();
}

/** Split JD into requirement / responsibility bullets and free lines. */
export function extractJobSections(text: string): JobSections {
  const sections: JobSections = {
    requirements: [],
    responsibilities: [],
    niceToHave: [],
    otherLines: [],
  };

  let current: keyof JobSections | "other" = "other";

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    let matchedSection = false;
    for (const [key, re] of Object.entries(SECTION_ALIASES)) {
      if (re.test(line) && line.length < 80) {
        current = key as keyof JobSections;
        matchedSection = true;
        break;
      }
    }
    if (matchedSection) continue;

    const content = isBulletLine(line) ? stripBullet(line) : line;
    if (content.length < 4) continue;

    if (isBulletLine(line) || current !== "other") {
      if (current === "requirements") sections.requirements.push(content);
      else if (current === "responsibilities")
        sections.responsibilities.push(content);
      else if (current === "niceToHave") sections.niceToHave.push(content);
      else sections.otherLines.push(content);
    } else {
      sections.otherLines.push(content);
      current = "other";
    }
  }

  if (
    sections.requirements.length === 0 &&
    sections.responsibilities.length === 0
  ) {
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (!t) continue;
      const content = isBulletLine(t) ? stripBullet(t) : t;
      if (content.length >= 20) sections.otherLines.push(content);
    }
  }

  return sections;
}

const SKILL_PATTERNS: RegExp[] = [
  /\b(?:experience|proficiency|skilled|expertise|knowledge|familiar(?:ity)?)\s+(?:with|in|of)\s+([^.;\n]{3,80})/gi,
  /\b(?:using|including)\s+([A-Za-z0-9+#./\s,&-]{2,60})/gi,
  /\b(\d+\+?\s*years?\s+(?:of\s+)?(?:experience\s+)?(?:with|in)\s+[^.\n]{3,60})/gi,
  /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s+(?:development|engineering|architecture|management)\b/g,
];

/** Pull skill-like phrases from requirement bullets and prose. */
export function extractPhrasesFromJob(text: string, sections: JobSections): string[] {
  const pool = [
    ...sections.requirements,
    ...sections.responsibilities,
    ...sections.niceToHave,
    ...sections.otherLines,
    text,
  ].join("\n");

  const found = new Set<string>();

  for (const re of SKILL_PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(pool)) !== null) {
      const chunk = (m[1] ?? m[0]).trim();
      splitSkillList(chunk).forEach((s) => {
        if (s.length >= 2 && s.length <= 60) found.add(s);
      });
    }
  }

  return [...found];
}

function splitSkillList(chunk: string): string[] {
  return chunk
    .split(/\s*,\s*|\s+\/\s+|\s+and\s+|\s*&\s*|\s*\|\s*/i)
    .map((s) => s.replace(/^[^a-zA-Z0-9+#]+|[^a-zA-Z0-9+#.]+$/g, "").trim())
    .filter(Boolean);
}
