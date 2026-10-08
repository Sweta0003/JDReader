import { extractKeywordTerms, termInText } from "@/lib/analysis/extractKeywords";
import {
  extractJobSections,
  extractPhrasesFromJob,
  normalizeJobText,
} from "@/lib/analysis/parseJobDescription";
import {
  extractTermsFromText,
  termsMissingFromResume,
} from "@/lib/analysis/skillDictionary";
import type { JobInsights } from "@/lib/types/analysis";

export type RankedJobTerm = {
  term: string;
  weight: number;
  source: "dictionary" | "phrase" | "keyword" | "requirement";
};

function dedupeRanked(terms: RankedJobTerm[]): RankedJobTerm[] {
  const byKey = new Map<string, RankedJobTerm>();
  for (const t of terms) {
    const key = t.term.toLowerCase();
    const existing = byKey.get(key);
    if (!existing || t.weight > existing.weight) {
      byKey.set(key, t);
    } else if (existing && t.weight === existing.weight) {
      byKey.set(key, { ...existing, weight: existing.weight + 0.5 });
    }
  }
  return [...byKey.values()].sort((a, b) => b.weight - a.weight);
}

/** Build a unified, ranked term list from the full JD. */
export function buildJobUnderstanding(rawJobText: string): {
  normalizedJob: string;
  sections: ReturnType<typeof extractJobSections>;
  rankedTerms: RankedJobTerm[];
  insights: JobInsights;
} {
  const normalizedJob = normalizeJobText(rawJobText);
  const sections = extractJobSections(normalizedJob);

  const ranked: RankedJobTerm[] = [];

  for (const term of extractTermsFromText(normalizedJob)) {
    ranked.push({ term, weight: 4, source: "dictionary" });
  }

  for (const phrase of extractPhrasesFromJob(normalizedJob, sections)) {
    ranked.push({ term: phrase, weight: 3, source: "phrase" });
  }

  for (const line of sections.requirements) {
    for (const part of line.split(/[,;/]/)) {
      const t = part.trim();
      if (t.length >= 3 && t.length <= 40 && /[A-Za-z]/.test(t) && t.split(/\s+/).length <= 4) {
        ranked.push({ term: t, weight: 3.5, source: "requirement" });
      }
    }
  }

  for (const kw of extractKeywordTerms(normalizedJob, 12)) {
    if (kw.split(/\s+/).length <= 3) {
      ranked.push({ term: kw, weight: 2, source: "keyword" });
    }
  }

  const rankedTerms = dedupeRanked(ranked);
  const termsFromJob = rankedTerms
    .filter((t) => t.source === "dictionary")
    .slice(0, 20)
    .map((t) => t.term);

  return {
    normalizedJob,
    sections,
    rankedTerms,
    insights: {
      requirementBullets: sections.requirements.length,
      responsibilityBullets: sections.responsibilities.length,
      termsFromJob,
      role: "general",
    },
  };
}

export function missingTermsForResume(
  rankedTerms: RankedJobTerm[],
  resumeText: string,
  max = 15
): string[] {
  const dictionaryOnly = rankedTerms
    .filter((t) => t.source === "dictionary" || t.weight >= 3)
    .map((t) => t.term);

  const fromDict = termsMissingFromResume(
    dictionaryOnly.length ? dictionaryOnly : rankedTerms.map((t) => t.term),
    resumeText
  );

  const fromKeywords = rankedTerms
    .filter((t) => t.source === "keyword" || t.source === "phrase")
    .map((t) => t.term)
    .filter((term) => !termInText(term, resumeText));

  const merged = [...fromDict, ...fromKeywords];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const term of merged) {
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(term);
    if (out.length >= max) break;
  }
  return out;
}
