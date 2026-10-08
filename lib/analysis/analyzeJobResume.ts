import {
  buildJobUnderstanding,
  missingTermsForResume,
} from "@/lib/analysis/mergeJobTerms";
import { buildPrepCurriculum } from "@/lib/analysis/prepCurriculum";
import type {
  AnalysisResult,
  PrepTopic,
  ResumeSuggestion,
} from "@/lib/types/analysis";

const MIN_JD_LENGTH = 80;

function scenarioSubtopics(bullets: string[]): string[] {
  return bullets
    .map((b) => b.replace(/\s+/g, " ").trim())
    .filter((b) => b.length >= 24 && b.length <= 160)
    .slice(0, 5);
}

function slugId(prefix: string, value: string, index: number) {
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
  return `${prefix}-${slug}-${index}`;
}

function buildSuggestions(
  missing: string[],
  resumeText: string
): ResumeSuggestion[] {
  const suggestions: ResumeSuggestion[] = [];
  const topMissing = missing.slice(0, 8);

  if (topMissing.length > 0) {
    const skillsLine = topMissing.join(", ");
    suggestions.push({
      id: slugId("skills", skillsLine, 0),
      category: "skills",
      title: "Add missing skills to Skills section",
      explanation: `Highlight these JD terms if you truly have experience: ${skillsLine}.`,
      patch: {
        type: "append_section",
        section: "Skills",
        content: `\nAdditional (align with JD): ${skillsLine}`,
      },
    });
  }

  topMissing.slice(0, 3).forEach((term, i) => {
    suggestions.push({
      id: slugId("keyword", term, i),
      category: "keyword",
      title: `Surface "${term}" in your resume`,
      explanation:
        "Recruiters often scan for this term. Add it naturally in experience or skills if accurate.",
      patch: {
        type: "insert_after_heading",
        heading: "Experience",
        content: `\n• Applied ${term} in relevant projects (customize with metrics).`,
      },
    });
  });

  if (resumeText.length > 0 && topMissing.length > 0) {
    suggestions.push({
      id: slugId("summary", "tailored", 0),
      category: "summary",
      title: "Add a tailored summary line",
      explanation:
        "One-line summary referencing top role requirements (edit to match your background).",
      patch: {
        type: "insert_after_heading",
        heading: "Summary",
        content: `\nRole alignment: Experienced professional with strengths in ${topMissing.slice(0, 4).join(", ")}.`,
      },
    });
  }

  if (topMissing.length >= 2) {
    suggestions.push({
      id: slugId("bullet", "impact", 0),
      category: "bullet",
      title: "Add a quantified impact bullet (template)",
      explanation:
        "Replace placeholders with real outcomes. Focus on missing themes from the JD.",
      patch: {
        type: "insert_after_heading",
        heading: "Experience",
        content: `\n• Delivered measurable results using ${topMissing[0]} and ${topMissing[1]} — [X% improvement / $Y saved / N users].`,
      },
    });
  }

  return suggestions;
}

/**
 * Mock/heuristic analysis. Swap this implementation for an LLM call later
 * while keeping the same signature and return type.
 */
export function analyzeJobResume(
  jobText: string,
  resumeText: string
): AnalysisResult {
  const trimmedJob = jobText.trim();
  if (trimmedJob.length < MIN_JD_LENGTH) {
    throw new Error(
      `Job description is too short (minimum ${MIN_JD_LENGTH} characters).`
    );
  }

  const { normalizedJob, sections, rankedTerms, insights } =
    buildJobUnderstanding(trimmedJob);

  const missing = missingTermsForResume(
    rankedTerms.filter((t) => t.source === "dictionary"),
    resumeText
  );

  let prepTopics: PrepTopic[] = buildPrepCurriculum(
    normalizedJob,
    resumeText
  );

  const scenarios = scenarioSubtopics(sections.responsibilities);
  if (scenarios.length > 0) {
    prepTopics.push({
      topic: "Role-specific scenarios (from this JD)",
      reason:
        "Prepare a STAR story for each responsibility so you can prove you have done this work.",
      priority: "medium",
      subtopics: scenarios,
    });
  }

  const suggestions = buildSuggestions(missing, resumeText);

  if (
    prepTopics.length === 0 &&
    insights.termsFromJob.length > 0 &&
    resumeText.length > 0
  ) {
    prepTopics.push({
      topic: "Role-specific deep dive",
      reason:
        "Your resume already overlaps many JD terms. Prepare examples for each responsibility and why you fit this company.",
      priority: "medium",
      subtopics: [
        "Walk through 2-3 projects end to end",
        "Prepare metrics and trade-offs for each",
        "Map your work to this team's stack",
      ],
    });
  }

  if (prepTopics.length === 0 && insights.termsFromJob.length === 0) {
    prepTopics.push({
      topic: "Paste the full job posting",
      reason:
        "We could not detect requirements or skills. Copy the entire LinkedIn description (including Qualifications and Responsibilities), not just the title.",
      priority: "high",
      subtopics: [
        "Include Responsibilities / What you'll do",
        "Include Qualifications / Requirements",
        "Include the tech stack list if present",
      ],
    });
  } else if (prepTopics.length === 0) {
    prepTopics.push({
      topic: "Core software interview track",
      reason:
        "We could not map a specialist track. Start with coding, system design, and behavioral.",
      priority: "medium",
      subtopics: [
        "Data structures & algorithms",
        "System design fundamentals",
        "STAR behavioral stories",
      ],
    });
  }

  return {
    prepTopics: prepTopics.slice(0, 18),
    suggestions,
    jobInsights: insights,
  };
}
