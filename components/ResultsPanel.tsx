"use client";

import { PriorityBadge } from "@/components/PriorityBadge";
import type {
  AnalysisResult,
  ResumeSuggestion,
  SuggestionState,
} from "@/lib/types/analysis";

type Props = {
  analysis: AnalysisResult;
  suggestionStates: Record<string, SuggestionState>;
  onAccept: (s: ResumeSuggestion) => void;
  onSkip: (id: string) => void;
  activeTab: "prep" | "resume";
  onTabChange: (tab: "prep" | "resume") => void;
};

export function ResultsPanel({
  analysis,
  suggestionStates,
  onAccept,
  onSkip,
  activeTab,
  onTabChange,
}: Props) {
  const sortedTopics = [...analysis.prepTopics].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => onTabChange("prep")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            activeTab === "prep"
              ? "bg-indigo-100 text-indigo-900"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Prepare
        </button>
        <button
          type="button"
          onClick={() => onTabChange("resume")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            activeTab === "resume"
              ? "bg-indigo-100 text-indigo-900"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Resume suggestions
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Parsed from JD: {analysis.jobInsights.requirementBullets} requirement
        bullets, {analysis.jobInsights.responsibilityBullets} responsibility
        bullets
        {analysis.jobInsights.termsFromJob.length > 0 && (
          <>
            {" "}
            · Top terms:{" "}
            {analysis.jobInsights.termsFromJob.slice(0, 8).join(", ")}
          </>
        )}
      </p>

      {activeTab === "prep" && (
        <ul className="mt-4 space-y-3">
          {sortedTopics.map((t) => (
            <li
              key={t.topic}
              className="rounded-lg border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-900">{t.topic}</span>
                <PriorityBadge priority={t.priority} />
              </div>
              <p className="mt-1 text-sm text-slate-600">{t.reason}</p>
              {t.subtopics?.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-800">
                  {t.subtopics.map((sub) => (
                    <li key={sub}>{sub}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {activeTab === "resume" && (
        <ul className="mt-4 space-y-4">
          {analysis.suggestions.map((s) => {
            const state = suggestionStates[s.id] ?? "pending";
            return (
              <li
                key={s.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {s.category}
                    </p>
                    <h3 className="font-medium text-slate-900">{s.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{s.explanation}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      state === "accepted"
                        ? "bg-emerald-100 text-emerald-800"
                        : state === "skipped"
                          ? "bg-slate-200 text-slate-600"
                          : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {state}
                  </span>
                </div>
                {state === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onAccept(s)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => onSkip(s.id)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Skip
                    </button>
                  </div>
                )}
              </li>
            );
          })}
          {analysis.suggestions.length === 0 && (
            <p className="text-sm text-slate-600">No suggestions for this pair.</p>
          )}
        </ul>
      )}
    </section>
  );
}
