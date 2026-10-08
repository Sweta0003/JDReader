const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "you",
  "your",
  "our",
  "will",
  "this",
  "that",
  "from",
  "have",
  "has",
  "are",
  "was",
  "were",
  "been",
  "being",
  "into",
  "about",
  "their",
  "they",
  "them",
  "who",
  "what",
  "when",
  "where",
  "which",
  "while",
  "would",
  "should",
  "could",
  "can",
  "may",
  "might",
  "must",
  "able",
  "work",
  "working",
  "team",
  "role",
  "job",
  "company",
  "experience",
  "years",
  "year",
  "including",
  "such",
  "other",
  "well",
  "also",
  "using",
  "use",
  "used",
  "across",
  "within",
  "through",
  "during",
  "both",
  "each",
  "more",
  "most",
  "some",
  "any",
  "all",
  "not",
  "but",
  "how",
  "why",
  "linkedin",
  "apply",
  "share",
  "report",
]);

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP.has(w));
}

/** Significant unigrams and bigrams by frequency in JD (not in generic stop list). */
export function extractKeywordTerms(jobText: string, limit = 25): string[] {
  const words = tokenize(jobText);
  const unigramCounts = new Map<string, number>();
  for (const w of words) {
    unigramCounts.set(w, (unigramCounts.get(w) ?? 0) + 1);
  }

  const bigramCounts = new Map<string, number>();
  for (let i = 0; i < words.length - 1; i++) {
    const bg = `${words[i]} ${words[i + 1]}`;
    if (bg.length >= 7) {
      bigramCounts.set(bg, (bigramCounts.get(bg) ?? 0) + 1);
    }
  }

  const scored: { term: string; score: number }[] = [];

  for (const [term, count] of unigramCounts) {
    if (count >= 2) scored.push({ term, score: count });
  }
  for (const [term, count] of bigramCounts) {
    if (count >= 2) scored.push({ term, score: count * 1.5 });
  }

  scored.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const result: string[] = [];
  for (const { term } of scored) {
    if (seen.has(term)) continue;
    seen.add(term);
    result.push(term);
    if (result.length >= limit) break;
  }
  return result;
}

export function termInText(term: string, text: string): boolean {
  const t = term.toLowerCase();
  const body = text.toLowerCase();
  if (t.includes(" ")) {
    return body.includes(t);
  }
  return new RegExp(`\\b${escapeRegExp(t)}\\b`, "i").test(body);
}

export function termsMissingFromText(
  terms: string[],
  resumeText: string
): string[] {
  return terms.filter((term) => !termInText(term, resumeText));
}
