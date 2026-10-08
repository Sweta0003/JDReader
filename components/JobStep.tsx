"use client";

type Props = {
  jobUrl: string;
  jobText: string;
  scrapeMessage: string | null;
  loadingScrape: boolean;
  onUrlChange: (v: string) => void;
  onTextChange: (v: string) => void;
  onFetch: () => void;
};

export function JobStep({
  jobUrl,
  jobText,
  scrapeMessage,
  loadingScrape,
  onUrlChange,
  onTextChange,
  onFetch,
}: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">1. Job description</h2>
      <p className="mt-1 text-sm text-slate-600">
        Try a LinkedIn job URL, or paste the full description (recommended if fetch
        fails).
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={jobUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://www.linkedin.com/jobs/view/..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <button
          type="button"
          onClick={onFetch}
          disabled={loadingScrape || !jobUrl.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingScrape ? "Fetching…" : "Fetch description"}
        </button>
      </div>

      {scrapeMessage && (
        <p className="mt-2 text-sm text-amber-800" role="status">
          {scrapeMessage}
        </p>
      )}

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Job description text
        <textarea
          value={jobText}
          onChange={(e) => onTextChange(e.target.value)}
          rows={8}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Paste the full job posting here…"
        />
      </label>
      <p className="mt-1 text-xs text-slate-500">
        Minimum 80 characters. For best results, include{" "}
        Responsibilities and Qualifications sections from the
        posting.
      </p>
    </section>
  );
}
