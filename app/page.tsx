"use client";

import { useCallback, useState } from "react";
import { JobStep } from "@/components/JobStep";
import { ResumeStep } from "@/components/ResumeStep";
import { ResultsPanel } from "@/components/ResultsPanel";
import { ResumePreview } from "@/components/ResumePreview";
import { applyPatch } from "@/lib/resume/applyPatch";
import type {
  AnalysisResult,
  ResumeSuggestion,
  SuggestionState,
} from "@/lib/types/analysis";

const MIN_JOB = 80;

export default function Home() {
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [scrapeMessage, setScrapeMessage] = useState<string | null>(null);
  const [loadingScrape, setLoadingScrape] = useState(false);

  const [resumeText, setResumeText] = useState("");
  const [workingText, setWorkingText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [loadingParse, setLoadingParse] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const [suggestionStates, setSuggestionStates] = useState<
    Record<string, SuggestionState>
  >({});
  const [undoStack, setUndoStack] = useState<
    { text: string; suggestionId: string }[]
  >([]);
  const [activeTab, setActiveTab] = useState<"prep" | "resume">("prep");
  const [downloading, setDownloading] = useState<"docx" | "pdf" | null>(null);

  const fetchJob = useCallback(async () => {
    setLoadingScrape(true);
    setScrapeMessage(null);
    try {
      const res = await fetch("/api/job/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobUrl.trim() }),
      });
      const data = await res.json();
      if (data.text) {
        setJobText(data.text);
      }
      if (data.error) {
        setScrapeMessage(data.error);
      } else if (data.text) {
        setScrapeMessage("Description loaded from URL.");
      }
    } catch {
      setScrapeMessage(
        "Network error while fetching. Paste the job description manually."
      );
    } finally {
      setLoadingScrape(false);
    }
  }, [jobUrl]);

  const onFile = useCallback(async (file: File) => {
    setLoadingParse(true);
    setFileName(file.name);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/resume/parse", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setAnalyzeError(data.error ?? "Parse failed.");
        return;
      }
      setResumeText(data.text);
      setWorkingText(data.text);
      setSuggestionStates({});
      setUndoStack([]);
      setAnalysis(null);
      setAnalyzeError(null);
    } catch {
      setAnalyzeError("Failed to upload resume.");
    } finally {
      setLoadingParse(false);
    }
  }, []);

  const runAnalyze = useCallback(async () => {
    setLoadingAnalyze(true);
    setAnalyzeError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobText, resumeText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAnalyzeError(data.error ?? "Analysis failed.");
        return;
      }
      setAnalysis(data as AnalysisResult);
      const initial: Record<string, SuggestionState> = {};
      for (const s of (data as AnalysisResult).suggestions) {
        initial[s.id] = "pending";
      }
      setSuggestionStates(initial);
      setWorkingText(resumeText);
      setUndoStack([]);
      setActiveTab("prep");
    } catch {
      setAnalyzeError("Analysis request failed.");
    } finally {
      setLoadingAnalyze(false);
    }
  }, [jobText, resumeText]);

  const onAccept = useCallback(
    (s: ResumeSuggestion) => {
      const result = applyPatch(workingText, s.patch);
      if (!result.ok) {
        setAnalyzeError(result.error);
        return;
      }
      setUndoStack((stack) => [
        ...stack.slice(-9),
        { text: workingText, suggestionId: s.id },
      ]);
      setWorkingText(result.text);
      setSuggestionStates((prev) => ({ ...prev, [s.id]: "accepted" }));
      setAnalyzeError(null);
    },
    [workingText]
  );

  const onSkip = useCallback((id: string) => {
    setSuggestionStates((prev) => ({ ...prev, [id]: "skipped" }));
  }, []);

  const onUndo = useCallback(() => {
    setUndoStack((stack) => {
      if (stack.length === 0) return stack;
      const last = stack[stack.length - 1];
      setWorkingText(last.text);
      setSuggestionStates((prev) => ({
        ...prev,
        [last.suggestionId]: "pending",
      }));
      return stack.slice(0, -1);
    });
  }, []);

  const onDownload = useCallback(
    async (format: "docx" | "pdf") => {
      setDownloading(format);
      try {
        const res = await fetch("/api/resume/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText: workingText, format }),
        });
        if (!res.ok) {
          setAnalyzeError("Export failed.");
          return;
        }
        const blob = await res.blob();
        const disposition = res.headers.get("Content-Disposition");
        const match = disposition?.match(/filename="([^"]+)"/);
        const name = match?.[1] ?? `resume-tailored.${format}`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        setAnalyzeError("Export failed.");
      } finally {
        setDownloading(null);
      }
    },
    [workingText]
  );

  const canAnalyze =
    jobText.trim().length >= MIN_JOB && resumeText.trim().length > 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Job Description Reader & Resume Coach
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Read a LinkedIn job posting, see what to prepare, review resume suggestions,
          apply them one at a time, and download an updated resume.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <JobStep
            jobUrl={jobUrl}
            jobText={jobText}
            scrapeMessage={scrapeMessage}
            loadingScrape={loadingScrape}
            onUrlChange={setJobUrl}
            onTextChange={setJobText}
            onFetch={fetchJob}
          />

          <ResumeStep
            resumeText={resumeText}
            fileName={fileName}
            loadingParse={loadingParse}
            previewOpen={previewOpen}
            onTogglePreview={() => setPreviewOpen((o) => !o)}
            onFile={onFile}
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={runAnalyze}
              disabled={!canAnalyze || loadingAnalyze}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingAnalyze ? "Analyzing…" : "Analyze job & resume"}
            </button>
            {!canAnalyze && (
              <span className="text-xs text-slate-500">
                Need job text (80+ chars) and an uploaded resume.
              </span>
            )}
          </div>

          {analyzeError && (
            <p className="text-sm text-rose-700" role="alert">
              {analyzeError}
            </p>
          )}

          {analysis && (
            <ResultsPanel
              analysis={analysis}
              suggestionStates={suggestionStates}
              onAccept={onAccept}
              onSkip={onSkip}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
        </div>

        <ResumePreview
          workingText={workingText}
          onUndo={onUndo}
          canUndo={undoStack.length > 0}
          onDownload={onDownload}
          downloading={downloading}
        />
      </div>
    </main>
  );
}
