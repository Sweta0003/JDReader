"use client";

import { useState } from "react";
import { PriorityBadge } from "@/components/PriorityBadge";
import type { AnalysisResult } from "@/lib/types/analysis";

type ResultTab = "prepare" | "courses" | "projects";

type Props = {
  analysis: AnalysisResult;
};

function tabClass(active: boolean) {
  return `rounded-lg px-3 py-1.5 text-sm font-medium ${
    active
      ? "bg-indigo-100 text-indigo-900"
      : "text-slate-600 hover:bg-slate-100"
  }`;
}

export function ResultsPanel({ analysis }: Props) {
  const [tab, setTab] = useState<ResultTab>("prepare");

  const sortedTopics = [...analysis.prepTopics].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div
        className="flex flex-wrap gap-2 border-b border-slate-200 pb-3"
        role="tablist"
        aria-label="Analysis results"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "prepare"}
          className={tabClass(tab === "prepare")}
          onClick={() => setTab("prepare")}
        >
          Prepare ({sortedTopics.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "courses"}
          className={tabClass(tab === "courses")}
          onClick={() => setTab("courses")}
        >
          Courses ({analysis.courses.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "projects"}
          className={tabClass(tab === "projects")}
          onClick={() => setTab("projects")}
        >
          Projects ({analysis.projects.length})
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Detected track: {analysis.jobInsights.role}
        {" · "}
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

      {tab === "prepare" && (
        <ul className="mt-4 space-y-3" role="tabpanel">
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

      {tab === "courses" && (
        <div role="tabpanel">
          <p className="mt-4 text-sm text-slate-600">
            Suggested study paths for this role. Pick one primary course and
            finish it; links are public catalogs, not endorsements.
          </p>
          <ul className="mt-3 space-y-3">
            {analysis.courses.map((c) => (
              <li
                key={c.url}
                className="rounded-lg border border-slate-100 bg-slate-50 p-3"
              >
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-700 hover:underline"
                >
                  {c.title}
                </a>
                <p className="mt-1 text-xs text-slate-500">{c.provider}</p>
                <p className="mt-1 text-sm text-slate-700">{c.focus}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "projects" && (
        <div role="tabpanel">
          <p className="mt-4 text-sm text-slate-600">
            Build 1–2 of these so your GitHub matches what this job screens for.
          </p>
          <ul className="mt-3 space-y-3">
            {analysis.projects.map((p) => (
              <li
                key={p.title}
                className="rounded-lg border border-slate-100 bg-slate-50 p-3"
              >
                <p className="font-medium text-slate-900">{p.title}</p>
                <p className="mt-1 text-sm text-slate-600">{p.why}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-800">
                  {p.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
